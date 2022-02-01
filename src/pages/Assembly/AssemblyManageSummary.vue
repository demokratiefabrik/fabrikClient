<template>
  <q-page class="doc_content" v-if="ready">
    <a name="INTRO" />

    <div class="row text-center">
      <div class="seperator">
        <q-img
          style="max-width: 150px; max-height: 150px"
          :src="`layout/logodemokratiefabrik.png`"
          class="q-mb-xl"
        />
        <h1>Summary</h1>
      </div>
    </div>

    <br />
    <div class="row justify-between">
      <div class="seperator">
        <q-icon name="mdi-star-four-points-outline" />
      </div>
    </div>
    <br />

    <a name="TOPICS" />
    <!-- THEMEN -->
    <div v-if="loaded(topics)">
      <h2>Zwischenstand: smartvote-Themen</h2>

      <p>
        Themen, die den Teilnehmenden an der Demokratiefabrik besonders wichtig
        sind, erhalten mehr Raum im smartvote-Fragenkatalog. Wäre die
        Könizer-Demokratiefabrik heute schon zu Ende, dann würden die Fragen
        ungefähr so auf die Themen verteilt:
        <!-- Wie genau der smartvote-Fragenkatalog am Ende aussehen wird können wir jetzt natürlich erst mitteilen, nachdem die Demokratiefabrik am 2. Juli schliesst.
        Dann wird neben der Bewertung der einzelnen Fragen auch die Bewertung der Themen eine Rolle spielen. Themen, die Ihnen besonders wichtig sind, erhalten mehr Raum im smartvote-Fragenkatalog.
        Ein erster Vorgeschmack, wie die Verteilung aussehen könnte, findet sich im folgenden Diagramm. -->
      </p>
      <br /><br />
      <ContentTreeChart
        chartType="chartPie"
        :addPersonalData="false"
        :nodes="topics"
      />

      <!-- <p v-if="topicHighestSalience && topicHighestSaliencePercent">
        Wenn die Beteiligungswochen bereits beendet wären, dann würde das Thema
        "{{ topicHighestSalience.content.title }}" im smartvote-Fragebogen am
        meisten Platz eingeräumt werden. Nämlich ungefähr
        {{ topicHighestSaliencePercent }}%.
      </p> -->
    </div>
    <div v-else>
      <Skeleton h2="Zwischenstand:  smartvote-Themen"></Skeleton>
    </div>

    <br />

    <!-- FRAGEN -->
    <a name="QUESTIONS" />

    <div v-if="questions && questions.length">
      <h2>Zwischenstand: smartvote-Fragen</h2>
      <p>
        Im Moment sind {{ questions.length }} Fragen im Fragenkatalog der
        Demokratiefabrik vorhanden. Insgesamt fliessen am Ende etwa 48 Fragen in
        den finalen smartvote-Fragebogen ein.
      </p>

      <div
        v-if="questionsHighestSalience && questionsHighestSalience.length > 0"
      >
        <p>
          Hier sind die aktuell am besten bewerteten Fragen in unserem Katalog.
          Diese haben bisher die grössten Chancen am Ende, so oder in ähnlicher
          Form, im smartvote-Fragebogen aufgeführt zu werden.
        </p>
        <br />
        <ul v-if="questionsHighestSalience.length">
          <li v-for="node in questionsHighestSalience" :key="node.content?.id">
            {{ node.content?.title }} (Bewertung:
            {{
              node?.content?.S?.SA !== undefined
                ? Math.round(node.content?.S.SA)
                : '-'
            }}/100)
          </li>
        </ul>
      </div>
      <div v-else>
        Wir halten Sie hier auf dem Laufenden, welche Fragen bei den
        Teilnehmenden besonders gut ankommen.
      </div>
    </div>
    <div v-else>
      <Skeleton h2="Fragenkatalog"></Skeleton>
    </div>

    <br />
    <div class="row justify-between">
      <div class="seperator">
        <q-icon name="mdi-star-four-points-outline" />
      </div>
    </div>
    <br />

    <a name="PEERREVIEWS" />

    <!-- PEERREVIEW -->
    <div v-if="loaded(peerreviews)">
      <h2>Zwischenstand: Anträge</h2>
      <p>
        Damit neue Fragen in den Katalog aufgenommen oder bisherige Fragen
        geändert werden können, müssen die Teilnehmenden Anträge schreiben.
      </p>
      <ul>
        <li>
          Bisher <span v-if="peerreviews.length !== 1">wurden</span
          ><span v-else>wurde</span> {{ peerreviews.length }} Anträge gestellt.
        </li>
        <li v-if="peerreviews.length > 0">
          Davon <span v-if="peerreviewsApproved.length !== 1">wurden</span
          ><span v-else>wurde</span> {{ peerreviewsApproved.length }} von
          anderen Könizerinnen und Könizern angenommen und
          {{ peerreviewsRejected.length }} abgelehnt.
        </li>
        <li v-if="peerreviews.length > 0">
          {{ peerreviewsOngoing.length }}
          <span v-if="peerreviewsApproved.length !== 1">werden</span
          ><span v-else>wird</span> gegenwärtig begutachtet.
        </li>
      </ul>

      <!-- <ChartBar
        :personalData="chartBarPersonalData"
        :labels="chartBarLabels"
        color="rgb(224, 202, 60, 0.45)"
      />-->
    </div>
    <div v-else>
      <Skeleton h2="Zwischenstand: Anträge"></Skeleton>
    </div>
    <br />
    <div class="row justify-between">
      <div class="seperator">
        <q-icon name="mdi-star-four-points-outline" />
      </div>
    </div>
    <br />

    <a name="USERS" />
    <!-- USER -->
    <div>
      <h2>Zwischenstand: Beteiligung</h2>
      <p>
        Wir laden insgesamt 9000 Könizerinnen und Könizer in die
        Demokratiefabrik ein. Wir sind gespannt, wieviele von Ihnen sich für die
        Demokratiefabrik interessieren.

        <span
          >Aktuell sind wir bei
          <b>{{ assembly.agg_user_count }} Teilnehmenden.</b></span
        >
      </p>
      <br /><br />
    </div>
    <SideMenu :items="sideMenuItems" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ContentTreeChart from 'src/pages/ContentTree/components/ContentTreeChart.vue';
