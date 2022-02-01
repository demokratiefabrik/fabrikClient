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
      v-if="limitForAddingCommentsReached && !isAModification"
    >
      Sie haben heute schon {{ dailyContributionLimits?.current }} Kommentare
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
      v-if="localmodel && (!limitForAddingCommentsReached || isAModification)"
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
              currentParent?.content?.id
                ? `#${currentParent.content.id} ${currentParent.content.title}`
                : '*Oberste Ebene*'
            }`"
            :options="parentOptionsFiltered"
            @filter="filterParentsFn"
            :option-value="(tuple) => (tuple ? tuple.content.id : null)"
            :option-label="
              (tuple) =>
                `${
                  tuple && tuple.content.id == this.localmodel?.parent_id
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

      <p v-if="!isAModification && dailyContributionLimits">
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
import { mapGetters, mapActions, useStore } from 'vuex';
import api from 'src/utils/api';
import { defineComponent, ref } from 'vue';
import useLibraryComposable from 'src/utils/library';
import useAssemblyComposable from 'src/composables/assembly.composable';
import useContenttreeComposable from 'src/composables/contenttree.composable';
import { INodeTuple } from 'src/models/content';

export interface IError {
  title?: string;
  text?: string;
  type?: string;
}

export interface IData {
  id: number | null;
  title: string;
  disabled: boolean;
  type: string;
  text: string;
  parent_id: number | null;
}

export default defineComponent({
  setup() {
    const { loaded } = useLibraryComposable();
    const {
      getDailyContributionLimits,
      limitForAddingCommentsReached,
      assemblyIdentifier,
    } = useAssemblyComposable('');
    const { getContentReference, contenttree, markDiscussed } =
      useContenttreeComposable();
    const popup_content_formor = ref();
    const store = useStore();

    return {
      loaded,
      popup_content_formor,
      getDailyContributionLimits,
      limitForAddingCommentsReached,
      getContentReference,
      store,
      markDiscussed,
      contenttree,
      assemblyIdentifier,
    };
  },

  name: 'ContentEditor',

  data() {
    return {
      localmodel: null as IData | null,
      originalmodel: null as IData | null,
      error: false as boolean,
      TYPES_WITHOUT_REQUIRED_TEXTS: ['VAA_QUESTION'],
      errors: {} as IError,
      errormsg: '',
      action: null as string | null,
      btnlabel: '',
      showParentSelectionBool: false,
      parentOptions: null as any,
      parentOptionsFiltered: [] as any[],
    };
  },

  computed: {
    dailyContributionLimits(): Record<string, number> | undefined {
      const limits = this.getDailyContributionLimits();
      return limits?.number_of_comments;
    },

    /* Get all context types that are allowed at this position.
    There are a) general contenttree restrictions (See Configuration.CONTENT_TYPES),
    There are b) parentType restrictions (See Configuration.ONTOLOGY),
    and there are c) context restrictions (See QTree.filterTypes-Prop)),
     */
    reviewNeeded(): boolean {
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
        propertyIsCommon = this.isCommonPropertyByConentType(
          this.originalmodel.type
        );
      }
      if (this.localmodel?.type) {
        propertyIsCommon =
          propertyIsCommon ||
          this.isCommonPropertyByConentType(this.localmodel.type);
      }

      return propertyIsCommon;
    },

    isAModification(): boolean {
      return this.action === 'edit';
    },
    maxTextLength(): number {
      return this.get_content_text_max_length({
        contenttreeID: this.contenttree.id,
        type: this.localmodel?.type,
      });
    },
    maxTitleLength(): number {
      return this.get_content_title_max_length({
        contenttreeID: this.contenttree.id,
        type: this.localmodel?.type,
      });
    },
    parentReference(): string | null {
      if (!this.localmodel?.parent_id) {
        return null;
      }
      return this.getContentReference(this.localmodel.parent_id);
    },
    submitButtonLabel(): string {
      if (this.reviewNeeded) {
        return 'Absenden';
      }
      return 'Speichern';
    },

    contextNodeTypes(): string[] {
      if (this.localmodel && !('id' in this.localmodel)) {
        return [];
      }

      // get parent type (if available)
      var parentType = null;
      if (this.localmodel?.parent_id) {
        const parentNode =
          this.contenttree.entries[this.localmodel.parent_id].content;
        parentType = parentNode.type;
      }

      // get allowed types for this parent
      var context_node_types = this.get_allowed_node_types({
        contenttreeID: this.contenttree.id,
        parentType,
      });

      // FILTER THE TYPES, THE USER HAS ADD PERMISSION
      // get types (considering current permissions)
      var allowedContentTypesToAdd = this.get_node_types_with_add_permission({
        contenttreeID: this.contenttree.id,
        parentType,
      });

      // Reduce to overlapp
      context_node_types = context_node_types.filter((value) =>
        allowedContentTypesToAdd.includes(value)
      );

      if (
        this.localmodel?.type &&
        !context_node_types.includes(this.localmodel.type)
      ) {
        context_node_types = [this.localmodel.type];
      }

      return context_node_types;
    },

    contextNodeTypesOptions(): any {
      const options = Object.values(
        this.contextNodeTypes.reduce((prev, cur, i) => {
          return {
            ...(prev as string[]),
            [i as number]: {
              value: cur as string,
              label: this.$t(`contenttree.types.${cur}`),
            },
          };
        }, [] as any[])
      );
      return options;
    },

    currentParent(): INodeTuple | null {
      if (this.localmodel?.parent_id) {
        return this.contenttree.entries[this.localmodel.parent_id];
      }
      return null;
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
    initialize(action, model: IData) {
      console.log('Initialize popup action ' + action);
      this.originalmodel = model;
      this.action = action;

      const template: IData = {
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
      if (!this.localmodel) {
        return;
      }

      const tmpParentOptions = Object.values(this.contenttree.entries);
      // console.log(tmpParentOptions);
      const nodeId = this.localmodel?.id;
      if (nodeId) {
        this.parentOptions = tmpParentOptions.filter((v) => {
          const noCyclying = !(v as INodeTuple).path.includes(nodeId);
          return noCyclying;
        });
      } else {
        console.log('warning: nodeID not defined..973..');
      }
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

      if (!this.localmodel) {
        return false;
      }

      if (
        !this.localmodel?.type ||
        !this.contextNodeTypes.includes(this.localmodel.type)
      ) {
        this.errors['type'] = 'Sie müssen ein Inhaltstyp angeben.';
        has_error = true;
      }

      if (!this.localmodel?.title) {
        this.errors['text'] =
          'Bitte fügen Sie einen Titel für diesen Beitrag ein.';
        has_error = true;
      } else if (this.localmodel.title.length > this.maxTitleLength) {
        this.errors[
          'title'
        ] = `Den Titel den Sie geschrieben haben ist zu lang. Er darf maximal ${this.maxTitleLength} Zeichen lang sein.`;
        has_error = true;
      }
      if (
        !this.localmodel?.text &&
        !this.TYPES_WITHOUT_REQUIRED_TEXTS.includes(this.localmodel.type)
      ) {
        this.errors['text'] =
          'Bitte fügen Sie einen Text für diesen Beitrag ein.';
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
      if (!this.localmodel) {
        return;
      }

      let contentID = this.isAModification
        ? this.localmodel.id
        : this.localmodel.parent_id;
      if (contentID) {
        const path = this.contenttree.entries[contentID]?.path;
        if (path.length) {
          return path[0];
        }
      }
    },

    saveContent: function () {
      // console.log(this.localmodel)
      console.log('Save content');
      console.assert(this.contenttree.id);
      var assemblyIdentifier = this.assemblyIdentifier;
      console.assert(assemblyIdentifier);

      // Set topic as dicussed
      const topicID = this.getTopicID();
      if (topicID) {
        this.markDiscussed(this.contenttree.entries[topicID]);
      }

      let submitApiFunction = null as
        | null
        | ((
            assemblyIdentifier: string | null,
            contenttreeID: number,
            localmodel: IData | null
          ) => Promise<any>);
      if (this.reviewNeeded) {
        submitApiFunction = api.proposeContent;
      } else {
        submitApiFunction = api.saveContent;
      }

      submitApiFunction(
        this.assemblyIdentifier,
        this.contenttree.id,
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

              this.store.dispatch(
                'assemblystore/incrementAssemblyActivityCounter',
                {
                  assemblyIdentifier: this.assemblyIdentifier,
                  counterName: 'number_of_comments_today',
                }
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
