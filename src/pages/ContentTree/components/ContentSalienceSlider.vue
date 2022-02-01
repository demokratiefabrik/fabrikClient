<template>
  <!-- :style="{'background-color': backgroundColor}" -->
  <!-- // ContentSalienceSlider -->
  <div class="q-pa-md full-width" :class="noneResponse ? 'bg-orange-4' : ''">
    {{ instruction }}

    <q-list dense class="q-mt-lg">
      <q-item>
        <q-item-section side v-if="$q.screen.gt.xs"> Unwichtig </q-item-section>
        <q-item-section side v-else> 0 </q-item-section>
        <q-item-section>
          <q-slider
            v-model="value"
            :min="min"
            :max="max"
            @change="debouncedInitSet"
            label-always
            :label-value="getSlideLabel"
            :style="{ color: getSlideColor }"
          />
        </q-item-section>
        <q-item-section side v-if="$q.screen.gt.xs">
          Sehr wichtig
        </q-item-section>
        <q-item-section side v-else> 100 </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { debounce } from 'quasar';
import { mapActions } from 'vuex';
import constants from 'src/utils/constants';
import { colors } from 'quasar';
import useLibraryComposable from 'src/utils/library';
import { INode } from 'src/composables/contenttree.composable';
import useMonitorComposable from 'src/composables/monitor.composable';
const { rgbToHex } = colors;

export default defineComponent({
  setup() {
    const { monitorLog } = useMonitorComposable();
    const { loaded } = useLibraryComposable();
    // const debouncedInitSet: null | (() => void) = () => void
    const debouncedInitSet: null | (() => void) = () => undefined;
    return { loaded, debouncedInitSet, monitorLog };
  },
  name: 'ContentSalienceSlider',
  props: {
    content: {},
    instruction: {},
    scaleLabel: {
      default: () => [
        'Unwichtig',
        'Eher unwichtig',
        'Mittelmässsig',
        'Eher wichtig',
        'Sehr wichtig',
      ],
    },
  },
  data() {
    return {
      progression_salience: null,
      min: 0,
      max: 100,
    };
  },

  computed: {
    value: {
      get: function () {
        return this.noneResponse ? 50 : this.progression_salience;
      },
      set: function (value) {
        this.progression_salience = value;
      },
    },

    colorRange() {
      return this.max - this.min;
    },

    getSlideLabel() {
      if (this.noneResponse || this.scale100 === null) {
        return 'Bitte wählen';
      }

      const value = Math.round(
        (this.scale100 / 100) * (this.scaleLabel.length - 1)
      );
      return `${this.scaleLabel[value]} | ${Math.round(this.scale100)}`; // PERCENT
    },

    scale100() {
      if (this.progression_salience !== null) {
        return (100 / this.colorRange) * (this.progression_salience - this.min);
      }

      return null;
    },

    getSlideColor() {
      if (this.noneResponse || this.scale100 === null) {
        return 'grey';
      }
      const color = rgbToHex({
        r: Math.round((100 - this.scale100) * 2.24),
        g: Math.round((100 - this.scale100) * 2.02),
        b: 60,
      });
      return color;
    },
    noneResponse() {
      return (
        this.progression_salience === null ||
        this.progression_salience === undefined
      );
    },

    realSalience() {
      return (this.content as INode)?.progression?.salience;
    },
  },

  methods: {
    initSet() {
      // console.log("SET NEW VALUE");
      // INIT Salience Monitor
      if (!this.loaded(this.progression_salience)) {
        // console.log("NULL RATING")
        return null;
      }

      const data = {
        contentID: (this.content as INode).content.id,
        salience: this.progression_salience,
        topicID: (this.content as INode)?.path
          ? (this.content as INode).path[0]
          : null,
      };
      this.monitorLog(constants.MONITOR_SET_SALIENCE, data);

      // immediatly update saliences in vuex store (=> allows to update the dynamically generated charts)
      this.update_salience({
        contenttreeID: (this.content as INode).content.contenttree_id,
        contentID: (this.content as INode).content.id,
        topicID: (this.content as INode).path?.length
          ? (this.content as INode).path[0]
          : null,
        salience: this.progression_salience,
      });

      this.$emit('item-saliencing', this.content);
    },

    ...mapActions('contentstore', ['update_salience']),
  },

  created() {
    this.debouncedInitSet = debounce(this.initSet, 1200);
  },

  mounted: function () {
    this.progression_salience = (this.content as INode)?.progression?.salience;
  },

  watch: {
    realSalience(val) {
      this.progression_salience = val;
    },
  },
});
</script>
