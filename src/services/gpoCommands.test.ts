import { describe, expect, it } from "vitest";
import {
  chainAddCommand,
  chainAddGpoCommand,
  chainFindCommand,
  chainModCommand,
  chainMoveGpoCommands,
  chainRemoveGpoCommand,
  chainResolveCommand,
  gpmasterMoveChainCommands,
  gpmasterSetOrderCommand,
  gpoFindCommand,
  gpoModCommand,
} from "./gpoCommands";

describe("gpo commands", () => {
  it("renames in the same call as the other changes and never sends the server's own fields", () => {
    const command = gpoModCommand("Old", {
      displayname: "New",
      ipagpoflags: 1,
      cn: "{GUID}",
      ipagpoversionnumber: 9,
      distinguishedname: "cn=x",
    });
    expect(command).toEqual({
      method: "gpo_mod",
      params: [["Old"], { all: true, rename: "New", ipagpoflags: 1 }],
    });
  });

  it("does not rename when the name is the same", () => {
    const command = gpoModCommand("Same", {
      displayname: "Same",
      ipagpoflags: 0,
    });
    expect(command.params[1]).toEqual({ all: true, ipagpoflags: 0 });
  });

  it("searches with the criteria as the positional argument, or lists everything", () => {
    expect(gpoFindCommand("pol", 50).params).toEqual([
      ["pol"],
      { all: true, sizelimit: 50 },
    ]);
    expect(gpoFindCommand("", 0).params).toEqual([
      [],
      { all: true, sizelimit: 0 },
    ]);
  });
});

describe("chain commands", () => {
  it("sends only the filled fields when adding", () => {
    expect(
      chainAddCommand({
        cn: "c",
        description: "",
        ipagpousergroup: "g",
        ipagpolink: [],
      })
    ).toEqual({
      method: "chain_add",
      params: [["c"], { ipagpousergroup: "g" }],
    });
  });

  it("clears a group with remove_*, because the server rejects the attribute together with it", () => {
    const options = chainModCommand("c", {
      ipagpousergroup: "",
      ipagpocomputergroup: "hosts",
    }).params[1];
    expect(options.remove_usergroup).toBe(true);
    expect(options.ipagpousergroup).toBeUndefined();
    expect(options.ipagpocomputergroup).toBe("hosts");
    expect(options.remove_computergroup).toBeUndefined();
  });

  it("renames, and replaces the whole policy list to set an order in one call", () => {
    const options = chainModCommand("old", {
      cn: "new",
      ipagpolink: ["B", "A"],
    }).params[1];
    expect(options.rename).toBe("new");
    expect(options.ipagpolink).toEqual(["B", "A"]);
  });

  it("moves a policy one command per step, up or down, and nothing for 0 steps", () => {
    expect(chainMoveGpoCommands("c", "P", "up", 2)).toEqual([
      { method: "chain_mod", params: [["c"], { moveup_gpc: ["P"] }] },
      { method: "chain_mod", params: [["c"], { moveup_gpc: ["P"] }] },
    ]);
    expect(chainMoveGpoCommands("c", "P", "down")).toEqual([
      { method: "chain_mod", params: [["c"], { movedown_gpc: ["P"] }] },
    ]);
    expect(chainMoveGpoCommands("c", "P", "up", 0)).toEqual([]);
  });

  it("adds and removes policies with the `gpo` option", () => {
    expect(chainAddGpoCommand("c", ["A", "B"]).params).toEqual([
      ["c"],
      { gpo: ["A", "B"] },
    ]);
    expect(chainRemoveGpoCommand("c", ["A"]).params).toEqual([
      ["c"],
      { gpo: ["A"] },
    ]);
  });

  it("lists with no size limit by default of the caller, and resolves for a user or a host", () => {
    expect(chainFindCommand("", 0).params).toEqual([
      [],
      { all: true, sizelimit: 0 },
    ]);
    expect(chainResolveCommand("user", "alice").method).toBe(
      "chain_resolve_for_user"
    );
    expect(chainResolveCommand("host", "h.example.com").method).toBe(
      "chain_resolve_for_host"
    );
  });
});

describe("gpmaster commands", () => {
  it("moves a chain one command per step and takes no positional argument", () => {
    expect(gpmasterMoveChainCommands("c", "down", 3)).toHaveLength(3);
    expect(gpmasterMoveChainCommands("c", "down", 1)[0]).toEqual({
      method: "gpmaster_mod",
      params: [[], { movedown_chain: ["c"] }],
    });
  });

  it("sets the whole order in one call", () => {
    expect(gpmasterSetOrderCommand(["b", "a"])).toEqual({
      method: "gpmaster_mod",
      params: [[], { ipagpochainlist: ["b", "a"] }],
    });
  });
});
