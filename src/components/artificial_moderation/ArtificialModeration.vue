<style lang="sass">
.artificialmoderation

  .q-message-avatar
    width: 98px
    height: 138px

  .q-message-text
    color: #EEE !important

  // .q-chip
  //   der: 1px solid black
  //   background-color: #EEE !important

.tooltip
  max-width: 251px

/* .noTextPadding  */
.q-message-text
  padding-bottom: 0.7em
  padding-top: 0.7em

.q-message-text:not(:last-child)
  padding-bottom: 0.5em

.q-message-text:not(:first-child)
  padding-top: 0.5em
</style>

<template>
  <div
    v-if="AMpatched && Object.values(AMpatched).length"
    :align="alignment"
    :class="['full-width', slim && $q.screen.gt.xs ? '' : 'q-mb-xl']"
  >
    <div
      v-if="
    enabled
    &&
    (!noContent
    ||
    loading)"
      align="left"
      style="max-width:450px;"
    >
      <q-chat-message
        size=7
        :text="loading ? [] : text"
        :sent="alignment=='left' ? false : true"
        :class="['artificialmoderation', actorClass, noTextPadding ? 'noTextPadding' : ''] "
      >
        <template v-if="loading">
          <q-spinner-dots size="2rem" />
        </template>

        <template v-slot:avatar>
          <div style="z-index: 5; height: 85px;">
            <!-- v-model="tooltip_shown" -->
            <q-tooltip
              content-class="tooltip"
              anchor="bottom middle"
            >{{tooltip}}</q-tooltip>
            <img
              :src="avatar"
              style="position:relative;"
              aria-hidden="true"
              class="q-message-avatar q-message-avatar--sent"
            />
          </div>
        </template>

      </q-chat-message>
      <div
        :class="['artificialmoderation', actorClass, 'full-width']"
        :style="`text-align:${alignmentForced}; padding-${alignmentForced}:100px`"
        v-if="buttons && !loading"
      >
        <q-btn
          v-for="(item, index) in buttons"
          :key="index"
          class="q-ma-xs"
          :icon="item.icon"
          :size="item.size ? item.size : 'md'"
          :style="actor == 1 ? 'background-color:#776d58' : 'background-color:#1d496d'"
          rounded
          text-color="white"
          @click="item.action(ctx)"
          :label="item.label ? item.label(ctx) : '...'"
        />

      </div>
    </div>
  </div>
</template>


<script>
import { mapGetters, mapActions } from "vuex";

/** EXAMPLE OF A AM-CONFIGURATION OBJECT
  topics_after_saliencing: {
    condition: (ctx) => ctx.routed_stage,
    items: [
      {
        body: `Sie sehen hier nun Ihre persönliche Prioritätenliste der Wahlthemen. Sind Sie mit Ihrer Priorisierung vorerst einmal einverstanden?`,
        condition: (ctx) => ctx.salienceCompleted,
        buttons: [
          {
            action: (ctx) => ctx.next_scheduled_stage(),
            label: 'Ja, wir können weiterfahren!'
            // icon: null,
            // icon_rigth: null,
          }
        ]
      }
    ]
  }
 * 
 */
