import Vue from "vue";

export const runtimeStore = Vue.observable({
  stageID: null,
  assemblyIdentifier: null,
  appExitState: false,
  brokenSession: false,
  logoutState: false
})

export const runtimeMutations = {
  exitApp() {
    runtimeStore.appExitState = true
  },
  setStageID(stageID) {
    runtimeStore.stageID = parseInt(stageID)
  },
  setBrokenSession(val = true) {
    runtimeStore.brokenSession = val
  },
  // setStageNr(stageID) {
  //   runtimeStore.stageID = parseInt(stageID)
  // },
  setAssemblyIdentifier(assemblyIdentifier) {
    runtimeStore.assemblyIdentifier = assemblyIdentifier
  },
  setLogoutState(val = true) {
    runtimeStore.logoutState = val
  }


}