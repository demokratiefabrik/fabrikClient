<template>
  <q-page class="doc_content" v-if="ready">
    <!-- AM-CONCLUSION -->
    <ArtificialModeration :AM="index_top" alignment="center" :ctx="this" />

    <div class="text-vessel" v-if="mainTopics?.length">
      <h2>{{ routed_stage.stage.title }}</h2>

      <div
        class="row justify-between"
        v-for="(nodeL1, keyL1) in mainTopics"
        :key="`L1${nodeL1?.content?.id}`"
      >
        <a :name="`ANCHOR${nodeL1.content?.id}`" />

        <TextsheetCard
          :level="1"
          :filterTypes="DISCUSSIONTYPES"
          :node="nodeL1"
          :discussionAM="discussionAM"
          :heading_number="keyL1 + 1"
        />

        <template v-if="nodeL1?.content">
          <div
            class="row justify-between"
            v-for="(nodeL2, keyL2) in textChildrenEntries(nodeL1 as INodeTuple)"
            :key="`L2${nodeL2.content?.id}`"
          >
            <TextsheetCard
              :level="2"
              :filterTypes="DISCUSSIONTYPES"
              :node="nodeL2"
              :discussionAM="discussionAM"
              :heading_number="`${keyL1 + 1}.${keyL2 + 1}`"
            />
            <template v-if="nodeL2?.content">
              <div
                class="row justify-between"
                v-for="(nodeL3, keyL3) in textChildrenEntries(nodeL2 as INodeTuple)"
                :key="`L3${nodeL3.content.id}`"
              >
                <span>{{ keyL3 }}</span>
                <TextsheetCard
                  :filterTypes="DISCUSSIONTYPES"
                  :node="nodeL3"
                  :level="3"
                  :discussionAM="discussionAM"
                />
              </div>
            </template>
          </div>
        </template>
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

<script lang="ts">
import TextsheetCard from './components/TextsheetCard.vue';
import AMs from './ArtificialModeration';
import ArtificialModeration from 'src/pages/components/artificial_moderation/ArtificialModeration.vue';
import SideMenu from 'src/pages/components/SideMenu.vue';
import localI18n from './i18n';
import constants from 'src/utils/constants';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import useLibraryComposable from 'src/utils/library';
import useContenttreeComposable from 'src/composables/contenttree.composable';
import useEmitter from 'src/utils/emitter';
import { INodeTuple } from 'src/models/content';
import useStageComposable from 'src/composables/stage.composable';
import { ISideMenuItem, ISideMenuItems } from 'src/models/layout';
import { IArtificialModerationGroup } from 'src/pages/components/artificial_moderation/model';
import useAssemblyComposable from 'src/composables/assembly.composable';
import { mapGetters } from 'vuex';

export default defineComponent({
  setup() {
    const { loaded } = useLibraryComposable();
    const {
      contenttreeID,
      routed_stage,
      isFirstText,
      isRoutedStageAlerted,
      markUnAlert,
      nextScheduledStage,
    } = useStageComposable();
    const { contenttree, filter_entries } = useContenttreeComposable();
    const { gotoAssemblyHome, gotoStage, assembly } = useAssemblyComposable();

    const emitter = useEmitter();

    // extend i18n
    const i18n = useI18n();
    i18n.mergeLocaleMessage('de-ch', localI18n['de-ch']);

    const {
      index_bottom_with_request_for_consent,
      index_bottom,
      discussion_index_top,
      index_top,
    } = AMs;
    return {
      index_bottom_with_request_for_consent,
      index_bottom,
      discussion_index_top,
      index_top,
      routed_stage,
      loaded,
      filter_entries,
      isRoutedStageAlerted,
      emitter,
      nextScheduledStage,
      gotoAssemblyHome,
      assembly,
      markUnAlert,
      gotoStage,
      contenttreeID,
      isFirstText,
      contenttree,
    };
  },

  name: 'TextsheetDefault',
  components: {
    TextsheetCard,
    SideMenu,
    ArtificialModeration,
  },

  data() {
    return {
      TEXTTYPES: constants.TEXTTYPES,
      DISCUSSIONTYPES: constants.DISCUSSIONTYPES,
    };
  },

  computed: {
    ...mapGetters('assemblystore', ['is_stage_alerted']),

    ready(): boolean {
      const contenttreeLoaded =
        this.loaded(this.routed_stage) && this.loaded(this.contenttree);
      if (contenttreeLoaded) {
        this.emitter.emit('hideLoading');
      }
      return contenttreeLoaded;
    },

    // isStageAlerted() {
    //   return this.is_stage_alerted(this.routed_stage);
    // },

    mainTopics(): INodeTuple[] | undefined {
      // console.log('run mainTOpics? (computed)', this.textChildrenEntries());
      return this.textChildrenEntries();
    },

    textEntries(): INodeTuple[] | null {
      console.log('run textEntries (computed)');
      if (this.contenttree.entries) {
        return this.filter_entries(
          Object.values(this.contenttree.entries),
          this.TEXTTYPES
        );
      }

      return null;
    },

    sideMenuItems(): ISideMenuItems {
      if (!this.mainTopics) {
        return [];
      }

      const topics = this.mainTopics.filter(
        (x) => x.content?.title !== '@HIDDEN@'
      );
      return topics.map((node) => {
        return {
          label: node.content?.title,
          anchor: `ANCHOR${node.content?.id}`,
        } as ISideMenuItem;
      });
    },

    AM_index_bottom(): IArtificialModerationGroup {
      console.log('CONSENT REQUEST...', this.routed_stage.stage.custom_data);
      if (this.routed_stage.stage.custom_data?.REQUEST_CONSENT) {
        console.log('CONSENT REQUEST...!!');
        return this.index_bottom_with_request_for_consent;
      } else {
        return this.index_bottom;
      }
    },

    discussionAM(): IArtificialModerationGroup {
      return this.discussion_index_top;
    },
  },

  methods: {
    textChildrenEntries(
      node: INodeTuple | null = null
    ): undefined | INodeTuple[] {
      const node_id = node ? node.content?.id : null;
      console.log('look for children of ', node_id);
      let children = this.textEntries?.filter(
        (child) => child.content?.parent_id === node_id
      );
      return children;
    },
  },

  // DONT HAVE TO UNALERT: is done by AM buttons
  // watch: {
  //   ready(to) {
  //     // TODO: Everything loaded...
  //     if (to && !this.isRoutedStageAlerted) {
  //       console.log('DE-ALERT!')
  //     }
  //   },
  // },
});
</script>
