<template>
  <div v-if="$props.appId" class="q-pa-md">
    <div class="text-h6 q-pb-md">
      <!-- {{ application.name }} -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import { useApplications } from 'src/composables/useApplications'
import { useRouter } from 'vue-router'

// import samTruckRoster from 'src/components/truckRoster.vue'

export default defineComponent({
  props: {
    appId: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    const router = useRouter()

    if (!props.appId) {
      console.error('No application ID provided to load the correct form')
      void router.push({ path: 'applications' })
      return
    }

    // const { getApplication } = useApplications()
    // const application = getApplication(props.appId)

    return {  }
  },
  components: {
    // samTruckRoster,
  },


  methods: {
      aler() {
          console.log(this)
      }
  }
})
</script>