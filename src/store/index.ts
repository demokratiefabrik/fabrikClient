import {createStore} from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import appstore from './appstore'
import contenttreestore from './contenttreestore';
import assemblystore from './assemblystore';
import publicindexstore from './publicindexstore';
import profilestore from './profilestore';

export default function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      appstore,
      profilestore,
      assemblystore,
      contenttreestore,
      publicindexstore
    },
    plugins: [createPersistedState()],

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: !!process.env.DEBUGGING,
  });

  return Store;
};
