export const get_contenttree =
  (state) =>
  ({ contenttreeID }) => {
    const key = `${contenttreeID}`
    if (!(Object.keys(state.contenttree).includes(key))) {
      return null;
    }

    return state.contenttree[key];
  };

export const get_content =
  (state) =>
  ({ contenttreeID, contentID }) => {
    return state.contenttree[contenttreeID]?.entries[contentID];
  };

export const get_content_text_max_length =
  (state) =>
  ({ contenttreeID, type }) => {
    // console.log(contenttreeID, type)
    const MAX_LENGTHS =
      state.contenttree[contenttreeID].configuration
        .CONTENT_TEXT_MAX_LENGTH_BY_TYPES;
    if (type in MAX_LENGTHS) {
      return MAX_LENGTHS[type];
    }
    return state.contenttree[contenttreeID].configuration
      .DEFAULT_CONTENT_TEXT_MAX_LENGTH;
  };

export const get_content_title_max_length =
  (state) =>
  ({ contenttreeID, type }) => {
    const MAX_LENGTHS =
      state.contenttree[contenttreeID].configuration
        .CONTENT_TITLE_MAX_LENGTH_BY_TYPES;
    if (type in MAX_LENGTHS) {
      return MAX_LENGTHS[type];
    }
    return state.contenttree[contenttreeID].configuration
      .DEFAULT_CONTENT_TITLE_MAX_LENGTH;
  };

export const get_allowed_node_types =
  (state) =>
  ({ contenttreeID, parentType }) => {
    // Allowed types by ontology
    let types = [];
    if (parentType === undefined) {
      types = state.contenttree[contenttreeID].configuration.CONTENTTYPES;
    } else {
      types =
        state.contenttree[contenttreeID].configuration.ONTOLOGY[parentType];
    }

    return types;
  };

export const get_node_types_with_add_permission =
  (state) =>
  ({ contenttreeID }) => {
    // Allowed types by ontology
    return state.contenttree[contenttreeID].configuration
      .ALLOWED_CONTENT_TYPES_TO_ADD;
  };

export const getExpandedBranches =
  (state) =>
  ({ contenttreeID, rootNodeID }) => {
    const key = contenttreeID + '-' + rootNodeID;
    if (!(key in state.expanded_branches)) {
      return null;
    }
    return state.expanded_branches[key];
  };

export const isCommonPropertyByConentType =
  (state) =>
  ({ contenttreeID, type }) => {
    if (
      !state.contenttree[contenttreeID].configuration.CONTENTTYPES.includes(
        type
      )
    ) {
      return null;
    }

    return state.contenttree[
      contenttreeID
    ].configuration.COMMON_PROPERTY_CONTENT.includes(type);
  };

export const monitorPathChange =
  (state) =>
  ({ contentTuple }) => {
    // return yes, if parent_id changed or if path is not yet set.
    console.assert(
      contentTuple && contentTuple.content && contentTuple.content.id
    );
    const contenttreeID = contentTuple.content.contenttree_id;
    console.assert(contenttreeID);
    const previousParentID =
      state.contenttree[contenttreeID].entries[contentTuple.content.id]?.content
        ?.parent_id;
    return previousParentID !== contentTuple.content.parent_id;
  };
