import type { Edge, Person } from "@data/people";

export type TreeNode = {
  person: Person | undefined;
  /** Present when the person has a `spouse` relation — the pair is drawn side by side. */
  spouse?: Person;
  children: TreeNode[];
};

export type ParentRef = {
  id: string;
  role?: "father" | "mother";
};

export type RelationIndex = {
  childrenByParent: Map<string, string[]>;
  parentsByChild: Map<string, ParentRef[]>;
  spouseOf: Map<string, string>;
  /**
   * Spouse edges per person. More than one means remarriage, and then "the couple"
   * is ambiguous — children must not be pooled, or a child of the first marriage
   * would be shown as a child of the second.
   */
  spouseEdgeCount: Map<string, number>;
};

/**
 * Index the edges once, in both directions. `parentsByChild` is what makes it
 * possible to walk *up* a lineage — the tree builder alone only ever walks down.
 */
export function buildRelationIndex(relations: Edge[]): RelationIndex {
  const childrenByParent = new Map<string, string[]>();
  const parentsByChild = new Map<string, ParentRef[]>();
  const spouseOf = new Map<string, string>();
  const spouseEdgeCount = new Map<string, number>();

  const countSpouse = (id: string) => spouseEdgeCount.set(id, (spouseEdgeCount.get(id) ?? 0) + 1);

  for (const relation of relations) {
    if (relation.relation === "parent") {
      childrenByParent.set(relation.fromId, [
        ...(childrenByParent.get(relation.fromId) ?? []),
        relation.toId,
      ]);
      parentsByChild.set(relation.toId, [
        ...(parentsByChild.get(relation.toId) ?? []),
        { id: relation.fromId, role: relation.role },
      ]);
    } else if (relation.relation === "spouse") {
      // First edge wins, so a second marriage cannot silently replace the first.
      if (!spouseOf.has(relation.fromId)) spouseOf.set(relation.fromId, relation.toId);
      if (!spouseOf.has(relation.toId)) spouseOf.set(relation.toId, relation.fromId);
      countSpouse(relation.fromId);
      countSpouse(relation.toId);
    }
  }

  return { childrenByParent, parentsByChild, spouseOf, spouseEdgeCount };
}

export type Relatives = {
  father?: Person;
  mother?: Person;
  /** Parents recorded without a role — shown, but not claimed to be the father. */
  otherParents: Person[];
  spouse?: Person;
  children: Person[];
};

/**
 * Resolve a person's immediate relatives to actual records. Only edges count:
 * the free-text `fatherName` / `spouse` / `children` fields are written in
 * inconsistent name orders and often name people who have no page at all, so
 * matching on them would risk linking a memorial to the wrong person.
 */
export function getRelatives(personId: string, people: Person[], index: RelationIndex): Relatives {
  const byId = new Map(people.map((item) => [item.id, item]));
  const parents = index.parentsByChild.get(personId) ?? [];

  const father = parents.find((parent) => parent.role === "father");
  const mother = parents.find((parent) => parent.role === "mother");
  const spouseId = index.spouseOf.get(personId);

  return {
    father: father ? byId.get(father.id) : undefined,
    mother: mother ? byId.get(mother.id) : undefined,
    otherParents: parents
      .filter((parent) => !parent.role)
      .map((parent) => byId.get(parent.id))
      .filter((item): item is Person => Boolean(item)),
    spouse: spouseId ? byId.get(spouseId) : undefined,
    children: (index.childrenByParent.get(personId) ?? [])
      .map((childId) => byId.get(childId))
      .filter((item): item is Person => Boolean(item)),
  };
}

/**
 * Walk up to the earliest known ancestor, so a memory page can show the whole
 * line instead of the person as an orphan. Someone who married into the family
 * has no ancestors of their own — they inherit their spouse's line, but only
 * when that spouse actually has one.
 */
