<style scoped>
/* .bg-vaacolor {
  background-color: var(--profilecolor);
  color: var(--profilecolor);
} */

.customSelector {
  margin-top: 3em;
  min-height: 300px;
  height: 100%;
}
.customSelector .head-card {
  max-width: 400px;
  width: 100%;
}

.disabledCustomSelector {
  width: 100%;
}
.disabledCustomSelector .head-card {
  max-width: inherit;
}
</style>
<template>
  <div class="row justify-between  q-ma-none q-pa-none">

    <q-carousel
      :value="value"
      animated
      transition-prev="slide-right"
      transition-next="slide-left"
      control-type="unelevated"
      infinite
      :navigation="!disabled"
      :swipeable="!disabled"
      :arrows="!disabled"
      navigation-icon="mdi-checkbox-blank-circle"
      navigation-active-icon="mdi-checkbox-circle"
      padding
      @input="input"
      :class="{'full-width customSelector rounded-borders': true, 'disabledCustomSelector': disabled} "
      control-color="profilecolor"
    >
      <!-- # vaacolor -->
      <!-- text-vaatopic  -->
      <q-carousel-slide
        name="index"
        v-if="!topicID"
        class="profilecolor column no-wrap flex-center"
        :key="`topic-content`"
      >
        <q-icon
          name="mdi-routes"
          size="xl"
        />
        <div
          class="q-mt-md text-center"
          style="font-size: 1.3rem;"
        >
          Bitte wählen Sie mit<br />den Pfeilen ein Thema aus!
        </div>
      </q-carousel-slide>

      <!-- full-width    -->
      <q-carousel-slide
        :name="topic.content.id"
        v-for="topic in topics"
        class="column no-wrap flex-center"
        :key="`topic-${topic.content.id}`"
      >

        <q-card
          flat
          class="q-ma-none q-pa-none head-card"
        >
          <br>
          <q-card-section
            class="bg-profilecolor"
            :style="` color:#fff;`"
          >
            <q-avatar
              class="absolute"
              color="primary"
              text-color="white"
              style="top: 0; right: 12px; transform: translateY(-50%);"
              icon="mdi-sign-direction"
            />

            <div class="row no-wrap items-center">
              <div
                class="col text-h2"
                style="word-break: break-word;"
              >
                {{topic.content.title}}
                <div
                  class="text-subtitle1"
                  v-if="nof_contents_to_peerreview"
                >
                  <q-icon
                    size="md"
                    name="mdi-scale-balance"
                  />
                  {{nof_contents_to_peerreview}} {{nof_contents_to_peerreview==1 ? 'hängiges' : 'hängige'}} Gutachten
                </div>
                <!-- <div
                  class="text-subtitle1"
                  v-else-if="nof_peerreview_assigned > 0"
                >
                  <q-icon
                    size="md"
                    name="mdi-scale-balance"
                  />
                  Involviert in {{nof_peerreview_assigned}} Gutachten
                </div> -->
                <!-- 
                <div
                  class="text-subtitle1"
                  v-if="nofSalienceUncompleted"
                >
                  <q-icon name="mdi-thumb-down" />
                  <q-icon name="mdi-thumb-up" />
                  {{nofSalienceUncompleted}} unbewertete {{nofSalienceUncompleted==1 ? 'smartvote-Frage' : 'smartvote-Fragen'}}

                </div> -->
              </div>
            </div>

          </q-card-section>

          <q-card-section class="q-pt-none q-ma-md">
            <div class="grey">
              {{topic.content.text}}
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none q-ma-md">
            <div
              class="text-caption text-grey"
              v-if="topic.progression && topic.progression.last_interaction"
            >
              Letzter Besuch: {{topic.progression.last_interaction | formatTimeLeft}}
            </div>
          </q-card-section>
        </q-card>
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "VAATopicSelector",
  props: ["topicID", "disabled", "nofSalienceUncompleted"],
  inject: ["CONTENTTREE"],
  computed: {
    topics() {
      var elements = [];
      this.CONTENTTREE.rootElements.forEach((x) => {
        elements = this.$pushSorted(elements, x);
      });

      return elements;
    },

    value() {
      return this.topicID ? parseInt(this.topicID) : "index";
    },

    // vaacolor() {
    //   const color = this.public_profile ? this.public_profile.CO : "grey";
    //   return color;
    // },

    nof_contents_to_peerreview() {
      if (!this.$loaded(this.contents_to_peerreview)) {
        return null;
      }

      const to_respond = Object.values(this.contents_to_peerreview).filter(
        (peerreviews) => !this.$loaded(peerreviews[0].progression.response)
      );

      return to_respond.length;
    },

    nof_peerreview_assigned() {
      if (!this.$loaded(this.contents_to_peerreview)) {
        return null;
      }

      return Object.keys(this.contents_to_peerreview).length;
    },

    contents_to_peerreview() {
      if (!this.topicID) {
        return {};
      }

      const peerreviews = this.get_user_peerreviews_by_parent_and_content;
      if (!this.$loaded(peerreviews)) {
        return null;
      }

      if (this.topicID && peerreviews[this.topicID]) {
        return peerreviews[this.topicID];
      } else {
        return {};
      }
    },

    ...mapGetters({
      get_user_peerreviews_by_parent_and_content:
        "peerreviewstore/get_user_peerreviews_by_parent_and_content",
    }),
  },

  methods: {
    input(topicID) {
      this.$emit("input", topicID == "index" ? null : topicID);
    },
  },
};
</script>