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
        />Willst du diese "Stage" bearbeiten? Dann klicke auf "Ja, Bearbeiten".
      </div>
      <div v-if="!model['id']">
        <q-icon
          name="mdi-shape-circle-plus"
          color="white"
          style="font-size: 1.3rem;"
        />Your are allowed to add an additional Stage. Click on "Add".
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

      <h3>{{ localmodel.id ? 'Stage bearbeiten' : 'Fügen Sie einen neuen Stage hinzu' }} </h3>

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

          <q-input
            type="textarea"
            v-model="localmodel.info"
            label="Description (Public &amp; Required)"
            placeholder="Please add a short description what this stage is about!"
            autofocus
            @keyup.enter.stop
          />

          <q-input
            type="text"
            v-model="localmodel.group"
            dense
            autofocus
            label="You can group some stages within one stage group. Enter the name of the group."
            :error="errorStageGroup"
            :error-message="errorMessageStageGroup"
          />

          <q-input
            v-model="localmodel_custom_data"
            dense
            autofocus
            @keyup="validate"
            label="You can add some configuration data as JSON object."
            autogrow
            :error="errorStageCustomData"
            :error-message="errorMessageStageCustomData"
          />

          <q-select
            dense
            style="max-width:270px"
            dropdown-icon="mdi-menu-down"
            v-model="localmodel.type"
            :options="Object.keys(assemblyConfiguration.STAGE_TYPES)"
            label="Please Choose a Stage Type (Required)"
            :error="errorStageType"
            :error-message="errorMessageStageType"
          />

          <br />
          <q-select
            class="q-ma-none"
            style="max-width:270px"
            dense
            dropdown-icon="mdi-menu-down"
            v-model="localmodel.order_position"
            :options="order_position_options"
            hint="At which Position should this stage be placed?"
            label="Order Position"
          />
          <!-- {{stage_count}} -->
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
          <div v-if="!localmodel.date_end">{{'The duration of the citizenmodul is unlimited'}}</div>
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
            v-model="localmodel.disabled"
            :false-value="false"
            :true-value="true"
            checked-icon="mdi-airplane-off"
            color="red"
            label="Should this stage be disabled?"
            unchecked-icon="mdi-airplane"
          />
          <div v-if="localmodel.id">
            <b>Additional Information:</b><br>
            Last Modification: {{localmodel.date_modified | formatDate}}<br>
            Created: {{localmodel.date_created | formatDate}}
          </div>
        </div>

        <div style="float:left">
          <q-btn
            flat
            label="delete"
            dense
            size="lg"
            icon="mdi-delete"
            @click.stop="confirm_delete"
          />
          <!-- <q-btn label="Confirm" color="primary" @click="confirm" /> -->
        </div>

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
// import ApiService from "src/utils/xhr";
// import AssemblyMixin from "src/mixins/assembly";
import { mapGetters, mapActions } from "vuex";
// import Configuration from 'src/utils/configuration'

