<style>
.q-tree .q-focus-helper {
  background-color: transparent !important;
}

/* DENSE */

body.screen--xs .q-tree__node-header {
  padding: 0px;
}
/* body.screen--xs
  .q-tree__node--parent
  > .q-tree__node-collapsible
  > .q-tree__node-body {
} */
body.screen--xs .q-tree__children {
  padding-left: 19px;
}
body.screen--xs .q-card__section--vert {
  padding: 7px;
}
body.screen--xs
  .q-tree__node--parent
  > .q-tree__node-collapsible
  > .q-tree__node-body:after {
  left: 6px;
}

body.screen--xs .q-gutter-x-sm > *,
.q-gutter-sm > * {
  margin-left: 0px;
}
</style>

<template>
  <div class="full-width q-mb-lg">
    <!-- <a name="TOP_OF_CONTENTTREE"></a> -->
    <div
      v-if="node.children && node.children.length"
      class="full-width"
      align="right"
    >
      <q-chip
        :clickable="qtree.expanded && qtree.expanded.length > 0"
        @click="qtree.expand_none"
        :disabled="qtree.expanded !== null && qtree.expanded.length == 0"
        align="right"
        icon="mdi-unfold-less-horizontal"
      >
        <!-- icon="mdi-collapse-all" -->
        {{ $t('contenttree.collapse_all') }}
      </q-chip>

      <q-chip
        clickable
        @click="qtree.expanded_filter = !qtree.expanded_filter"
        align="right"
        icon="mdi-feature-search"
      >
        {{ $t('contenttree.search_button') }}
      </q-chip>
      <div class="q-gutter-md">
        <div v-show="qtree.expanded_filter">
          <q-input
            ref="treeFilterInput"
            filled
            v-model="qtree.treeFilter.value.text"
            :label="$t('contenttree.search_field_label')"
          >
          </q-input>

          <div class="q-gutter-sm">
            <q-checkbox v-model="qtree.treeFilter.value.own" label="Eigene" />
            <q-checkbox v-model="qtree.treeFilter.value.new" label="Neu" />
            <q-checkbox
              v-if="IsManager"
              v-model="qtree.treeFilter.value.unreviewed"
              label="Ungeprüft"
            />
          </div>
        </div>
      </div>
    </div>
    <br />
    <ArtificialModerationComponent
      v-if="amEnabled"
      :AM="
        customAM
          ? customAM
          : [AMs.indexTopBasic, AMs.indexTopBasicDefaultExtension]
      "
      :alignment="amPosition"
      :role="amRole"
      :amGroup="amGroup"
      v-on:am-change="$emit('am-index-change', $event)"
      :ctx="this"
    />

    <div class="q-pa-sm" v-if="discussionBlockIntro">
      <br />{{ discussionBlockIntro }}
    </div>

    <!-- AFTER LOADING -->
    <div class="'q-pa-none q-ma-none q-gutter-sm" v-if="node.children">
      <span v-if="node.nof_descendants && !hideNofEntriesText">
        {{ node.nof_descendants }} Beiträge
      </span>

      <!-- <q-chip
        removable
        v-if="treeFilter.focus"
        color="red"
        clickable
        text-color="white"
        @remove="resetFilterFocus"
        @click="resetFilterFocus"
        icon="mdi-image-filter-center-focus-strong"
        :label="`Fokus: ${treeFilter.focus.content.type === 'UPDATEPROPOSAL' ? 'Aktueller Verbesserungsvorschlag' :  treeFilter.focus.content.title}`"
        title="Es werden nur die Einträge zum fokussierten Beitrags angezeigt."
      /> -->
      <div
        class="q-mb-md q-ml-md text-notification"
        v-if="limitForAddingCommentsReached && dailyContributionLimits?.current"
      >
        Sie haben heute schon {{ dailyContributionLimits.current }} Kommentare
        geschrieben. Damit haben Sie die Tageslimite erreicht. Ab morgen früh
        können Sie wieder neue Kommentare schreiben.
      </div>
      <!-- label-key="id" -->
      <!-- is V-model expanded working (new quasar, before ist was expanded.sync) -->
      <q-tree
        ref="qtree"
        :nodes="node.children"
        :expandable="false"
        nodeKey="id"
        :duration="qtree.animationDuration"
        v-model="qtree.expanded"
        @update:expanded="qtree.updateExpanded"
        filter="custom"
        color="teal-10"
        style="clear: both"
        :filter-method="qtree.treeFilterMethod"
        :no-results-label="
          node.children.length
            ? $t('contenttree.no_filter_results')
            : hideNoEntryText
            ? ' '
            : $t('contenttree.no_entries')
        "
        :no-nodes-label="hideNoEntryText ? ' ' : $t('contenttree.no_entries')"
      >
        <template v-slot:default-header="prop">
          <a :name="`NODE${prop.node.id}`" />
          <ContentTreeQTreeHead
            :node="prop.node"
            :is_currently_expanded="isExpandedNode"
            :is_read="isReadNode"
            v-on:toggle-node="qtree.toggle_node($event)"
            v-on:popup-edit="popup_content_form($event.action, $event.content)"
            :highlightedNode="prop.node.id == qtree.highlightedNodeID"
          />
        </template>

        <template v-slot:default-body="prop">
          <ContentTreeQTreeBody :node="prop.node" />
        </template>
      </q-tree>

      <q-separator class="q-mr-md" color="white" size="5px" />

      <!-- EDIT/CREATE FORM -->
      <div>
        <component
          :is="ContentEditorComponentLoader"
          ref="content_editor"
          @expand-node="qtree.focus_on_branch"
          :parent_id="node.id"
        />
      </div>

      <div class="full-width" align="right">
        <!-- class="bg-accent" -->
        <q-chip
          v-if="allowAddingToRootLevel && !limitForAddingCommentsReached"
          icon="mdi-tooltip-plus-outline"
          clickable
          @click="popup_create"
        >
          {{ $t('contenttree.add_comment_or_question') }}
        </q-chip>

        <q-chip
          :clickable="qtree.expanded && qtree.expanded.length > 0"
          @click="expand_none_and_scroll"
          :disabled="qtree.expanded !== null && qtree.expanded.length == 0"
          align="right"
          icon="mdi-collapse-all"
        >
          {{ $t('contenttree.collapse_all') }}
        </q-chip>

        <!-- Disclaimer -->
        <AlgorithmDisclaimer
          :text="disclaimerText"
          v-if="node.nof_descendants > 1"
        />

        <slot name="actions"></slot>
      </div>
    </div>

    <!-- DURING LOADING -->
    <div v-else>
      <q-spinner-rings color="primary" size="2em" />
      <q-tooltip :offset="[0, 8]"
        >Bitte warten. Die Daten werden geladen.</q-tooltip
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import AlgorithmDisclaimer from 'src/components/AlgorithmDisclaimer.vue';
import { mapGetters } from 'vuex';
import ContentTreeQTreeHead from './ContentTreeQTreeHead.vue';
import ArtificialModerationComponent from 'src/components/artificial_moderation/ArtificialModeration.vue';
import ContentTreeQTreeBody from './ContentTreeQTreeBody.vue';
import AMs from '../ArtificialModeration.js';
import useAssemblyComposable from 'src/composables/assembly.composable';
import useQtreeComposable from 'src/composables/qtree.composable';
import useLibraryComposable from 'src/utils/library';
import useContenttreeComposable from 'src/composables/contenttree.composable';
import useAppComposable from 'src/composables/app.composable';

