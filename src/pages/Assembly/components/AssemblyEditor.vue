<template>
  <span
    class="cursor-pointer"
    style="margin-top:1em;"
  >
    <q-banner
      dense
      inline-actions
      class="text-white bg-green"
    >
      <div v-if="model['id']">
        <q-icon
          name="mdi-circle-edit-outline"
          color="white"
          style="font-size: 1.3rem;"
        />Willst du diese "Assembly" bearbeiten? Dann klicke auf "Bearbeiten".
      </div>
      <div v-if="!model['id']">
        <q-icon
          name="mdi-shape-circle-plus"
          color="white"
          style="font-size: 1.3rem;"
        />Your are allowed to add an additional Assembly. Click on "Add".
      </div>

      <template v-slot:action>
        <q-btn
          flat
          color="white"
          :label="model['id'] ? 'Bearbeiten' : 'Hinzufügen'"
        />
      </template>
    </q-banner>

    <q-popup-edit
      v-model="localmodel"
      @save="save"
      ref="popupeditor"
      :persistent="persistent"
      :label-set="localmodel.id ? 'Speichern' : 'Hinzufügen'"
      :validate="validate"
    >

      <!-- <q-btn flat label="cancel" dense icon="mdi-close-box-outline" style="float:right" @click.stop="$refs['popupeditor'].cancel()" /> -->
      <div style="float:right">
        <q-btn
          flat
          label="cancel"
          dense
          size="lg"
          icon="mdi-close"
          @click.stop="$refs['popupeditor'].cancel()"
        />
        <q-btn
          flat
          label="save"
          dense
          size="lg"
          icon="mdi-check"
          @click.stop="$refs['popupeditor'].set()"
        />
      </div>

      <h3>{{ localmodel.id ? 'Assembly bearbeiten' : 'Fügen Sie einen neuen Assembly hinzu' }} </h3>
      Hinweis: Es kann eine Weile dauern, bis der lokale Cache im Browser ersetzt wird. Um Änderungen zu testen verwende am besten den Inkognito oder Private-Modus deines Browsers.<br>

      <div class="bg-grey-2 q-mt-lg">
        <div
          class="q-gutter-y-md column q-pa-md"
          style="width: 100%"
        >

          <q-input
            type="text"
            v-model="localmodel.title"
            dense
            autofocus
            label="Label (Public &amp; Required)"
            :error="errorTitle"
            :error-message="errorMessageTitle"
          />

          <div
            v-if="errorInfo"
            class="red-5 q-field--error text-negative"
          >
            <div class="q-field__messages col">
              <div>{{errorMessageInfo}}</div>
            </div>
          </div>

          <div>
            <b>Text für die Startseite</b>
            <q-editor
              v-model="localmodel.background"
              min-height="5rem"
              :toolbar="defaultToolbar"
              label="Startseite"
              placeholder="Füge hier den Text für die Startseite hinzu."
              autofocus
              @keyup.enter.stop
            />
          </div>

          <div>
            <b>Text für die Seite "Tages-Programm"</b>
            <q-editor
              v-model="localmodel.info"
              min-height="5rem"
              :toolbar="defaultToolbar"
              label="Text für das Tages-Programm"
              placeholder="Füge hier einen Text für die Tages-programm-Seite hinzu."
              autofocus
              @keyup.enter.stop
            />
          </div>
          <q-select
            dense
            style="max-width:270px"
            dropdown-icon="mdi-menu-down"
            v-model="localmodel.type"
            :options="$assemblyTypes"
            label="Please Choose a Assembly Type (Required)"
            :error="errorAssemblyType"
            :error-message="errorMessageAssemblyType"
          />

          <b>Starting Date {{localmodel.date_start | formatDate}}</b>
          <div v-if="!localmodel.date_start">{{'The citizenmodul is now enabled'}}</div>
          <div>
            <q-btn
              class="q-ma-none"
              v-if="!show_date_start_selector"
              flat
              :label="'Set a starting date'"
              dense
              size="md"
              icon="mdi-calendar-range"
              @click.stop="show_date_start_selector=true"
            />
            <q-btn
              v-if="show_date_start_selector"
              flat
              :label="'Remove the starting date.'"
              dense
              size="md"
              icon="mdi-close"
              @click.stop="show_date_start_selector=false; localmodel.date_start = null"
            />
          </div>
          <div
            v-if="show_date_start_selector"
            class="q-gutter-md row items-start"
          >
            <q-date
              v-model="localmodel.date_start"
              mask="YYYY-MM-DDTHH:mm"
              color="green"
            />
            <q-time
              v-model="localmodel.date_start"
              mask="YYYY-MM-DDTHH:mm"
              color="green"
            />
          </div>

          <b>Assembly Ends: {{localmodel.date_end | formatDate}}</b>
          <div v-if="!localmodel['date_end']">{{'The duration of the citizenmodul is unlimited'}}</div>
          <div>
            <q-btn
              class="q-ma-none"
              v-if="!show_date_end_selector"
              flat
              :label="'Set a ending date'"
              dense
              size="md"
              icon="mdi-calendar-range"
              @click.stop="show_date_end_selector=true"
            />
            <q-btn
              v-if="show_date_end_selector"
              flat
              :label="'Remove the ending date.'"
              dense
              size="md"
              icon="mdi-close"
              @click.stop="show_date_end_selector=false; localmodel.date_end = null"
            />
          </div>
          <div
            v-if="show_date_end_selector"
            class="q-gutter-md row items-start"
          >
            <q-date
              v-model="localmodel.date_end"
              mask="YYYY-MM-DDTHH:mm"
              color="purple"
            />
            <q-time
              v-model="localmodel.date_end"
              mask="YYYY-MM-DDTHH:mm"
              color="purple"
            />
          </div>

          <q-toggle
            class="q-ma-none q-mt-md"
            v-model="localmodel['disabled']"
            :false-value="false"
            :true-value="true"
            color="red"
            size="xl"
            checked-icon="mdi-delete-variant"
            unchecked-icon="mdi-eye-outline"
            label="Should this assembly be disabled?"
          />
          <div v-if="localmodel.id">
            <b>Additional Information:</b><br>
            Last Modification: {{localmodel['date_modified'] | formatDate}}<br>
            Created: {{localmodel['date_created'] | formatDate}}
          </div>
        </div>

        <!-- <div style="float:left">
          <q-btn
            flat
            label="delete"
            dense
            size="lg"
            icon="mdi-delete"
            @click.stop="confirm_delete"
          /> -->
        <!-- <q-btn label="Confirm" color="primary" @click="confirm" /> -->
        <!-- </div> -->

        <div style="float:right">
          <q-btn
            flat
            label="cancel"
            dense
            size="lg"
            icon="mdi-close"
            @click.stop="$refs['popupeditor'].cancel()"
          />
          <q-btn
            flat
            label="save"
            dense
            size="lg"
            icon="mdi-check"
            @click.stop="$refs['popupeditor'].set()"
          />
        </div>
      </div>

    </q-popup-edit>
  </span>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "AssemblyEditor",
  // mixins: [AssemblyMixin],
  props: {
    persistent: {
      type: Boolean,
      default: function () {
        return true;
      },
    },
    model: {
      type: Object,
      default: function () {
        // EMPTY CONTAINER MODEL as default value
        return {
          id: null,
          title: "",
          disabled: false,
          type: "",
          // group: "",
          info: "",
          background: "",
          // custom_data: null,
          date_start: null,
          date_end: null,
          // disabled: false,
          // NEW: true,
        };
      },
    },
  },

  data() {
    return {
      show_date_start_selector: !!this.model["date_start"],
      show_date_end_selector: !!this.model["date_end"],
      localmodel: this.model,
      errorAssemblyType: false,
      errorMessageAssemblyType: "",
      errorInfo: false,
      errorMessageInfo: "",
      errorBackground: false,
      errorMessageBackground: "",
      errorTitle: false,
      errorMessageTitle: "",
      errorIcon: "",
      errorMessageIcon: "",
      defaultToolbar: [
        [
          {
            label: this.$q.lang.editor.align,
            icon: this.$q.iconSet.editor.align,
            fixedLabel: true,
            options: ["left", "center", "right", "justify"],
          },
        ],
        ["bold", "italic", "strike", "underline", "subscript", "superscript"],
        ["token", "hr", "link", "custom_btn"],
        ["print", "fullscreen"],
        [
          {
            label: this.$q.lang.editor.formatting,
            icon: this.$q.iconSet.editor.formatting,
            list: "no-icons",
            options: ["p", "h1", "h2", "h3", "h4", "h5", "h6", "code"],
          },
          {
            label: this.$q.lang.editor.fontSize,
            icon: this.$q.iconSet.editor.fontSize,
            fixedLabel: true,
            fixedIcon: true,
            list: "no-icons",
            options: [
              "size-1",
              "size-2",
              "size-3",
              "size-4",
              "size-5",
              "size-6",
              "size-7",
            ],
          },
          "removeFormat",
        ],
        ["quote", "unordered", "ordered", "outdent", "indent"],

        ["undo", "redo"],
        ["viewsource"],
      ],
    };
  },
  computed: {
    assembly_count: function () {
      return this.assembly_assemblys
        ? Object.keys(this.assembly_assemblys).length + 1
        : 0;
    },
  },

  methods: {
    // validateJSON(str) {
    //   try {
    //     const alreadyObject =
    //       typeof this.localmodel["custom_data"] === "object";
    //     if (alreadyObject) {
    //       return true;
    //     }
    //     JSON.parse(str);
    //     return true;
    //   } catch (error) {
    //     return false;
    //   }
    // },

    validate() {
      // console.log("validate...");
      var has_error = false;
      this.errorInfo = false;
      this.errorMessageInfo = "";
      this.errorBackground = false;
      this.errorMessageBackground = "";
      this.errorIcon = false;
      this.errorMessageIcon = "";
      this.errorAssemblyType = false;
      this.errorMessageAssemblyType = "";
      // this.errorAssemblyCustomData = false;
      // this.errorMessageAssemblyCustomData = "";

      if (!this.localmodel["type"]) {
        this.errorAssemblyType = true;
        this.errorMessageAssemblyType = "The field must not be empty!";
        has_error = true;
      }
      if (!this.localmodel["info"]) {
        this.errorInfo = true;
        this.errorMessageInfo = "The field must not be empty!";
        has_error = true;
      }
      if (!this.localmodel["background"]) {
        this.errorBackground = true;
        this.errorMessageBackground = "The field must not be empty!";
        has_error = true;
      }

      if (!this.localmodel["title"]) {
        this.errorTitle = true;
        this.errorMessageTitle = "Please add a title!";
        has_error = true;
      }
      return !has_error;
    },

    save: function (localmodel) {
      this.updateAssembly({ assembly: this.localmodel });
    },

    ...mapActions({
      updateAssembly: "assemblystore/updateAssembly",
    }),
  },
};
</script>
