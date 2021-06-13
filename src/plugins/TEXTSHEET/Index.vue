<template>
  <q-page
    class="doc_content"
    v-if="ready"
  >
    <!-- AM-CONCLUSION -->
    <ArtificialModeration
      :AM="AMs.index_top"
      alignment="center"
      :ctx="this"
    />
    <!-- </div> -->
    <div class="text-vessel">

      <h2>{{routed_stage.stage.title}}</h2>
      <!-- <p
        class="text-body1"
        v-if="routed_stage.stage.info!=='@HIDDEN@'"
      >{{routed_stage.stage.info}}</p> -->

      <div
        class="row justify-between"
        v-for="(nodeL1, keyL1)  in mainTopics"
        :key="`L1${nodeL1.content.id}`"
      >

        <!-- <div class="seperator">
          <q-icon
            name="mdi-star-four-points-outline"
            v-if="routed_stage.stage.info!=='@HIDDEN@'"
          />
        </div> -->
        <a :name="`ANCHOR${nodeL1.content.id}`" />

        <TextsheetCard
          :level="1"
          :filterTypes="DISCUSSIONTYPES"
          :node="nodeL1"
          :discussionAM="discussionAM"
          :heading_number="(keyL1+1)"
        />

        <div
          class="row justify-between"
          v-for="(nodeL2, keyL2) in textChildrenEntries(nodeL1)"
          :key="`L2${nodeL2.content.id}`"
        >

          <TextsheetCard
            :level="2"
            :filterTypes="DISCUSSIONTYPES"
            :node="nodeL2"
            :discussionAM="discussionAM"
            :heading_number="`${(keyL1+1)}.${(keyL2+1)}`"
          />

          <div
            class="row justify-between"
            v-for="(nodeL3, keyL3) in textChildrenEntries(nodeL2)"
            :key="`L3${nodeL3.content.id}`"
          >

            <TextsheetCard
              :filterTypes="DISCUSSIONTYPES"
              :node="nodeL3"
              :level="3"
              :discussionAM="discussionAM"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- AM-FINAL -->
    <ArtificialModeration
      :AM="AM_index_bottom"
      alignment="center"
      :ctx="this"
    />

    <SideMenu :items="sideMenuItems" />

  </q-page>
</template>

<script>
import ContentTreeMixin from "src/mixins/stage.contenttree";
// import ComponentStageEditor from "src/pages/ContentTree/components/StageEditor";
import TextsheetCard from "./components/TextsheetCard";
import AMs from "./ArtificialModeration.js";
import ArtificialModeration from "src/components/artificial_moderation/ArtificialModeration.vue";
import SideMenu from "src/components/SideMenu";
import { LayoutEventBus } from "src/utils/eventbus";

import i18nPluginMixin from "./i18n";
import constants from "src/utils/constants";

export default {
  name: "TextsheetDefault",
  mixins: [ContentTreeMixin, i18nPluginMixin],
  components: {
    TextsheetCard,
    SideMenu,
    ArtificialModeration,
  },

  data() {
    return {
      AMs,
      TEXTTYPES: constants.TEXTTYPES,
      DISCUSSIONTYPES: constants.DISCUSSIONTYPES,
      // todays_first_visit: null,
      // sideMenuItems: null,
    };
  },

  computed: {
    ready() {
      const ready =
        this.$loaded(this.routed_stage) && this.$loaded(this.contenttree);
      console.log("READY?", ready);
      if (ready) {
        LayoutEventBus.$emit("hideLoading");

        // Everything loaded...
        // if (!this.$loaded(this.todays_first_visit)) {
        //   this.todays_first_visit = this.is_stage_alerted(this.routed_stage);
        // }
      }
      return ready;
    },

    // isStageAlerted() {
    //   return this.is_stage_alerted(this.routed_stage);
    // },

    mainTopics() {
      console.log("run mainTOpics? (computed)");
      return this.textChildrenEntries();
    },

    textEntries() {
      console.log("run textEntries (computed)");
      return this.filter_entries(
        Object.values(this.contenttree.entries),
        this.TEXTTYPES
      );
    },

    sideMenuItems() {
      if (!this.mainTopics) {
        return [];
      }

      const topics = this.mainTopics.filter(
        (x) => x.content.title !== "@HIDDEN@"
      );
      return topics.map((node) => {
        return {
          label: node.content.title,
          anchor: `ANCHOR${node.content.id}`,
        };
      });
    },

    AM_index_bottom() {
      console.log("CONSENT REQUEST...", this.routed_stage.stage.custom_data);
      if (this.routed_stage.stage.custom_data?.REQUEST_CONSENT) {
        console.log("CONSENT REQUEST...!!");
        return this.AMs.index_bottom_with_request_for_consent;
      } else {
        return this.AMs.index_bottom;
      }
    },

    discussionAM() {
      // console.log(this.AMs?.discussion_index_top);
      return this.AMs?.discussion_index_top;
    },
  },

  methods: {
    textChildrenEntries(node) {
      const node_id = node ? node.content.id : null;
      console.log("look for children of ", node_id);
      let children = this.textEntries.filter(
        (child) => child.content.parent_id === node_id
      );
      return children;
    },
  },
};
</script>