export default {
  name: "StageEditor",
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
          order_position: this.stage_count,
          disabled: false,
          type: "",
          group: "",
          info: "",
          custom_data: null,
          date_start: null,
          date_end: null,
          disabled: false,
          // NEW: true,
        };
      },
    },
  },

  data() {
    return {
      show_date_start_selector: !!this.model.date_start,
      show_date_end_selector: !!this.model.date_end,
      localmodel: this.model,
      errorStageType: false,
      errorMessageStageType: "",
      errorStageGroup: false,
      errorMessageStageGroup: "",
      errorStageCustomData: false,
      errorMessageStageCustomData: "",
      errorInfo: false,
      errorMessageInfo: "",
      errorTitle: false,
      errorMessageTitle: "",
      errorIcon: "",
      errorMessageIcon: "",
    };
  },
  computed: {
    localmodel_custom_data: {
      get: function () {
        const isObject = typeof this.localmodel.custom_data === "object";
        if (isObject) {
          return JSON.stringify(this.localmodel.custom_data);
        } else if (!this.localmodel.custom_data?.length === 0) {
          return "null";
        } else {
          return this.localmodel.custom_data;
        }
      },
      set: function (value) {
        const isObject = typeof this.localmodel.custom_data === "object";
        if (this.validateJSON(value) && !isObject) {
          this.localmodel.custom_data = JSON.parse(value);
        } else {
          // invalid JSON. do nothing
          this.localmodel.custom_data = value;
        }
      },
    },

    stage_count: function () {
      return this.assembly_stages
        ? Object.keys(this.assembly_stages).length + 1
        : 0;
    },

    order_position_options: function () {
      let options = [...Array(this.stage_count).keys()];
      options = options.map((x) => x + 1);
      return options;
    },

    ...mapGetters("assemblystore", [
      "assemblyConfiguration",
      "assembly_stages",
    ]),
  },

  methods: {
    validateJSON(str) {
      try {
        const alreadyObject = typeof this.localmodel.custom_data === "object";
        if (alreadyObject) {
          return true;
        }
        JSON.parse(str);
        return true;
      } catch (error) {
        console.log("JSON ERROR", error);

        return false;
      }
    },

    validate() {
      // console.log("validate...");
      var has_error = false;
      this.errorInfo = false;
      this.errorMessageInfo = "";
      this.errorIcon = false;
      this.errorMessageIcon = "";
      this.errorStageType = false;
      this.errorMessageStageType = "";
      this.errorStageGroup = false;
      this.errorMessageStageGroup = "";
      this.errorStageCustomData = false;
      this.errorMessageStageCustomData = "";

      if (!this.localmodel["type"]) {
        this.errorStageType = true;
        this.errorMessageStageType = "The field must not be empty!";
        has_error = true;
      }
      if (!this.localmodel["group"]) {
        this.errorStageGroup = true;
        this.errorMessageStageGroup = "The field must not be empty!";
        has_error = true;
      }
      if (!this.validateJSON(this.localmodel.custom_data)) {
        this.errorStageCustomData = true;
        this.errorMessageStageCustomData = "The field must not be empty!";
        has_error = true;
      }

      // console.log("VALIDATOR custom_data:  ", this.errorStageCustomData);

      if (!this.localmodel.info) {
        this.errorInfo = true;
        this.errorMessageInfo = "The field must not be empty!";
        has_error = true;
      }

      if (!this.localmodel.title) {
        this.errorTitle = true;
        this.errorMessageTitle = "Please add a title!";
        has_error = true;
      }
      return !has_error;
    },

    save: function (localmodel) {
      console.log("Save Stage", this.$parent);
      // console.assert(this.assembly.identifier);
      // console.log(this.localmodel);

      // update fields
      if (!this.localmodel.order_position) {
        this.localmodel.order_position = this.stage_count + 1;
      }

      this.addOrUpdateStage({ stage: this.localmodel });
    },

    // confirm_delete: function () {
    //   this.$q
    //     .dialog({
    //       title: "Confirm Deletion",
    //       message:
    //         "Would you like to delete this stage? Only Administrators can restore the data.",
    //       cancel: true,
    //       persistent: true,
    //     })
    //     .onOk(() => {
    //       this.delete();
    //       // console.log('I am triggered on both OK and Cancel')
    //     });
    // },

    // delete: function (localmodel) {
    //   console.log("DELETE Stage");
    //   console.assert(this.assembly.identifier);
    //   let url = `${process.env.ENV_APISERVER_URL}/assembly/${this.assembly.identifier}/stage`;
    //   url += `/{this.localmodel.id}`;

    //   ApiService.delete(url).then((response) => {
    //     // we have to update the assembly. (it contains a list of stages)
    //     this.add_or_update_assembly(response.data.assembly);
    //     this.$refs["popupeditor"].cancel();
    //   });
    // },

    ...mapActions({
      addOrUpdateStage: "assemblystore/addOrUpdateStage",
      // addOrUpdateStage: "assemblystore/addOrUpdateStage",
    }),
  },
};
</script>
