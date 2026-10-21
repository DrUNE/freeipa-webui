import { Command } from "./rpc";
import { Chain, Gpo, MoveDirection } from "src/utils/datatypes/gpoDataTypes";

/**
 * The commands of the Group Policy plugin (`gpo_*`, `chain_*`, `gpmaster_*`), as pure functions that build the
 * `{ method, params }` of a JSON-RPC call. The endpoints of rpcGpo.ts, rpcChain.ts and rpcGpmaster.ts only wrap them
 * (`getCommand` adds the API version). Keeping them apart makes the request shapes testable without a server.
 *
 * Order everywhere: the first item has the highest priority; moving "up" brings an item closer to the start. The server
 * moves one step per call, so a move by N steps is N commands (send them as one batch).
 */

const withoutEmpty = (record: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(record).filter(
      ([, value]) =>
        value !== undefined &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0)
    )
  );

// ---------------------------------------------------------------- gpo

export const gpoShowCommand = (displayname: string): Command => ({
  method: "gpo_show",
  params: [[displayname], { all: true }],
});

export const gpoAddCommand = (displayname: string): Command => ({
  method: "gpo_add",
  params: [[displayname], { all: true }],
});

export const gpoDelCommand = (displayname: string): Command => ({
  method: "gpo_del",
  params: [[displayname], {}],
});

/**
 * `criteria` searches the name; `sizelimit` 0 means no limit. The answer lists full entries (not only the primary key).
 */
export const gpoFindCommand = (
  criteria: string,
  sizelimit: number
): Command => ({
  method: "gpo_find",
  params: [criteria ? [criteria] : [], { all: true, sizelimit }],
});

/**
 * Saves the editable fields. A new `displayname` is sent as `rename` in the same call (the GUID stays, the primary key
 * changes: refer to the policy by the new name afterwards). `cn`, the DN, the version and the file system path are the
 * server's own and are never sent.
 */
export const gpoModCommand = (
  displayname: string,
  changes: Partial<Gpo>
): Command => {
  const options: Record<string, unknown> = { all: true };
  if (
    changes.displayname !== undefined &&
    changes.displayname !== displayname
  ) {
    options.rename = changes.displayname;
  }
  for (const key of [
    "ipagpoflags",
    "ipagpomachineextensionnames",
    "ipagpouserextensionnames",
  ] as const) {
    if (changes[key] !== undefined) options[key] = changes[key];
  }
  return { method: "gpo_mod", params: [[displayname], options] };
};

// ---------------------------------------------------------------- chain

export const chainShowCommand = (cn: string): Command => ({
  method: "chain_show",
  params: [[cn], { all: true }],
});

/** Only filled fields are sent. A new chain becomes active at the lowest priority on the server. */
export const chainAddCommand = (chain: Partial<Chain>): Command => ({
  method: "chain_add",
  params: [
    [chain.cn],
    withoutEmpty({
      description: chain.description,
      ipagpousergroup: chain.ipagpousergroup,
      ipagpocomputergroup: chain.ipagpocomputergroup,
      ipagpolink: chain.ipagpolink,
    }),
  ],
});

export const chainDelCommand = (cn: string): Command => ({
  method: "chain_del",
  params: [[cn], {}],
});

/**
 * Chains in the order the server gives: the active ones by priority, then the inactive ones by name. Do not sort them again.
 * `active` filters after the size limit, so leave it out when the list may be truncated.
 */
export const chainFindCommand = (
  criteria: string,
  sizelimit: number
): Command => ({
  method: "chain_find",
  params: [criteria ? [criteria] : [], { all: true, sizelimit }],
});

/**
 * Saves the editable fields of a chain. A cleared group is `remove_*` (the server rejects an attribute together with its
 * `remove_*`); a new `cn` is `rename`. `ipagpolink` replaces the whole list, which is also how an order is set in one call.
 * Moving a policy is a separate call: it cannot be combined with other changes (see `chainMoveGpoCommands`).
 */