export function findRootAncestor(personId: string, index: RelationIndex, maxDepth = 32): string {
  const climb = (startId: string): string => {
    const visited = new Set<string>([startId]);
    let current = startId;

    for (let depth = 0; depth < maxDepth; depth += 1) {
      const parents = index.parentsByChild.get(current) ?? [];
      const next = parents.find((parent) => parent.role === "father") ?? parents[0];
      if (!next || visited.has(next.id)) {
        return current;
      }
      visited.add(next.id);
      current = next.id;
    }

    return current;
  };

  const own = climb(personId);
  if (own !== personId) {
    return own;
  }

  const spouseId = index.spouseOf.get(personId);
  if (spouseId) {
    const viaSpouse = climb(spouseId);
    if (viaSpouse !== spouseId) {
      return viaSpouse;
    }
  }

  return personId;
}

export type GenerationGroup = {
  /** The couple these nodes descend from — shown when a row holds more than one family. */
  parentLabel?: string;
  nodes: TreeNode[];
};

export type GenerationRow = {
  depth: number;
  groups: GenerationGroup[];
};

const shortName = (item: Person) => [item.lastName, item.firstName].filter(Boolean).join(" ");

const coupleLabel = (node: TreeNode): string | undefined => {
  if (!node.person) return undefined;
  return node.spouse
    ? `${shortName(node.person)} ⚭ ${shortName(node.spouse)}`
    : shortName(node.person);
};

/**
 * Flatten a tree into one row per generation, so the lineage reads top to bottom
 * as a chain. Children of different siblings stay in separate groups — without
 * that, a row of cousins would lose which parents each of them belongs to.
 */
export function toGenerations(tree: TreeNode | null, maxDepth = 64): GenerationRow[] {
  if (!tree) {
    return [];
  }

  const rows: GenerationRow[] = [{ depth: 0, groups: [{ nodes: [tree] }] }];

  for (let depth = 0; depth < maxDepth; depth += 1) {
    const nextGroups: GenerationGroup[] = [];

    for (const group of rows[depth].groups) {
      for (const node of group.nodes) {
        if (node.children.length > 0) {
          nextGroups.push({ parentLabel: coupleLabel(node), nodes: node.children });
        }
      }
    }

    if (nextGroups.length === 0) {
      break;
    }
    rows.push({ depth: depth + 1, groups: nextGroups });
  }

  return rows;
}

/**
 * Build a descent tree rooted at `rootId`.
 *
 * Parent edges define the descent. Spouse edges are symmetric: whichever half of a
 * couple you root at, the other half is attached, and the children of both are
 * merged into one list so a child shared by the pair is not drawn twice.
 */
export function buildTree(rootId: string, people: Person[], relations: Edge[]): TreeNode | null {
  const personMap = new Map(people.map((item) => [item.id, item]));

  if (!personMap.has(rootId)) {
    return null;
  }

  const { childrenByParent, spouseOf, spouseEdgeCount } = buildRelationIndex(relations);

  // Children are pooled only for an unambiguous couple. With remarriage on either
  // side, pooling would attribute a child of one marriage to the other.
  const isExclusiveCouple = (a: string, b: string) =>
    (spouseEdgeCount.get(a) ?? 0) === 1 && (spouseEdgeCount.get(b) ?? 0) === 1;

  // `path` carries the ancestors already rendered on this branch, so malformed data
  // (a person listed as their own ancestor) stops instead of recursing forever.
  const build = (id: string, path: Set<string>): TreeNode => {
    const spouseId = spouseOf.get(id);
    const nextPath = new Set(path).add(id);
    if (spouseId) {
      nextPath.add(spouseId);
    }

    const poolSpouseChildren = spouseId ? isExclusiveCouple(id, spouseId) : false;
    const childIds = [
      ...(childrenByParent.get(id) ?? []),
      ...(poolSpouseChildren ? childrenByParent.get(spouseId!) ?? [] : []),
    ];

    const seen = new Set<string>();
    const children: TreeNode[] = [];
    for (const childId of childIds) {
      if (seen.has(childId) || nextPath.has(childId)) {
        continue;
      }
      seen.add(childId);
      children.push(build(childId, nextPath));
    }

    return {
      person: personMap.get(id),
      spouse: spouseId ? personMap.get(spouseId) : undefined,
      children,
    };
  };

  return build(rootId, new Set());
}
