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
    @click="toggle_node(node)"
    :class="{  highlightedDefault: highlightedNode }"
    :style="{
      'cursor': 'default', 
      'background-color' :  'inherit',
      'border-top': '5px solid white', 
}"
  >
    <q-card-section
      class="q-ma-none q-pa-none"
      :class="{ backToDefault : highlightedNode }"
    >
      <div class="row items-center no-wrap">
        <div class="col">

          <!-- SHOW USER INFOS FOR PRIVATE CONTENT -->
          <div v-if="node.content.private_property">

            <UserAvatar
              v-if="node.creator"
              :profile="node.creator"
            >
              <!-- <template v-slot:extrainfos>
                <span class="text-caption">
                  ({{node.content.date_created | formatDate}})
                </span> 

              </template> -->
            </UserAvatar>

            <!-- transparent -->
            <q-badge
              color="blue"
              style="left:17px; top: -10px;"
              class="absolute"
              v-if="!isRead(node)"
            >
              <!-- EXPANDABLE-ALL: v-if="isExpanded !== false" -->
              <q-tooltip>Dieser Beitrag haben Sie bisher noch nicht geöffnet.</q-tooltip>
              Neu
            </q-badge><br>

            <span class=" text-subtitle1">
              <!-- <q-icon :name="ICONS[node.content.type]"></q-icon> -->
              {{node.content.title}} {{node.nof_descendants ? `(${node.nof_descendants})` : ''}}
            </span><br>

          </div>

          <!-- SHOW TITLE FOR GIVEN AND COMMON CONTENT -->
          <div
            v-else
            class="text-h5 q-pt-sm q-pl-none"
          >
            <q-chip>
              <q-avatar
                color="grey"
                text-color="white"
              >
                <q-icon :name="ICONS[node.content.type]"></q-icon>
              </q-avatar>
              {{TYPE_LABELS[node.content.type]}}
            </q-chip>

            <span v-if="node.content.type=='UPDATEPROPOSAL'">
              <!-- <q-icon :name="ICONS[node.content.type]"></q-icon> -->
              vom {{node.content.date_created | formatDate}}
              {{node.nof_descendants ? `(${node.nof_descendants})` : ''}}
            </span>
            <span v-else>
              <!-- <q-icon :name="ICONS[node.content.type]"></q-icon> -->
              {{node.content.title}} {{node.nof_descendants ? `(${node.nof_descendants})` : ''}}
            </span><br>
          </div>

        </div>

        <div class="col-auto vertical-top">

          <q-badge
            color="purple"
            v-if="node.content.disabled"
            size="lg"
            style="position:relative; top:-1em;"
          >
            <q-tooltip>Dieser Beitrag wurde gelöscht. Er ist nur noch heute hier sichtbar.</q-tooltip>
            Gelöscht
          </q-badge>
          <q-badge
            color="grey"
            v-if="node.content.rejected"
            size="lg"
            style="position:relative; top:-1em;"
          >
            <q-tooltip>Dieser Beitrag wurde in einem Gutachten abgelehnt. Er ist nur noch heute hier sichtbar.</q-tooltip>
            Abgelehnt
          </q-badge>
          <span v-if="IsManager">
            #{{node.content.id}} |
          </span>

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
            <q-tooltip v-if="!isExpanded">Klicken Sie hier, um diesen Beitrag vollständig anzuzeigen.</q-tooltip>
            <q-tooltip v-if="isExpanded">Klicken Sie hier um diesen Diskussionsast zu schliessen.</q-tooltip>
          </span>
        </div>
      </div>

    </q-card-section>
  </q-card>
</template>


<script>
import { mapGetters } from "vuex";
import UserAvatar from "src/components/UserAvatar";
import constants from "src/utils/constants";

export default {
  name: "ContentTreeQTreeHead",
  props: ["node", "highlightedNode"],
  components: {
    UserAvatar,
  },
  inject: ["toggle_node", "is_currently_expanded", "isRead"],
  data() {
    return {
      ICONS: constants.ICONS,
      TYPE_LABELS: constants.TYPE_LABELS,
    };
  },

  computed: {
    isExpanded() {
      return this.is_currently_expanded(this.node);
    },

    headColor() {
      return "grey-6";
    },

    ...mapGetters("assemblystore", ["IsManager"]),
  },

  methods: {
    popup_edit() {
      this.popup_content_form("edit", this.content.content);
    },
  },
};
</script>