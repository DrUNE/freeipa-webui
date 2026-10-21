/**
 * Data types of the Group Policy plugin (`freeipa-server-gpo`): policies (gpo), chains of policies (chain) and the
 * chain order master (gpmaster). The shapes follow the answers of the `gpo_*`, `chain_*` and `gpmaster_*` commands after
 * `src/utils/gpoUtils.ts` has normalised them (the server sends single values as one-item lists and sometimes as scalars).
 */

/** A Group Policy Object. `displayname` is the primary key; `cn` is the GUID `{XXXXXXXX-...}`. */
export interface Gpo {
  displayname: string;
  cn: string;
  distinguishedname: string;
  ipagpoflags: number;
  ipagpoversionnumber: number;
  ipagpofilesyspath: string;
  ipagpomachineextensionnames: string;
  ipagpouserextensionnames: string;
}

/**
 * An ordered chain of policies applied to a user group and/or a host group. `ipagpolink` holds GPO display names, the first
 * one has the highest priority. `active` is computed by the server: the chain is in the list of the GPMaster.
 */
export interface Chain {
  cn: string;
  description: string;
  ipagpousergroup: string;
  ipagpocomputergroup: string;
  ipagpolink: string[];
  active: boolean;
}

/** The singleton that orders the active chains (`ipagpochainlist`, the first has the highest priority). */
export interface Gpmaster {
  cn: string;
  ipagpochainlist: string[];
  ipagpopdcemulator: string;
}

/** A policy as `chain_resolve_for_user` and `chain_resolve_for_host` return it (snake_case, not an LDAP entry). */
export interface ResolvedGpo {
  name: string;
  flags: string | number;
  file_system_path: string;
  version: string | number;
  /** Set when the details of this policy could not be read. */
  error?: string;
}

/** Which way to move an item of an ordered list (up = closer to the start = higher priority). */
export type MoveDirection = "up" | "down";
