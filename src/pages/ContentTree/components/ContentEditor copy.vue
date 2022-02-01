<template>
  <q-popup-edit
    :cover="true"
    max-height="100%"
    anchor="center middle"
    self="center middle"
    persistent
    v-model="localmodel"
    ref="popup_content_formor"
    :validate="validate"
    v-on:save="saveContent"
  >
    <div
      class="q-mb-md q-ml-md text-notification"
      v-if="CONTENTTREE.limitForAddingCommentsReached && !isAModification"
    >
      Sie haben heute schon {{ dailyContributionLimits.current }} Kommentare
      geschrieben. Damit haben Sie die Tageslimite erreicht. Ab morgen früh
      können Sie wieder neue Kommentare verfassen.

      <q-btn
        flat
        label="Abbrechen"
        dense
        size="md"
        icon="mdi-close"
        @click.stop="popup_content_formor.value.cancel()"
      />
    </div>

    <div
      class="q-pa-md"
      v-if="
        loaded(localmodel) &&
        (!CONTENTTREE.limitForAddingCommentsReached || isAModification)
      "
    >
      <!-- <q-btn flat label="cancel" dense icon="mdi-close-box-outline" style="float:right" @click.stop="$refs['popupeditor'].cancel()" /> -->
      <div style="float: right">
        <q-btn
          flat
          label="Abbrechen"
          dense
          size="md"
          icon="mdi-close"
          @click.stop="popup_content_formor.value.cancel()"
        />
        <q-btn
          flat
          :label="submitButtonLabel"
          dense
          size="md"
          icon="mdi-check"
          @click.stop="popup_content_formor.value.set()"
        />
      </div>

      <div class="full-width q-gutter-y-md column" style="max-width: 600px">
        <!-- HTML -->
        <div v-if="isAModification">
          <p v-if="reviewNeeded">
            Sie können einen Änderungsvorschlag einreichen. Andere zufällig
            ausgewählte Teilnehmerinnen und Teilnehmer werden danach darüber
            befinden.
          </p>
          <p v-if="!reviewNeeded">
            Sie können diesen Inhalt direkt bearbeiten oder löschen.
          </p>
        </div>
        <div v-if="!isAModification">
          <p v-if="reviewNeeded">
            Sie können hier einen neuen Beitrag vorschlagen. Andere zufällig
            ausgewählte Teilnehmerinnen und Teilnehmer werden danach darüber
            befinden.
          </p>
          <div v-if="!reviewNeeded">
            <p v-if="parentReference">
              Sie erstellen gerade einen Beitrag zum Thema '{{
                parentReference
              }}'. Was möchten Sie mitteilen?
            </p>
            <p v-else>
              Sie eröffnen ein ganz neues Thema. Was möchten Sie mitteilen?
            </p>
          </div>
        </div>

        <!-- <b>{{$t('contenttree.editor.content_title')}}</b> -->
        <!-- $t('contenttree.editor.content_title_shadow') -->
        <q-input
          type="text"
          v-model="localmodel.title"
          :label="$t('contenttree.editor.content_title')"
          standout="bg-teal text-white"
          stack-label
          input-style="padding-top:2.5em; padding-bottom:0.6em"
          counter
          filled
          :error="'title' in errors"
          :error-message="errors.title"
          :maxlength="maxTitleLength"
          autofocus
        />
        <!-- <b>{{$t('contenttree.editor.content_text')}}</b> -->
        <q-input
          @keyup.enter.stop
          v-model="localmodel.text"
          :hint="$t('contenttree.editor.content_text_hint')"
          type="textarea"
          counter
          filled
          input-style="padding-top:0.5em"
          :label="'Ihr Beitrag'"
          :error="'text' in errors"
          :error-message="errors.text"
          :maxlength="maxTextLength"
        >
          <!-- <template v-slot:label>
            <div class="q-ma-lg">
              <br>
              <q-icon
                class="q-mr-xs"
                size="24px"
                name="mdi-text"
              />
              Ihr Beitrag
            </div>
          </template> -->
        </q-input>

        <br />

        <!-- && contextNodeTypesOptions.length <= 1 -->
        <span :hidden="!IsManager">
          <b>{{ $t('contenttree.editor.content_type') }}</b
          ><br />

          <div v-if="'type' in errors" class="bg-red q-pa-sm q-ma-sm">
            {{ errors.type }}
          </div>

          {{ $t('contenttree.editor.content_type_hint') }}
          <q-option-group
            name="preferred_genre"
            v-model="localmodel.type"
            :options="contextNodeTypesOptions"
            dense
            color="primary"
            inline
          />
        </span>
        <br />

        <div v-if="isAModification">
          <b>Beitrag löschen</b>
          Wenn Sie die folgende Checkbox aktivieren, wird dieser Beitrag (und
          sämtliche Antworten darauf) von der Plattform entfernt.
          <q-toggle
            class="q-ma-none q-mt-md"
            v-model="localmodel.disabled"
            :false-value="false"
            :true-value="true"
            size="xl"
            checked-icon="mdi-delete-variant"
            unchecked-icon="mdi-eye-outline"
            color="red"
            :label="
              localmodel.disabled
                ? 'Der Beitrag ist im Papierkorb. Möchten Sie ihn wieder anzeigen lassen?'
                : 'Möchten Sie diesen Beitrag wirklich in den Papierkorb verschieben?'
            "
          />
        </div>

        <div v-if="IsManager && isAModification">
          <b>Beitrag Verschieben</b>
          Als Event-Manager können Sie die Beiträge auch verschieben. Möchten
          Sie das tun?
          <q-btn
            @click="showParentSelection"
            :label="
              showParentSelectionBool
                ? `Elternbeiträge aktualisieren`
                : `Elternbeiträge laden`
            "
          />
          <!-- && contextNodeTypesOptions.length <= 1 -->
          <q-select
            filled
            v-if="showParentSelectionBool"
            v-model="localmodel.parent_id"
            use-input
            input-debounce="0"
            label="Eltern-Beitrag"
            :display-value="`Beitrag: ${
              currentParent
                ? `#${currentParent.content.id} ${currentParent.content.title}`
                : '*Oberste Ebene*'
            }`"
            :options="parentOptionsFiltered"
            @filter="filterParentsFn"
            :option-value="(tuple) => (tuple ? tuple.content.id : null)"
            :option-label="
              (tuple) =>
                `${
                  tuple && tuple.content.id == this.localmodel.parent_id
                    ? '*** '
                    : ''
                }#${tuple.content.id} ${tuple.content.title}`
            "
            :option-disable="
              (tuple) =>
                tuple ? tuple.content.disabled || tuple.content.deleted : false
            "
            map-options
            style="width: 250px"
            emit-value
            behavior="menu"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
      </div>

      <p v-if="!isAModification">
        Hinweis: In den Diskussionsforen können Sie pro Tag maximal
        {{ dailyContributionLimits.daylimit }} Beiträge schreiben.
        <span v-if="dailyContributionLimits.current > 1"
          >Bis jetzt waren es {{ dailyContributionLimits.current }}.</span
        >
      </p>

      <!-- <q-btn flat label="cancel" dense icon="mdi-close-box-outline" style="float:right" @click.stop="$refs['popupeditor'].cancel()" /> -->
      <div style="float: right">
        <q-btn
          flat
          label="Abbrechen"
          dense
          size="md"
          icon="mdi-close"
          @click.stop="popup_content_formor.value.cancel()"
        />
        <q-btn
          flat
          :label="submitButtonLabel"
          dense
          size="md"
          icon="mdi-check"
          @click.stop="popup_content_formor.value.set()"
        />
      </div>
    </div>
  </q-popup-edit>
