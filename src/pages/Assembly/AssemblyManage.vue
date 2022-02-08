<style lang="sass" scoped>
.q-stepper__dot
  width: 50px !important
  height: 50px !important
</style>

<template>
  <q-page class="doc_content" v-if="ready">
    <a name="DISCUSSIONS" />

    <!-- ASSEMBLY DESCRIPTION -->

    <!-- 2. Etappe -->
    <div class="row justify-between">
      <div class="seperator large">
        <q-icon name="mdi-star-four-points-outline" />
      </div>
    </div>

    <h1>Summary</h1>
    <p>
      Diese Übersicht gibt es nun nicht mehr. Du kannst dich stattdessen als
      Beobachter einloggen. Siehe Dokument "Moderationshandbuch/Zugänge.docx"
    </p>

    <br /><br />

    <h1>Assembly-Inhalte</h1>
    <p>Hier können Sie die laufenden Diskussionen moderieren.</p>
    <!-- CITIZEN ASSEMBLIES -->
    <q-list v-if="stagesWithContenttree">
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
            <q-chip clickable @click="openContenttree(localstage.stage.id)"
              >Inhalte öffnen</q-chip
            >

            <ul>
              <li>
                Anzahl Beiträge: {{ Object.keys(contenttree.entries).length }}
              </li>
              <li>
                Letzter Änderung:
                {{ formatDate_contenttree_date_last_tree_modification }}
              </li>
            </ul>
          </q-card-section>
          <q-card-section>
            <div v-if="!loaded(contenttree)">
              <q-spinner-ios color="primary" size="2em" />
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

    <q-list v-if="assembly_sorted_stages">
      <q-expansion-item
        icon="mdi-account-supervisor-circle"
        v-for="stage of assembly_sorted_stages"
        group="samegroup"
        :key="stage?.stage.id"
        :label="`${stage?.stage.disabled ? '[[[DEAKTIVIERT]]] - ' : ''}${
          stage?.stage.order_position
        }. ${stage?.stage.title}`"
        :caption="`Gruppe: ${stage?.stage.group}; Typ: ${stage?.stage.type}; `"
        header-class="text-secondary"
      >
        <q-card style="border-left: 1px solid blue" class="q-ml-xl">
          <q-card-section>
            <b> {{ stage.stage.title }}</b
            ><br />
            <i>Beschreibung:</i> {{ stage?.stage.info }}<br />
            <br />
            Zuletzt Bearbeitet: {{ formatDate_stage_stage_date_modified }}

            <StageEditor :model="stage?.stage"></StageEditor>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
    <br />
    <p>Möchtest du nun eine neue Stage dieser Assembly hinzufügen?</p>
    <br />

    <StageEditor></StageEditor><br />

    <!-- 3. Etappe -->
    <div class="row justify-between">
      <div class="seperator large">
        <q-icon name="mdi-star-four-points-outline" />
      </div>
    </div>

    <a name="ASSEMBLY" />

    <h2>
      {{ assembly.disabled ? `[[DEAKTIVIERT]]` : `` }}Assembly:
      Basis-Konfiguration
    </h2>
    <p>
      Möchten Sie Änderungen an der Asssembly-Basis-Konfiguration vornehmen?
    </p>

    <AssemblyEditor :model="assembly"></AssemblyEditor><br />

    <!-- Schluss -->
    <div class="row justify-between">
      <div class="seperator large">
        <q-icon name="mdi-star-four-points-outline" />
      </div>
    </div>

    <SideMenu :items="sideMenuItems" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, Ref } from 'vue';
// import { RouteRecordRaw, LocationAsRelativeRaw} from 'vue-router';
// import AssemblyMixin from 'src/mixins/assembly';
// import DefaultDiscussionBlock from 'src/pages/ContentTree/components/DefaultDiscussionBlock';
import SideMenu from 'src/components/SideMenu.vue';
import { mapGetters } from 'vuex';
import { IContentTree } from 'src/models/contenttree';
import { IStageTuple } from 'src/models/stage';

import StageEditor from 'src/pages/Assembly/components/StageEditor.vue';
import AssemblyEditor from 'src/pages/Assembly/components/AssemblyEditor.vue';
import useLibraryComposable from 'src/utils/library';
import useAssemblyComposable from 'src/composables/assembly.composable';
import usePKCEComposable from 'src/plugins/VueOAuth2PKCE/pkce.composable';
import { useStore } from 'vuex';
// import useContenttreeComposable from 'src/composables/contenttree.composable';
// import useContenttreeComposable from './contenttree.composable';
// import ArtificialModeration from 'src/components/artificial_moderation/ArtificialModeration.vue';

export default defineComponent({
  setup() {
    const { loaded } = useLibraryComposable();
    const { assemblyIdentifier, assembly_sorted_stages, assembly, ready } =
      useAssemblyComposable('');
    // const { contenttree } = useContenttreeComposable();
    const store = useStore();
    const { userid } = usePKCEComposable();
    return {
      assemblyIdentifier,
      assembly,
      ready,
      loaded,
      store,
      // contenttree,
      assembly_sorted_stages: assembly_sorted_stages as Ref<IStageTuple[]>,
      userid,
    };
  },
  name: 'PageAssemblyHome',
  // mixins: [AssemblyMixin],

  data() {
    return {
      stage: null as IStageTuple | null,
      sideMenuItems: [
        {
          label: 'Inhalte',
          anchor: 'DISCUSSIONS',
        },
        {
          label: 'Stage-Programmierung',
          anchor: 'STAGES',
        },
        {
          label: 'Basis-Konfiguration',
          anchor: 'ASSEMBLY',
        },
      ],
    };
  },

  components: {
    SideMenu,
    StageEditor,
    AssemblyEditor,
  },

  computed: {
    formatDate_contenttree_date_last_tree_modification(): string {
      return this.$filters.formatDate(
        this.contenttree?.date_last_tree_modification
      );
    },

    formatDate_stage_stage_date_modified(): string {
      const date = this.stage?.stage.date_modified;
      return this.$filters.formatDate(date);
    },

    stagesWithContenttree(): IStageTuple[] | null {
      const stages = [] as IStageTuple[];
      const previousContenttrees: number[] = [];

      this.assembly_sorted_stages.forEach((stage: IStageTuple) => {
        const contenttreeID = stage.stage.contenttree_id as number;
        if (!contenttreeID) {
          return null;
        }
        if (contenttreeID && !previousContenttrees.includes(contenttreeID)) {
          previousContenttrees.push(stage.stage.contenttree_id);
          stages.push(stage);
        }
      });

      return stages;
    },

    contenttreeID(): number | undefined {
      return this.stage?.stage.contenttree_id;
    },

    contenttree(): IContentTree | null {
      if (this.contenttreeID) {
        this.store.dispatch('contenttreestore/syncContenttree', {
          assemblyIdentifier: this.assemblyIdentifier,
          contenttreeID: this.contenttreeID,
          oauthUserID: this.userid,
        });
        return this.get_contenttree({ contenttreeID: this.contenttreeID });
      }

      return null;
    },

    // toSummary(): RouteRecordRaw | LocationAsRelativeRaw {
    //   // TODO: this is a hack...
    //   alert('ddddddddddddddd')
    //   return {
    //     name: 'assembly_manage_summary',
    //     params: {
    //       assemblyIdentifier: this.assemblyIdentifier,
    //       stageID: 8,
    //       contenttreeID: 5,
    //     },
    //   };
    // },

    ...mapGetters({
      assemblystore: 'contenttreestore/assembly_sorted_stages',
      get_contenttree: 'contenttreestore/get_contenttree',
    }),
  },

  methods: {
    openContenttree(stageID) {
      // const target = this.$router.resolve(this.$router.route).href
      const route = {
        name: 'assembly_manage_tree',
        params: {
          assemblyIdentifier: this.assemblyIdentifier,
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
});
</script>
