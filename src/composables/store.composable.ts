/** DEMOKRATIFABRIK RUNTIME VARIABLES */
import { ref } from 'vue';
const assemblyIdentifier = ref<string | null>(null);
const stageID = ref<number | null>(null);
const setAssemblyIdentifier = (identifier: string | null) => assemblyIdentifier.value = identifier;
const setStageID = (id: number | null) => (stageID.value = id);

export default function useStoreComposable() {
  return {
    assemblyIdentifier,
    setAssemblyIdentifier,
    setStageID,
    stageID,
  };
}
