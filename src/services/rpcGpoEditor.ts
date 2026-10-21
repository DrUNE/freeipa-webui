import { api, getCommand } from "./rpc";
import type {
  GpoEditorAdvancedAuditShowResult,
  GpoEditorAdvancedAuditUpdateResult,
  GpoEditorChildrenResult,
  GpoEditorOpenResult,
  GpoEditorPolicyIndexResult,
  GpoEditorPolicyShowResult,
  GpoEditorPolicyUpdateResult,
  GpoEditorPreferenceCreateResult,
  GpoEditorPreferenceDeleteResult,
  GpoEditorPreferenceDocumentsResult,
  GpoEditorPreferenceItemsResult,
  GpoEditorPreferenceShowResult,
  GpoEditorPreferenceUpdateResult,
  GpoEditorReconcileResult,
  GpoEditorScriptAssetDeleteResult,
  GpoEditorScriptAssetDownloadResult,
  GpoEditorScriptAssetReplaceResult,
  GpoEditorScriptAssetUploadResult,
  GpoEditorScriptEntriesReorderResult,
  GpoEditorScriptEntryAddResult,
  GpoEditorScriptEntryRemoveResult,
  GpoEditorScriptEntryUpdateResult,
  GpoEditorScriptFilesResult,
  GpoEditorScriptOrderUpdateResult,
  GpoEditorScriptUploadAndAddResult,
  GpoEditorScriptsShowResult,
  GpoEditorSecurityDefinitionsShowResult,
  GpoEditorSecurityDefinitionsUpdateResult,
} from "../utils/datatypes/gpoEditorRpc";

/**
 * The editor commands of the Group Policy plugin (`gpo_editor_*`): 28 commands that read and change the content of one
 * policy (ADMX settings, preferences, scripts, security, advanced audit). The graphical editor of stage 5 of the migration
 * is built on them; until then the editor of the plugin (an island) talks to the server itself.
 *
 * Every command takes the policy's display name as its only argument and options; every answer has the same envelope
 * (the policy, its snapshot, diagnostics, pending publication). The shapes of the answers are in
 * `utils/datatypes/gpoEditorRpc.ts`, a copy of the types the plugin generates from its reference answers.
 */

/** The answer of every editor command, by its name without the `gpo_editor_` prefix. */
export interface GpoEditorResults {
  advanced_audit_show: GpoEditorAdvancedAuditShowResult;
  advanced_audit_update: GpoEditorAdvancedAuditUpdateResult;
  children: GpoEditorChildrenResult;
  open: GpoEditorOpenResult;
  policy_index: GpoEditorPolicyIndexResult;
  policy_show: GpoEditorPolicyShowResult;
  policy_update: GpoEditorPolicyUpdateResult;
  preference_create: GpoEditorPreferenceCreateResult;
  preference_delete: GpoEditorPreferenceDeleteResult;
  preference_documents: GpoEditorPreferenceDocumentsResult;
  preference_items: GpoEditorPreferenceItemsResult;
  preference_show: GpoEditorPreferenceShowResult;
  preference_update: GpoEditorPreferenceUpdateResult;
  reconcile: GpoEditorReconcileResult;
  script_asset_delete: GpoEditorScriptAssetDeleteResult;
  script_asset_download: GpoEditorScriptAssetDownloadResult;
  script_asset_replace: GpoEditorScriptAssetReplaceResult;
  script_asset_upload: GpoEditorScriptAssetUploadResult;
  script_entries_reorder: GpoEditorScriptEntriesReorderResult;
  script_entry_add: GpoEditorScriptEntryAddResult;
  script_entry_remove: GpoEditorScriptEntryRemoveResult;
  script_entry_update: GpoEditorScriptEntryUpdateResult;
  script_files: GpoEditorScriptFilesResult;
  script_order_update: GpoEditorScriptOrderUpdateResult;
  script_upload_and_add: GpoEditorScriptUploadAndAddResult;
  scripts_show: GpoEditorScriptsShowResult;
  security_definitions_show: GpoEditorSecurityDefinitionsShowResult;
  security_definitions_update: GpoEditorSecurityDefinitionsUpdateResult;
}

export type GpoEditorMethod = keyof GpoEditorResults;

/** The `{ method, params }` of an editor command: `gpo_editor_<method>` with `[[displayname], options]`. */
export const gpoEditorCommand = (
  method: GpoEditorMethod,
  displayname: string,
  options: Record<string, unknown> = {}
) =>
  getCommand({
    method: `gpo_editor_${method}`,
    params: [[displayname], options],
  });

interface GpoEditorPayload {
  method: GpoEditorMethod;
  displayname: string;
  options?: Record<string, unknown>;
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Runs one editor command. The hook is not generic: cast the data to `GpoEditorResults[method]` where the method is
     * known, e.g. `data as GpoEditorResults["policy_show"]`.
     */
    gpoEditorCommand: build.mutation<unknown, GpoEditorPayload>({
      query: ({ method, displayname, options }) =>
        gpoEditorCommand(method, displayname, options),
    }),
  }),
  overrideExisting: false,
});

export const { useGpoEditorCommandMutation } = extendedApi;
