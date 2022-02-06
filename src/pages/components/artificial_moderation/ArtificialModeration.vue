<style lang="sass">
.artificialmoderation

  .q-message-avatar
    width: 98px
    height: 138px

  .q-message-text
    color: #EEE !important

.tooltip
  max-width: 251px

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
      v-if="enabled && (!noContent || loading)"
      align="left"
      style="max-width: 450px"
    >
      <q-chat-message
        size="7"
        v-if="!loading"
        :text="text"
        :sent="alignment == 'left' ? false : true"
        :class="[
          'artificialmoderation',
          actorClass,
          noTextPadding ? 'noTextPadding' : '',
        ]"
      >
        <template v-slot:default v-if="loading">
          <q-spinner-dots size="2rem" v-if="loading" />
        </template>

        <template v-slot:avatar>
          <div style="z-index: 5; height: 85px">
            <!-- v-model="tooltip_shown" -->
            <q-tooltip content-class="tooltip" anchor="bottom middle">{{
              tooltip
            }}</q-tooltip>
            <img
              :src="avatar"
              style="position: relative"
              aria-hidden="true"
              class="q-message-avatar q-message-avatar--sent"
            />
          </div>
        </template>
      </q-chat-message>

      <div
        :class="['artificialmoderation', actorClass, 'full-width']"
        :style="`text-align:${alignmentForced}; padding-${alignmentForced}:100px`"
        v-if="buttons && buttons.length && !loading"
      >
        <q-btn
          v-for="(button, index) in buttons"
          :key="index"
          class="q-ma-xs"
          :icon="button.icon ? button.icon : undefined"
          :size="button.size ? button.size : 'md'"
          :style="
            actor == 1 ? 'background-color:#776d58' : 'background-color:#1d496d'
          "
          rounded
          text-color="white"
          @click="button.action(ctx)"
          :label="button.label ? button.label(ctx) : '...'"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// import { mapGetters } from 'vuex';
import { defineComponent, PropType, ComponentPublicInstance } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { IArtificialModeration, IArtificialModerationButton, IArtificialModerationGroup } from './model';

