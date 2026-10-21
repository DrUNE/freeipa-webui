import {
  api,
  BatchResponse,
  FindRPCResponse,
  getBatchCommand,
  getCommand,
} from "./rpc";
import { API_VERSION_BACKUP } from "../utils/utils";
import { Gpmaster, MoveDirection } from "../utils/datatypes/gpoDataTypes";
import { apiToGpmaster } from "../utils/gpoUtils";
import {
  gpmasterMoveChainCommands,
  gpmasterSetOrderCommand,
  gpmasterSetPdcEmulatorCommand,
  gpmasterShowCommand,
} from "./gpoCommands";

/**
 * The GPMaster, the singleton that orders the active chains and names the PDC emulator (plugin `freeipa-server-gpo`):
 * - gpmaster_show / gpmaster_mod (add_chain, remove_chain, moveup_chain, movedown_chain, ipagpochainlist, ipagpopdcemulator)
 *
 * Enabling and disabling a chain is `chain_enable` / `chain_disable` in rpcChain.ts. The request shapes are in gpoCommands.ts.
 */
const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    getGpmaster: build.query<Gpmaster, void>({
      query: () => getCommand(gpmasterShowCommand()),
      transformResponse: (response: FindRPCResponse): Gpmaster =>
        apiToGpmaster(response.result.result),
      providesTags: ["Gpmaster"],
    }),
    /** Moves an active chain by `steps` places (one server call per step, sent as one batch). */
    moveChain: build.mutation<
      BatchResponse,
      { cn: string; direction: MoveDirection; steps?: number }
    >({
      query: ({ cn, direction, steps }) =>
        getBatchCommand(
          gpmasterMoveChainCommands(cn, direction, steps),
          API_VERSION_BACKUP
        ),
      invalidatesTags: ["Gpmaster", "ChainList"],
    }),
    /** Sets the whole order of the active chains in one call. */
    setChainOrder: build.mutation<FindRPCResponse, string[]>({
      query: (chains) => getCommand(gpmasterSetOrderCommand(chains)),
      invalidatesTags: ["Gpmaster", "ChainList"],
    }),
    setPdcEmulator: build.mutation<FindRPCResponse, string>({
      query: (name) => getCommand(gpmasterSetPdcEmulatorCommand(name)),
      invalidatesTags: ["Gpmaster"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetGpmasterQuery,
  useMoveChainMutation,
  useSetChainOrderMutation,
  useSetPdcEmulatorMutation,
} = extendedApi;
