import { describe, expect, it } from "vitest";
import type { Edge, Person } from "@data/people";
import { people, relations } from "@data/people";
import { buildTree } from "@/lib/family-tree-model";

const person = (id: string): Person => ({
  id,
  slug: id,
  firstName: id,
  lastName: id,
});

describe("buildTree", () => {
  it("returns null when the root is unknown", () => {
    expect(buildTree("nobody", people, relations)).toBeNull();
  });

  it("builds a spouseless tree exactly as before", () => {
    const tree = buildTree("akan-nurgali", people, relations);

    expect(tree?.person?.id).toBe("akan-nurgali");
    expect(tree?.spouse).toBeUndefined();
    expect(tree?.children.map((child) => child.person?.id)).toEqual([
      "ermek-akanuly",
      "gulnar-akanqyzy",
    ]);
  });

  it("attaches the spouse to the node", () => {
    const tree = buildTree("kabdolla-omaruly", people, relations);

    expect(tree?.spouse?.id).toBe("zeinep-temirkankyzy");
  });

  it("reads a spouse edge from either direction", () => {
    // The edge is stored as kabdolla -> zeinep; rooting at zeinep must still pair them.
    const tree = buildTree("zeinep-temirkankyzy", people, relations);

    expect(tree?.spouse?.id).toBe("kabdolla-omaruly");
  });

  it("lists a child shared by both spouses only once", () => {
    const tree = buildTree("kabdolla-omaruly", people, relations);
    const childIds = tree?.children.map((child) => child.person?.id) ?? [];

    expect(childIds).toEqual(["zhumagazy-khabdullin"]);
  });

  it("does not recurse forever on a cyclic relation", () => {
    const cyclicPeople = [person("a"), person("b")];
    const cyclicRelations: Edge[] = [
      { fromId: "a", toId: "b", relation: "parent" },
      { fromId: "b", toId: "a", relation: "parent" },
    ];

    const tree = buildTree("a", cyclicPeople, cyclicRelations);

    expect(tree?.person?.id).toBe("a");
    expect(tree?.children.map((child) => child.person?.id)).toEqual(["b"]);
    // 'a' is already on the path, so the cycle stops here instead of repeating.
    expect(tree?.children[0]?.children).toEqual([]);
  });
});