/** EXAMPLE OF A AM-CONFIGURATION OBJECT
  topics_after_saliencing: {
    condition: (ctx) => ctx.routed_stage,
    items: [
      {
        body: `Sie sehen hier nun Ihre persönliche Prioritätenliste der Wahlthemen. Sind Sie mit Ihrer Priorisierung vorerst einmal einverstanden?`,
        condition: (ctx) => ctx.salienceCompleted,
        buttons: [
          {
            action: (ctx) => ctx.nextScheduledStage(),
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

// interface IArtificialModerationSet{
//   buttons: IArtificialModerationButton[];
//   items: IArtificialModeration[]
// }

const numberOfActors = 2;
// TODO: AMcache does only work with one AM per page...
export default defineComponent({
  /*
  Variables:
  "this.amGroup" -Prop allows to specify whether the ArtificialModerators are played by
    distinct actors or the same actors. (If not specified, it is a random choice)
  */
  // setup() {
  //   return {};
  // },
  data() {
    return {
      AMpatched: null as null | IArtificialModerationGroup,
    };
  },

  props: {
    ctx: {
      // Context, where all the required varaibles are defiend. (passed to ongoing, condition ete. functions)
      type: Object as PropType<ComponentPublicInstance>,
      required: true,
    },
    AM: {
      type: Object as PropType<IArtificialModeration>,
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
      type: String as PropType<'left' | 'center' | 'right'>,
      default: 'left',
      // validator(value: string): boolean {
      //   return ['left', 'center', 'right'].includes(value)
      // },
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
    enabled(): boolean {
      // console.log(this.ctx);
      const response = true;
      // const response = !this.AMpatched?.condition || this.AMpatched.condition(this.ctx);
      return response;
    },

    tooltip(): string {
      const name = this.$t(`am.actor.${this.actor}`);
      return this.$t(`am.tooltip.${this.actor}`, { actor: name });
    },

    alignmentForced(): 'left' | 'right' | 'center' {
      // dont allo "center" here
      return this.alignment === 'left' ? 'left' : 'right';
    },

    loading(): boolean | undefined {
      if (this.AMpatched) {
        // const response =
        //   this.AMpatched.loading && this.AMpatched.loading(this.ctx);
        // return response;
        // console.log(this.AMpatched.loading)
      }
      return undefined;
    },

    /* A key that allows to identify a certain AM Instance */
    cacheKey(): string | undefined {
      if (this.AMpatched) {
        const prefix = this.ctx.$options.name;
        const suffix = this.AMpatched.id;
        // _${this.role}: role must be variable always...
        return `${prefix}_${suffix}`;
      }

      return undefined;
    },

    /* Calculates a seed (number) that is individual for given user and AM-Group. */
    seed(): number {
      // 1: get a string that is constant for current AM-group
      let randomSeedBase;
      // if amGroup is indicated: this is the seedBase
      if (this.amGroup) {
        // random role allocation within group
        randomSeedBase = this.amGroup;
      } else {
        if (this.role) {
          // if component name is availbale, take it as seedBase
          randomSeedBase = this.ctx.$options.name;
        } else {
          // if nothing is indicated: take a individual-level random seedbase
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
      const seedFloat =
        (((this.randomLocalStorageSeed as number) + seed) * 3) / 2;
      return Math.round(seedFloat);
    },

    actor(): number {
      // Lets do the allocation of AM-roles and avatars based on the user-random seed.
      if (this.fixedActor) {
        return this.fixedActor;
      }
      const b = this.seed as number;
      const allocationShift = b % numberOfActors;
      return ((this.role + allocationShift) % numberOfActors) + 1;
    },

    // Which is the displayed name of the Actor?
    actorName(): string {
      return this.$t(`am.actor.${this.actor}`);
    },

    // Which is the gender of the displayed Actor?
    // TODO: return "f" and "m" instead of '1' and '0'
    actorGender(): string {
      return this.$t(`am.gender.${this.actor}`);
    },

    // Name of Partner AM
    actorPartner(): string {
      // console.log("kkk", this.alternate(this.actor));
      return this.$t(`am.actor.${this.alternate(this.actor)}`);
    },

    // How this AM refers to the other one?
    actorPartnerReference(): string {
      // console.log(this.actorGender, this.actorPartner, "lll");
      const partnerGender = this.$t(`am.gender.${this.alternate(this.actor)}`);
      // const partnerGender = '1'
      return this.$t('am.reference', partnerGender, {
        actorPartner: this.actorPartner,
      });
    },

    actorClass(): string {
      return `artificialmoderator${this.actor}`;
    },

    // Which is the displayed avatar of the AM-Actor?
    avatar(): string {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      let path = require(`src/assets/actor${this.actor}.png`);
      return path;
    },

    invAlignment(): 'left' | 'right' | 'center' {
      if (this.alignment === 'left') {
        return 'right';
      }
      if (this.alignment === 'right') {
        return 'left';
      }
      return this.alignment;
    },

    validItems(): IArtificialModeration[] | undefined {
      if (this.AMpatched && this.AMpatched.items) {
        const items = this.AMpatched.items as IArtificialModeration[];
        return items.filter(
          (item) =>
            !item.condition || item.condition(this.ctx, { role: this.role })
        );
      }

      return undefined;
    },

    validMaxPriorityItems(): any[] {
      if (!this.validItems) {
        return [];
      }

      // get max priorities
      const items = this.validItems as IArtificialModeration[];
      const priorities = items.map((item) =>
        item.priority ? item.priority : 0
      );
      const max = Math.max(...priorities);
      // console.log("MAXX: ", max, priorities);
      if (!max || max < 1) {
        return items;
      }

      return items.filter((item) => max === item.priority);
    },

    selectedItem(): IArtificialModerationGroup | undefined {
      if (!this.AMpatched || this.loading || !this.validItems) {
        // not yet loaded
        return undefined;
      }

      // CACHE
      const getCacheKey = this.getAMCache as (string) => number;

      if (this.cacheKey) {
        const itemId = getCacheKey(this.cacheKey);
        if (itemId) {
          const items = this.validMaxPriorityItems as IArtificialModeration[];
          const cachedItem = items.find((item) => item.id === itemId);
          if (cachedItem) {
            // selected item by cache
            // console.log('selected item by cache...');
            return cachedItem;
          }
        }
      }

      // RANDOM DRAW
      if (this.validMaxPriorityItems.length) {
        const selected = this.$library.sample(this.validMaxPriorityItems);
        console.log('SELECTED', selected);
        return selected as IArtificialModeration;
      }

      return undefined;
    },

    text(): string[] | unknown {
      if (!this.selectedItem) {
        return [];
      }

      const body = (this.selectedItem as IArtificialModeration).body(this.ctx, {
        actorName: this.actorName,
        actorGender: this.actorGender,
        actorPartner: this.actorPartner,
        actorPartnerReference: this.actorPartnerReference,
      });

      // string or list of strings.
      if (Array.isArray(body)) {
        // filter empty values
        return body.filter((x) => x && x.length > 0);
      }

      return [body];
    },

    noContent(): boolean {
      // console.log(this.text, "ll")
      return !this.text || (this.text as string[]).length === 0;
    },

    buttons(): IArtificialModerationButton[] | undefined {
      if (!this.selectedItem) {
        return undefined;
      }

      var buttons: IArtificialModerationButton[] = [];
      const selectedItem = this.selectedItem as IArtificialModeration;
      if (selectedItem.buttons?.length) {
        selectedItem.buttons.forEach((button) => {
          if (button && (!button.condition || button.condition(this.ctx))) {
            buttons.push(button);
          }
        });
      }

      if (
        this.AMpatched &&
        this.AMpatched.buttons &&
        this.AMpatched.buttons.length
      ) {
        this.AMpatched.buttons.forEach((button) => {
          if (button && (!button.condition || button.condition(this.ctx))) {
            buttons.push(button);
          }
        });
      }

      // console.log("AM buttons", buttons);
      return buttons as IArtificialModerationButton[];
    },

    ...mapGetters({
      randomLocalStorageSeed: 'profilestore/randomLocalStorageSeed',
      // TODO use runtime store for am cache...
      getAMCache: 'profilestore/getAMCache',
    }),
  },

  /* What to do when AM changes. */
  watch: {
    selectedItem(item) {
      // update cache
      // console.log(item);
      if (item && this.text) {
        const itemId = item ? item.id : null;
        this.setAMCache({ cacheKey: this.cacheKey, itemId });

        // emit event
        const text = this.text as string[];
        this.$emit('am-change', { item, text: text.join('') });
      }
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

    //   testConfiguration() {

    //     if (this.AMpatched && this.AMpatched.items) {
    //       const items = this.AMpatched.items as IArtificialModeration[];
    //       return items.filter(
    //         (item) =>
    //           !item.condition || item.condition(this.ctx, { role: this.role })
    //       );

    //       console.log('AM TEST ABSOLVED...')
    //     }
    //   },

    ...mapActions({
      setAMCache: 'profilestore/setAMCache',
    }),
  },

  created() {
    this.AMpatched = Array.isArray(this.AM)
      ? this.mergeAMs(this.AM[0], this.AM[1])
      : this.AM;
    if (
      !this.AMpatched ||
      !Object.values(this.AMpatched).length ||
      !this.AMpatched?.items?.length
    ) {
      console.log(
        'DEBUG: Artificial Moderator did not receive any instructions. AM is empty...'
      );
    }
  },

  // mounted() {
  //   // TEST ONLY ON DEVELOPMENT SERVER
  //   // this.testConfiguration()
  // }
});
</script>
