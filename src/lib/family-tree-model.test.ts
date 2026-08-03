import { describe, expect, it } from "vitest";
import type { Edge, Person } from "@data/people";
import { people, relations } from "@data/people";
import {
  buildRelationIndex,
  buildTree,
  findRootAncestor,
  getRelatives,
} from "@/lib/family-tree-model";

const person = (id: string): Person => ({
  id,
  slug: id,
  firstName: id,
  lastName: id,
});

/** A two-generation family that owes nothing to the production data. */
const fixture = {
  people: [person("dad"), person("mum"), person("kid"), person("kid2")],
  relations: [
    { fromId: "dad", toId: "kid", relation: "parent", role: "father" },
    { fromId: "mum", toId: "kid", relation: "parent", role: "mother" },
    { fromId: "dad", toId: "kid2", relation: "parent", role: "father" },
    { fromId: "dad", toId: "mum", relation: "spouse" },
  ] as Edge[],
};

describe("buildTree", () => {
  it("returns null when the root is unknown", () => {
    expect(buildTree("nobody", people, relations)).toBeNull();
  });

  it("builds a spouseless tree", () => {
    const solo: Edge[] = [
      { fromId: "dad", toId: "kid", relation: "parent" },
      { fromId: "dad", toId: "kid2", relation: "parent" },
    ];
    const tree = buildTree("dad", fixture.people, solo);

    expect(tree?.person?.id).toBe("dad");
    expect(tree?.spouse).toBeUndefined();
    expect(tree?.children.map((child) => child.person?.id)).toEqual(["kid", "kid2"]);
  });

  it("attaches the spouse to the node", () => {
    expect(buildTree("kabdolla-omaruly", people, relations)?.spouse?.id).toBe("zeinep-temirkankyzy");
  });

  it("reads a spouse edge from either direction", () => {
    // The edge is stored as kabdolla -> zeinep; rooting at zeinep must still pair them.
    expect(buildTree("zeinep-temirkankyzy", people, relations)?.spouse?.id).toBe("kabdolla-omaruly");
  });

  it("lists a child shared by both spouses only once", () => {
    const tree = buildTree("kabdolla-omaruly", people, relations);

    expect(tree?.children.map((child) => child.person?.id)).toEqual(["zhumagazy-khabdullin"]);
  });

  it("does not recurse forever on a cyclic relation", () => {
    const cyclic: Edge[] = [
      { fromId: "a", toId: "b", relation: "parent" },
      { fromId: "b", toId: "a", relation: "parent" },
    ];
    const tree = buildTree("a", [person("a"), person("b")], cyclic);

    expect(tree?.person?.id).toBe("a");
    expect(tree?.children.map((child) => child.person?.id)).toEqual(["b"]);
    expect(tree?.children[0]?.children).toEqual([]);
  });
});

describe("buildRelationIndex", () => {
  it("indexes children by parent and parents by child", () => {
    const index = buildRelationIndex(fixture.relations);

    expect(index.childrenByParent.get("dad")).toEqual(["kid", "kid2"]);
    expect(index.parentsByChild.get("kid")).toEqual([
      { id: "dad", role: "father" },
      { id: "mum", role: "mother" },
    ]);
  });

  it("records spouses in both directions", () => {
    const index = buildRelationIndex(fixture.relations);

    expect(index.spouseOf.get("dad")).toBe("mum");
    expect(index.spouseOf.get("mum")).toBe("dad");
  });
});

describe("getRelatives", () => {
  it("separates father from mother by edge role", () => {
    const index = buildRelationIndex(relations);
    const kin = getRelatives("zhumagazy-khabdullin", people, index);

    expect(kin.father?.id).toBe("kabdolla-omaruly");
    expect(kin.mother?.id).toBe("zeinep-temirkankyzy");
    expect(kin.spouse?.id).toBe("maken-saduakaskyzy");
    expect(kin.children).toEqual([]);
  });

  it("returns children and spouse for the top of the line", () => {
    const index = buildRelationIndex(relations);
    const kin = getRelatives("kabdolla-omaruly", people, index);

    expect(kin.father).toBeUndefined();
    expect(kin.mother).toBeUndefined();
    expect(kin.spouse?.id).toBe("zeinep-temirkankyzy");
    expect(kin.children.map((c) => c.id)).toEqual(["zhumagazy-khabdullin"]);
  });

  it("keeps a role-less parent out of father and mother", () => {
    const index = buildRelationIndex([{ fromId: "dad", toId: "kid", relation: "parent" }]);
    const kin = getRelatives("kid", fixture.people, index);

    expect(kin.father).toBeUndefined();
    expect(kin.otherParents.map((p) => p.id)).toEqual(["dad"]);
  });

  it("ignores edges pointing at people who have no record", () => {
    const index = buildRelationIndex([
      { fromId: "ghost", toId: "kid", relation: "parent", role: "father" },
    ]);
    const kin = getRelatives("kid", fixture.people, index);

    expect(kin.father).toBeUndefined();
  });
});

describe("findRootAncestor", () => {
  it("climbs to the top of the line", () => {
    const index = buildRelationIndex(relations);

    expect(findRootAncestor("zhumagazy-khabdullin", index)).toBe("kabdolla-omaruly");
  });

  it("prefers the father when both parents are known", () => {
    const index = buildRelationIndex(fixture.relations);

    expect(findRootAncestor("kid", index)).toBe("dad");
  });

  it("falls back to the spouse's line for someone who married in", () => {
    // Мәкен has no ancestors of her own; her page should still show the Уак line.
    const index = buildRelationIndex(relations);

    expect(findRootAncestor("maken-saduakaskyzy", index)).toBe("kabdolla-omaruly");
  });

  it("does not hand the root to a spouse who has no ancestors either", () => {
    const index = buildRelationIndex(relations);

    expect(findRootAncestor("kabdolla-omaruly", index)).toBe("kabdolla-omaruly");
  });

  it("returns the person unchanged when nobody is related", () => {
    const index = buildRelationIndex([]);

    expect(findRootAncestor("kid", index)).toBe("kid");
  });

  it("does not hang on a parent cycle", () => {
    const index = buildRelationIndex([
      { fromId: "a", toId: "b", relation: "parent" },
      { fromId: "b", toId: "a", relation: "parent" },
    ]);

    expect(["a", "b"]).toContain(findRootAncestor("a", index));
  });

  it("puts every member of the line into the tree grown from the root", () => {
    const index = buildRelationIndex(relations);
    const root = findRootAncestor("zhumagazy-khabdullin", index);
    const tree = buildTree(root, people, relations);

    const ids: string[] = [];
    const walk = (node: NonNullable<typeof tree>) => {
      if (node.person) ids.push(node.person.id);
      if (node.spouse) ids.push(node.spouse.id);
      node.children.forEach(walk);
    };
    walk(tree!);

    expect(ids).toContain("kabdolla-omaruly");
    expect(ids).toContain("zeinep-temirkankyzy");
    expect(ids).toContain("zhumagazy-khabdullin");
    expect(ids).toContain("maken-saduakaskyzy");
  });
});
