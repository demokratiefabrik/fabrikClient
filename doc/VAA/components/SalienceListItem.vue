<style lang="sass" scoped>
// USED TO MARK UNAPPROVED CONTENT
.under-peerreview
  opacity: 0.2
  color: red
  position: absolute
  left: -30px
  top: -10px
  transform: rotate(-20deg)
  font-size: 1.2em
  line-height: 0.8em
  font-weight: bold

.approved
  opacity: 0.8
  color: white

  border: 1px solid green
  background-color: green
  position: absolute
  border-radius: 45px
  padding: 5px
  left: -30px
  top: 10px
  transform: rotate(0deg)
  font-size: 0.9em
  old_line-height: 2.8em
</style>
<template>
  <q-expansion-item
    v-if="node"
    :group="salienceCompleted ? 'accordeon' : `group${node}`"
    popup
    v-model="expanded"
    :ref="`expandable`"
    :header-class="[
      'text-primary',
      'text-h4',
      expanded ? 'bg-grey-2' : !isSalienced ? 'bg-orange' : '',
    ]"
  >
    <template v-slot:header="prop">
      <q-item class="full-width">
        <q-item-section
          avatar
          class="q-pt-md"
          style="justify-content: flex-start"
          vertical-align="top"
        >
          <!-- <q-badge
            color="green"
            style="position:absolute; left:-10px; top:0px; ;"
            class="absolut"
            v-if="node.content.common_property && node.content.peerreviewed"
          >Genehmigt <q-tooltip>Diese Frage ist von Teilnehmenden bereits genehmigt worden. </q-tooltip>
          </q-badge> -->
          <q-badge
            color="grey"
            style="position: absolute; left: -10px; top: -5px"
            class="absolut"
            v-if="
              node.content.common_property &&
              node.content.pending_peerreview_for_insert
            "
            >Begutachtung ausstehend
            <q-tooltip
              >Diese Frage wird gerade von anderen Teilnehmenden begutachtet.
            </q-tooltip>
          </q-badge>
          <q-badge
            color="grey"
            style="position: absolute; left: -10px; top: -5px"
            class="absolut"
            v-if="
              node.content.common_property &&
              node.content.pending_peerreview_for_update
            "
            >Verbesserung vorgeschlagen<q-tooltip
              >Für diese Frage wurde eine Verbesserung<br />vorgeschlagen, die
              gerade begutachtet wird.
            </q-tooltip>
          </q-badge>

          <q-icon
            :name="itemIcon"
            :class="
              node.content.pending_peerreview_for_insert ? 'text-grey-5' : ''
            "
            :style="node.content.common_property ? '' : 'text-grey-9'"
          />
        </q-item-section>

        <q-item-section class="q-pt-sm">
          <q-item-label>
            <!-- <span v-if="titlePrefix">
              {{titlePrefix}}:
            </span> -->
            {{ node.content.title }}
          </q-item-label>

          <q-item-label caption v-if="isSalienced">
            {{ titlePrefix }} | Ihre Bewertung: {{ getSlideLabel }}

            <span v-if="node.content.common_property">
              |
              <span
                v-if="
                  !node.content.peerreviewed &&
                  !node.content.pending_peerreview_for_insert
                "
                >Parteivorschlag</span
              >
              <span
                v-if="
                  node.content.peerreviewed ||
                  node.content.pending_peerreview_for_insert
                "
                >Vorschlag eines Teilnehmenden</span
              >
            </span>
          </q-item-label>
          <q-item-label caption v-else>
            {{ titlePrefix }} | unbewertet |

            <span
              v-if="
                node.content.common_property &&
                !node.content.peerreviewed &&
                !node.content.pending_peerreview_for_insert
              "
              >Parteivorschlag</span
            >
            <span
              v-if="
                node.content.common_property &&
                (node.content.peerreviewed ||
                  node.content.pending_peerreview_for_insert)
              "
              >Vorschlag eines Teilnehmenden</span
            >
          </q-item-label>
        </q-item-section>
        <a :name="`ITEM${node.content.id}`" />
      </q-item>
    </template>

    <SalienceDetail
      v-if="expanded && node"
      @item-saliencing="$emit('item-saliencing', node)"
      :contenttreeID="node.content.contenttree_id"
      v-on:expandable-hide="closeExpandedItem"
      :node="node"
      :titlePrefix="titlePrefix"
      :discussionIntro="discussionIntro"
      :salienceInstruction="salienceInstruction"
      :hideText="hideText"
      :topic="topic"
    />
  </q-expansion-item>
</template>

<script>
import SalienceDetail from './SalienceDetail';
// import ContentSalienceSlider from "src/pages/ContentTree/components/ContentSalienceSlider";
// import ContentBackground from "src/pages/ContentTree/components/ContentBackground";
// import ProposeVAAQuestionEdit from "../QUESTIONS/components/ProposeVAAQuestionEdit";
// import DefaultDiscussionBlock from "src/pages/ContentTree/components/DefaultDiscussionBlock";
// import PeerReviewHistory from "./PeerReviewHistory";
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SalienceList',
  data() {
    return {
      tab: 'default',
      expanded: null,
      indexToShowEditForm: false,
    };
  },
  props: [
    'node',
    'hideText',
    'salienceCompleted',
    'salienceInstruction',
    'discussionIntro',
    'showBackgroundPage',
    'captionPrefix',
    'itemIcon',
    'titlePrefix',
  ],
  inject: ['CONTENTTREE', 'markDiscussed', 'markRead', 'getDescendantsOf'],

  components: {
    SalienceDetail,
    // DefaultDiscussionBlock,
    // ContentSalienceSlider,
    // ContentBackground,
    // ProposeVAAQuestionEdit,
    // PeerReviewHistory,
  },
  computed: {
    getSlideLabel() {
      if (this.$loaded(this.node.progression?.salience)) {
        return `${this.node.progression?.salience} von 100`; // PERCENT
      } else {
        return '';
      }
    },
    isSalienced: function () {
      return this.$loaded(this.node.progression?.salience);
    },

    discussionDescendants() {
      return this.getDescendantsOf(this.node);
    },

    nofDiscussionDescendants() {
      if (!this.discussionDescendants) {
        return;
      }
      return Object.keys(this.discussionDescendants).length;
    },

    discussionDescendantsUnread() {
      return Object.values(this.discussionDescendants).find((x) =>
        this.isRead(x)
      );
    },

    topic() {
      if (this.node.content.parent_id) {
        return this.CONTENTTREE.contenttree.entries[
          this.node.content.parent_id
        ];
      }
    },
  },

  methods: {
    closeExpandedItem() {
      // hideExpandable $refs.expandable.hide
      console.assert(this.node);
      const expandable = this.$refs.expandable;
      if (expandable) {
        expandable.hide();
        this.$root.scrollToAnchorIfNecessary(`ITEM${this.node.content.id}`);
      }
    },

    switchTab(tab) {
      console.log('DESTINATION TAB', tab);

      this.tab = tab;
    },
  },

  watch: {
    expanded(val) {
      if (val) {
        this.$emit('item-read', this.node);
        this.markRead(this.node);
      }
    },
  },
  created() {
    this.expanded = !this.isSalienced;
  },
});
</script>
