import {
  api,
  BatchResponse,
  FindRPCResponse,
  getBatchCommand,
  getCommand,
} from "./rpc";
import { API_VERSION_BACKUP } from "../utils/utils";
import {
  Chain,
  MoveDirection,
  ResolvedGpo,
} from "../utils/datatypes/gpoDataTypes";
import { apiToChain, apiToResolvedGpo } from "../utils/gpoUtils";
import {
  chainAddCommand,
  chainAddGpoCommand,
  chainDelCommand,
  chainDisableCommand,
  chainEnableCommand,
  chainFindCommand,
  chainModCommand,
  chainMoveGpoCommands,
  chainRemoveGpoCommand,
  chainResolveCommand,
  chainShowCommand,
} from "./gpoCommands";

/**
 * Chains of policies (plugin `freeipa-server-gpo`):
 * - chain_find / chain_show / chain_add / chain_mod / chain_del
 * - chain_enable / chain_disable (change the list of the GPMaster, not the chain)
 * - chain_add_gpo / chain_remove_gpo / moves of a policy inside a chain (chain_mod)
 * - chain_resolve_for_user / chain_resolve_for_host
 *
 * The list from `getChainList` is already in the order of priority: the active chains first, then the inactive ones by name.
 * The request shapes are in gpoCommands.ts.
 */

interface FindListResponse {
  result: {
    result: Record<string, unknown>[];
    count: number;
    truncated: boolean;
    summary: string;
  };
}

interface ResolveResponse {
  result: { result: Record<string, unknown>[] };
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    getChainList: build.query<
      Chain[],
      { criteria?: string; sizelimit?: number } | void
    >({
      query: (payload) =>
        getCommand(
          chainFindCommand(
            (payload && payload.criteria) || "",
            (payload && payload.sizelimit) || 0
          )
        ),
      transformResponse: (response: FindListResponse): Chain[] =>
        response.result.result.map(apiToChain),
      providesTags: ["ChainList"],
    }),
    getChainFullData: build.query<Chain, string>({
      query: (cn) => getCommand(chainShowCommand(cn)),
      transformResponse: (response: FindRPCResponse): Chain =>
        apiToChain(response.result.result),
      providesTags: ["FullChain"],
    }),
    addChain: build.mutation<FindRPCResponse, Partial<Chain>>({
      query: (chain) => getCommand(chainAddCommand(chain)),
      invalidatesTags: ["ChainList", "Gpmaster"],
    }),
    removeChains: build.mutation<BatchResponse, string[]>({
      query: (names) =>
        getBatchCommand(names.map(chainDelCommand), API_VERSION_BACKUP),
      invalidatesTags: ["ChainList", "Gpmaster"],
    }),
    saveChain: build.mutation<
      FindRPCResponse,
      { cn: string; changes: Partial<Chain> }
    >({
      query: ({ cn, changes }) => getCommand(chainModCommand(cn, changes)),
      invalidatesTags: ["FullChain", "ChainList", "Gpmaster"],
    }),
    enableChain: build.mutation<FindRPCResponse, string>({
      query: (cn) => getCommand(chainEnableCommand(cn)),
      invalidatesTags: ["FullChain", "ChainList", "Gpmaster"],
    }),
    disableChain: build.mutation<FindRPCResponse, string>({
      query: (cn) => getCommand(chainDisableCommand(cn)),
      invalidatesTags: ["FullChain", "ChainList", "Gpmaster"],
    }),
    /** The answer has `completed` and `failed` (names that were not found or not in the chain, with the reason). */
    addGposToChain: build.mutation<
      FindRPCResponse,
      { cn: string; gpos: string[] }
    >({
      query: ({ cn, gpos }) => getCommand(chainAddGpoCommand(cn, gpos)),
      invalidatesTags: ["FullChain", "ChainList"],
    }),
    removeGposFromChain: build.mutation<
      FindRPCResponse,
      { cn: string; gpos: string[] }
    >({
      query: ({ cn, gpos }) => getCommand(chainRemoveGpoCommand(cn, gpos)),
      invalidatesTags: ["FullChain", "ChainList"],
    }),
    /** Moves a policy of a chain by `steps` places (one server call per step, sent as one batch). */
    moveGpoInChain: build.mutation<
      BatchResponse,
      { cn: string; gpo: string; direction: MoveDirection; steps?: number }
    >({
      query: ({ cn, gpo, direction, steps }) =>
        getBatchCommand(
          chainMoveGpoCommands(cn, gpo, direction, steps),
          API_VERSION_BACKUP
        ),
      invalidatesTags: ["FullChain", "ChainList"],
    }),
    /** The policies that apply to a user or a host, in the order of application. */
    resolveChainPolicies: build.query<
      ResolvedGpo[],
      { target: "user" | "host"; name: string }
    >({
      query: ({ target, name }) =>
        getCommand(chainResolveCommand(target, name)),
      transformResponse: (response: ResolveResponse): ResolvedGpo[] =>
        response.result.result.map(apiToResolvedGpo),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetChainListQuery,
  useGetChainFullDataQuery,
  useAddChainMutation,
  useRemoveChainsMutation,
  useSaveChainMutation,
  useEnableChainMutation,
  useDisableChainMutation,
  useAddGposToChainMutation,
  useRemoveGposFromChainMutation,
  useMoveGpoInChainMutation,
  useResolveChainPoliciesQuery,
} = extendedApi;
