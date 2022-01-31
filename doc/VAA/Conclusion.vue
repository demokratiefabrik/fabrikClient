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
        <h1>Vielen Dank für Ihre heutige Mitarbeit!</h1>

        <ArtificialModeration
          :AM="AMs.conclusionA"
          alignment="left"
          amGroup="Conclusion"
          :role="1"
          :ctx="this"
        />

        <ArtificialModeration
          :AM="AMs.conclusionB"
          alignment="right"
          amGroup="Conclusion"
          :role="2"
          :ctx="this"
        />

        <!-- <p class="text-h4"> Es folgt ein kleiner Zwischenstand zur Demokratiefabrik! Wenn Sie möchten können Sie sich weiterhin auf der Plattform bewegen. Es gibt noch viel zu entdecken und mit anderen Könizerinenn und Könizer zu diskutieren. </p> -->
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
    <div v-if="$loaded(topics)">
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

      <p v-if="topicHighestSalience && topicHighestSaliencePercent">
        Wenn die Beteiligungswochen bereits beendet wären, dann würde das Thema
        "{{ topicHighestSalience.content.title }}" im smartvote-Fragebogen am
        meisten Platz eingeräumt werden. Nämlich ungefähr
        {{ topicHighestSaliencePercent }}%.
      </p>
    </div>
    <div v-else>
      <Skeleton h2="Zwischenstand:  smartvote-Themen"></Skeleton>
    </div>

    <br />

    <!-- FRAGEN -->
    <a name="QUESTIONS" />

    <div v-if="$loaded(questions)">
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
        <ul>
          <li v-for="node in questionsHighestSalience" :key="node.content.id">
            <span v-if="!node.content.peerreviewed">Parteivorschlag</span>
            <span v-if="node.content.peerreviewed"
              >Vorschlag eines Teilnehmenden</span
            >

            | Bewertung: {{ Math.round(node.content.S.SA) }}/100
            <br />
            <span class="text-h6">{{ node.content.title }}</span>

            <!-- {{node.content.peerreviewed}} -->
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
    <div v-if="$loaded(peerreviews)">
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
        <span v-if="assembly.agg_user_count && assembly.agg_user_count > 50"
          >Aktuell sind wir bei
          {{ assembly.agg_user_count }} Teilnehmenden.</span
        >
        <span v-if="!assembly.agg_user_count || assembly.agg_user_count <= 50"
          >Wir halten Sie hier auf dem Laufenden.</span
        >
      </p>
      <br /><br />
    </div>
    <!-- ... -->
    <br />
    <div class="row justify-between">
      <div class="seperator">
        <q-icon name="mdi-star-four-points-outline" />
      </div>
    </div>
    <br />

    <a name="OUTLOOK" />

    <!-- Ausblick -->
    <div>
      <h2>Wie geht es nun weiter?</h2>
      <p>
        Die Demokratiefabrik bleibt noch bis und mit 4. Juli 2021 geöffnet. Wir
        freuen uns, wenn Sie noch einmal vorbeischauen, um die Arbeiten zum
        Fragenkatalog erneut zu unterstützen! Bei Ihrem nächsten Besuch finden
        Sie beim Glöckchen am oberen Rand Informationen dazu, wie andere
        Teilnehmende auf Ihre Anträge und Kommentare reagiert haben.

        <!-- Vielen Dank für Ihren Besuch und bis zum nächsten Mal!  -->
      </p>
    </div>
    <SideMenu :items="sideMenuItems" />
  </q-page>
</template>

