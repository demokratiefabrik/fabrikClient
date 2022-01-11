import useLibraryComposable from 'src/utils/library';
const { filter } = useLibraryComposable();

export const ongoing_assemblies = (state) => {
  const publicIndex = state.publicIndex;
  if (publicIndex === null) {
    return null;
  }

  const filtered_assemblies = filter(
    state.publicIndex.assemblies,
    (x) => x.is_active
  );
  return Object.values(filtered_assemblies);
};

export const published_assemblies = (state) => {
  if (state.publicIndex === null || state.publicIndex === undefined) {
    return null;
  }

  const filtered_assemblies = filter(
    state.publicIndex.assemblies,
    (x) => x.is_public
  );
  return Object.values(filtered_assemblies);
};

export const UsersManagerAssemblies = (
  state,
  _getters,
  _rootState,
  rootGetters
) => {
  // Check if there is at least one ongoing assembly.
  if (state.publicIndex.assemblies.length === 0) {
    return false;
  }

  // Check permissions:
  const compare_func = rootGetters['profilestore/translateOauthAcls'];
  const accessibleAssemblies = filter(state.publicIndex.assemblies, (x) => {
    const acls = compare_func(x.identifier);
    return acls.includes('manage');
  });
  return Object.values(accessibleAssemblies);
};

export const UsersObserverAssemblies = (
  _state,
  getters,
  _rootState,
  rootGetters
) => {
  // data not yet loaded
  if (getters.ongoing_assemblies === null) {
    return null;
  }

  // Check if there is at least one ongoing assembly.
  if (getters.ongoing_assemblies.length === 0) {
    return false;
  }

  // Check permissions:
  const compare_func = rootGetters['profilestore/translateOauthAcls'];
  const accessibleAssemblies = filter(getters.ongoing_assemblies, (x) => {
    const acls = compare_func(x.identifier);
    return acls.includes('observe');
  });
  return Object.values(accessibleAssemblies);
};

export const UsersDelegateAssemblies = (
  _state,
  getters,
  _rootState,
  rootGetters
) => {
  // data not yet loaded
  if (getters.ongoing_assemblies === null) {
    return null;
  }

  // Check if there is at least one ongoing assembly.
  if (getters.ongoing_assemblies.length === 0) {
    return false;
  }

  // Check permissions:
  const compare_func = rootGetters['profilestore/translateOauthAcls'];
  const accessibleAssemblies = filter(getters.ongoing_assemblies, (x) => {
    const acls = compare_func(x.identifier);
    return acls.includes('delegate');
  });
  return Object.values(accessibleAssemblies);
};

export const IsUserDelegateOfOngoingAssembly = (_state, getters) => {
  // console.log("IsUserDelegateOfOngoingAssembly", getters.UsersDelegateAssemblies)
  const assemblies = getters.UsersDelegateAssemblies;
  return assemblies && Object.values(assemblies).length > 0;
};

export const IsUserObserverOfOngoingAssembly = (getters) => {
  // console.log("IsUserObserverOfOngoingAssembly", getters.UsersDelegateAssemblies)
  const assemblies = getters.UsersObserverAssemblies;
  return assemblies && Object.values(assemblies).length > 0;
};

export const /* SHORTCUTS: mainly for artificial moderators */
  IsThereAnAssemblyInPublicState = (state) => {
    if (state.published_assemblies == null) {
      return null;
    }
    return state.published_assemblies.length > 0;
  };

export const IsThereAnAssemblyOngoing = (_state, getters) => {
  if (getters.ongoing_assemblies === null) {
    return null;
  }
  return getters.ongoing_assemblies.length > 0;
};

export const IsThereNothingGoingOn = (_state, getters) => {
  if (
    getters.IsThereAnAssemblyInPublicState === false ||
    getters.IsThereAnAssemblyInPublicState === false
  ) {
    return null;
  }

  return (
    !getters.IsThereAnAssemblyOngoing && !getters.IsThereAnAssemblyInPublicState
  );
};

export const isUserAssemblyManager =
  (_state, _getters, _rootState, rootGetters) => (assemblyIdentifier) => {
    // Check permissions:
    const aclFunc = rootGetters['profilestore/translateOauthAcls'];
    const acls = aclFunc(assemblyIdentifier);
    return acls.includes('manage');
  };
