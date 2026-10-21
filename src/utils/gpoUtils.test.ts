import { describe, expect, it } from "vitest";
import {
  apiToChain,
  apiToGpmaster,
  apiToGpo,
  apiToResolvedGpo,
  createEmptyChain,
  createEmptyGpmaster,
  createEmptyGpo,
  isGpoPluginAvailable,
} from "./gpoUtils";

describe("apiToGpo", () => {
  it("reads one-item lists and scalars alike and converts the numbers", () => {
    const gpo = apiToGpo({
      displayname: ["Default Domain Policy"],
      cn: ["{31B2F340-016D-11D2-945F-00C04FB984F9}"],
      ipagpoflags: ["2"],
      ipagpoversionnumber: 7,
    });
    expect(gpo.displayname).toBe("Default Domain Policy");
    expect(gpo.cn).toBe("{31B2F340-016D-11D2-945F-00C04FB984F9}");
    expect(gpo.ipagpoflags).toBe(2);
    expect(gpo.ipagpoversionnumber).toBe(7);
  });

  it("fills what the server did not send, so the form can read every field", () => {
    expect(apiToGpo({ displayname: ["x"] })).toEqual({
      ...createEmptyGpo(),
      displayname: "x",
    });
  });

  it("treats a number that does not parse as 0", () => {
    expect(apiToGpo({ ipagpoversionnumber: ["abc"] }).ipagpoversionnumber).toBe(
      0
    );
  });
});

describe("apiToChain", () => {
  it("keeps the order of the policies and reads `active` from its one-item list", () => {
    const chain = apiToChain({
      cn: ["servers"],
      description: ["Servers"],
      ipagpousergroup: ["admins"],
      ipagpolink: ["B", "A", "C"],
      ipagpolink_gpo: ["B", "A", "C"],
      active: [true],
    });
    expect(chain.ipagpolink).toEqual(["B", "A", "C"]);
    expect(chain.active).toBe(true);
    expect(chain.ipagpousergroup).toBe("admins");
    expect(chain.ipagpocomputergroup).toBe("");
  });

  it("is inactive and empty when the server says nothing", () => {
    expect(apiToChain({ cn: "x" })).toEqual({ ...createEmptyChain(), cn: "x" });
  });

  it("accepts a single policy sent as a scalar (a move answer) and an inactive flag", () => {
    const chain = apiToChain({ cn: "x", ipagpolink: "only", active: [false] });
    expect(chain.ipagpolink).toEqual(["only"]);
    expect(chain.active).toBe(false);
  });
});

describe("apiToGpmaster", () => {
  it("reads the order as a list whether the server unwrapped the other values or not", () => {
    expect(
      apiToGpmaster({
        cn: "grouppolicymaster",
        ipagpochainlist: ["a", "b"],
        ipagpopdcemulator: "ipa.example.com",
      })
    ).toEqual({
      cn: "grouppolicymaster",
      ipagpochainlist: ["a", "b"],
      ipagpopdcemulator: "ipa.example.com",
    });
    expect(
      apiToGpmaster({ cn: ["grouppolicymaster"], ipagpopdcemulator: ["h"] })
        .ipagpopdcemulator
    ).toBe("h");
  });

  it("has an empty list when no chain is active", () => {
    expect(apiToGpmaster({})).toEqual(createEmptyGpmaster());
  });
});

describe("apiToResolvedGpo", () => {
  it("keeps the error of a policy whose details could not be read", () => {
    const resolved = apiToResolvedGpo({
      name: "P",
      flags: "0",
      file_system_path: "",
      version: "",
      error: "Failed to retrieve policy details",
    });
    expect(resolved.error).toBe("Failed to retrieve policy details");
    expect(apiToResolvedGpo({ name: "P" }).error).toBeUndefined();
  });
});

describe("isGpoPluginAvailable", () => {
  const commands = (names: string[]) => ({
    commands: Object.fromEntries(names.map((name) => [name, {}])),
  });

  it("is true when the commands of all three objects are there", () => {
    expect(
      isGpoPluginAvailable(
        commands(["gpo_find", "chain_find", "gpmaster_show", "user_find"])
      )
    ).toBe(true);
  });

  it("is false without the plugin, or with only a part of it, or before the metadata is loaded", () => {
    expect(isGpoPluginAvailable(commands(["user_find"]))).toBe(false);
    expect(isGpoPluginAvailable(commands(["gpo_find", "chain_find"]))).toBe(
      false
    );
    expect(isGpoPluginAvailable({})).toBe(false);
    expect(isGpoPluginAvailable(undefined)).toBe(false);
  });
});
