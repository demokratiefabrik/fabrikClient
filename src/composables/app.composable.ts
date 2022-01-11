/** DEMOKRATIFABRIK RUNTIME VARIABLES */
import { ref, readonly} from 'vue'

const stageID = ref<number | null>(null);
const assemblyIdentifier = ref<string | null>(null);
const appExitState = ref<boolean>(false);
const headerOffset = ref<number>(150);

// export default {
export default function useAppComposable() {

  const exitApp = () => (appExitState.value = true);
  const setStageID = (id: number | null) => (stageID.value = id);
  const setAssemblyIdentifier = (identifier: string | null) =>
    (assemblyIdentifier.value = identifier);

  // Layout
  const setHeaderOffset = (offset: number) => (headerOffset.value = offset);

  return {
    stageID: readonly(stageID),
    assemblyIdentifier: readonly(assemblyIdentifier),
    appExitState: readonly(appExitState),
    headerOffset: readonly(headerOffset),
    exitApp,
    setStageID,
    setAssemblyIdentifier,
    setHeaderOffset
  };
}
