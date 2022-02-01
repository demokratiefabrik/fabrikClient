<template ref="forumContainer">
  <div v-if="contenttree" class="full-width">
    <a :name="`CONTENTTREE${contenttree.id}CONTENT${tree.id ? tree.id : ''}`" />
    <div align="right">
      <span :class="{ 'bg-blue-1': temporaryHighlightedBackground }">
        <q-btn
          v-if="tree && !alwaysExpanded"
          flat
          align="right"
          @click="toggleDiscussion"
          text-color="grey-7"
          :class="[show_discussion ? 'bg-grey-1' : '']"
          :icon="show_discussion ? 'mdi-comment' : 'mdi-comment-outline'"
          size="md"
        >
          <q-badge v-if="tree.nof_descendants_unread" color="red" floating
            >{{ tree.nof_descendants_unread }} Ungelesen</q-badge
          >
          <q-tooltip
            v-if="!show_discussion"
            anchor="top left"
            self="bottom left"
            >{{ $t('contenttree.comment_section_tooltip') }}</q-tooltip
          >
          <q-tooltip
            v-if="show_discussion"
            anchor="top left"
            self="bottom left"
            >{{ $t('contenttree.close_comment_section_tooltip') }}</q-tooltip
          >
          &nbsp;{{
            discussionBlockLabel
              ? discussionBlockLabel
              : 'Fragen und Kommentare'
          }}
          {{ tree.nof_descendants ? `(${tree.nof_descendants} Beiträge)` : '' }}
        </q-btn>
      </span>
    </div>

    <ComponentContentTree
      class="q-pa-xs full-width"
      :class="classBackgroundColor"
      :node="tree"
      :customAM="customAM"
      :amEnabled="amEnabled"
      :amGroup="amGroup"
      :amRole="amRole"
      :doNotExpandNodesAtInitialization="doNotExpandNodesAtInitialization"
      :accordion="accordion"
      :discussionBlockIntro="discussionBlockIntro"
      :initialFocusNode="initialFocusNode"
      :amPosition="amPosition"
      :allowAddingToRootLevel="allowAddingToRootLevel"
      v-if="show_discussion"
      v-on:am-index-change="$emit('am-index-change', $event)"
      :dense="true"
      :hideNoEntryText="true"
      :hideNofEntriesText="true"
    >
      <template v-slot:actions>
        <q-chip
          v-if="!alwaysExpanded"
          clickable
          @click="closeDiscussion(true)"
          align="right"
          icon="mdi-close"
        >
          {{ $t('contenttree.close_comment_section') }}
        </q-chip>
      </template>
    </ComponentContentTree>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import ComponentContentTree from 'src/pages/ContentTree/components/ContentTree.vue';
import { IArtificialModeration } from 'src/components/artificial_moderation/model';
import constants from 'src/utils/constants';
// import useContenttreeComposable from 'src/composables/contenttree.composable';
import useAppComposable from 'src/composables/app.composable';
import useMonitorComposable from 'src/composables/monitor.composable';
import useLibraryComposable from 'src/utils/library';
// import useAssemblyComposable from 'src/composables/assembly.composable';
import useContenttreeComposable from 'src/composables/contenttree.composable';
import { INodeTuple } from 'src/models/content';
// import useMonitorComposable from './monitor.composable';

type IPath = number[]; //array of cells

