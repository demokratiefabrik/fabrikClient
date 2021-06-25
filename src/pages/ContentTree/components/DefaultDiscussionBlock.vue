<template ref="forumContainer">
  <div
    v-if="CONTENTTREE.contenttree"
    class="full-width"
  >
    <a :name="`CONTENTTREE${CONTENTTREE.contenttree.id}CONTENT${tree.id ? tree.id: ''}`" />
    <div align="right">
      <span :class="{'bg-blue-1': temporaryHighlightedBackground}">

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
          <q-badge
            v-if="tree.nof_descendants_unread"
            color="red"
            floating
          >{{tree.nof_descendants_unread}} Ungelesen</q-badge>
          <q-tooltip
            v-if="!show_discussion"
            anchor="top left"
            self="bottom left"
          >{{$t('contenttree.comment_section_tooltip')}}</q-tooltip>
          <q-tooltip
            v-if="show_discussion"
            anchor="top left"
            self="bottom left"
          >{{$t('contenttree.close_comment_section_tooltip')}}</q-tooltip>
          &nbsp;{{ discussionBlockLabel ? discussionBlockLabel : 'Fragen und Kommentare'}} {{tree.nof_descendants ? `(${tree.nof_descendants} Beiträge)` : ''}}
        </q-btn>
      </span>
    </div>

    <ComponentContentTree
      class="q-pa-xs full-width "
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

<script>
import ComponentContentTree from "src/pages/ContentTree/components/ContentTree";
import constants from "src/utils/constants";
// import { mapGetters } from "vuex";

export default {
  name: "DefaultDiscussionBlock",
  components: { ComponentContentTree },
  props: {
    customAM: {
      default: null,
    },
    amEnabled: {
      default: true,
    },
    amRole: {
      default: null,
    },
    amPosition: {
      default: "left",
    },
    amGroup: {
      default: null,
    },
    expanded: {
      default: false,
    },
    doNotExpandNodesAtInitialization: {},
    accordion: {
      default: false,
    },
    alwaysExpanded: {
      default: false,
    },
    allowAddingToRootLevel: {
      default: true,
    },
    node: {},
    filterTypes: {
      default: null,
    },
    discussionBlockLabel: {
      default: "Diskussionsforum",
    },
    discussionBlockIntro: {},
    initialFocusNode: {},
    classBackgroundColor: {
      default: () => "bg-secondary-light",
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
  inject: ["CONTENTTREE", "isRead", "isAlerted"],

  computed: {
    // COLLECT ALL Ids to include into this discussion tree...
    entrieIds() {
      // filter entries...
      // NOTE: this takes also subentries of filtered entries
      const ids = [];
      const paths = [];
      const filteredBranches = [];
      for (const [id, tuple] of Object.entries(
        this.CONTENTTREE.contenttree.entries
      )) {
        const withinPath =
          !this.node?.content.id ||
          (tuple.path &&
            tuple.path.includes(this.node.content.id) &&
            this.node?.content.id !== tuple.content.id);
        const withinTypeFilter =
          // this.node?.content.id == tuple.content.id ||
          !this.filterTypes || this.filterTypes.includes(tuple.content.type);

        if (!withinTypeFilter && withinPath) {
          filteredBranches.push(parseInt(id));
        } else if (withinTypeFilter && withinPath) {
          paths.push(tuple.path);
        }
      }
      // remove all descendants of filtered elements...
      paths.map((path) => {
        if (
          path &&
          !path.find((el) => filteredBranches.includes(parseInt(el)))
        ) {
          ids.push(parseInt(path[path.length - 1]));
        }
      });
      return ids;
    },

    // collect all tree entries to include into this dicussion tree..
    rawEntries() {
      if (this.filterTypes?.length || this.node?.content.id) {
        // fetch all content entries
        const entries = Object.keys(this.CONTENTTREE.contenttree.entries)
          .filter((key) => this.entrieIds.includes(parseInt(key)))
          .reduce((obj, key) => {
            obj[key] = this.CONTENTTREE.contenttree.entries[key];
            return obj;
          }, {});
        return entries;
      } else {
        // NO FILTER and root object: so take all entries...
        return this.CONTENTTREE.contenttree.entries;
      }
    },

    // Finalize Discussion TREE STRUCTURE
    tree() {
      // empty entries vessel
      const structure = this.getEmptyNode(this.node?.content.id);
      const entries = {};
      const rootLevel = this.node?.path ? this.node.path.length : 0;
      const rootId = this.node?.content ? this.node.content.id : null;

      for (let [id, original] of Object.entries(this.rawEntries)) {
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
          entry.id = `${entry.id}`
        }else{
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
            this.$pushSorted(parentNode.children, entry);
            parentNode.nof_children++;
            parentNode.nof_children_unread += !this.isRead(entry) ? 1 : 0;
            parentNode.nof_children_alerted += this.isAlerted(entry) ? 1 : 0;
          } else {
            console.log(
              original.content.parent_id,
              "CONTENT ENTRY MISSING: deleted?"
            );
          }
        }
        // It's the root element
        if (rootId === original.content.parent_id) {
          // structure.children.push(entry);
          this.$pushSorted(structure.children, entry);
          structure.nof_children++;
          structure.nof_children_unread += !this.isRead(entry) ? 1 : 0;
          structure.nof_children_alerted += this.isAlerted(entry) ? 1 : 0;
        }
      }

      return structure;
    },
  },

  methods: {
    toggleDiscussion(event, scroll = false) {
      if (this.show_discussion) {
        this.closeDiscussion();
      } else {
        this.openDiscussion();
      }
    },

    closeDiscussion(scroll = false) {
      // scroll To element above the discussion
      if (scroll) {
        this.$root.scrollToAnchor(
          `CONTENTTREE${this.CONTENTTREE.contenttree.id}CONTENT${
            this.node ? this.node.content.id : ""
          }`,
          50
        );

        // Toggle Discussion
        this.show_discussion = false;
      }

      // Monitor action
      const data = {};
      if (this.node) {
        data.content_id = this.node.content.id;
      }
      this.$root.monitorLog(constants.MONITOR_DISCUSSION_HIDE, data);

      // TEMPORARILY HIGHLIGHT BACKGROUND OF BUTTON
      // TODO: is this used?
      this.temporaryHighlightedBackground = true;
      const that = this;
      const turnOffTemporaryHighlightedBackground = function () {
        that.temporaryHighlightedBackground = false;
      };
      setTimeout(turnOffTemporaryHighlightedBackground, 3000);
    },

    openDiscussion() {
      // Toggle Discussion
      this.show_discussion = true;

      // Monitor action
      const data = {};
      if (this.node) {
        data.content_id = this.node.content.id;
      }
      this.$root.monitorLog(constants.MONITOR_DISCUSSION_SHOW, data);
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
};
</script>
