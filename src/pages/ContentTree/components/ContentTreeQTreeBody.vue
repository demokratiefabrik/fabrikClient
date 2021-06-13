<style lang="sass" scoped>
// .hovercraft:hover
//   background-color: beige
.hovercraft
  margin: 2px
  cursor: pointer
  top: -5px
  // right: -5px
  position: relative
  background-color: beige
</style>
<template>
  <q-card
    flat
    v-if="isExpanded"
    class="full-width bg-none"
  >
    <!-- :style="node.children.length || node.level===1 ? 'margin-left:1.4em' : ''" -->
    <q-card-section v-if="node.content.type==='UPDATEPROPOSAL'">
      <div class="text-caption text-grey-9">
        {{node.creator.U}} schlug vor die smartvote-Frage folgendermassen abzuändern:
        <p
          v-if="node.content.title !== '@NOCHANGE@'"
          class="q-ma-md text-notification"
        >"{{node.content.title}}"</p>

        <div
          v-if="node.content.text && node.content.text !== '@NOCHANGE@'"
          class="text-caption text-grey-9"
        >
          <br>Dies wurde folgendermassen begründet:
          <p class="q-ma-md text-notification">"{{node.content.text}}"</p>
        </div>
        <!-- <br><br> -->
        <!-- Dieser Vorschlag kann hier kommentiert werden. -->
      </div>
    </q-card-section>

    <q-card-section v-else>
      <!-- <q-btn
        flat
        rounded
        class="hovercraft float-right"
        @click="showBackground"
      >
        INFO
        <q-tooltip>Schauen Sie sich zusätzliche <br>Informationen zu diesem Beitrag an.</q-tooltip>
      </q-btn>

      <ContentBackground
        v-if="IsObserver"
        ref="backgroundDialog"
        name="`elBackground${obj.content.id}`"
        :obj="node"
      /> -->

      <!-- <div
        class="text-h5"
        v-if="node.content.private_property"
        v-text="node.content.title"
      /> -->
      <div
        class="text-caption text-grey-9"
        v-text="node.content.text"
      />
    </q-card-section>

    <ContentToolbar :obj="node" />

  </q-card>
</template>


<script>
import ContentToolbar from "src/pages/ContentTree/components/ContentToolbar";
import { mapGetters } from "vuex";
// import ContentBackground from "./ContentBackground";

export default {
  name: "ContentTreeQTreeBody",
  props: ["node"],
  components: {
    ContentToolbar,
    // ContentBackground,
  },
  inject: ["is_currently_expanded"],
  data() {
    return {};
  },

  computed: {
    isExpanded() {
      return this.is_currently_expanded(this.node);
    },

    ...mapGetters("assemblystore", ["IsObserver"]),
  },

  methods: {
    // showBackground() {
    //   console.log("SHOOOOW");
    //   this.$refs.backgroundDialog.toolbar = true;
    // },
    popup_edit() {
      this.popup_content_form("edit", this.node.content);
    },
  },
};
</script>