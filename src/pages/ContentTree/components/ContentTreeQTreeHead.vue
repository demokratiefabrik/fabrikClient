<style scoped lang="sass">
@import 'src/css/quasar.variables.sass'

.highlightedDefault
  background-color: var(--profilecolor) !important

.backToDefault
  background-color: $primary-light !important
  transition: background 1s ease
</style>
<template>
  <q-card
    flat
    square
    @click.stop
    @keypress.stop
    class="cursor-pointer full-width q-ma-none q-pa-none"
    @click="$emit('toggle-node', node)"
    :class="{ highlightedDefault: highlightedNode }"
    :style="{
      cursor: 'default',
      'background-color': 'inherit',
      'border-top': '5px solid white',
    }"
  >
    <q-card-section
      v-if="node"
      class="q-ma-none q-pa-none"
      :class="{ backToDefault: highlightedNode }"
    >
      <div class="row items-center no-wrap">
        <div class="col">
          <!-- SHOW USER INFOS FOR PRIVATE CONTENT -->
          <div v-if="node.content?.private_property">
            <UserAvatar
              v-if="node.creator"
              :profile="node.creator"
            ></UserAvatar>

            <!-- transparent -->
            <q-badge
              color="blue"
              style="left: 17px; top: -10px"
              class="absolute"
              v-if="!isRead"
            >
              <!-- EXPANDABLE-ALL: v-if="isExpanded !== false" -->
              <q-tooltip
                >Dieser Beitrag haben Sie bisher noch nicht geöffnet.</q-tooltip
              >
              Neu </q-badge
            ><br />

            <span class="text-subtitle1">
              <!-- <q-icon :name="ICONS[node.content.type]"></q-icon> -->
              {{ node.content.title }}
              {{
                node.nof_descendants ? `(${node.nof_descendants})` : ''
              }} </span
            ><br />
          </div>

          <div v-else class="text-h5 q-pt-sm q-pl-none">
            <q-chip v-if="node.content?.type">
              <q-avatar color="grey" text-color="white">
                <q-icon :name="ICONS[node.content?.type]"></q-icon>
              </q-avatar>
              {{ TYPE_LABELS[node.content?.type] }}
            </q-chip>

            <span v-if="node.content?.type == 'UPDATEPROPOSAL'">
              <!-- <q-icon :name="ICONS[node.content.type]"></q-icon> -->
              vom {{ formatDate_node_content_date_created }}
              {{ node.nof_descendants ? `(${node.nof_descendants})` : '' }}
            </span>
            <span v-else>
              <!-- <q-icon :name="ICONS[node.content.type]"></q-icon> -->
              {{ node.content?.title }}
              {{
                node.nof_descendants ? `(${node.nof_descendants})` : ''
              }} </span
            ><br />
          </div>
        </div>

        <div class="col-auto vertical-top" v-if="node.content">
          <q-badge
            color="purple"
            v-if="node.content.disabled"
            size="lg"
            style="position: relative; top: -1em"
          >
            <q-tooltip
              >Dieser Beitrag wurde gelöscht. Er ist nur noch heute hier
              sichtbar.</q-tooltip
            >
            Gelöscht
          </q-badge>
          <q-badge
            color="grey"
            v-if="node.content?.rejected"
            size="lg"
            style="position: relative; top: -1em"
          >
            <q-tooltip
              >Dieser Beitrag wurde in einem Gutachten abgelehnt. Er ist nur
              noch heute hier sichtbar.</q-tooltip
            >
            Abgelehnt
          </q-badge>
          <span v-if="IsManager"> #{{ node.content?.id }} | </span>

          <span class="q-mr-xs">
            <span v-if="$q.screen.gt.md">
              {{ isExpanded ? 'EINKLAPPEN' : 'AUSKLAPPEN' }}
            </span>

            <q-icon
              right
              size="md"
              class="q-pa-none q-ma-none"
              :name="isExpanded ? 'mdi-chevron-down' : 'mdi-chevron-up'"
            />
            <!-- :name="isExpanded ? 'mdi-unfold-less-horizontal' : 'mdi-unfold-more-horizontal'" -->
            <q-tooltip v-if="!isExpanded"
              >Klicken Sie hier, um diesen Beitrag vollständig
              anzuzeigen.</q-tooltip
            >
            <q-tooltip v-if="isExpanded"
              >Klicken Sie hier um diesen Diskussionsast zu
              schliessen.</q-tooltip
            >
          </span>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { mapGetters } from 'vuex';
import UserAvatar from 'src/pages/components/UserAvatar.vue';
import constants from 'src/utils/constants';
import { INodeTuple } from 'src/models/content';

export default defineComponent({
  // setup() {},
  name: 'ContentTreeQTreeHead',
  props: {
    node: { type: Object as PropType<INodeTuple> },
    highlightedNode: { type: Boolean },
    isRead: { type: Boolean },
    isExpanded: { type: Boolean },
  },
  components: {
    UserAvatar,
  },
  // inject: ['toggle_node', 'is_currently_expanded', 'isRead'],
  data() {
    return {
      ICONS: constants.ICONS,
      TYPE_LABELS: constants.TYPE_LABELS,
    };
  },
  emits: ['is-currently-expanded', 'popup-content-form', 'toggle-node'],
  computed: {
    formatDate_node_content_date_created(): string {
      return this.$filters.formatDate(this.node?.content?.date_created);
    },

    // isExpanded() {
    //   return this.isExpanded;
    // },

    headColor() {
      return 'grey-6';
    },

    ...mapGetters('assemblystore', ['IsManager']),
  },

  methods: {
    popup_edit() {
      if (this.node) {
        this.$emit('popup-content-form', {
          action: 'edit',
          content: this.node.content,
        });
      } else {
        console.error('Error: content node not loaded');
      }
    },
  },
});
</script>
