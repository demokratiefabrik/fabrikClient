/**
 * Requires inherited contenttreeID
 */
// import { mapGetters, mapActions, useStore } from 'vuex'
// import { ReactiveProvideMixin } from 'vue-reactive-provide'
// import { LayoutEventBus } from 'src/utils/eventbus.js'
import constants from 'src/utils/constants';
import useEmitter from 'src/utils/emitter';
import useLibraryComposable from 'src/utils/library';
// import useAssemblyComposable from './assembly.composable';
import { computed } from 'vue';
// import useAppComposable from './app.composable';
import useMonitorComposable from './monitor.composable';
import { useStore } from 'vuex';
import useStagesComposable from './stages.composable';


export interface INode {
  id: number | null;
  path: number[];
  children: INode[];   
  progression?: any;
  creator?: any;
  content?: any;
}

export default function useContenttreeComposable() {
  const store = useStore();
  const emitter = useEmitter();
  // const { gotoAssemblyHome } = useAssemblyComposable();
  const { loaded, pushSorted} = useLibraryComposable();
  const { monitorLog } = useMonitorComposable();
  const { routed_stage } = useStagesComposable();

  
  const get_contenttree = store.getters['contentstore/get_contenttree'];
  // const numberOfUnsaliencedTopLevelEntries   = store.getters['contentstore/get_contenttree'];
  // const contenttree = store.getters['contentstore/get_contenttree'];

  const contenttreeID = computed(() => {
    // Mixin is only usable for pages with assemblyIdentifier in the URL
    console.log('load contenttreeID in contentree.computed');

    // console.log("RETRIEVE contenttreeID..", routed_stage)
    if (!routed_stage.value || !routed_stage?.value.stage?.contenttree_id) {
      // console.log(' routed_stage not loaded');
      return null;
    }
    // console.log('contenttreeID', routed_stage.value.stage?.contenttree_id);
    return routed_stage.value.stage?.contenttree_id;
  });

  const contenttree = computed(() => {
    console.log('load contenttree in contentree.computed');
    if (!contenttreeID.value) {
      return null;
    }

    // retrieve from localStorage
    const contenttree = get_contenttree ({
      contenttreeID
    });

    // console.log('contenttree', contenttree);
    return contenttree;
  });

  const ready = computed(() => {
    const ready = loaded(contenttree.value) && loaded(contenttree.value.rootElementIds);
    if (ready) {
      emitter.emit('hideLoading');
    }
    return ready;
  });

  const contents = computed(() => {
    return contenttree.value?.entries;
  });

  const rootNode = computed(() => {
    return {
      id: null,
      path: [],
      children: rootElements.value,
    } as INode;
  });

  const rootElements = computed((): INode[] | null => {
    if (contenttree.value?.rootElementIds) {
      let elements: INode[] = [];
      contenttree.value.rootElementIds.forEach((x: any) => {
        const el = contenttree.value.entries[x];
        elements = pushSorted(elements, el);
      });

      return elements;
    }

    return null
  });

  
  const numberOfUnsaliencedTopLevelEntries = computed((): number | null => {
    if (contenttree.value == null) {
      return null;
    }
    const unsalienced_children = rootElements.value?.filter(
      (x) => !loaded(x.progression?.salience)
    );
    if(unsalienced_children) {
      return Object.values(unsalienced_children).length;
    }

    return null
  });

  const salienceCompleted = computed((): boolean | null => {
    if (!routed_stage) {
      return null;
    }
    return numberOfUnsaliencedTopLevelEntries.value == 0;
  });

  const numberOfUnratedTopLevelEntries = computed((): number | null => {
    if (contenttree.value == null) {
      return null;
    }
    const unrated_children = rootElements.value?.filter(
      (x) => !loaded(x.progression?.rating)
    );
    if(!unrated_children) {
      return null
    }
    return Object.values(unrated_children).length;
  });

  // ...mapGetters({
  //   get_contenttree: 'contentstore/get_contenttree'
  // })

  /** Filter nodes by type (positive list) */
  const filter_entries = (nodes, TYPES): INode[] | null => {
    if (!nodes) {
      return null;
    }
    const filtered = nodes.filter((item) => TYPES.includes(item.content.type));
    return filtered;
  };

  const isRead = (content): boolean => {
    return !!content?.progression?.read;
  };

  const isAlerted = (content): boolean => {
    return !!content?.progression?.alerted;
  };

  const isSalienced = (content): boolean => {
    return loaded(content.progression?.salience);
  };

  const isRated = (content): boolean => {
    return loaded(content.progression?.rating);
  };

  const markRead = (content): void => {
    const data = {
      contentID: content.content.id,
    };
    monitorLog(constants.MONITOR_SET_CONTENT_READ, data);

    // immediatly update vuex store
    store.dispatch('contentstore/update_read', {
      contenttreeID,
      contentID: content.content.id,
    });
  };

  const getDescendantsOf = (node): INode[] => {
    console.assert(node);
    const nodePathLength = node.path.length;
    const nodeID = node.content.id;
    return contenttree.value.entries.filter(
      (x) =>
        x.path &&
        x.path.length > nodePathLength &&
        x.path[nodePathLength - 1] == nodeID
    );
  };

  const getContentReference = (nodeID): string => {
    console.assert(nodeID);
    const content = contenttree.value.entries[nodeID];
    return content.content.title;
  };

  const markDiscussed = (node): void => {
    console.assert(node);
    const data = {
      contentID: node.content.id,
    };

    monitorLog(constants.MONITOR_SET_CONTENT_DISCUSSED, data);
    store.dispatch('contentstore/update_discussed', {
      contenttreeID,
      contentID: node.content.id,
    });
  };

  return {
    markDiscussed,
    getContentReference,
    getDescendantsOf,
    markRead,
    isRated,
    salienceCompleted,
    contenttree,
    isAlerted,
    contents,
    ready,
    isSalienced,
    filter_entries,
    isRead,
    rootNode,
    numberOfUnratedTopLevelEntries,
    numberOfUnsaliencedTopLevelEntries,
  };
}
