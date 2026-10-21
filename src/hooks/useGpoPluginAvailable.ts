import { useGetObjectMetadataQuery } from "src/services/rpc";
import { isGpoPluginAvailable } from "src/utils/gpoUtils";

/**
 * Whether the server has the Group Policy plugin, so the "Group Policy" section (menu entries and routes) is shown only
 * then. `undefined` while the metadata is loading.
 */
export function useGpoPluginAvailable(): boolean | undefined {
  const { data, isLoading } = useGetObjectMetadataQuery();
  if (isLoading) return undefined;
  return isGpoPluginAvailable(data);
}
