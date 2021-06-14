<style lang="sass" scoped>
.q-stepper__dot
  width: 50px !important
  height: 50px !important
</style>

<template>
  <q-page
    class="doc_content"
    v-if="ready"
  >

    <a name="DISCUSSIONS" />

    <!-- ASSEMBLY DESCRIPTION -->

    <!-- 2. Etappe -->
    <div class="row justify-between">
      <div class="seperator large">
        <q-icon name="mdi-star-four-points-outline" />
      </div>
    </div>

    <h1>Assembly-Summary</h1>
    <p>Hier sehen Sie einige Kennzahlen zur Assembly</p>
    <router-link :to="toSummary">Übersicht</router-link>

<br><br>

    <h1>Assembly-Inhalte</h1>
    <p>Hier können Sie die laufenden Diskussionen moderieren.</p>
    <!-- CITIZEN ASSEMBLIES -->
    <q-list>
      <q-expansion-item
        popup
        icon="mdi-account-supervisor-circle"
        v-for="localstage of stagesWithContenttree"
        group="samegroup"
        @input="switchContenttree($event, localstage)"
        :key="localstage.stage.id"
        :label="`Inhalte der Stage '${localstage.stage.title}'`"
        header-class="text-secondary"
      >
        <!-- contenttree -->
        <q-card>
          <q-card-section v-if="contenttree">

            <q-chip
              clickable
              @click="openContenttree(localstage.stage.id)"
            >Inhalte öffnen</q-chip>

            <ul>
              <li>
                Anzahl Beiträge: {{ Object.keys(contenttree.entries).length }}
              </li>
              <li>
                Letzter Änderung: {{ contenttree.date_last_tree_modification | formatDate }}
              </li>
            </ul>
          </q-card-section>
          <q-card-section>

            <div v-if="!$loaded(contenttree)">
              <q-spinner-ios
                color="primary"
                size="2em"
              />
              <q-tooltip :offset="[0, 8]">QSpinnerIos</q-tooltip>
            </div>
          </q-card-section>

        </q-card>
      </q-expansion-item>

    </q-list>

    <a name="STAGES" />
    <div class="row justify-between">
      <div class="seperator large">
        <q-icon name="mdi-star-four-points-outline" />
      </div>
    </div>

    <h1>Administration</h1>

    <h2>Stage-Konfiguration (Etappen-Programmierung)</h2>
    <p>Möchtest du die Stages dieser Assembly bearbeiten?</p>

    <q-list>

      <q-expansion-item
        icon="mdi-account-supervisor-circle"
        v-for="stage of assembly_sorted_stages"
        group="samegroup"
        :key="stage.stage.id"
        :label="`${stage.stage.disabled ? '[[[DEAKTIVIERT]]] - ' : ''}${stage.stage.order_position}. ${stage.stage.title}`"
        :caption="`Gruppe: ${stage.stage.group}; Typ: ${stage.stage.type}; `"
        header-class="text-secondary"
      >
        <q-card
          style="border-left: 1px solid blue;"
          class="q-ml-xl"
        >
          <q-card-section>
            <b> {{ stage.stage.title }}</b><br>
            <i>Beschreibung:</i> {{ stage.stage.info }}<br>
            <br>
            Zuletzt Bearbeitet: {{stage.stage.date_modified | formatDate}}

            <StageEditor :model="stage.stage"></StageEditor>
          </q-card-section>
        </q-card>
      </q-expansion-item>

    </q-list>
    <br>
    <p>Möchtest du nun eine neue Stage dieser Assembly hinzufügen?</p><br>

    <StageEditor></StageEditor><br>

    <!-- 3. Etappe -->
    <div class="row justify-between">
      <div class="seperator large">
        <q-icon name="mdi-star-four-points-outline" />
      </div>
    </div>

    <a name="ASSEMBLY" />

    <h2>{{assembly.disabled ? `[[DEAKTIVIERT]]` : ``}}Assembly: Basis-Konfiguration</h2>
    <p>Möchten Sie Änderungen an der Asssembly-Basis-Konfiguration vornehmen?</p>

    <AssemblyEditor :model="assembly"></AssemblyEditor><br>

    <!-- Schluss -->
    <div class="row justify-between">
      <div class="seperator large">
        <q-icon name="mdi-star-four-points-outline" />
      </div>
    </div>

    <SideMenu :items="sideMenuItems" />

  </q-page>
</template>


<script>
import AssemblyMixin from "src/mixins/assembly";
import DefaultDiscussionBlock from "src/pages/ContentTree/components/DefaultDiscussionBlock";
import SideMenu from "src/components/SideMenu";
import { runtimeStore } from "src/store/runtime.store";
import { mapGetters } from "vuex";
import StageEditor from "src/pages/Assembly/components/StageEditor";
import AssemblyEditor from "src/pages/Assembly/components/AssemblyEditor";
import ArtificialModeration from "src/components/artificial_moderation/ArtificialModeration.vue";

export default {
  name: "PageAssemblyHome",
  mixins: [AssemblyMixin],

  data() {
    return {
      stage: null,

      sideMenuItems: [
        {
          label: "Inhalte",
          anchor: "DISCUSSIONS",
        },
        {
          label: "Stage-Programmierung",
          anchor: "STAGES",
        },
        {
          label: "Basis-Konfiguration",
          anchor: "ASSEMBLY",
        },
      ],
    };
  },

  components: {
    ArtificialModeration,
    SideMenu,
    DefaultDiscussionBlock,
    StageEditor,
    AssemblyEditor,
  },

  computed: {
    stagesWithContenttree() {
      const stages = [];
      const previousContenttrees = [];
      this.assembly_sorted_stages.forEach((stage, key) => {
        const contenttreeID = stage.stage.contenttree_id;
        if (contenttreeID && !previousContenttrees.includes(contenttreeID)) {
          previousContenttrees.push(stage.stage.contenttree_id);
          stages.push(stage);
        }
      });

      return stages;
    },

    contenttreeID() {
      return this.stage?.stage?.contenttree_id;
    },

    contenttree() {
      if (this.contenttreeID) {
        this.$store.dispatch("contentstore/syncContenttree", {
          assemblyIdentifier: runtimeStore.assemblyIdentifier,
          contenttreeID: this.contenttreeID,
          oauthUserID: this.oauth.userid,
        });
        return this.get_contenttree({ contenttreeID: this.contenttreeID });
      }
    },

    toSummary() {
      // TODO: this is a hack...
      return {
              name: 'assembly_manage_summary',
              params: {
                assemblyIdentifier: runtimeStore.assemblyIdentifier,
                stageID: 8,
                contenttreeID: 5,
              },

        }

    },
    ...mapGetters({
      assemblystore: "contentstore/assembly_sorted_stages",
      get_contenttree: "contentstore/get_contenttree",
    }),
  },

  methods: {
    openContenttree(stageID) {
      // const target = this.$router.resolve(this.$router.route).href
      const route = {
        name: "assembly_manage_tree",
        params: {
          assemblyIdentifier: runtimeStore.assemblyIdentifier,
          stageID: stageID,
          contenttreeID: this.contenttreeID,
        },
      };
      this.$router.push(route);
      // window.location.href = this.$router.resolve(route).href;
    },

    switchContenttree: function (value, stage) {
      if (value) {
        this.stage = stage;
      }
    },
  },

  mounted() {},
};
</script>
