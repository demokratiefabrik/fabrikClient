<template>
  <!-- 
                <q-item-section avatar>
                  <q-avatar
                    icon="mdi-image-filter-hdr"
                    :style="{
                      'background-color': profile ? profile.CO : 'inherit',
                    }"
                    :text-color="profile ? 'white' : 'primary'"
                    class="q-mr-sm"
                  >
                    <q-tooltip

                      >{{ version.user_profile.username_formatted }}
{{version.user_profile.username_derivation_formatted}}</q-tooltip
                    >
                  </q-avatar>
                  <span class="text-bold">{{
                    version.user_profile)
                  }}</span>
                </q-item-section>

                <q-item-section>
                  <q-item-label>
                    Änderung vom {{ version.date_formatted }}
                  </q-item-label>
                  <div
                    v-for="(change, index) in humanReadable(
                      Object.entries(version.changeset)
                    )"
                    :key="`change_${version.id}_${index}`"
                  >
                    <q-tooltip>Ursprünglich: {{ change[1][0] }}</q-tooltip>
                    {{ change[0] }}: <i>{{ change[1][1] }}</i>
                  </div>
                </q-item-section>
              </q-item> -->

  <q-item>
    <q-item-section avatar>
      <q-avatar
        icon="mdi-image-filter-hdr"
        :style="{ 'background-color': profile ? profile.CO : 'inherit' }"
        :text-color="profile ? 'white' : 'primary'"
        class="q-mr-sm"
      >
        <q-tooltip>{{ username }} {{ username_derivation }}</q-tooltip>
      </q-avatar>
      <span class="text-bold">{{ username }}</span>
    </q-item-section>

    <q-item-section v-if="text">
      <q-item-label>
        {{ text }}
      </q-item-label>
      <template v-if="version?.changeset">
        <div
          v-for="(change, index) in humanReadableContent"
          :key="`change_${index}`"
        >
          <q-tooltip>Ursprünglich: {{ change.values.old }}</q-tooltip>
          {{ change.label }}: <i>{{ change.values.new }}</i>
        </div>
      </template>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import useAuthComposable from 'src/composables/auth.composable';
import { defineComponent } from 'vue';

interface IChange {
  label: string | null;
  values: { old: string | null; new: string | null };
}

export default defineComponent({
  setup() {
    const { getUsername, getUsernameDerivation } = useAuthComposable();
    return { getUsernameDerivation, getUsername };
  },
  name: 'ContentVersionItem',
  props: ['profile', 'customText', 'version'],
  data() {
    return {};
  },

  computed: {
    humanReadableContent(): IChange[] {
      return this.humanReadable(Object.entries(this.version.changeset));
    },

    username(): string {
      if (this.profile) {
        return this.getUsername(this.profile);
      }

      return '';
    },

    username_derivation(): string {
      if (this.profile) {
        return this.getUsernameDerivation(this.profile);
      }
      return '';
    },

    text(): string | null {
      if (this.customText) {
        return this.customText;
      }

      if (this.version) {
        const date_formatted = this.$filters.formatDate(this.version.date);
        return `Änderung vom ${date_formatted}`;
      }

      return '-';
    },
  },

  methods: {
    humanReadable(changeset): IChange[] {
      const fieldsNotToIgnore = ['title', 'text', 'parent_id'];
      changeset = changeset.filter((change) =>
        fieldsNotToIgnore.includes(change[0])
      );
      return changeset.map((change) => this.humanReadableChange(change));
    },

    humanReadableChange(change): IChange {
      const labelled = {
        label: null,
        values: {
          old: null,
          new: null,
        },
      };

      // convert values
      const dateFields = ['date_modified'];
      let func = (x) => {
        return x;
      };

      if (dateFields.includes(change[0])) {
        func = this.$filters.formatDate;
      }

      labelled.values.old = func(change[1][0]);
      labelled.values.new = func(change[1][1]);

      // convert field labels
      const labels = {
        date_modified: 'Datum',
        title: 'Titel',
        type: 'Typ',
        parent_id: 'Angehängt bei',
        text: 'Text',
      };

      if (change[0] in labels) {
        labelled.label = labels[change[0]];
      }
      return labelled;
    },
  },
});
</script>
