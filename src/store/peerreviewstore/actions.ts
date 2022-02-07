import api from 'src/utils/api';

// export const syncPublicIndex = ({ state, dispatch }) => {
//   if (state.publicIndex === null || state.publicIndex === undefined) {
//     // no cached version exists: load the data from resource server...
//     console.log('...public Index cache is empty');
//     dispatch('retrievePublicIndex');
//     return null;
//   }

//   // console.log('...is public index in sync?', state.publicIndex)
//   // renew cache all x- minutes
//   const expired = api.expiredCacheDate(state.publicIndex.access_date);
//   if (expired) {
//     // too old cache: load the data from resource server...
//     console.log('public Index cache is outdated');
//     dispatch('retrievePublicIndex');
//   }

//   return null;
// };

/* Retrieve new version of the previews
  If timelag is set to true, the method will wait a few seconds to give priority the other 
  API-Requests.
  */
export const retrievePeerreviews = (
  { commit },
  { assemblyIdentifier, contenttreeID, timelag }
) => {
  // console.log("with timelage", timelag)
  const timeout = timelag ? 5 * 1000 : 0;
  setTimeout(() => {
    console.assert(contenttreeID);
    api
      .retrievePeerreviews(assemblyIdentifier, contenttreeID)
      .then((response) => {
        // update
        // console.log('save full contenttree to cache.')
        console.assert(response.data);
        console.assert('OK' in response.data);
        console.assert('peerreviews' in response.data);

        commit('add_or_update_peerreviews', {
          contenttreeID: contenttreeID,
          peerreviews: response.data.peerreviews,
        });
      })
      .catch((error) => {
        console.warn('Request Error', error);
      });
  }, timeout);
};

export const update_response = (
  { commit },
  { contenttreeID, peerreviewID, response, accept1, accept2, accept3 }
) => {
  commit('update_response', {
    contenttreeID,
    peerreviewID,
    response,
    accept1,
    accept2,
    accept3,
  });
};

/* Retrieve modifed content of the contenttree <assemblyIdentifier>.<contenttreeID>
 */
export const updatePeerreviews = (
  { commit },
  { assemblyIdentifier, contenttreeID, update_date, timelag }
) => {
  // UPDATE UPDATE-DATE
  // console.log("UPDATE CONTENTTREE; now! with timelage", timelag)
  commit('set_update_date_to_current', { contenttreeID });

  const timeoutSec = (timelag as boolean) ? 1000 : 0;
  setTimeout(() => {
    // console.log('Retrieve contenttree from resource server' + contenttreeID)
    console.assert(contenttreeID);
    api
      .updatePeerreviews(
        assemblyIdentifier,
        contenttreeID,
        update_date
      )
      .then((response) => {
        console.log(
          'RESPONSE OF CONTENTTREE UPDATE IS HERE....',
          response.data
        );
        console.assert(response.data);
        console.assert('OK' in response.data);
        const modifiedReviews = response.data.contents;
        if (modifiedReviews && Object.values(modifiedReviews).length) {
          console.log('STORE MODIFIED CONTENT TO DISK', modifiedReviews);
          commit('update_reviews', {
            peerreviewTuple: modifiedReviews,
          });
        }
      })
      .catch((error) => {
        console.warn('Request Error', error);
      });
  }, timeoutSec);
};

export const updatePeerreviewTuples = (
  { dispatch },
  { modifiedPeerreviews }
) => {
  // in case content or progression changes (without changing hirarchy...)
  console.log('RETRIEVED MODIFIED CONTENTS (2)', modifiedPeerreviews);
  console.assert(modifiedPeerreviews !== undefined);
  console.assert(modifiedPeerreviews !== null);
  for (const peerreviewTuple of Object.values(modifiedPeerreviews)) {
    console.assert(peerreviewTuple !== undefined);
    console.assert(peerreviewTuple !== null);
    dispatch('updatePeerreviewTuple', { peerreviewTuple });
  }
};

export const updatePeerreviewTuple = ({ commit }, { peerreviewTuple }) => {
  console.log(peerreviewTuple);
  commit('update_reviews', {
    peerreviewTuple,
  });
};

export const deletePeerreviewStore = ({ commit }) => {
  commit('deletePeerreviewStore');
};

export const syncPeerreviews = (
  { state, dispatch },
  { assemblyIdentifier, contenttreeID, oauthUserID }
) => {
  // TODO: prevent such api requests in request handler...
  // if (runtimeStore.logoutState) {
  //   // DO not sync after logout.
  //   return (null);
  // }

  // wrong user?
  const wrongUser: boolean =
    state.peerreviews[contenttreeID] &&
    oauthUserID != state.peerreviews[contenttreeID]?.access_sub;
  if (wrongUser) {
    dispatch('deletePeerreviewStore');
    // state.peerreviews = {}
  }

  // Renew cache all x minutes...
  const emptyPeerreviews = !state.peerreviews[contenttreeID];
  const expired =
    !emptyPeerreviews &&
    api.expiredCacheDate(state.peerreviews[contenttreeID]?.access_date);
  if (!expired && !emptyPeerreviews && !wrongUser) {
    // console.log("CONTENTREE CACHE IS STILL VALID! DO WE NEED TO CHECK FOR NEW CONTENT? ")
    dispatch('checkToUpdatePeerreviews', { assemblyIdentifier, contenttreeID });
    return true;
  }

  // too old or missing cache: load the data from resource server...
  console.log(
    'Cache expired: reload peerreviews',
    expired,
    wrongUser,
    emptyPeerreviews
  );
  dispatch('retrievePeerreviews', {
    assemblyIdentifier: assemblyIdentifier,
    contenttreeID: contenttreeID,
    timelag: true,
  });
};

export const checkToUpdatePeerreviews = (
  { state, dispatch },
  { assemblyIdentifier, contenttreeID }
) => {
  // Check for new content / Modified content, from time to time...
  const update_date = state.peerreviews[contenttreeID]?.update_date;
  console.assert(update_date);
  const expiredUpdateTime = api.expiredUpdateDate(update_date);
  if (!expiredUpdateTime) {
    return true;
  }

  // too old or missing cache: load the data from resource server...
  console.log('Its update time: check for modified / new contents');
  dispatch('updatePeerreviews', {
    assemblyIdentifier: assemblyIdentifier,
    contenttreeID: contenttreeID,
    update_date: update_date,
    timelag: true,
  });
};
