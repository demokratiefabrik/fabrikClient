<template>
  <q-page class="doc_content">
    <div
      class="row justify-between"
      v-if="!ready || !$loaded(this.salienceCompleted)"
    >
      <div class="seperator">
        <q-spinner-dots size="2rem" />
      </div>
    </div>

    <div v-if="ready && $loaded(this.salienceCompleted)">
      <!-- 1. Etappe -->
      <h2>Welches sind die wichtigsten Wahlthemen?</h2>
      <p>
        Je wichtiger die Themen für die Bürgerinnen und Bürger sind, desto mehr
        Platz erhalten sie im smartvote-Fragebogen.
      </p>

      <ArtificialModeration
        :AM="AMs.topics_top_partner"
        amGroup="topics_intro"
        alignment="right"
        :role="2"
        :ctx="this"
      />

      <a name="SALIENCE" />

      <div class="row justify-between">
        <div class="seperator large">
          <q-icon name="mdi-star-four-points-outline" />
        </div>
      </div>
      <h2>
        <q-badge
          v-if="milestoneSALIENCE"
          color="green"
          style="position: relative; top: -1em"
        >
          <q-icon name="mdi-check" size="1.2em" />
        </q-badge>
        Themenübersicht
      </h2>
      <p>
        Wir stellen Ihnen hier die verschiedenen Themengebiete vor, welche
        standardmässig mit dem smartvote-Fragebogen abgedeckt werden. Geben Sie
        hier an, wie wichtig Ihnen die einzelnen Themen sind.
      </p>
      <SalienceList
        :contentList="rootNode.children"
        salienceInstruction="Wie wichtig ist Ihnen dieses Thema? Bitte verschieben Sie den Regler."
        :salienceCompleted="salienceCompleted"
        titlePrefix="smartvote-Thema"
        discussionIntro="Hier können Sie über die Themen diskutieren. Weswegen ist dieses Thema besonders wichtig für Sie oder die Gemeinde Köniz? Gerne können Sie hierzu einen Diskussionsbeitrag verfassen."
        @item-saliencing="incrementNumberOfCurrentlySaliencedEntries"
        captionPrefix="Das smartvote-Thema"
        :itemIcon="ICON_VAA_TOPIC"
      ></SalienceList>

      <ArtificialModeration
        :AM="AMs.topics_after_saliencing"
        alignment="center"
        amGroup="chartmods"
        :role="1"
        :ctx="this"
      />

      <div class="row justify-between">
        <div class="seperator large">
          <q-icon name="mdi-star-four-points-outline" />
        </div>
      </div>

      <!-- RESULT / STATS -->
      <!-- 2. Etappe -->
      <a name="CHARTS" />

      <Skeleton v-if="!milestoneSALIENCE" h2="Die Themen im Vergleich" />

      <div v-if="milestoneSALIENCE">
        <ArtificialModeration
          :AM="AMs.topics_before_charts"
          alignment="right"
          group="chartmods"
          :role="2"
          :ctx="this"
        />

        <h2>
          <q-badge
            v-if="milestoneCHARTS"
            color="green"
            style="position: relative; top: -1em"
          >
            <q-icon name="mdi-check" size="1.2em" />
          </q-badge>

          Die Themen im Vergleich
        </h2>

        Sie sehen hier nun die von Ihnen angegebene Wichtigkeit der Themen in
        einem Netzdiagramm. Je wichtiger die Themen für Sie sind, desto weiter
        draussen im Spinnennetz verläuft die farbige Linie. Bei Themen, die
        Ihnen nicht wichtig erscheinen, nähert sich die farbige Linie der Mitte
        an.

        <ContentTreeChart :chartType="chartType" :nodes="rootElements" />

        <ArtificialModeration
          :AM="AMs.topics_after_charts"
          alignment="right"
          group="chartmods"
          :role="1"
          :ctx="this"
        />
      </div>
      <!-- 4. Etappe -->
      <a name="FINAL" />
      <br />
      <br />
      <br />
      <br />
      <div v-if="milestoneCHARTS">
        <ArtificialModeration
          alignment="left"
          :AM="AMs.topics_end_of_page"
          :ctx="that"
        />
      </div>
    </div>
    <SideMenu :items="sideMenuItems" :highlightedItem="highlightedItem" />
  </q-page>
