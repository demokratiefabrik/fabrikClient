<template>
  <!-- class="q-pa-none q-ma-none" -->
  <!-- <div
    style="display:inline-block"
    class="vertical-bottom "
  > -->

  <q-card-section
    vertical
    align="center"
    margin="0px"
    class="q-pa-sm q-ma-none cursor-pointer"
  >
    <q-btn-toggle
      padding="0px"
      label="Bewertung"
      v-model="progression_rating"
      unelevated
      size="1.4em"
      @input.capture="debouncedInitSet"
      :options="buttons"
    >
      <template v-for="button in buttons" v-slot:[button.slot] :key="button.value">
        <q-icon :name="button.ratingicon">
          <q-tooltip>{{
            $t(`contenttree.rating.${button.tooltipNr}`)
          }}</q-tooltip>
        </q-icon>
      </template>
    </q-btn-toggle>
    <q-card-section class="q-pa-none q-ma-none bg-none">
      Bewertung
    </q-card-section>
  </q-card-section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';
import { debounce } from 'quasar';
import constants from 'src/utils/constants';

export default defineComponent({
  // setup() {},
  name: 'ContentRatingThumbs',
  props: ['content'],
  data() {
    return {
      // TODO: do we need zero as starting value?
      progression_rating: 50,
      buttons: [
        {
          value: 0,
          slot: 'one',
          toggleColor: 'red',
          textColor: 'grey-7',
          ratingicon: 'mdi-emoticon-sad-outline',
          tooltipNr: 1,
        },
        {
          value: 50,
          slot: 'two',
          toggleColor: 'orange',
          textColor: 'grey-7',
          ratingicon: 'mdi-emoticon-neutral-outline',
          tooltipNr: 2,
        },
        {
          value: 100,
          slot: 'three',
          toggleColor: 'green',
          textColor: 'grey-7',
          ratingicon: 'mdi-emoticon-happy-outline',
          tooltipNr: 3,
        },
      ],
    };
  },

  computed: {
    noneResponse() {
      return (
        this.progression_rating === null ||
        this.progression_rating === undefined
      );
    },
  },

  methods: {
    initSet() {
      const data = {
        contentID: this.content.content.id,
        topicID: this.content?.path ? this.content.path[0] : null,
        rating: this.progression_rating,
      };
      console.log('new rating received...', this.progression_rating);
      this.$root.monitorLog(constants.MONITOR_SET_RATING, data);
      // this.$root.monitorLog(constants.MONITOR_SET_CONTENT_DISCUSSED, data);

      // immediatly update saliences in vuex store (=> allows to update the dynamically generated charts)
      // console.log("update local storage => rating")
      this.update_rating({
        contenttreeID: this.content.content.contenttree_id,
        contentID: this.content.content.id,
        topicID: this.content.path?.length ? this.content.path[0] : null,
        rating: this.progression_rating,
      });
    },

    ...mapActions('contentstore', ['update_rating']),
  },

  created() {
    this.debouncedInitSet = debounce(this.initSet, 1200);
  },

  mounted: function () {
    if (this.content && this.content.progression) {
      this.progression_rating = this.content.progression.rating;
    }
  },
});
</script>
