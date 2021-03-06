<template>

  <!-- :style="{'background-color': backgroundColor}" -->
  <!-- // ContentSalienceSlider -->
  <div
    class="q-pa-md full-width"
    :class="noneResponse ? 'bg-orange-4' : ''"
  >

    {{instruction}}

    <q-list
      dense
      class="q-mt-lg"
    >

      <q-item>
        <q-item-section
          side
          v-if="$q.screen.gt.xs"
        >
          Unwichtig
        </q-item-section>
        <q-item-section
          side
          v-else
        >
          0
        </q-item-section>
        <q-item-section>
          <q-slider
            v-model="value"
            :min="min"
            :max="max"
            @change="debouncedIniSet"
            label-always
            :label-value="getSlideLabel"
            :style="{color: getSlideColor}"
          />
        </q-item-section>
        <q-item-section
          side
          v-if="$q.screen.gt.xs"
        >
          Sehr wichtig
        </q-item-section>
        <q-item-section
          side
          v-else
        >
          100
        </q-item-section>

      </q-item>

    </q-list>
  </div>

</template>

<script>
import { debounce } from "quasar";
import { mapActions } from "vuex";
import constants from "src/utils/constants";
import { colors } from "quasar";
const { rgbToHex } = colors;

export default {
  name: "ContentSalienceSlider",
  props: {
    content: {},
    instruction: {},
    scaleLabel: {
      default: () => [
        "Unwichtig",
        "Eher unwichtig",
        "Mittelmässsig",
        "Eher wichtig",
        "Sehr wichtig",
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
      if (this.noneResponse) {
        return "Bitte wählen";
      }
      const value = Math.round(
        (this.scale100 / 100) * (this.scaleLabel.length - 1)
      );
      return `${this.scaleLabel[value]} | ${Math.round(this.scale100)}`; // PERCENT
    },

    scale100() {
      return (100 / this.colorRange) * (this.progression_salience - this.min);
    },

    getSlideColor() {
      if (this.noneResponse) {
        return "grey";
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
      return this.content?.progression?.salience;
    },
  },

  methods: {
    initSet() {
      // console.log("SET NEW VALUE");
      // INIT Salience Monitor
      if (!this.$loaded(this.progression_salience)){
        // console.log("NULL RATING")
        return null;
      }

      const data = {
        contentID: this.content.content.id,
        salience: this.progression_salience,
        topicID: this.content?.path ? this.content.path[0] : null,
      };
      this.$root.monitorLog(constants.MONITOR_SET_SALIENCE, data);

      // immediatly update saliences in vuex store (=> allows to update the dynamically generated charts)
      this.update_salience({
        contenttreeID: this.content.content.contenttree_id,
        contentID: this.content.content.id,
        topicID: this.content.path?.length ? this.content.path[0] : null,
        salience: this.progression_salience,
      });

      this.$emit("item-saliencing", this.content);
    },

    ...mapActions("contentstore", ["update_salience"]),
  },

  created() {
    this.debouncedIniSet = debounce(this.initSet, 1200);
  },

  mounted: function () {
    this.progression_salience = this.content?.progression?.salience;
  },

  watch: {
    realSalience(val) {
      this.progression_salience = val;
    },
  },
};
</script>
