import api from 'src/utils/api';

export const syncPublicIndex = ({ state, dispatch }) => {
  // console.log("...is public index in sync?")
  if (state.publicIndex === null || state.publicIndex === undefined) {
    // no cached version exists: load the data from resource server...
    console.log('...public Index cache is empty');
    dispatch('retrievePublicIndex');
    return null;
  }

  // renew cache all x- minutes
  const expired = api.expiredCacheDate(state.publicIndex.access_date);
  if (expired) {
    // too old cache: load the data from resource server...
    console.log('public Index cache is outdated');
    dispatch('retrievePublicIndex');
  }

  return null;
};

export const retrievePublicIndex = ({ commit }) => {
  console.log('Retrieve publicIndex from resource server');
  api
    .retrievePublicIndex()
    .then((response) => {
      // save data
      // console.log('save PublicIndex to cache.', response)
      console.assert(response.data !== null && response.data !== undefined);
      commit('storePublicIndex', response.data);
    })
    .catch((error) => {
      console.log(error);
      console.warn('Request Error');
    });
};
