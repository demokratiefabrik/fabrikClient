export const add_or_update_peerreviews = (
  state,
  { contenttreeID, peerreviews }
) => {
  console.assert(contenttreeID);
  // console.log('add_or_update_peerreviews', contenttreeID, peerreviews);
  state.peerreviews[contenttreeID] = peerreviews;
};

export const update_reviews = (state, { peerreviewTuple }) => {
  console.assert(peerreviewTuple !== undefined);
  console.assert(peerreviewTuple !== null);
  const contenttreeID: number = peerreviewTuple.peerreview?.contenttree_id;
  const peerreviewID: number = peerreviewTuple.peerreview?.id;

  // NEW ENTRIES
  if (!(peerreviewID in state.peerreviews[contenttreeID].entries)) {
    console.assert(peerreviewTuple.peerreview);
    console.assert(peerreviewTuple.creator);
    state.peerreviews[contenttreeID].entries[peerreviewID] = {};
  }

  if (peerreviewTuple.peerreview) {
    state.peerreviews[contenttreeID].entries[peerreviewID].peerreview =
      peerreviewTuple.peerreview;
  }
  if (peerreviewTuple.progression) {
    state.peerreviews[contenttreeID].entries[peerreviewID].progression =
      peerreviewTuple.progression;
  }
  if (peerreviewTuple.content) {
    state.peerreviews[contenttreeID].entries[peerreviewID].content =
      peerreviewTuple.content;
  }
  if (peerreviewTuple.creator) {
    state.peerreviews[contenttreeID].entries[peerreviewID].creator =
      peerreviewTuple.creator;
  }
};

export const set_update_date_to_current = (state, { contenttreeID }) => {
  const now = new Date();
  state.peerreviews[contenttreeID].update_date = now;
};

export const update_response = (
  state,
  { contenttreeID, peerreviewID, response, accept1, accept2, accept3 }
) => {
  // in case content or progression changes (without changing hierarchy...)
  if (response === null || response === undefined) {
    return null;
  }
  console.log('UPDATE VUEX PREEVIEW');

  let progression =
    state.peerreviews[contenttreeID]?.entries[peerreviewID]?.progression;
  if (progression) {
    state.peerreviews[contenttreeID].entries[
      peerreviewID
    ].progression.response = response;
    state.peerreviews[contenttreeID].entries[
      peerreviewID
    ].progression.criteria_accept1 = accept1;
    state.peerreviews[contenttreeID].entries[
      peerreviewID
    ].progression.criteria_accept2 = accept2;
    state.peerreviews[contenttreeID].entries[
      peerreviewID
    ].progression.criteria_accept3 = accept3;
  } else {
    progression = {
      response,
      criteria_accept1: accept1,
      criteria_accept2: accept2,
      criteria_accept3: accept3,
    };
    state.peerreviews[contenttreeID].entries[peerreviewID].progression =
      progression;
  }
};

export const deletePeerreviewStore = (state) => {
  console.log('delete peerreview store im mutations.');
  state.peerreviews = {};
};
