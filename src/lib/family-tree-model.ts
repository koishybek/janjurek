import type { Edge, Person } from "@data/people";

export type TreeNode = {
  person: Person | undefined;
  /** Present when the person has a `spouse` relation — the pair is drawn side by side. */
  spouse?: Person;
  children: TreeNode[];
};

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

  const childrenMap = new Map<string, string[]>();
  const spouseMap = new Map<string, string>();

  relations.forEach((relation) => {
    if (relation.relation === "parent") {
      const existing = childrenMap.get(relation.fromId) ?? [];
      childrenMap.set(relation.fromId, [...existing, relation.toId]);
    } else if (relation.relation === "spouse") {
      spouseMap.set(relation.fromId, relation.toId);
      spouseMap.set(relation.toId, relation.fromId);
    }
  });

  // `path` carries the ancestors already rendered on this branch, so malformed data
  // (a person listed as their own ancestor) stops instead of recursing forever.
  const build = (id: string, path: Set<string>): TreeNode => {
    const spouseId = spouseMap.get(id);
    const nextPath = new Set(path).add(id);
    if (spouseId) {
      nextPath.add(spouseId);
    }

    const childIds = [
      ...(childrenMap.get(id) ?? []),
      ...(spouseId ? childrenMap.get(spouseId) ?? [] : []),
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