const numberOfActors = 2;
// TODO: AMcache does only work with one AM per page...
export default {
  /*
  Variables:
  "this.amGroup" -Prop allows to specify whether the ArtificialModerators are played by
    distinct actors or the same actors. (If not specified, it is a random choice)
  */

  data() {
    return {
      AMpatched: null,
    };
  },

  props: {
    AM: {
      // AM Configuration Data-Object (see above)
      type: [Array, Object],
      required: true,
    },
    AMs: Array,
    ctx: {
      // Context, where all the required varaibles are defiend. (passed to ongoing, condition ete. functions)
      type: Object,
      required: true,
    },
    slim: {
      // low margins around the AM
      type: Boolean,
      default: false,
    },
    noTextPadding: {
      // low margins around the AM
      type: Boolean,
      default: false,
    },
    alignment: {
      // right, left, center
      type: String,
      default: "left",
      validator(value) {
        return ["left", "center", "right"].indexOf(value) !== -1;
      },
    },

    amGroup: {
      /* Constant-Random-Allocate the actors to the AM-Roles
      For doing that calculate a constant number depending on the global random seed (localstorage) and the name
      of the context(ctx)-component (the component where the AM is displayed.)
      => For each visitor and each component the allocation of actors to the Am-roles varies
      randomly. (However, the allocation remains constant over time, browser-instance and page-reloads.)
      */
      default: null,
      type: String,
    },
    role: {
      default: 1,
      required: false,
      type: Number,
    },
    fixedActor: {
      default: null,
      type: Number,
    },
  },

  computed: {
    enabled() {
      return (
        this.AMpatched &&
        (!this.AMpatched.condition || this.AMpatched.condition(this.ctx))
      );
    },

    tooltip() {
      const name = this.$t(`am.actor.${this.actor}`);
      return this.$t(`am.tooltip.${this.actor}`, { actor: name });
    },

    alignmentForced() {
      // dont allo "center" here
      return this.alignment == "left" ? "left" : "right";
    },

    loading() {
      return (
        this.AMpatched &&
        this.AMpatched.loading &&
        this.AMpatched.loading(this.ctx)
      );
    },

    /* A key that allows to identify a certain AM Instance */
    cacheKey() {
      // _${this.role}: role must be variable always...
      return `${this.ctx.$options.name}_${this.AMpatched.id}`;
    },

    /* Calculates a seed (number) that is individual for given user and AM-Group. */
    seed: function () {
      // 1: get a string that is constant for current AM-group
      let randomSeedBase;
      // if amGroup is indicated: this is the seedBase
      if (this.amGroup) {
        // random role allocation within group
        randomSeedBase = this.amGroup;
      } else {
        if (this.role) {
          // if component name is availbale, take it as seedBase
          // if nothing is indicated: take a individual-level random seedbase
          randomSeedBase = this.ctx.$options.name;
        } else {
          // full random: // is this used?
          randomSeedBase =
            this.ctx.$options.name + JSON.stringify(this.AMpatched);
        }
      }
      // calculate a user-specific number by the seedBase string
      let seed = 0;
      for (var i = 0; i < randomSeedBase.length; i++) {
        seed += randomSeedBase.charCodeAt(i);
      }

      // add also a user-constant random number
      return Math.round(
        ((parseInt(this.randomLocalStorageSeed) + seed) * 3) / 2
      );
    },

    actor: function () {
      // Lets do the allocation of AM-roles and avatars based on the user-random seed.
      if (this.fixedActor) {
        return this.fixedActor;
      }
      const allocationShift = this.seed % numberOfActors;
      return ((this.role + allocationShift) % numberOfActors) + 1;
    },

    // Which is the displayed name of the Actor?
    actorName: function () {
      return this.$i18n.t(`am.actor.${this.actor}`);
    },

    // Which is the gender of the displayed Actor?
    actorGender: function () {
      return this.$i18n.t(`am.gender.${this.actor}`);
    },

    // Name of Partner AM
    actorPartner: function () {
      // console.log("kkk", this.alternate(this.actor));
      return this.$i18n.t(`am.actor.${this.alternate(this.actor)}`);
    },

    // How this AM refers to the other one?
    actorPartnerReference: function () {
      // console.log(this.actorGender, this.actorPartner, "lll");
      const partnerGender = this.$i18n.t(
        `am.gender.${this.alternate(this.actor)}`
      );
      return this.$i18n.tc(`am.reference`, partnerGender, {
        actorPartner: this.actorPartner,
      });
    },

    actorClass: function () {
      return `artificialmoderator${this.actor}`;
    },

    // Which is the displayed avatar of the AM-Actor?
    avatar: function () {
      let path = require(`src/assets/actor${this.actor}.png`);
      return path;
    },

    invAlignment: function () {
      if (this.alignment == "left") {
        return "right";
      }
      if (this.alignment == "rigth") {
        return "left";
      }
      return this.alignment;
    },

    validItems() {
      return this.AMpatched.items.filter(
        (item) =>
          !item.condition || item.condition(this.ctx, { role: this.role })
      );
    },

    validMaxPriorityItems() {
      if (!this.validItems) {
        return [];
      }

      // get max priorities
      const priorities = this.validItems.map((item) =>
        item.priority ? item.priority : 0
      );
      const max = Math.max(...priorities);
      // console.log("MAXX: ", max, priorities);
      if (!max || max < 1) {
        return this.validItems;
      }

      return this.validItems.filter((item) => max === item.priority);
    },

    selectedItem() {
      if (!this.AMpatched || this.loading) {
        // not yet loaded
        return;
      }
      if (!this.validItems.length) {
        // console.log("::::SELECT AMs", "no valid items");
        return null;
      }

      // CACHE
      const itemId = this.getAMCache(this.cacheKey);
      if (itemId) {
        const cachedItem = this.validMaxPriorityItems.find(
          (item) => item.id === itemId
        );
        if (cachedItem) {
          // selected item by cache
          console.log("selected item by cache...");
          return cachedItem;
        }
      }

      // RANDOM DRAW
      // randomly select one item!
      // console.log("RANDOM DRAW", this.validMaxPriorityItems);
      const selected = this.$sample(this.validMaxPriorityItems);
      console.log("SELECTED", selected.id, selected);
      return selected;
    },

    text() {
      if (!this.selectedItem) {
        return [];
      }

      const body = this.selectedItem.body(this.ctx, {
        actorName: this.actorName,
        actorGender: this.actorGender,
        actorPartner: this.actorPartner,
        actorPartnerReference: this.actorPartnerReference,
      });

      // if (!body) {
      //   return null;
      // }

      // string or list of strings.
      if (Array.isArray(body)) {
        // filter empty values
        return body.filter((x) => x && x.length > 0);
        //console.log("mm", body2, body)
        //return body2;
      }

      return [body];
    },

    noContent() {
      // console.log(this.text, "ll")
      return this.text?.length === 0;
    },

    buttons() {
      if (!this.selectedItem) {
        return [];
      }

      var buttons = [];
      if (this.selectedItem.buttons?.length) {
        this.selectedItem.buttons.forEach((button) => {
          if (button && (!button.condition || button.condition(this.ctx))) {
            buttons.push(button);
          }
        });
      }

      if (this.AMpatched.buttons && this.AMpatched.buttons.length) {
        this.AMpatched.buttons.forEach((button) => {
          if (button && (!button.condition || button.condition(this.ctx))) {
            buttons.push(button);
          }
        });
      }

      // console.log("AM buttons", buttons);
      return buttons;
    },

    ...mapGetters({
      randomLocalStorageSeed: "publicprofilestore/randomLocalStorageSeed",
      // TODO use runtime store for am cache...
      getAMCache: "publicprofilestore/getAMCache",
    }),
  },

  /* What to do when AM changes. */
  watch: {
    selectedItem(item, olditem) {
      // update cache
      // console.log(item);
      const itemId = item ? item.id : null;
      this.setAMCache({ cacheKey: this.cacheKey, itemId });

      // emit event
      this.$emit("am-change", { item, text: this.text.join("") });
    },
  },

  methods: {
    mergeAMs(AM1, AM2) {
      // TODO: is this used???
      // console.assert(this.AM.length === 2); // only two AMs are possible to merge
      const AM = JSON.parse(JSON.stringify(AM1));
      AM.items = AM1.items.concat(AM2.items);
      if (AM2.buttons) {
        if (AM1.buttons) {
          AM.buttons = AM1.buttons.concat(AM2.buttons);
        } else {
          AM.buttons = AM2.buttons;
        }
      }
      // TOOD: proper merge root level conditions....
      return AM;
    },

    alternate(role) {
      if (role == 2) {
        return 1;
      } else {
        return 2;
      }
    },

    ...mapActions({
      setAMCache: "publicprofilestore/setAMCache",
    }),
  },

  created() {
    this.AMpatched = Array.isArray(this.AM)
      ? this.mergeAMs(this.AM[0], this.AM[1])
      : this.AM;

    if (
      !this.AMpatched ||
      !Object.values(this.AMpatched).length ||
      !this.AMpatched.items.length
    ) {
      console.log(
        "Artificial Moderator did not receive any instructions. AM is empty..."
      );
    }
  },
};
</script>
