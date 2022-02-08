/** DEMOKRATIFABRIK: components for using qtree-discussions
This file contains all method that are specific to q-tree. 
i.e.  filtering and management of expanded content .
*/

import { scroll } from 'quasar';
const { getVerticalScrollPosition, setVerticalScrollPosition } = scroll;

import { ref, computed } from 'vue';
import { useStore } from 'vuex';
// import { useRoute} from 'vue-router';
// import useEmitter from 'src/utils/emitter';
import useAssemblyComposable from './assembly.composable';
// import useLibraryComposable from 'src/utils/library';
import library  from 'src/utils/library';
import useContenttreeComposable from './contenttree.composable';
import usePKCEComposable from 'src/plugins/VueOAuth2PKCE/pkce.composable';
import constants from 'src/utils/constants';
import useAppComposable from './app.composable';
import { INodeTuple } from 'src/models/content';

// import useAuthComposable from './auth.composable';
// import useRouterComposable from './router.composable';
// import usePKCEComposable from 'src/plugins/VueOAuth2PKCE/pkce.composable';

// // const oauthEmitter = useOAuthEmitter();
// // const { userid } = usePKCEComposable();
// const assemblyIdentifier = ref<string | null>(null);
// // const stageID = ref<number | null>(null);

export interface ITreeFilter {
  text?: string;
  focus?: INodeTuple | null;
  own?: boolean;
  new?: boolean;
  unreviewed?: boolean; // used for manager review
}

