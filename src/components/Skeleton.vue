
<style lang="sass" scoped>
.q-skeleton
  z-index: 0
</style>
</style><template>
  <div>
    <q-tooltip max-width="300px">
      {{ $t('menu.items.locked.tooltip') }}
    </q-tooltip>

    <h2 disabled> {{h2}}

      <q-badge
        color="orange"
        style="position:relative; top:-1em;"
      >
        <q-icon
          name="mdi-clock-time-eleven-outline"
          size="1.2em"
        />
      </q-badge>
    </h2> <a name="FORUM" />

    <q-card
      style="full-width"
      flat
    >

      <q-skeleton
        type="text"
        class="text-subtitle1"
      />
      <q-skeleton
        type="text"
        width="50%"
        class="text-subtitle1"
      />
      <q-skeleton
        type="text"
        class="text-subtitle1"
      />
      <q-skeleton
        type="text"
        width="50%"
        class="text-subtitle1"
      />

    </q-card>
  </div>

</template>


<script>
export default {
  name: "Skeleton",
  props: ["h2"],
};
</script>