<script>
import ContenttreeMixin from 'src/mixins/stage.contenttree';
import ContentTreeChart from 'src/pages/ContentTree/components/ContentTreeChart';
import SideMenu from 'src/components/SideMenu.vue';
import { mapGetters } from 'vuex';
import Skeleton from 'src/components/Skeleton.vue';
import AMs from './ArtificialModeration';
import ArtificialModeration from 'src/components/artificial_moderation/ArtificialModeration.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    const { assemblyIdentifier } = useAssemblyComposable();
    return { instanceNr };
  },
  name: 'VAATopics',
  mixins: [ContenttreeMixin],
  data() {
    return {
      AMs,
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
      ],
    };
  },

  components: {
    ArtificialModeration,
    SideMenu,
    ContentTreeChart,
    Skeleton,
  },

  computed: {
    topicContentTree() {
      const contenttreeID = this.topicContentTreeID;
      // const topicStage = Object.values(this.assembly_stages).find(
      //   (stageTuple) => stageTuple.stage.type == "VAA_TOPICS"
      // );
      // console.assert(topicStage);
      // console.assert(topicStage.stage.contenttree_id);
      return this.get_contenttree({
        contenttreeID: contenttreeID,
      });
    },

    topicContentTreeID() {
      const topicStage = Object.values(this.assembly_stages).find(
        (stageTuple) => stageTuple.stage.type == 'VAA_TOPICS'
      );
      console.assert(topicStage);
      return topicStage.stage.contenttree_id;
      // return this.get_contenttree({
      //   contenttreeID: topicStage.stage.contenttree_id,
      // });
    },

    topics() {
      if (!this.topicContentTree) {
        return;
      }
      if (this.topicContentTree?.rootElementIds) {
        return this.topicContentTree.rootElementIds.map(
          (x) => this.topicContentTree.entries[x]
        );
      }
    },

    topicHighestSalience() {
      // const sorted = this.topics.sort((a, b) => b?.S?.SA - a.S?.SA);
      const sorted = this.topics.sort(function (first, second) {
        const firstS = first.content.S?.SA !== null ? first.content?.S?.SA : 50;
        const secondS =
          second.content.S?.SA !== null ? second.content?.S?.SA : 50;
        return secondS - firstS;
      });

      return sorted[0];
    },

    topicHighestSaliencePercent() {
      if (!this.topicHighestSalience.content?.S?.SA) {
        return;
      }
      const cumulative = this.topics.reduce(
        (a, b) => a.content?.S?.SA + b.content?.S?.SA,
        0
      );
      if (!cumulative) {
        return;
      }
      const highest = this.topicHighestSalience.content?.S?.SA;
      return Math.round((100 / cumulative) * highest);
    },

    questionsContentTree() {
      const questionStage = Object.values(this.assembly_stages).find(
        (stageTuple) => stageTuple.stage.type == 'VAA_QUESTIONS'
      );
      console.assert(questionStage);
      console.assert(questionStage.stage.contenttree_id);
      return this.get_contenttree({
        contenttreeID: questionStage.stage.contenttree_id,
      });
    },

    questions() {
      if (!this.questionsContentTree) {
        return;
      }
      return Object.values(
        Object.filter(
          this.questionsContentTree.entries,
          (x) => x.content.type === 'VAA_QUESTION' && !x.content.rejected
        )
      );
    },

    questionsHighestSalience() {
      const questions = [
        ...this.questions.filter(
          (x) =>
            this.$loaded(x.content.S?.SA) &&
            !x.content.rejected &&
            !x.content.pending_peerreview_for_insert
        ),
      ];
      const sorted = questions.sort(function (first, second) {
        const firstS =
          first.content?.S?.SA !== null ? first.content?.S?.SA : 50;
        const secondS =
          second.content?.S?.SA !== null ? second.content?.S?.SA : 50;
        return secondS - firstS;
      });

      return sorted.slice(0, 10);
    },

    peerreviewsOngoing() {
      if (!this.$loaded(this.peerreviews)) {
        return;
      }
      return this.peerreviews.filter(
        (x) =>
          !this.$loaded(x.peereview.rejected) &&
          !this.$loaded(x.peereview.approved)
      );
    },

    peerreviewsOngoing() {
      if (!this.$loaded(this.peerreviews)) {
        return;
      }
      return this.peerreviews.filter(
        (x) => !x.peerreview.rejected && !x.peerreview.approved
      );
    },

    peerreviewsRejected() {
      if (!this.$loaded(this.peerreviews)) {
        return;
      }
      return this.peerreviews.filter((x) => x.peerreview.rejected);
    },

    peerreviewsApproved() {
      if (!this.$loaded(this.peerreviews)) {
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
    ready(to, from) {
      if (to) {
        this.markUnAlert();
      }
    },

    // LOAD TOPICS
    topicContentTreeID(to, from) {
      if (to) {
        this.$store.dispatch('contentstore/syncContenttree', {
          assemblyIdentifier: this.assemblyIdentifier,
          contenttreeID: to,
          oauthUserID: this.oauth.userid,
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
    this.$store.dispatch('contentstore/syncContenttree', {
      assemblyIdentifier: this.assemblyIdentifier,
      contenttreeID: this.topicContentTreeID,
      oauthUserID: this.oauth.userid,
    });

    if (this.routed_stage?.stage.contenttree_id && this.oauth.userid) {
      this.$store.dispatch('peerreviewstore/syncPeerreviews', {
        assemblyIdentifier: this.assemblyIdentifier,
        contenttreeID: this.routed_stage.stage.contenttree_id,
        oauthUserID: this.oauth.userid,
      });
    } else {
      // Stage is not yet loaded: so wait until it is...
      LayoutEventBus.$once('EventStageLoaded', (stage) => {
        this.$store.dispatch('peerreviewstore/syncPeerreviews', {
          assemblyIdentifier: this.assemblyIdentifier,
          contenttreeID: stage.stage.contenttree_id,
          oauthUserID: this.oauth.userid,
        });
      });
    }
  },
});
</script>
