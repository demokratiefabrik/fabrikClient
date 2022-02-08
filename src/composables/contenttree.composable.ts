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
import useStageComposable from './stage.composable';
import { INodeTuple } from 'src/models/content';


const emitter = useEmitter();
const { loaded, pushSorted} = useLibraryComposable();

export default function useContenttreeComposable() {
  console.log('DEBUG: useContenttreeComposable::SETUP')
  const store = useStore();
  // const { gotoAssemblyHome } = useAssemblyComposable('');
  const { monitorLog } = useMonitorComposable();
  
  const { routed_stage } = useStageComposable();

    // TODO: extract runtime Store to own composable. (Saves Resources, I gues...)
  const contenttreeID = computed(() => {
    // Mixin is only usable for pages with assemblyIdentifier in the URL

    if (!routed_stage || !routed_stage.value?.stage?.contenttree_id) {
      console.log(' routed_stage not loaded');
      return null;
    }
    // console.log('contenttreeID', routed_stage.value.stage?.contenttree_id);
    return routed_stage.value.stage?.contenttree_id;
  });

  const contenttree = computed(() => {
    if (!contenttreeID.value) {
      return null;
    }

    // retrieve from localStorage
    console.log('TODO: does this get_contenttree getter work?')
    const get_contenttree = store.getters['contenttreestore/get_contenttree']
    const contenttree = get_contenttree ({
      contenttreeID: contenttreeID.value
    });
    console.log('load contenttree in contentree.computed', contenttreeID.value);
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
      content: null,
      children: rootElements.value,
    } as INodeTuple;
  });

  const rootElements = computed((): INodeTuple[] | null => {
    if (contenttree.value?.rootElementIds) {
      let elements: INodeTuple[] = [];
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


  /** Filter nodes by type (positive list) */
  const filter_entries = (nodes, TYPES): INodeTuple[] | null => {
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
    store.dispatch('contenttreestore/update_read', {
      contenttreeID,
      contentID: content.content.id,
    });
  };

  const getDescendantsOf = (node): INodeTuple[] => {
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
    store.dispatch('contenttreestore/update_discussed', {
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