import SideMenu from 'src/components/SideMenu.vue';
import { mapGetters, useStore } from 'vuex';
import Skeleton from 'src/components/Skeleton.vue';
// import AMs from './ArtificialModeration';
// import ArtificialModeration from 'src/components/artificial_moderation/ArtificialModeration.vue';
import useAssemblyComposable from 'src/composables/assembly.composable';
import useLibraryComposable from 'src/utils/library';
import { IStageTuple } from 'src/models/stage';
import { IContentTree } from 'src/models/contenttree';
import { INodeTuple } from 'src/models/content';
import useStageComposable from 'src/composables/stage.composable';
import usePKCEComposable from 'src/plugins/VueOAuth2PKCE/pkce.composable';
import useEmitter from 'src/utils/emitter';

export interface ISideMenuItem {
  label: string;
  anchor: string;
  caption?: string;
  visible?: () => boolean;
}

export type ISideMenuItems = ISideMenuItem[];
export default defineComponent({
  setup() {
    const { loaded } = useLibraryComposable();
    const { assemblyIdentifier, assembly, assemblyStages, ready } =
      useAssemblyComposable();
    const { routed_stage, markUnAlert } = useStageComposable();
    const store = useStore();
    const { userid } = usePKCEComposable();
    const emitter = useEmitter();

    return {
      assemblyIdentifier,
      loaded,
      assemblyStages,
      markUnAlert,
      store,
      userid,
      routed_stage,
      emitter,
      ready,
      assembly,
    };
  },
  name: 'VAATopics',
  mixins: [],
  data() {
    return {
      AMs: [],
      chartType: 'chartRadar',

      sideMenuItems: [
        {
          label: 'Intro',
          anchor: 'INTRO',
        },
        {
          label: 'Themengewichtung',
          anchor: 'TOPICS',
        },
        {
          label: 'Fragenkatalog',
          anchor: 'QUESTIONS',
        },
        {
          label: 'Anträge',
          anchor: 'PEERREVIEWS',
        },
        // {
        //   label: "Teilnehmende",
        //   anchor: "USERS",
        // },
        {
          label: 'Ausblick',
          anchor: 'OUTLOOK',
        },
      ] as ISideMenuItem[],
    };
  },

  components: {
    // ArtificialModeration,
    SideMenu,
    ContentTreeChart,
    Skeleton,
  },

  computed: {
    topicContentTree(): any {
      // TODO interface
      const contenttreeID = this.topicContentTreeID;
      // const topicStage = Object.values(this.assemblyStages).find(
      //   (stageTuple) => stageTuple.stage.type == "VAA_TOPICS"
      // );
      // console.assert(topicStage);
      // console.assert(topicStage.stage.contenttree_id);
      return this.get_contenttree({
        contenttreeID: contenttreeID,
      });
    },

    topicContentTreeID(): number {
      const topicStage = Object.values(this.assemblyStages).find(
        (stageTuple) => (stageTuple as IStageTuple).stage?.type === 'VAA_TOPICS'
      );
      console.assert(topicStage);
      return (topicStage as IStageTuple).stage.contenttree_id;
    },

    topics(): INodeTuple[] | undefined {
      // TODO interface
      if (!this.topicContentTree) {
        return;
      }

      if (!this.topicContentTree?.rootElementIds) {
        return;
      }

      return this.topicContentTree.rootElementIds.map(
        (x) => this.topicContentTree.entries[x]
      );
    },

    topicHighestSalience(): INodeTuple | undefined {
      // TODO: interface
      // const sorted = this.topics.sort((a, b) => b?.S?.SA - a.S?.SA);
      const sorted = this.topics;

      if (!sorted) {
        return undefined;
      }

      sorted.sort(function (first: INodeTuple, second: INodeTuple) {
        const firstS =
          first.content?.S?.SA !== undefined ? first.content?.S?.SA : 50;
        const secondS =
          second.content?.S?.SA !== undefined ? second.content?.S?.SA : 50;
        return secondS - firstS;
      });

      return sorted[0];
    },

    // topicHighestSaliencePercent(): INodeTuple | undefined {
    //   const reduced = this.topics as INodeTuple[];

    //   if (!this.topicHighestSalience?.content?.S?.SA || !reduced) {
    //     return;
    //   }

    //   const cumulative = reduced.reduce(
    //     (a: INodeTuple, b: INodeTuple) => a.content?.S?.SA + b.content?.S?.SA,
    //     0
    //   );
    //   if (!cumulative) {
    //     return;
    //   }
    //   const highest = this.topicHighestSalience.content?.S?.SA;

    //   return Math.round((100 / cumulative) * highest);
    // },

    questionsContentTree(): IContentTree | null {
      if (!this.assemblyStages) {
        return null;
      }

      const stages: IStageTuple[] = Object.values(this.assemblyStages);

      const questionStage = stages.find(
        (stageTuple: IStageTuple) => stageTuple?.stage?.type === 'VAA_QUESTIONS'
      );
      console.assert(questionStage);
      console.assert(questionStage?.stage.contenttree_id);
      return this.get_contenttree({
        contenttreeID: questionStage?.stage.contenttree_id,
      });
    },

    questions(): INodeTuple[] | undefined {
      if (!this.questionsContentTree) {
        return undefined;
      }
      const nodes: INodeTuple[] = Object.values(
        this.questionsContentTree.entries
      );
      return nodes.filter(
        (x: INodeTuple) =>
          x.content?.type === 'VAA_QUESTION' && !x.content.rejected
      );
    },

    questionsHighestSalience(): INodeTuple[] | null {
      // TODO: interface
      if (!this.questions) {
        return null;
      }

      const questions = [
        ...this.questions.filter((x) => this.loaded(x.content?.S?.SA)),
      ];
      const sorted = questions.sort(function (
        first: INodeTuple,
        second: INodeTuple
      ) {
        const firstS =
          first.content?.S?.SA !== undefined ? first.content?.S?.SA : 50;
        const secondS =
          second.content?.S?.SA !== undefined ? second.content?.S?.SA : 50;
        return secondS - firstS;
      });

      return sorted.slice(0, 10);
    },

    peerreviewsOngoing(): any {
      // TODO: interface
      if (!this.loaded(this.peerreviews)) {
        return;
      }
      return this.peerreviews.filter(
        (x) =>
          !this.loaded(x.peereview.rejected) &&
          !this.loaded(x.peereview.approved)
      );
    },

    peerreviewsRejected(): any {
      // TODO: interface
      if (!this.loaded(this.peerreviews)) {
        return;
      }
      return this.peerreviews.filter((x) => x.peerreview.rejected);
    },

    peerreviewsApproved(): any {
      // TODO: interface
      if (!this.loaded(this.peerreviews)) {
        return;
      }
      return this.peerreviews.filter((x) => x.peerreview.approved);
    },

    ...mapGetters({
      get_contenttree: 'contentstore/get_contenttree',
      peerreviews: 'peerreviewstore/all_peerreviews',
    }),
  },

  watch: {
    ready(to) {
      if (to) {
        this.markUnAlert();
      }
    },

    // LOAD TOPICS
    topicContentTreeID(to) {
      if (to) {
        this.store.dispatch('contentstore/syncContenttree', {
          assemblyIdentifier: this.assemblyIdentifier,
          contenttreeID: to,
          oauthUserID: this.userid,
        });
      }
    },
  },

  created() {
    if (this.routed_stage) {
      this.markUnAlert();
    }
  },

  mounted() {
    // when stage has been loaded already
    this.store.dispatch('contentstore/syncContenttree', {
      assemblyIdentifier: this.assemblyIdentifier,
      contenttreeID: this.topicContentTreeID,
      oauthUserID: this.userid,
    });

    if (this.routed_stage?.stage.contenttree_id && this.userid) {
      this.store.dispatch('peerreviewstore/syncPeerreviews', {
        assemblyIdentifier: this.assemblyIdentifier,
        contenttreeID: this.routed_stage.stage.contenttree_id,
        oauthUserID: this.userid,
      });
    } else {
      // Stage is not yet loaded: so wait until it is...
      this.emitter.on('EventStageLoaded', (stage) => {
        // this.emitter.off('EventStageLoaded', onFoo)  // unlisten
        this.store.dispatch('peerreviewstore/syncPeerreviews', {
          assemblyIdentifier: this.assemblyIdentifier,
          contenttreeID: (stage as IStageTuple)?.stage.contenttree_id,
          oauthUserID: this.userid,
        });
      });
    }
  },
});
</script>
