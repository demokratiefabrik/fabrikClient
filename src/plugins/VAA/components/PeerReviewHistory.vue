<template>
  <div>
    <br>
    <div class="text-h6"> Bisherige Anträge zu dieser smartvote-Frage</div>
    <p>Um Änderungen am Fragenkatalog vorzunehmen, muss ein Antrag gestellt werden, der von anderen Teilnehmenden begutachtet werden muss. Hier sehen Sie, wie viele Anträge zu dieser Frage bereits gestellt worden sind und ob die Begutachtung dazu noch hängig ist oder bereits abgeschlossen wurde. Tipp: Die inhaltliche Auseinandersetzung mit den Anträgen kann am besten im Register "Diskussion" nachvollzogen werden.</p>

    <q-timeline color="secondary">

      <q-timeline-entry
        v-for="peerreview in peerreviewHistory"
        :key="peerreview.peerreview.id"
        :class="peerreview.creator.id==public_profile.id ? 'bg-blue-1' : ''"
        :subtitle="peerreviewSubtitle(peerreview)"
        :icon="peerreviewIcon(peerreview)"
      >
        <p>
          <b>Vorschlag:</b> <br>
          <span class="text-notification q-ma-md">{{peerreview.peerreview.data_to_apply_on_success.title}}</span>
        </p>

        <span v-if="peerreview.peerreview.approved">
          <b>Angenommen {{peerreview.peerreview.date_approved | formatDate}}</b><br>
        </span>
        <span v-else-if="peerreview.peerreview.rejected">
          <b>Abgelehnt am {{peerreview.peerreview.date_rejected | formatDatetime}} </b><br>
          Es wurden keine Änderungen vorgenommen.
        </span>
        <span v-else>
          <b>Stand: Wird gegenwärtig begutachtet</b><br>
        </span>

        <ul>
          <li v-if="peerreview.peerreview.approved">
            Der Antrag wurde mit {{peerreview.peerreview.nof_approved}} zu {{peerreview.peerreview.nof_rejected}} Stimmen angenommen.
          </li>
          <li v-if="peerreview.peerreview.approved">
            Der Antrag ist angenommen worden, weil mehr als {{peerreview.peerreview.approving_rate}}% von {{peerreview.peerreview.responded_quorum}} Gutachten den Antrag zur Annahme empfohlen haben.
          </li>
          <li v-if="peerreview.peerreview.rejected">
            Der Antrag wurde mit {{peerreview.peerreview.nof_rejected}} zu {{peerreview.peerreview.nof_approved}} Stimmen abgelehnt.
          </li>
          <li v-if="peerreview.peerreview.rejected">
            Der Antrag wäre angenommen worden, wenn mehr als {{peerreview.peerreview.approving_rate}}% von {{peerreview.peerreview.responded_quorum}} Gutachten den Antrag zur Annahme empfehlen.
          </li>

          <li v-if="!peerreview.peerreview.rejected && !peerreview.peerreview.approved">
            Eingegangene Urteile: {{peerreview.peerreview.nof_responded ? peerreview.peerreview.nof_responded : 0}}
          </li>
          <li v-if="peerreview.peerreview.nof_responded && !peerreview.peerreview.rejected && !peerreview.peerreview.approved">
            Anzahl positive Urteile: {{peerreview.peerreview.nof_approved ? peerreview.peerreview.nof_approved : 0 }}
          </li>
          <li v-if="peerreview.peerreview.nof_responded && !peerreview.peerreview.rejected && !peerreview.peerreview.approved">
            Anzahl negative Urteile: {{peerreview.peerreview.nof_rejected ? peerreview.peerreview.nof_rejected : 0}}
          </li>
          <li v-if="!peerreview.peerreview.rejected && !peerreview.peerreview.approved">
            Der Antrag wird angenommen, wenn mehr als {{peerreview.peerreview.approving_rate}}% von {{peerreview.peerreview.responded_quorum}} Gutachten den Antrag zur Annahme empfehlen.
          </li>
          <li v-if="peerreview.peerreview.nof_criteria_accept1 + peerreview.peerreview.nof_criteria_accept2 + peerreview.peerreview.nof_criteria_accept3 < 3*peerreview.peerreview.nof_responded">
            Bisher gingen folgende Meldungen bezüglich eines allfälligen Verstosses gegen die Entscheidungskriterien ein:<br>
            <ul>
              <li
                v-for="i in [1,2,3]"
                :key="i"
                v-show="peerreview.peerreview.nof_responded > peerreview.peerreview[`nof_criteria_accept${i}`]"
              >
                {{peerreview.peerreview.nof_responded-peerreview.peerreview[`nof_criteria_accept${i}`]}}x wurde beanstandet, dass folgendes Kriterium nicht erfüllt ist:<br> <i class="text-orange">{{ $t(`common_properties.${peerreview.peerreview.operation.toLowerCase()}.criteria_accept.${i}`,  {topic:topic.content.title})}}</i>
              </li>
            </ul>
          </li>

          <li v-else>
            Für diesen Antrag gingen noch keine Meldungen bezüglich eines allfälligen Verstosses gegen die Entscheidungskriterien ein.
          </li>
        </ul>
      </q-timeline-entry>

      <q-timeline-entry
        title=""
        v-if="!nofPeerreviewInsertOperation"
        subtitle="14. Juni 2021"
        icon="mdi-rocket-launch-outline"
      >
        <div>
          Die Frage gehört zu denjenigen Fragen, die von den Ortsparteien vorgeschlagen wurden und die sich bereits seit der Öffnung der Könizer Demokratiefabrik auf der Plattform befinden.
        </div>
      </q-timeline-entry>

    </q-timeline>

  </div>

