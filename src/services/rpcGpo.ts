import {
  api,
  BatchResponse,
  FindRPCResponse,
  getBatchCommand,
  getCommand,
} from "./rpc";
import { API_VERSION_BACKUP } from "../utils/utils";
import { Gpo } from "../utils/datatypes/gpoDataTypes";
import { apiToGpo } from "../utils/gpoUtils";
import {
  gpoAddCommand,
  gpoDelCommand,
  gpoFindCommand,
  gpoModCommand,
  gpoShowCommand,
} from "./gpoCommands";

/**
 * Group Policy Objects (plugin `freeipa-server-gpo`):
 * - gpo_find / gpo_show / gpo_add / gpo_del / gpo_mod
 *
 * The primary key is `displayname`; renaming keeps the GUID (`cn`) and changes the key, so refer to a policy by its new
 * name afterwards. The request shapes are in gpoCommands.ts.
 */

/** The answer of a `*_find` call that returns entries (not only primary keys). */
interface FindListResponse {
  result: {
    result: Record<string, unknown>[];
    count: number;
    truncated: boolean;
    summary: string;
  };
}

interface GpoListPayload {
  /** Searches the name; empty lists everything. */
  criteria?: string;
  /** 0 means no limit. */
  sizelimit?: number;
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /** All policies (or the ones matching `criteria`) with their full data. */
    getGpoList: build.query<Gpo[], GpoListPayload | void>({
      query: (payload) =>
        getCommand(
          gpoFindCommand(
            (payload && payload.criteria) || "",
            (payload && payload.sizelimit) || 0
          )
        ),
      transformResponse: (response: FindListResponse): Gpo[] =>
        response.result.result.map(apiToGpo),
      providesTags: ["GpoList"],
    }),
    getGpoFullData: build.query<Gpo, string>({
      query: (displayname) => getCommand(gpoShowCommand(displayname)),
      transformResponse: (response: FindRPCResponse): Gpo =>
        apiToGpo(response.result.result),
      providesTags: ["FullGpo"],
    }),
    addGpo: build.mutation<FindRPCResponse, string>({
      query: (displayname) => getCommand(gpoAddCommand(displayname)),
      invalidatesTags: ["GpoList"],
    }),
    /** Deletes the policies and their SYSVOL folders. The ones already deleted on the server are not an error there. */
    removeGpos: build.mutation<BatchResponse, string[]>({
      query: (names) =>
        getBatchCommand(names.map(gpoDelCommand), API_VERSION_BACKUP),
      invalidatesTags: ["GpoList", "ChainList", "FullChain"],
    }),
    /** `changes.displayname` different from `displayname` renames the policy (in the same call). */
    saveGpo: build.mutation<
      FindRPCResponse,
      { displayname: string; changes: Partial<Gpo> }
    >({
      query: ({ displayname, changes }) =>
        getCommand(gpoModCommand(displayname, changes)),
      invalidatesTags: ["FullGpo", "GpoList"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetGpoListQuery,
  useGetGpoFullDataQuery,
  useAddGpoMutation,
  useRemoveGposMutation,
  useSaveGpoMutation,
} = extendedApi;
