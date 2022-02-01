<style>
/* body.screen--xs  */
</style>

<template>
  <div v-if="items">
    <div
      style="
        top: 120px;
        right: 0px;
        max-width: 150px;
        position: fixed;
        background: rgba(255, 255, 255, 0.3);
      "
    >
      <!-- <q-menu content-class="bg-purple text-white" auto-close> -->
      <q-list>
        <q-item
          v-for="item in items"
          :key="item.label"
          clickable
          :disable="enabledAnchors && !enabledAnchors.includes(item.anchor)"
          :class="{
            'q-pa-none': $q.screen.lt.sm,
            'q-ma-none': $q.screen.lt.sm,
            hidden: item?.visible && !item?.visible(),
          }"
          :style="
            selectedItemsAnchor.includes(item.anchor) ? selectedStyle : ''
          "
          @click="scrollToAnchor(item.anchor)"
          v-ripple
        >
          <q-item-section
            v-if="$q.screen.lt.sm"
            style="width: 0.6em; border-top: 1px solid #ccc"
            :class="{
              'bg-grey-3': !selectedItemsAnchor.includes(item.anchor),
              'bg-blue-3': selectedItemsAnchor.includes(item.anchor),
              'q-pa-none': true,
              'q-ma-none': true,
            }"
            >&nbsp;
            <q-icon
              v-if="highlightedItem && highlightedItem.anchor == item.anchor"
              style="position: absolute; right: 0px"
              color="blue"
              name="mdi-account-supervisor-circle"
              size="sm"
            ></q-icon>
          </q-item-section>

          <q-item-section v-if="$q.screen.lt.md && $q.screen.gt.xs">
            <q-icon
              dense
              :class="
                selectedItemAnchor == item.anchor ? '' : 'bg-white q-pa-xs'
              "
              :name="
                selectedItemAnchor == item.anchor
                  ? 'mdi-checkbox-blank-circle'
                  : 'mdi-checkbox-blank-circle-outline'
              "
            >
              <q-icon
                v-if="highlightedItem && highlightedItem.anchor == item.anchor"
                style="position: absolute; left: 12px; top: -5px"
                color="blue"
                name="mdi-account-supervisor-circle"
                size="sm"
              ></q-icon>
              <q-tooltip
                anchor="center left"
                self="center right"
                :offset="[10, 10]"
                content-class="tooltip"
                >{{ item.label }}</q-tooltip
              >
            </q-icon>
          </q-item-section>

          <q-item-section v-if="$q.screen.gt.sm">
            <q-item-label v-if="item.caption" style="width: 150px" caption
              >{{ item.caption }}
            </q-item-label>

            <q-item-label>
              {{ item.label }}
            </q-item-label>
            <q-icon
              v-if="highlightedItem && highlightedItem?.anchor == item.anchor"
              style="position: absolute; right: 2px"
              color="blue"
              name="mdi-account-supervisor-circle"
              size="sm"
            ></q-icon>
          </q-item-section>

          <!-- <div
            v-if="highlightedItem && highlightedItem.anchor == item.anchor"
            class="q-tab__alert text-blue "
            style="position:absolute; left:5px;"
          ></div> -->
        </q-item>
      </q-list>
    </div>
    <q-scroll-observer @scroll="onScroll" debounce="300" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { mapGetters } from 'vuex';
import { dom } from 'quasar';

// import { colors } from 'quasar';
import useAppComposable from 'src/composables/app.composable';
import {
  ISideMenuItems,
  ISideMenuItem,
} from 'src/pages/Assembly/AssemblyManageSummary.vue';

// const { changeAlpha } = colors;
const { offset } = dom;

export default defineComponent({
  setup() {
    const { headerOffset, scrollToAnchor } = useAppComposable();
    return { headerOffset, scrollToAnchor };
  },
  name: 'SideMenu',
  props: {
    items: Array as PropType<ISideMenuItems>,
    highlightedItem: Object as PropType<ISideMenuItem>,
  },
  data() {
    return {
      scrollSelectedItemAnchor: null as string | null,
      fixedSelectedItemAnchor: null,
      enabledAnchors: undefined as string[] | undefined,
      // step: null,
    };
  },
  computed: {
    selectedItemAnchor() {
      return this.fixedSelectedItemAnchor
        ? this.fixedSelectedItemAnchor
        : this.scrollSelectedItemAnchor;
    },

    selectedItemsAnchor() {
      // it is possible that two are selected: onclick event!
      return [this.fixedSelectedItemAnchor, this.scrollSelectedItemAnchor];
    },

    selectedStyle() {
      const color = this.public_profile ? this.public_profile.CO : 'grey';
      return `background-color: ${color}; color:#fff;`;
    },

    itemAnchors() {
      return this.items?.map((item) => item.anchor);
    },

    ...mapGetters({
      public_profile: 'publicprofilestore/get_public_profile',
    }),
  },
  methods: {
    onScroll() {
      this.scrollSelectedItemAnchor = this.getSelectedItemAnchor();
    },

    getEnabledAnchors() {
      const anchors = this.itemAnchors;
      return anchors?.filter((anchor) => !!document.getElementsByName(anchor));
    },

    refresh() {
      this.enabledAnchors = this.getEnabledAnchors();
    },

    getSelectedItemAnchor() {
      const anchors = JSON.parse(JSON.stringify(this.itemAnchors));
      anchors.reverse();
      var selected = anchors.find((anchor) => {
        const dom = document.getElementsByName(anchor);
        return (
          dom &&
          dom?.item(0) &&
          offset(dom.item(0)).top < this.headerOffset + 350
        );
      });
      if (!selected) {
        return anchors[anchors.length - 1];
      }
      return selected;
    },
  },

  mounted() {
    if (this.items?.length && this.items[0].anchor) {
      // console.log(this.items[0]);
      this.scrollSelectedItemAnchor = this.items[0].anchor;
      this.enabledAnchors = this.getEnabledAnchors();
    }
  },
});
</script>