</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "PeerReviewHistory",
  data() {
    return {
      peerreviewIcons: {
        rejected: "mdi-cancel",
        approved: "mdi-check",
        ongoing: "mdi-timer-sand",
      },
      peerreviewTitles: {
        INSERT: "Neu-Eingabe",
        UPDATE: "Verbesserungsvorschlag",
      },
    };
  },
  props: ["contentID", "topic"],
  inject: ["CONTENTTREE"],
  computed: {
    peerreviewHistory() {
      const peerreviews = this.get_peerreview_by_content({
        contentID: this.contentID,
      });

      const sortedPeerreviews = [...peerreviews];
      console.log(sortedPeerreviews);
      return sortedPeerreviews.sort(
        (a, b) => b.peerreview.id - a.peerreview.id
      );
    },

    nofPeerreviewInsertOperation() {
      const inserts = this.peerreviewHistory.filter(
        (x) => x.peerreview.operation == "INSERT"
      );
      return inserts ? inserts.length : 0;
    },
    ...mapGetters({
      public_profile: "publicprofilestore/get_public_profile",
      get_peerreview_by_content: "peerreviewstore/get_peerreview_by_content",
    }),
  },

  methods: {
    peerreviewSubtitle(peerreview) {
      const datecreated = this.$options.filters.formatDatetime(
        peerreview.peerreview.date_created
      );
      const user = peerreview.creator.U;
      const title = this.peerreviewTitles[peerreview.peerreview.operation];
      return `${title} (Antrag #${peerreview.peerreview.id}) von ${user} vom ${datecreated}`;
    },
    // peerreviewTitle(peerreview) {
    //   const title = this.peerreviewTitles[peerreview.peerreview.operation];
    //   return `Antrag: ${title}`;
    // },
    peerreviewIcon(peerreview) {
      if (peerreview.peerreview.rejected) {
        return this.peerreviewIcons.rejected;
      }
      if (peerreview.peerreview.approved) {
        return this.peerreviewIcons.approved;
      }

      return this.peerreviewIcons.ongoing;
    },
  },
};
</script>