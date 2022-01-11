
 export const add_or_update_contenttree = (state, { contenttreeID, contenttree, configuration }) => {

    // keep list of opened contents (if previously available)
    // console.log('update contenttree')
    let configuration_old = null;
    const expanded_old = null;

    if (contenttreeID in state.contenttree) {
      // expanded_old = state.contenttree[contenttreeID].expanded_by_default
      configuration_old = state.contenttree[contenttreeID].configuration
    }
    // console.log(configuration)

    contenttree.configuration = configuration ? configuration : configuration_old
    if (expanded_old) {
      contenttree.expanded = expanded_old
    }
    // console.log(contenttree)
    // console.log('new copy saved...')
    state.contenttree[contenttreeID] = contenttree
  }

 export const  update_content = (state, { contentTuple }) => {
    // in case content or progression changes (without changing hirarchy...)
    console.assert(contentTuple !== undefined)
    console.assert(contentTuple !== null)

    const contenttreeID = contentTuple.content.contenttree_id
    const contentID = contentTuple.content.id

    // NEW ENTRIES
    if (!(contentID in state.contenttree[contenttreeID].entries)) {
      console.assert(contentTuple.content);
      console.assert(contentTuple.creator);
      state.contenttree[contenttreeID].entries[contentTuple.content.id] = {
        progression: contentTuple.progression,
        content: contentTuple.content,
        creator: contentTuple.creator,
        path: contentTuple.path
      }
    } else {

      if (contentTuple.progression) {
        state.contenttree[contenttreeID].entries[contentID].progression = contentTuple.progression
      }
      if (contentTuple.content) {
        state.contenttree[contenttreeID].entries[contentID].content = contentTuple.content
      }
      if (contentTuple.creator) {
        state.contenttree[contenttreeID].entries[contentID].creator = contentTuple.creator
      }
      if (contentTuple.path) {
        state.contenttree[contenttreeID].entries[contentID].path = contentTuple.path
      }
    }
  }

 export const  updateTreeStructure = (state, { contenttreeID, contentIdsToUpdate }) => {

    console.log('content that have changed their parent object', contentIdsToUpdate)
    const values = Object.values(state.contenttree[contenttreeID].entries);
    const contentsToUpdate = values.filter((contentTuple: any) => {
      return !contentTuple.path || contentTuple.path.some(r => contentIdsToUpdate.includes(r))
    })

    console.log('content that is affected by parent_id modifications', contentsToUpdate)
    contentsToUpdate.forEach((contentTuple: any) => {
      console.log('UPDATE PATH FOR FOLLOGING CONTENTS', contentIdsToUpdate)
      let antecesdentID = contentTuple.content.id
      let antecesdent = state.contenttree[contenttreeID].entries[antecesdentID];
      let rootElementIds = state.contenttree[contenttreeID].rootElementIds;
      const isAmongRootElementIds = rootElementIds.includes(contentTuple.content.id)
      console.assert(!antecesdentID || antecesdent)
      const path: number[] = []
      while (antecesdent) {
        path.unshift(antecesdentID)
        // GET new Ancestore
        antecesdentID = antecesdent.content.parent_id
        if (antecesdentID) {
          antecesdent = state.contenttree[contenttreeID].entries[antecesdentID];
        } else {
          antecesdent = null;
        }
        console.assert(!antecesdentID || antecesdent)
      }
      state.contenttree[contenttreeID].entries[contentTuple.content.id].path = path

      // Update RootNode Ids...
      if (contentTuple.content.parent_id && isAmongRootElementIds) {
        // REMOVE
        rootElementIds = rootElementIds.filter(x => x !== contentTuple.content.id)
        state.contenttree[contenttreeID].rootElementIds = rootElementIds
      }
      if (!contentTuple.content.parent_id && !isAmongRootElementIds) {
        // ADD
        rootElementIds.push(contentTuple.content.id)
        state.contenttree[contenttreeID].rootElementIds = rootElementIds
        // console.log("add ")
      }
      console.log('CURRENT ROOT ELEMENTS:, ', rootElementIds)
    })
  }

 export const  update_expanded_branches = (state, { contenttreeID, rootNodeID, expanded }) => {
    // in case content or progression changes (without changing hierarchy...)
    const key = contenttreeID + '-' + rootNodeID
    state.expanded_branches, key, expanded
  }

 export const  delete_contenttree = (state, { contenttreeID }) => {
    state.contenttree[contenttreeID] = null
  }

 export const  set_update_date_to_current = (state, { contenttreeID }) => {
    const now = new Date()
    state.contenttree[contenttreeID].update_date = now
  }


 export const update_rating = (state, { contenttreeID, contentID, rating }) => {
    // in case content or progression changes (without changing hierarchy...)
    if (rating === null || rating === undefined) {
      return (null)
    }

    let progression = state.contenttree[contenttreeID]?.entries[contentID]?.progression
    if (!progression) {
      progression = {
        read: true,
        discussed: true
      }
    }

    // store value
    progression.rating = rating

    state.contenttree[contenttreeID].entries[contentID].progression = progression
  }

 export const  update_review = (state, { contenttreeID, contentID, reviewed }) => {
    // in case content or progression changes (without changing hierarchy...)
    if (reviewed === null || reviewed === undefined) {
      return (null)
    }

    const content = state.contenttree[contenttreeID]?.entries[contentID]?.content
    console.assert(content)

    // store value
    content.reviewed = reviewed

    state.contenttree[contenttreeID].entries[contentID].content = content
  }

 export const  update_read = (state, { contenttreeID, contentID }) => {
    let progression = state.contenttree[contenttreeID]?.entries[contentID]?.progression
    if (!progression) {
      progression = {
        read: false,
        discussed: false,
        rating: null,
        salience: null
      }
    }

    // store value
    progression.read = true

    state.contenttree[contenttreeID].entries[contentID].progression = progression
  }

 export const  update_discussed = (state, { contenttreeID, contentID }) => {
    // console.log("update_discussed ############", contentID, contenttreeID)
    let progression = state.contenttree[contenttreeID]?.entries[contentID]?.progression
    if (!progression) {
      progression = {
        read: true,
        discussed: true,
        rating: null,
        salience: null
      }
      console.log('add progressison', progression)
      state.contenttree[contenttreeID].entries[contentID].progression = progression
    } else {
      console.log('update.. progressison discussed', contentID)
      state.contenttree[contenttreeID].entries[contentID].progression.discussed = true
    }
  }

 export const  update_salience = (state, { contenttreeID, contentID, salience }) => {

    if (salience === undefined) {
      return (null)
    }

    // TARGET
    let progression = state.contenttree[contenttreeID]?.entries[contentID]?.progression
    if (!progression) {
      progression = {
        read: true,
        salience: salience,
        discussed: true,
        view: false
      }
      state.contenttree[contenttreeID].entries[contentID].progression = progression
    } else {
      console.log('update.. progressison salienced', contentID, salience)

      state.contenttree[contenttreeID].entries[contentID].progression.salience = salience
    }
  }

 export const deleteContentStore = (state) => {
    state.contenttree = {}
    state.expanded_branches = {}
  }