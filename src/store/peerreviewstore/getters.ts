import { IPeerreviewTuple } from 'src/models/peerreview';
// import useLibraryComposable from 'src/utils/library';
// const { filter } = useLibraryComposable();
// export const ongoing_assemblies = (state) => {

import { date } from 'quasar';
const { isSameDate } = date;


// TODO: not used, right?
export const all_peerreviews = (state) => {
  if (!Object.keys(state.peerreviews).length) {
    return null;
  }
  const peerreviews: IPeerreviewTuple[] = [];
  Object.keys(state.peerreviews).forEach((contenttreeID) => {
    const entries: IPeerreviewTuple[] =
      state.peerreviews[contenttreeID].entries;
    if (entries) {
      Object.values(entries).forEach((peerreview) => {
        peerreviews.push(peerreview);
      });
    }
  });

  return peerreviews;
};

// TODO: load contenttree ids, right
export const loadedPeerreviewContententtrees = (state) => {
  return Object.keys(state.peerreviews);
};

export const load_all_peerreviews_by_content_id = (state) => {
  if (!Object.keys(state.peerreviews).length) {
    return null;
  }
  const peerreviews = {};
  Object.keys(state.peerreviews).forEach((contenttreeID) => {
    const entries: IPeerreviewTuple[] =
      state.peerreviews[contenttreeID].entries;
    if (entries) {
      Object.values(entries).forEach((peerreview) => {
        if (!peerreview.disabled) {
          const content_id = peerreview.content.id;
          if (content_id) {
            if (!peerreviews[content_id]) {
              peerreviews[content_id] = [];
            }
            peerreviews[content_id].push(peerreview);
          } else {
            console.error('peerreview is misconfigured....');
          }
        }
      });
    }
  });

  return peerreviews;
};

// Open peerreviews assigned for the user...
// Only one per content is allowed!
export const get_uncompleted_user_peerreviews = (state) => {
  if (!Object.keys(state.peerreviews).length) {
    return null;
  }
  const peerreviews: IPeerreviewTuple[] = [];
  Object.keys(state.peerreviews).forEach((contenttreeID) => {
    const entries: IPeerreviewTuple[] =
      state.peerreviews[contenttreeID].entries;
    if (entries) {
      Object.values(entries).forEach((peerreview) => {
        // NOT ASSIGNED OR disabled
        if (!peerreview.progression || peerreview.disabled) {
          return;
        }
        // Only those peerreviews that are still open
        // Priority for those peerreviews are not responded...
        if (
          !peerreview.peerreview.approved &&
          peerreview.progression.response === null &&
          !peerreview.peerreview.rejected
        ) {
          peerreviews.push(peerreview);
        }
      });
    }
  });

  return peerreviews;
};

// Open peerreviews assigned for the user...
// Only one per content is allowed!
export const get_user_peerreviews_by_content_id = (state) => {
  if (!Object.keys(state.peerreviews).length) {
    return null;
  }
  const peerreviews: Record<number, IPeerreviewTuple[]> = {};
  Object.keys(state.peerreviews).forEach((contenttreeID) => {
    const entries: IPeerreviewTuple[] =
      state.peerreviews[contenttreeID].entries;
    if (entries) {
      Object.values(entries).forEach((peerreview) => {
        // NOT ASSIGNED OR disabled
        if (!peerreview.progression || peerreview.disabled) {
          return;
        }

        // STILL OPEN / OR closed today!
        const openResponse =
          peerreview.progression &&
          (!peerreview.progression.date_responded ||
            isSameDate(
              new Date(),
              peerreview.progression.date_responded,
              'day'
            ));
        const notRejected =
          !peerreview.peerreview.date_rejected ||
          isSameDate(new Date(), peerreview.peerreview.date_rejected, 'day');
        const notApproved =
          !peerreview.peerreview.date_approved ||
          isSameDate(new Date(), peerreview.peerreview.date_approved, 'day');

        // Only those peerreviews that are still open
        // Priority for those peerreviews are not responded...
        // console.log(peerreview.peerreview.id, peerreview, notApproved, notRejected, openResponse, "VISIBLE?")
        if (openResponse && notRejected && notApproved) {
          if (peerreview.content.id) {
            const content_id = peerreview.content.id;
            if (!peerreviews[content_id]) {
              peerreviews[content_id] = [];
            }
            peerreviews[content_id].push(peerreview);
          } else {
            console.error('peerreview misconfiguration');
          }
        }
      });
    }
  });

  return peerreviews;
};

// All peerreviews assigned for the user...
export const get_user_peerreviews_by_parent_and_content = () => {
  if (get_user_peerreviews_by_content_id === null) {
    return null;
  }

  const peerreviews: Record<number, Record<number, IPeerreviewTuple[]>> = {};
  for (const [contentID, contentPeerreviews] of Object.entries(
    get_user_peerreviews_by_content_id
  )) {
    const first = contentPeerreviews[Object.keys(contentPeerreviews)[0]];
    const parentID = first.content.parent_id;
    if (!peerreviews[parentID]) {
      peerreviews[parentID] = {};
    }
    peerreviews[parentID][contentID] = contentPeerreviews;
  }

  return peerreviews;
};

export const get_peerreview_by_content =
  () =>
  ({ contentID }) => {
    console.assert(contentID);
    console.log('load peerreview of contentID', contentID);
    const peerreviews_by_content = load_all_peerreviews_by_content_id;
    console.assert(peerreviews_by_content != null);
    if (contentID in peerreviews_by_content) {
      return peerreviews_by_content[contentID];
    }
    return [];
  };

export const get_peerreview =
  (state) =>
  ({ contenttreeID, peerreviewID }) => {
    console.log('load one specific peerreview');
    if (!state.peerreviews[contenttreeID]) {
      return;
    }
    return state.peerreviews[contenttreeID].entries[peerreviewID];
  };