export default function useQtreeComposable(props) {
  console.log('DEBUG: useQtreeComposable::SETUP');
  const store = useStore();
  const { scrollToAnchor, getOffsetTop, loaded } = library;
  const { contenttree, markRead, isRead } = useContenttreeComposable();
  const { assemblyIdentifier } = useAssemblyComposable('qtree.comp');
  const { userid } = usePKCEComposable();
  const { headerOffset } = useAppComposable();

  // const currentRoute = useRoute();
  // const { gotoAssemblyHome, stageID, assemblyIdentifier } = useAssemblyComposable('');
  // const { loaded } = useLibraryComposable();

  // ...mapActions("contenttreestore", ["'update_expanded_branches']),

  // LOCAL REFS (must not be global, right? ) only one instance at time...
  const tempBufferForJustReadContent = ref<any[]>([]);
  const animationDuration = ref<number>(150);
  const expanded = ref<any>(null);
  // TODO: performance optimization by disable animation...
  const treeFilter = ref<ITreeFilter>({});
  const highlightedNodeID = ref<number | null>(null);
  const expanded_filter = ref<any>(null);
  const public_profile = computed(() => store.getters['profilestore/profile'])
  const IsManager = computed(() => store.getters['assemblystore/IsManager'])
  const getExpandedBranches = store.getters['contenttreestore/getExpandedBranches']

  /*
    Which <label> should be displayed on top of the ContentTree?
    SHould the Tree be displayed in <dense> layout?
    SHould the whole ContentTree be displayed or only a specific <childrenNodes>?

    <filterTypes>: You may additionaly limit the nodetypes to insert:...
    If nothing is indicated: every type is allowed, that is allowed for the given parent. */

  const total_nof_contents = () => {
    return props.node.nof_descendants;
  };

  const is_currently_expanded = (node) => {
    if (loaded(expanded)) {
      return expanded.value.ncludes(`${node.id}`);
    }
  };

  const is_currently_expanded_id = (node_id) => {
    return expanded.value.includes(`${node_id}`);
  };

  const toggle_node = (node) => {
    if (expanded.value.includes(node.id)) {
      collapse_node(node);
    } else {
      // last_expanded_node = node
      tempBufferForJustReadContent.value.push(node.content.id);
      expand_node(node);
    }
  };

  const collapse_node = (node) => {
    expanded.value = expanded.value.filter((x) => x != `${node.id}`);
    highlightNode(node);
    updateExpanded();
  };

  /* expand node and a few of its children */
  const expand_node = (node) => {
    const isTopBranch =
      node.content.parent_id === null || node.content.parent_id == node.id;
    if (props.accordion.value && isTopBranch) {
      const newlyExpanded = expand_node_accordion(node);
      markAsReadByIDs(newlyExpanded);
    } else {
      // console.log("EXPAND THIS", node, node?.nof_descendants);
      const newlyExpanded = calculate_default_expanded_branches(node, 3);
      expanded.value = expanded.value.concat(newlyExpanded);
      updateExpanded();
      markAsReadByIDs(newlyExpanded);
    }
    // mark newly Expanded as Read...
    highlightNode(node.content);
  };

  /* expand root-branch  and a few of its children, while closing all other branches */
  const expand_node_accordion = (node) => {
    // let originOffsetTop = null
    const originalScrollPosition: number = getVerticalScrollPosition(window);
    // let originalScrollPosition: number | null = null

    const rootIds = node.children.map((x) => x.content.id);
    const anchor = `NODE${node.content.id}`;
    const dom = document.getElementsByName(anchor);
    const ele = dom?.item(0);
    const originOffsetTop = getOffsetTop(ele);

    // dont use animations for this stepp:
    const originalAnimationDuration: null | number = animationDuration.value;
    animationDuration.value = 0;

    // close all branches
    expanded.value = expanded.value.filter(
      (x) => !rootIds.includes(parseInt(x))
    );

    // console.log("EXPAND THIS", node);
    const newlyExpanded = calculate_default_expanded_branches(node, 3);
    expanded.value = expanded.value.concat(newlyExpanded);
    updateExpanded();

    // Scroll to newly opened element... (WHEN Root-Branch changes...)
    setTimeout(() => {
      const offsetDiff = getOffsetTop(ele) - originOffsetTop;
      if (offsetDiff < 0) {
        setVerticalScrollPosition(
          window,
          originalScrollPosition + offsetDiff,
          0
        );

        // reset animations :
        animationDuration.value = originalAnimationDuration;
      }
    }, 60 * 5);

    return newlyExpanded;
  };

  const highlightNode = (node) => {
    highlightedNodeID.value = node ? node.id : null;
  };

  const markAsReadByIDs = (ids) => {
    ids.forEach((nodeId) => {
      if (!nodeId) {
        return;
      }
      const entry = contenttree.value.entries[parseInt(nodeId)];
      if (entry && !isRead(entry)) {
        console.log('not read...');
        markRead(entry);
      }
    });
  };

  const expand_none = () => {
    console.log('expand_none');
    expanded.value = [];
    highlightNode(null);
    updateExpanded();
  };

  const focus_on_branch = (node) => {
    scrollToAnchor(`NODE${node.content.id}`, headerOffset.value, 0);
    expanded_filter.value = false;
    expand_node(node);
    console.assert(node.content.id);
  };

  // SELECT X elements that are expanded initially..
  const calculate_default_expanded_branches = (
    node,
    QTREE_NUMBER_OF_INITIALLY_EXPANDED_NODES: number | null = null
  ) => {
    if (!QTREE_NUMBER_OF_INITIALLY_EXPANDED_NODES) {
      QTREE_NUMBER_OF_INITIALLY_EXPANDED_NODES =
        constants.QTREE_NUMBER_OF_INITIALLY_EXPANDED_NODES;
    }
    if (node.content && !node.id) {
      node.id = node.content.id;
    }
    const selected = node ? [`${node.id}`] : [];
    if (!node?.nof_descendants) {
      return selected;
    }

    let sample = node.children;
    function weighted_random(items, weights) {
      let i: number | null;
      for (i = 0; i < weights.length; i++) {
        weights[i] += weights[i - 1] || 0;
      }
      const random: number = Math.random() * weights[weights.length - 1];
      for (i = 0; i < weights.length; i++) {
        if (weights[i] > random) {
          break;
        }
      }
      return items[i];
    }
    while (
      selected.length <= QTREE_NUMBER_OF_INITIALLY_EXPANDED_NODES &&
      sample.length > 0
    ) {
      // add newSelected to selected / remove newSelected from sample / add their children to sample
      const weights = sample.map((child) => child.nof_descendants + 1);
      const newSelected = weighted_random(sample, weights);
      selected.push(`${newSelected.id}`);
      sample = sample.filter((child) => child.id !== newSelected.id);
      sample = sample.concat(newSelected.children);
    }
    return selected;
  };

  /* Method store list of expanded array in localstorage */
  const updateExpanded = () => {
    // remove duplciateds
    expanded.value = [...new Set(expanded)];

    // PERFORMANCE:
    // Either:
    // // inform children...
    // expanded.forEach(
    // )

    store.dispatch('contenttreestore/update_expanded_branches', {
      contenttreeID: contenttree.value.id,
      rootNodeID: props.node.id,
      expanded: expanded,
    });

    store.dispatch('contenttreestore/syncContenttree', {
      assemblyIdentifier: assemblyIdentifier,
      contenttreeID: contenttree.value.id,
      oauthUserID: userid.value,
    });
  };

  // FILTER TREE
  const treeFilterMethod = (node: INodeTuple) => {
    if (treeFilter.value.focus) {
      // False, if at least one path element is not in the current node' path.
      // console.log(treeFilter.path, node.path)
      if (treeFilter.value?.focus?.path.find((id) => !node.path.includes(id))) {
        return false;
      }
    }

    if (!expanded_filter.value) {
      return true;
    }
    if (treeFilter.value.own) {
      if (node.creator.id !== public_profile.value.id) {
        return false;
      }
    }
    if (treeFilter.value.new) {
      const contentID = node?.content?.id;
      if (
        contentID &&
        node.progression?.read &&
        !tempBufferForJustReadContent.value.includes(contentID)
      ) {
        // if (node.progression?.read && node !== last_expanded_node) {
        return false;
      }
    }
    if (treeFilter.value.unreviewed) {
      if (node.content?.reviewed || !node?.content?.private_property) {
        return false;
      }
    }
    if (treeFilter.value?.text?.length) {
      let searchable = '';
      searchable += `${node?.content?.title} ${node?.content?.text} #${node.content?.id}  @${node?.creator.FN} `;
      if (
        searchable.toLowerCase().indexOf(treeFilter.value.text.toLowerCase()) ==
        -1
      ) {
        return false;
      }
    }

    return true;
  };

  const resetFilter = () => {
    // console.log('reset filter')
    treeFilter.value = {
      text: '',
      focus: null,
      own: false,
      new: false,
      unreviewed: false, // used for manager review
    };
  };

  const resetFilterFocus = () => {
    // console.log('reset filter focus')
    treeFilter.value = {
      focus: null,
    };
  };

  // CREATED / MOUNTED
  // ---------------------
  resetFilter();

  expanded_filter.value = IsManager;
  // console.log(contenttree, "Lllllllll")
  // set expanded branches
  expanded.value = getExpandedBranches({
    contenttreeID: contenttree.value.id,
    rootNodeID: props.node.id,
  });

  if (expanded.value === null) {
    console.assert(contenttree);
    // Nothing expaneded here: so expand 15 random branchens
    if (props.doNotExpandNodesAtInitialization) {
      expanded.value = [];
    } else {
      expanded.value = calculate_default_expanded_branches(props.node);
    }

    store.dispatch('contenttreestore/update_expanded_branches', {
      contenttreeID: contenttree.value.id,
      rootNodeID: props.node.id,
      expanded: expanded,
    });

    // mark newly Expanded as Read...
    markAsReadByIDs(expanded);
  }

  return {
    expanded,
    treeFilter,
    highlightNode,
    highlightedNodeID,
    expanded_filter,
    animationDuration,
    updateExpanded,
    total_nof_contents,
    is_currently_expanded,
    is_currently_expanded_id,
    toggle_node,
    treeFilterMethod,
    resetFilter,
    resetFilterFocus,
    expand_none,
    focus_on_branch,
  };
}
