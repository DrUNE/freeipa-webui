// Data types
import { Metadata } from "src/utils/datatypes/globalDataTypes";
import {
  Chain,
  Gpmaster,
  Gpo,
  ResolvedGpo,
} from "src/utils/datatypes/gpoDataTypes";

type ApiRecord = Record<string, unknown>;

/** A single value that the server may send as a scalar or as a one-item list. */
function first(value: unknown): unknown {
  return Array.isArray(value) ? value[0] : value;
}

function text(value: unknown): string {
  const single = first(value);
  return single === undefined || single === null ? "" : String(single);
}

function integer(value: unknown): number {
  const parsed = Number.parseInt(text(value), 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function flag(value: unknown): boolean {
  const single = first(value);
  return single === true || single === "TRUE" || single === "true";
}

/** A multi-valued attribute: missing means empty, a scalar becomes a one-item list. */
function list(value: unknown): string[] {
  if (value === undefined || value === null) return [];
  return (Array.isArray(value) ? value : [value]).map((item) => String(item));
}

export function createEmptyGpo(): Gpo {
  return {
    displayname: "",
    cn: "",
    distinguishedname: "",
    ipagpoflags: 0,
    ipagpoversionnumber: 0,
    ipagpofilesyspath: "",
    ipagpomachineextensionnames: "",
    ipagpouserextensionnames: "",
  };
}

export function apiToGpo(apiRecord: ApiRecord): Gpo {
  return {
    displayname: text(apiRecord.displayname),
    cn: text(apiRecord.cn),
    distinguishedname: text(apiRecord.distinguishedname),
    ipagpoflags: integer(apiRecord.ipagpoflags),
    ipagpoversionnumber: integer(apiRecord.ipagpoversionnumber),
    ipagpofilesyspath: text(apiRecord.ipagpofilesyspath),
    ipagpomachineextensionnames: text(apiRecord.ipagpomachineextensionnames),
    ipagpouserextensionnames: text(apiRecord.ipagpouserextensionnames),
  };
}

export function createEmptyChain(): Chain {
  return {
    cn: "",
    description: "",
    ipagpousergroup: "",
    ipagpocomputergroup: "",
    ipagpolink: [],
    active: false,
  };
}

/**
 * `ipagpolink` is the order of application (the first has the highest priority); `ipagpolink_gpo` is a copy of it that the
 * server adds, so it is not needed here.
 */
export function apiToChain(apiRecord: ApiRecord): Chain {
  return {
    cn: text(apiRecord.cn),
    description: text(apiRecord.description),
    ipagpousergroup: text(apiRecord.ipagpousergroup),
    ipagpocomputergroup: text(apiRecord.ipagpocomputergroup),
    ipagpolink: list(apiRecord.ipagpolink),
    active: flag(apiRecord.active),
  };
}

export function createEmptyGpmaster(): Gpmaster {
  return {
    cn: "grouppolicymaster",
    ipagpochainlist: [],
    ipagpopdcemulator: "",
  };
}

export function apiToGpmaster(apiRecord: ApiRecord): Gpmaster {
  return {
    cn: text(apiRecord.cn) || "grouppolicymaster",
    ipagpochainlist: list(apiRecord.ipagpochainlist),
    ipagpopdcemulator: text(apiRecord.ipagpopdcemulator),
  };
}

export function apiToResolvedGpo(apiRecord: ApiRecord): ResolvedGpo {
  const resolved: ResolvedGpo = {
    name: text(apiRecord.name),
    flags: text(apiRecord.flags),
    file_system_path: text(apiRecord.file_system_path),
    version: text(apiRecord.version),
  };
  if (apiRecord.error) resolved.error = text(apiRecord.error);
  return resolved;
}

/**
 * Whether the server has the Group Policy plugin: the commands of the three objects are in the metadata (`json_metadata`).
 * The pages and the menu entries of the section are shown only then.
 */
export function isGpoPluginAvailable(metadata: Metadata | undefined): boolean {
  const commands = metadata?.commands;
  if (!commands) return false;
  return ["gpo_find", "chain_find", "gpmaster_show"].every((name) =>
    Object.prototype.hasOwnProperty.call(commands, name)
  );
}