</template>

<script lang="ts">
import { mapGetters, mapActions } from 'vuex';
import api from 'src/utils/api';
import { runtimeStore } from 'src/store/runtime.store';

export default defineComponent({
  setup() {
    const { loaded } = useLibraryComposable();
    const popup_content_formor = ref()
    return { loaded, popup_content_formor };
  },
  name: 'ContentEditor',
  // inject: [
  //   'CONTENTTREE',
  //   'getContentReference',
  //   'getDailyContributionLimits',
  //   'markDiscussed',
  // ],

  data() {
    return {
      localmodel: null,
      originalmodel: null,
      error: false,
      TYPES_WITHOUT_REQUIRED_TEXTS: ['VAA_QUESTION'],
      errors: {},
      errormsg: '',
      action: null,
      btnlabel: '',
      showParentSelectionBool: false,
      parentOptions: null,
      parentOptionsFiltered: [],
    };
  },

  computed: {
    dailyContributionLimits() {
      const limits = this.getDailyContributionLimits();
      return limits.number_of_comments;
    },

    /* Get all context types that are allowed at this position.
    There are a) general contenttree restrictions (See Configuration.CONTENT_TYPES),
    There are b) parentType restrictions (See Configuration.ONTOLOGY),
    and there are c) context restrictions (See QTree.filterTypes-Prop)),
     */
    reviewNeeded() {
      // Manager cannot add proposal...
      if (this.IsManager) {
        return false;
      }

      if (!this.originalmodel?.type) {
        return false;
      }

      // For Modification: check old a new content type...(if at least one is commont property, return true)
      var propertyIsCommon = true;
      if (this.originalmodel?.type) {
        propertyIsCommon = isCommonPropertyByConentType(
          this.originalmodel.type
        );
      }
      if (this.localmodel?.type) {
        propertyIsCommon =
          propertyIsCommon ||
          isCommonPropertyByConentType(this.localmodel.type);
      }

      return propertyIsCommon;
    },

    isAModification() {
      return this.action === 'edit';
    },
    maxTextLength() {
      return this.get_content_text_max_length({
        contenttreeID: this.CONTENTTREE.contenttree.id,
        type: this.localmodel.type,
      });
    },
    maxTitleLength() {
      return this.get_content_title_max_length({
        contenttreeID: this.CONTENTTREE.contenttree.id,
        type: this.localmodel.type,
      });
    },
    parentReference() {
      if (!this.localmodel?.parent_id) {
        return null;
      }

      return this.getContentReference(this.localmodel.parent_id);
    },
    submitButtonLabel() {
      if (this.reviewNeeded) {
        return 'Absenden';
      }
      return 'Speichern';
    },

    contextNodeTypes: function () {
      if (!('id' in this.localmodel)) {
        return [];
      }

      var parentType = null;
      if (this.localmodel.parent_id) {
        const parentNode =
          this.CONTENTTREE.contenttree.entries[this.localmodel.parent_id]
            .content;
        parentType = parentNode.type;
      }

      var context_node_types = this.get_allowed_node_types({
        contenttreeID: this.CONTENTTREE.contenttree.id,
        parentType,
      });

      var allowedContentTypesToAdd = this.get_node_types_with_add_permission({
        contenttreeID: this.CONTENTTREE.contenttree.id,
        parentType,
      });

      // Overlap
      // console.log(parentType);
      context_node_types = context_node_types.filter((value) =>
        allowedContentTypesToAdd.includes(value)
      );

      if (
        this.localmodel.type &&
        !context_node_types.includes(this.localmodel.type)
      ) {
        context_node_types = [this.localmodel.type];
      }

      // FILTER THE TYPES, THE USER HAS ADD PERMISSION
      // if (this.reviewNeeded){
      //   // Review needed:
      // }else{
      //       // TODO: filter ALLOWED_CONTENT_TYPES_TO_ADD
      // }

      // CONTEXT
      // TODO: are there any filtered node types in this context?
      // context_node_types = context_node_types.filter((v) =>
      //   this.realFilterTypes.includes(v)
      // );
      // console.log("context_node_types", context_node_types);
      return context_node_types;
    },

    contextNodeTypesOptions: function () {
      const options = Object.values(
        this.contextNodeTypes.reduce((obj, cur, i) => {
          return {
            ...obj,
            [i]: {
              value: cur,
              label: this.$t(`contenttree.types.${cur}`),
            },
          };
        }, [])
      );
      return options;
    },

    currentParent() {
      return this.CONTENTTREE.contenttree.entries[this.localmodel.parent_id];
    },

    ...mapGetters({
      IsManager: 'assemblystore/IsManager',
      get_allowed_node_types: 'contentstore/get_allowed_node_types',
      get_node_types_with_add_permission:
        'contentstore/get_node_types_with_add_permission',
      get_content_text_max_length: 'contentstore/get_content_text_max_length',
      get_content_title_max_length: 'contentstore/get_content_title_max_length',
      isCommonPropertyByConentType: 'contentstore/isCommonPropertyByConentType',
    }),
  },

  methods: {
    initialize: function (action, model) {
      console.log('Initialize popup action ' + action);
      this.original = model;
      this.action = action;

      const template = {
        id: null,
        title: '',
        disabled: false,
        type: '',
        text: '',
        parent_id: null,
      };

      // take template as default values
      model = {
        ...template,
        ...model,
      };

      // remove all keys that are not in the template object
      const keys_to_keep = Object.keys(template);
      for (var k in model) {
        if (keys_to_keep.indexOf(k) < 0) {
          delete model[k];
        }
      }

      // store model
      this.localmodel = model;

      // validate / and pre-select type
      const types = this.contextNodeTypes;
      if (types.length == 1 && !this.localmodel.type) {
        this.localmodel.type = types[0];
      }
      this.popup_content_formor.value.show();
    },

    showParentSelection() {
      const tmpParentOptions = Object.values(
        this.CONTENTTREE.contenttree.entries
      );
      console.log(tmpParentOptions);
      this.parentOptions = tmpParentOptions.filter((v) => {
        const noCyclying = !v.path.includes(this.localmodel.id);
        return noCyclying;
      });
      // console.log(this.parentOptions);

      this.showParentSelectionBool = true;
      if (this.localmodel.parent_id) {
        this.parentOptionsFiltered = [this.currentParent];
      }
    },

    filterParentsFn(val, update) {
      if (val === '') {
        update(() => {
          this.parentOptionsFiltered = this.parentOptions;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.parentOptionsFiltered = this.parentOptions.filter((v) => {
          const searchable = `${v.content.title} ${v.content.text}  #${v.content.id}  @${v.creator.FN}`;
          return searchable.toLowerCase().indexOf(needle) > -1;
        });
      });
    },

    validate() {
      // console.log("validate...");
      var has_error = false;
      this.errors = {};

      if (
        !this.localmodel['type'] ||
        !this.contextNodeTypes.includes(this.localmodel.type)
      ) {
        this.errors['type'] = 'Sie müssen ein Inhaltstyp angeben.';
        has_error = true;
      }

      if (!this.localmodel['title']) {
        this.errors.text =
          'Bitte fügen Sie einen Titel für diesen Beitrag ein.';
        has_error = true;
      } else if (this.localmodel.title.length > this.maxTitleLength) {
        this.errors[
          'title'
        ] = `Den Titel den Sie geschrieben haben ist zu lang. Er darf maximal ${this.maxTitleLength} Zeichen lang sein.`;
        has_error = true;
      }
      if (
        !this.localmodel['text'] &&
        !this.TYPES_WITHOUT_REQUIRED_TEXTS.includes(this.localmodel['type'])
      ) {
        this.errors.text = 'Bitte fügen Sie einen Text für diesen Beitrag ein.';
        has_error = true;
      } else if (this.localmodel.text.length > this.maxTextLength) {
        this.errors[
          'text'
        ] = `Den Text den Sie geschrieben haben ist zu lang. Er darf maximal ${this.maxTextLength} Zeichen lang sein.`;
        has_error = true;
      }

      return !has_error;
    },

    getTopicID: function () {
      let contentID = this.isAModification
        ? this.localmodel.id
        : this.localmodel.parent_id;
      if (contentID) {
        const path = this.CONTENTTREE.contenttree.entries[contentID]?.path;
        if (path.length) {
          return path[0];
        }
      }
    },

    saveContent: function () {
      // console.log(this.localmodel)
      console.log('Save content');
      console.assert(this.CONTENTTREE.contenttree.id);
      var assemblyIdentifier = runtimeStore.assemblyIdentifier;
      console.assert(assemblyIdentifier);

      // Set topic as dicussed
      const topicID = this.getTopicID();
      if (topicID) {
        this.markDiscussed(this.CONTENTTREE.contenttree.entries[topicID]);
        // this.update_discussed({
        //   contenttreeID: this.STAGE.contenttreeID,
        //   contentID: topicID,
        // });
      }

      var submitApiFunction = null;
      if (this.reviewNeeded) {
        submitApiFunction = api.proposeContent;
      } else {
        submitApiFunction = api.saveContent;
      }

      submitApiFunction(
        assemblyIdentifier,
        this.CONTENTTREE.contenttree.id,
        this.localmodel
      )
        .then((response) => {
          console.log(response.data);
          console.log('Model saved');

          // ERROR RESPONSE
          if (response.data.OK) {
            console.log('data received');

            const reviewNeeded = 'proposal' in response.data;

            // Update Vuex Store
            if ('content' in response.data) {
              this.update_content({ contentTuple: response.data.content });
              console.log('SEND TO VUEX', response.data.content);

              this.$store.dispatch(
                'assemblystore/incrementAssemblyActivityCounter',
                { counterName: 'number_of_comments_today' }
              );

              // Zoom to content if needed.
              if (!this.isAModification && !this.reviewNeeded) {
                // Zoom tO new content
                setTimeout(() => {
                  console.log('raise Zoomer CONTENT');
                  this.$emit('expand-node', response.data.content);
                }, 75);
              }
            }

            // Success Message.
            this.$q.notify({
              type: 'nFabrikInfo',
              message: reviewNeeded
                ? 'Der Antrag wurde eingereicht und wird ab sofort von anderen Teilnehmenden begutachtet.'
                : this.isAModification
                ? 'Die Änderungen wurden gespeichert.'
                : 'Der Beitrag wurde gespeichert.',
            });
          } else {
            // Error Message
            this.$q.notify({
              type: 'nFabrikError',
              message:
                'Das Formular konnte nicht verarbeitet werden. Bitte informieren Sie die Veranstalter.',
            });
          }
        })
        .catch((error) => {
          console.warn(error);
          // Error Handling is done in Axios Interceptor
        });
    },

    ...mapActions({
      update_discussed: 'contentstore/update_discussed',
      add_or_update_contenttree: 'contentstore/add_or_update_contenttree',
      update_content: 'contentstore/update_content',
    }),
  },
});
</script>