</template>

<script>
import AMs from './ArtificialModeration';
import ArtificialModeration from 'src/components/artificial_moderation/ArtificialModeration.vue';
import SalienceList from 'src/plugins/VAA/components/SalienceList.vue';
import SideMenu from 'src/components/SideMenu.vue';
import Skeleton from 'src/components/Skeleton';
// import ContentTreeMixin from "src/mixins/contenttree";
import ContentTreeMixin from 'src/mixins/stage.contenttree';
import ContentTreeChart from 'src/pages/ContentTree/components/ContentTreeChart';
import DefaultDiscussionBlock from 'src/pages/ContentTree/components/DefaultDiscussionBlock';
import constants from 'src/utils/constants.js';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'VAATopics',
  mixins: [ContentTreeMixin],
  components: {
    SideMenu,
    Skeleton,
    DefaultDiscussionBlock,
    // ChartBar,
    ContentTreeChart,
    SalienceList,
    // ChartRadar,
    ArtificialModeration,
  },
  data() {
    return {
      AMs,
      ICON_VAA_TOPIC: constants.ICONS.VAA_TOPIC,
      that: this,
      numberOfCurrentlySaliencedEntries: 0,
      filterTypes: constants.VAA_TOPIC_TYPES,
      // cacheAMForum: null,
      // cacheAMForumText: null,
      // amForumRole: 1,
      showPopulationChart: false,

      sideMenuItems: [
        {
          label: 'Themengewichtung',
          anchor: 'SALIENCE',
        },
        // {
        //   label: "Forum",
        //   anchor: "FORUM",
        // },
        {
          label: 'Zusammenfassung',
          anchor: 'CHARTS',
        },
      ],
      chartType: 'chartRadar',
      // chartType: "chartBar",
    };
  },

  watch: {
    salienceCompleted(val) {
      if (val) {
        this.milestone('SALIENCE', 4);
      }
    },
  },

  computed: {
    // amForumPosition() {
    //   return this.amForumRole % 2 ? "left" : "right";
    // },

    milestoneSALIENCE() {
      if (!this.is_stage_alerted(this.routed_stage)) {
        return true;
      }
      return this.stageMilestoneLabels.includes('SALIENCE');
    },

    milestoneCHARTS() {
      if (!this.is_stage_alerted(this.routed_stage)) {
        return true;
      }

      // console.log(this.stageMilestoneLabels.includes("CHARTS"));
      return this.stageMilestoneLabels.includes('CHARTS');
    },

    // milestoneFORUM() {
    //   return this.stageMilestoneLabels.includes("FORUM");
    //   // return (
    //   //   "FORUM" in this.stageMilestoneWeigths &&
    //   //   this.stageMilestoneWeigths.FORUM >= 4
    //   // );
    // },

    // milestoneFORUMpartial() {
    //   return (
    //     "FORUM" in this.stageMilestoneWeigths &&
    //     this.stageMilestoneWeigths.FORUM < 4
    //   );
    // },

    // AMForumPriority() {
    //   return this.cacheAMForum?.priority;
    // },
  },

  methods: {
    incrementNumberOfCurrentlySaliencedEntries() {
      this.numberOfCurrentlySaliencedEntries += 1;
    },

    // amForumIndexChange({ item, text }) {
    //   // is it really a new AM?

    //   if (this.cacheAMForumText === text) {
    //     return;
    //   }

    //   this.amForumRole++;

    //   // Was the old a priority AM, that is now resolved?
    //   if (this.cacheAMForum?.priority) {
    //     // An AM with Priority. Let user answer this first...
    //     this.milestone("FORUM", 4, this.cacheAMForumText);
    //   }

    //   // There seems to be no priority AM anymore... (Finish this step...)
    //   if (!item?.priority) {
    //     this.milestone("FORUM", 4, "NOTHINGTODO");
    //   }

    //   this.cacheAMForum = item;
    //   this.cacheAMForumText = text;
    // },
  },

  mounted() {
    if (this.salienceCompleted) {
      this.milestone('SALIENCE', 4);
    }
  },
});
</script>