export default defineComponent({
  setup() {
    const { monitorLog } = useMonitorComposable();
    const { pushSorted } = useLibraryComposable();
    const { scrollToAnchor } = useAppComposable();
    const { contenttree, isRead, isAlerted } = useContenttreeComposable();

    return {
      scrollToAnchor,
      pushSorted,
      monitorLog,
      isAlerted,
      isRead,
      contenttree,
    };
  },
  name: 'DefaultDiscussionBlock',
  components: { ComponentContentTree },
  props: {
    customAM: {
      type: Object as PropType<IArtificialModeration>,
      default: null,
    },
    amEnabled: {
      type: Boolean,
      default: true,
    },
    amRole: {
      default: null,
    },
    amPosition: {
      type: String,
      default: 'left',
    },
    amGroup: {
      type: String,
      default: null,
    },
    expanded: {
      type: Boolean,
      default: false,
    },
    doNotExpandNodesAtInitialization: {},
    accordion: {
      type: Boolean,
      default: false,
    },
    alwaysExpanded: {
      type: Boolean,
      default: false,
    },
    allowAddingToRootLevel: {
      type: Boolean,
      default: true,
    },
    node: {
      type: Object as PropType<INodeTuple | null>,
      default: () => null, // TODO: used to be {}
    },
    filterTypes: {
      default: () => null,
      type: Array as PropType<string[]>,
    },
    discussionBlockLabel: {
      default: 'Diskussionsforum',
    },
    discussionBlockIntro: {},
    initialFocusNode: {},
    classBackgroundColor: {
      type: String,
      default: () => 'bg-secondary-light',
    },
  },
  data() {
    return {
      show_discussion: false,
      temporaryHighlightedBackground: false,
      // tree: null,
    };
  },

  // "openIndex",
  // inject: ['CONTENTTREE', 'isRead', 'isAlerted'],

  computed: {
    // COLLECT ALL Ids to include into this discussion tree...
    entrieIds(): number[] {
      // filter entries...
      // NOTE: this takes also subentries of filtered entries
      const ids = [] as number[];
      const paths = [] as IPath[];
      const filteredBranches = [] as number[];
      for (const [id, tuple] of Object.entries(
        this.contenttree.entries as Record<string, INodeTuple>
      )) {
        const withinPath =
          !this.node?.content?.id ||
          (tuple.path &&
            tuple.path.includes(this.node.content.id) &&
            this.node?.content.id !== tuple.content?.id);
        const type = tuple.content?.type;
        const withinTypeFilter =
          !this.filterTypes || (type && this.filterTypes.includes(type));
        if (!withinTypeFilter && withinPath) {
          filteredBranches.push(parseInt(id));
        } else if (withinTypeFilter && withinPath) {
          paths.push(tuple.path);
        }
      }
      // remove all descendants of filtered elements...
      paths.map((path) => {
        if (path && !path.find((el) => filteredBranches.includes(el))) {
          const lastEl = path[path.length - 1] as number;
          ids.push(lastEl);
        }
      });
      return ids;
    },

    // collect all tree entries to include into this dicussion tree..
    rawEntries() {
      if (this.filterTypes?.length || this.node?.content?.id) {
        // fetch all content entries
        const entries = Object.keys(this.contenttree.entries)
          .filter((key) => this.entrieIds.includes(parseInt(key)))
          .reduce((obj, key) => {
            obj[key] = this.contenttree.entries[key];
            return obj;
          }, {});
        return entries;
      } else {
        // NO FILTER and root object: so take all entries...
        return this.contenttree.entries;
      }
    },

    // Finalize Discussion TREE STRUCTURE
    tree() {
      // empty entries vessel
      const structure = this.getEmptyNode(this.node?.content?.id);
      const entries = {};
      const rootLevel = this.node?.path ? this.node.path.length : 0;
      const rootId = this.node?.content ? this.node.content.id : null;

      for (let [id, original] of Object.entries(
        this.rawEntries as INodeTuple
      )) {
        if (parseInt(id) === rootId) {
          continue;
        }

        if (!original.path || !original.path.length) {
          // SKIP: can have temprarily an empty path
          continue;
        }

        var entry = entries[id];
        if (entry) {
          // stringify the id. (contenttree requires a string id...)
          entry.id = `${entry.id}`;
        } else {
          entries[id] = this.getEmptyNode(id);
          entry = entries[id];
        }
        entry.progression = original.progression;
        entry.content = original.content;
        entry.level = original.path.length - rootLevel;
        entry.path = original.path;
        entry.creator = original.creator;
        // Notify descendants about state of every single node
        // console.log(original.path);
        original.path.forEach((descendant_id) => {
          // console.log(descendant_id, "DESC");
          if (parseInt(descendant_id) === parseInt(id)) {
            return;
          }
          if (!entries[descendant_id]) {
            entries[descendant_id] = this.getEmptyNode(descendant_id);
          }
          const descendant = entries[descendant_id];
          descendant.nof_descendants++;
          descendant.nof_descendants_unread += !this.isRead(entry) ? 1 : 0;
          descendant.nof_descendants_alerted += this.isAlerted(entry) ? 1 : 0;
        });
        // Notify root
        structure.nof_descendants++;
        structure.nof_descendants_unread += !this.isRead(entry) ? 1 : 0;
        structure.nof_descendants_alerted += this.isAlerted(entry) ? 1 : 0;

        // Append children to parent
        if (original.content.parent_id) {
          const parentNode = entries[original.content.parent_id];
          if (parentNode) {
            this.pushSorted(parentNode.children, entry);
            parentNode.nof_children++;
            parentNode.nof_children_unread += !this.isRead(entry) ? 1 : 0;
            parentNode.nof_children_alerted += this.isAlerted(entry) ? 1 : 0;
          }
        }

        // It's the root element
        if (rootId === original.content.parent_id) {
          // structure.children.push(entry);
          this.pushSorted(structure.children, entry);
          structure.nof_children++;
          structure.nof_children_unread += !this.isRead(entry) ? 1 : 0;
          structure.nof_children_alerted += this.isAlerted(entry) ? 1 : 0;
        }
      }

      console.log(JSON.stringify(structure));
      return structure;
    },
  },

  methods: {
    toggleDiscussion() {
      // event, scroll = false
      if (this.show_discussion) {
        this.closeDiscussion();
      } else {
        this.openDiscussion();
      }
    },
    closeDiscussion(scroll = false) {
      // scroll To element above the discussion
      if (scroll) {
        this.scrollToAnchor(
          `CONTENTTREE${this.contenttree.id}CONTENT${
            this.node ? this.node.content?.id : ''
          }`,
          50
        );

        // Toggle Discussion
        this.show_discussion = false;
      }

      // Monitor action
      const data = {} as any;
      if (this.node) {
        data.content_id = this.node.content?.id;
      }
      // this.monitorLog(constants.MONITOR_DISCUSSION_HIDE, data);

      // TEMPORARILY HIGHLIGHT BACKGROUND OF BUTTON
      // TODO: is this used?
      this.temporaryHighlightedBackground = true;
      const turnOffTemporaryHighlightedBackground = () => {
        this.temporaryHighlightedBackground = false;
      };
      setTimeout(turnOffTemporaryHighlightedBackground, 3000);
    },

    openDiscussion() {
      // Toggle Discussion
      this.show_discussion = true;

      // Monitor action
      const data = {} as any;
      if (this.node) {
        data.content_id = this.node.content?.id;
      }
      this.monitorLog(constants.MONITOR_DISCUSSION_SHOW, data);
    },

    getEmptyNode(id) {
      return {
        progression: null,
        content: null,
        creator: null,
        id: id,
        children: [],
        level: null,
        path: null,
        nof_children: 0,
        nof_children_unread: 0,
        nof_children_alerted: 0,
        nof_descendants: 0,
        nof_descendants_unread: 0,
        nof_descendants_alerted: 0,
      };
    },
  },

  mounted() {
    this.show_discussion = this.expanded || this.alwaysExpanded;
  },
});
</script>
