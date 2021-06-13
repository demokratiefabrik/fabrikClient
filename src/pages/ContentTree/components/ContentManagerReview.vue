<template>

  <q-card-section
    vertical
    align="center"
    margin="0px"
    class="q-pa-sm q-ma-none  cursor-pointer"
  >

    <q-btn
      padding="0px"
      v-model="content_reviewed"
      :icon="buttonIcon"
      :color="buttonColor"
      size="1.4em"
      @click="initSet"
    />
    <q-card-section class="q-pa-none q-ma-none bg-none">
      {{ buttonLabel}}
    </q-card-section>
  </q-card-section>

</template>

<script>
import { mapActions } from "vuex";
// import { debounce } from "quasar";
import constants from "src/utils/constants";

export default {
  name: "ContentManagerReview",
  props: ["content"],
  data() {
    return {
      // TODO: do we need zero as starting value?
      content_reviewed: false,
    };
  },

  computed: {
    buttonIcon() {
      return this.content_reviewed ? "mdi-check" : "mdi-file-find-outline";
    },
    buttonColor() {
      return this.content_reviewed ? "green" : "yellow";
    },
    buttonLabel() {
      return this.content_reviewed ? "Geprüft" : "Prüfung Ausstehend";
    },
  },

  methods: {
    initSet() {
      this.content_reviewed = !this.content_reviewed;

      const data = {
        contentID: this.content.content.id,
        reviewed: this.content_reviewed,
      };
      console.log("new review data received...", this.content_reviewed);
      this.$root.monitorLog(constants.MONITOR_SET_CONTENT_REVIEWED, data);

      // immediatly update flag in vuex store
      this.update_review({
        contenttreeID: this.content.content.contenttree_id,
        contentID: this.content.content.id,
        reviewed: this.content_reviewed,
      });
    },

    ...mapActions("contentstore", ["update_review"]),
  },

  // created() {
  //   this.debouncedInitSet = debounce(this.initSet, 500);
  // },

  mounted: function () {
    if (this.content) {
      this.content_reviewed = this.content.content.reviewed;
    }
  },
};
</script>