export default defineComponent({
  setup(props) {
    const { getDailyContributionLimits } = useAssemblyComposable('');
    const qtree = useQtreeComposable(props);
    const { sample } = useLibraryComposable();
    const { contenttree, isRead } = useContenttreeComposable();
    const { limitForAddingCommentsReached } = useAssemblyComposable('');
    const { scrollToAnchor } = useAppComposable();
    const content_editor = ref();

    return {
      content_editor,
      getDailyContributionLimits,
      qtree,
      sample,
      isRead,
      scrollToAnchor,
      contenttree,
      limitForAddingCommentsReached,
    };
  },
  name: 'ContentTree',
  // mixins: [QTreeMixin],
  props: [
    'customAM',
    'hideNoEntryText',
    'hideNofEntriesText',
    'allowAddingToRootLevel',
    'discussionBlockIntro',
    'initialFocusNode',
    'amEnabled',
    'amGroup',
    'amRole',
    'doNotExpandNodesAtInitialization',
    'amPosition',
    'label',
    'accordion', // bool. Note: Default qtree accoridion does not work here
    'dense',
    'node',
  ],

  components: {
    ArtificialModerationComponent,
    AlgorithmDisclaimer,
    ContentTreeQTreeHead,
    ContentTreeQTreeBody,
  },

  // provide() {
  //   return {
  //     popup_content_form: this.popup_content_form,
  //     toggle_node: this.qtree.toggle_node,
  //     is_currently_expanded_id: this.qtree.is_currently_expanded_id,
  //     is_currently_expanded: this.qtree.is_currently_expanded,
  //   };
  // },
  data() {
    return {
      AMs,
      ContentEditorComponentLoader: () => import('./ContentEditor.vue'),
    };
  },
  computed: {
    isReadNode(): boolean {
      return this.qtree.is_currently_expanded(this.node);
    },

    isExpandedNode(): boolean {
      return this.isRead(this.node);
    },

    disclaimerText: function () {
      var text = this.$t('disclaimer.contenttree.basic');
      if (this.node.nof_descendants.length > 30) {
        text += ' ' + this.$t('disclaimer.contenttree.extensionExtraLarge');
      }
      return text;
    },
    dailyContributionLimits() {
      const limits = this.getDailyContributionLimits();
      return limits?.number_of_comments;
    },
    undiscussedTopLevelEntryDataOrderedBySalience() {
      const saliences = this.node.children.filter(
        (child) =>
          child.progression?.salience !== null && !child.progression?.discussed
      );
      // console.log(saliences, "undiscussed entries...");
      return saliences.sort(function (first, second) {
        const firstS =
          first.progression?.salience !== null
            ? first.progression.salience
            : 50;
        const secondS =
          second.progression?.salience !== null
            ? second.progression.salience
            : 50;
        return secondS - firstS;
      });
    },

    undiscussedTopLevelEntrySuperiorSalience() {
      const data = this.undiscussedTopLevelEntryDataOrderedBySalience;
      if (data && data.length && data[0].progression.salience > 70) {
        return data[0];
      }

      return null;
    },
    undiscussedTopLevelEntryLowestSalience() {
      const data = this.undiscussedTopLevelEntryDataOrderedBySalience;
      if (
        data &&
        data.length &&
        data[data.length - 1].progression.salience < 30
      ) {
        return data[data.length - 1];
      }
      return null;
    },

    undiscussedTopLevelEntryDataOrderedBySalienceDiscrepancy() {
      const discrepancies = this.node.children.filter((child) => {
        return (
          child.progression?.salience !== null &&
          child.content.S.SC &&
          child.content.S.SC > 10 &&
          !child.progression?.discussed
        );
      });
      // console.log(discrepancies);
      return discrepancies.sort(function (first, second) {
        const firstD = first.progression.salience - first.content.S.SC;
        const secondD = second.progression.salience - second.content.S.SC;
        return secondD - firstD;
      });
    },

    // User findet das Thema viel weniger wichtiger als Mehrheit
    undiscussedTopLevelEntrySuperiorSalienceDiscrepanceNegativ() {
      const data =
        this.undiscussedTopLevelEntryDataOrderedBySalienceDiscrepancy;
      if (
        data &&
        data.length &&
        data[0].progression.salience < 40 &&
        data[0].progression.salience - data[0].content.S.SC < -30 &&
        !data[0].progression?.discussed
      ) {
        return data[0];
      }
      return null;
    },

    // User findet das Thema viel  wichtiger als Mehrheit
    undiscussedTopLevelEntrySuperiorSalienceDiscrepancePositive() {
      const data =
        this.undiscussedTopLevelEntryDataOrderedBySalienceDiscrepancy;
      if (
        data &&
        data.length &&
        data[0].progression.salience > 60 &&
        data[0].progression.salience - data[0].content.S.SC > 30 &&
        !data[0].progression?.discussed
      ) {
        return data[0];
      }
      return null;
    },

    undiscussedTopLevelEntryNoDescendants() {
      const nodescendants = this.node.children.filter(
        (child) => child.nof_descendants === 0
      );

      if (nodescendants) {
        return this.sample(nodescendants);
      }

      return null;
    },

    unexpandedTopLevelEntryWithUnreadMessage() {
      const unreads = this.node.children.filter(
        (child) =>
          child.nof_descendants_unread > 2 &&
          !this.qtree.is_currently_expanded(child)
      );
      unreads.sort(function (first) {
        const firstS = first.nof_descendants_unread;
        const secondS = first.nof_descendants_unread;
        return secondS - firstS;
      });
      // console.log("SORTED", unreads);
      return unreads.length ? unreads[0] : null;
    },

    ...mapGetters('assemblystore', [
      'IsDelegate',
      'stageMilestoneWeigths',
      'IsExpert',
      'IsContributor',
      'IsObserver',
      'IsManager',
      // "next_scheduled_stage",
    ]),
  },

  methods: {
    popup_content_form: function (action, model) {
      console.log('popup action ' + action);
      if (this.content_editor?.value) {
        this.content_editor.value.initialize(action, model);
      }
      console.error('content form not yet loaded...');
    },

    popup_create() {
      this.popup_content_form('create', { parent_id: this.node.id });
    },

    expand_none_and_scroll() {
      this.scrollToAnchor(
        `CONTENTTREE${this.contenttree.id}CONTENT${
          this.node && this.node.id ? this.node.id : ''
        }`,
        50
      );

      this.qtree.expand_none();
    },

    checkMilestone(identifier, weight) {
      return (
        identifier in this.stageMilestoneWeigths &&
        this.stageMilestoneWeigths[identifier] >= weight
      );
    },
  },

  created() {
    if (this.initialFocusNode) {
      this.qtree.treeFilter.value.focus = this.initialFocusNode;
    }
  },
});
</script>
