<template>
  <q-card-actions align="right" horizontal>
    <!-- EDIT -->
    <q-card-section
      vertical
      align="center"
      @click="popup_edit"
      margin="0px"
      v-if="
        obj.content.acl.includes('modify') ||
        obj.content.acl.includes('propose_modify')
      "
      class="q-pa-sm q-ma-none cursor-pointer"
    >
      <q-icon
        right
        size="md"
        class="q-pa-none q-ma-none"
        name="mdi-playlist-edit"
      />
      <q-card-section class="q-pa-none q-ma-none">
        {{
          obj.content.acl.includes('propose_modify')
            ? 'Änderung Vorschlagen'
            : 'Ändern'
        }}
      </q-card-section>
    </q-card-section>

    <!-- REPLY -->
    <q-card-section
      vertical
      align="center"
      v-if="obj.content.acl.includes('append')"
      @click="popup_create"
      margin="0px"
      class="q-pa-sm q-ma-none cursor-pointer"
    >
      <q-icon
        right
        size="md"
        class="q-pa-none q-ma-none"
        name="mdi-reply-outline"
      />
      <q-card-section
        class="q-pa-none q-ma-none"
        v-if="obj.content.private_property"
      >
        Antworten</q-card-section
      >
      <q-card-section class="q-pa-none q-ma-none" v-else>
        Neuer Kommentar</q-card-section
      >
    </q-card-section>

    <q-card-section
      vertical
      align="center"
      v-if="obj.content.acl.includes('observe')"
      @click="showBackground"
      margin="0px"
      class="q-pa-sm q-ma-none cursor-pointer"
    >
      <q-icon
        right
        size="md"
        class="q-pa-none q-ma-none"
        name="mdi-information-outline"
      />
      <q-card-section
        class="q-pa-none q-ma-none"
        v-if="obj.content.private_property"
      >
        Info
        <!-- <q-tooltip>Schauen Sie sich zusätzliche <br>Informationen zu diesem Beitrag an.</q-tooltip> -->
      </q-card-section>

      <ContentBackground
        v-if="IsObserver"
        ref="backgroundDialog"
        name="`elBackground${obj.content.id}`"
        :obj="obj"
      />
    </q-card-section>

    <component
      :is="ContentResponseComponentLoader"
      v-if="ContentResponseComponentLoader"
      name="`elReview${obj.content.id}`"
      :content="obj"
    />
  </q-card-actions>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
// import ApiService from "src/utils/xhr";
import { mapActions, mapGetters } from 'vuex';
// import { runtimeStore } from "src/store/runtime.store";
import ContentBackground from './ContentBackground.vue';

export default defineComponent({
  setup() {
    const backgroundDialog = ref();
    return { backgroundDialog };
  },
  name: 'ContentToolbarComponent',
  props: ['obj'],
  components: {
    ContentBackground,
  },
  data() {
    return {
      confirm_deletion: false,
      confirm_deletion_content: null,
      confirm_deletion_justification: '',
      confirm_deletion_justification_error: false,
      confirm_deletion_justification_error_message: '',
      track_changes: this.obj.progression
        ? this.obj.progression.track_changes
        : false,
    };
  },

  computed: {
    ContentResponseComponentLoader(): any {
      if (
        this.obj.content.acl.includes('manage') &&
        this.obj.content.private_property
      ) {
        return () => import('./ContentManagerReview.vue');
      } else if (
        this.obj.content.acl.includes('rating') &&
        this.obj.content.private_property
      ) {
        return () => import('./ContentRatingThumbs.vue');
      }

      return null;
    },

    track_changes_icon: function () {
      return this.track_changes
        ? 'mdi-bookmark-remove'
        : 'mdi-bookmark-plus-outline';
    },
    track_changes_color: function () {
      return this.track_changes ? 'brown-9' : 'grey-6';
    },

    ...mapGetters('assemblystore', [
      'IsDelegate',
      'IsExpert',
      'IsContributor',
      'IsObserver',
      'IsManager',
    ]),
  },

  methods: {
    popup_edit() {
      if (this.obj) {
        this.$emit('popup-content-form', {
          action: 'edit',
          content: this.obj.content,
        });
      } else {
        console.error('Error: content node not loaded');
      }
    },

    popup_create() {
      if (this.obj) {
        this.$emit('popup-content-form', {
          action: 'reply',
          content: { parent_id: this.obj.content.id },
        });
      } else {
        console.error('Error: content node not loaded');
      }
      // this.popup_content_form('reply', { parent_id: this.obj.content.id });
    },
    showBackground() {
      console.log('SHOOOOW');
      this.backgroundDialog.value.toolbar = true;
    },

    deletePrompt(content) {
      var message =
        'This is private property. If you want, you can delete it. However, please provide a short justification.';
      if (content.common_property) {
        message =
          'This is common property. You can submit a Proposal to delete this entry. However, provide a short justification, why do you think deletion is appropriate.';
      }

      this.$q
        .dialog({
          title: content.common_property
            ? this.$t('contenttree.toolbar.submit_delete_proposal')
            : this.$t('contenttree.toolbar.delete'),
          message,
          prompt: {
            model: '',
            isValid: (val) => val.length > 3, // << here is the magic
            type: 'text', // optional
          },
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          alert('DELETE ENTRY METHOD DOES NOT EXIST..908.');
          // console.log(data, 'object to delete?');
          // this.deleteEntry(content, data);
        });
    },
 
    validateConfirmDeletion() {
      var has_error = false;
      this.confirm_deletion_justification_error_message = '';
      this.confirm_deletion_justification_error = false;

      if (
        !this.confirm_deletion_justification ||
        this.confirm_deletion_justification.length < 5
      ) {
        this.confirm_deletion_justification_error = true;
        this.confirm_deletion_justification_error_message =
          'Please indicate why you want to delete this entry. What is wrong with it?';
        has_error = true;
      }

      return !has_error;
    },

    ...mapActions({
      add_or_update_contenttree: 'contentstore/add_or_update_contenttree',
    }),
  },
});
</script>