export const chainModCommand = (
  cn: string,
  changes: Partial<Chain>
): Command => {
  const options: Record<string, unknown> = { all: true };
  if (changes.cn !== undefined && changes.cn !== cn)
    options.rename = changes.cn;
  if (changes.description !== undefined)
    options.description = changes.description;
  if (changes.ipagpousergroup !== undefined) {
    if (changes.ipagpousergroup === "") options.remove_usergroup = true;
    else options.ipagpousergroup = changes.ipagpousergroup;
  }
  if (changes.ipagpocomputergroup !== undefined) {
    if (changes.ipagpocomputergroup === "") options.remove_computergroup = true;
    else options.ipagpocomputergroup = changes.ipagpocomputergroup;
  }
  if (changes.ipagpolink !== undefined) options.ipagpolink = changes.ipagpolink;
  return { method: "chain_mod", params: [[cn], options] };
};

/** Enabling puts the chain at the end of the GPMaster list; enabling an enabled chain is a validation error. */
export const chainEnableCommand = (cn: string): Command => ({
  method: "chain_enable",
  params: [[cn], {}],
});

export const chainDisableCommand = (cn: string): Command => ({
  method: "chain_disable",
  params: [[cn], {}],
});

/** Policies are added at the end of the chain (the lowest priority). Names that do not exist come back in `failed`. */
export const chainAddGpoCommand = (cn: string, gpos: string[]): Command => ({
  method: "chain_add_gpo",
  params: [[cn], { gpo: gpos }],
});

/** Names are matched exactly (the case counts) here, unlike the move commands. */
export const chainRemoveGpoCommand = (cn: string, gpos: string[]): Command => ({
  method: "chain_remove_gpo",
  params: [[cn], { gpo: gpos }],
});

/**
 * Moves a policy of a chain `steps` places (one command per step, for a batch). A move cannot be combined with other
 * changes; a policy at the border stays (no error); a policy that is not in the chain is a validation error.
 */
export const chainMoveGpoCommands = (
  cn: string,
  gpo: string,
  direction: MoveDirection,
  steps: number = 1
): Command[] =>
  Array.from({ length: Math.max(0, steps) }, () => ({
    method: "chain_mod",
    params: [
      [cn],
      direction === "up" ? { moveup_gpc: [gpo] } : { movedown_gpc: [gpo] },
    ],
  }));

/** The policies that apply to a user (their groups) or a host (their host groups), in the order of application. */
export const chainResolveCommand = (
  target: "user" | "host",
  name: string
): Command => ({
  method:
    target === "user" ? "chain_resolve_for_user" : "chain_resolve_for_host",
  params: [[name], {}],
});

// ---------------------------------------------------------------- gpmaster

export const gpmasterShowCommand = (): Command => ({
  method: "gpmaster_show",
  params: [[], { all: true }],
});

/**
 * Moves an active chain `steps` places in the list of the GPMaster (one command per step, for a batch). An inactive chain
 * is a validation error; a chain at the border stays.
 */
export const gpmasterMoveChainCommands = (
  cn: string,
  direction: MoveDirection,
  steps: number = 1
): Command[] =>
  Array.from({ length: Math.max(0, steps) }, () => ({
    method: "gpmaster_mod",
    params: [
      [],
      direction === "up" ? { moveup_chain: [cn] } : { movedown_chain: [cn] },
    ],
  }));

/** Sets the whole order of the active chains in one call (replaces `ipagpochainlist`), e.g. after a drag and drop. */
export const gpmasterSetOrderCommand = (chains: string[]): Command => ({
  method: "gpmaster_mod",
  params: [[], { ipagpochainlist: chains }],
});

/** An empty name is not sent by the server's `ipagpopdcemulator` (it cannot be cleared this way). */
export const gpmasterSetPdcEmulatorCommand = (name: string): Command => ({
  method: "gpmaster_mod",
  params: [[], { ipagpopdcemulator: name }],
});
