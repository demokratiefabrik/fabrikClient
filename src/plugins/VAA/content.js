// import { mapGetters } from 'vuex'
import ContentTreeMixin from 'src/mixins/stage.contenttree'
// import { ReactiveProvideMixin } from 'vue-reactive-provide'
// import { runtimeStore } from "src/store/runtime.store"
// import { LayoutEventBus } from 'src/utils/eventbus.js'

export default {
  mixins: [ContentTreeMixin],


  data() {
    return {
      topicID: null
    }
  },

  computed: {

    topic: function () {
      if (!this.topicID || !this.contenttree) {
        return null
      }
      return this.contenttree.entries[this.topicID]
    },


    node: function () {
      if (!this.topicID) {
        return null
      }
      return this.contenttree.entries[this.topicID]
      // TODO: error handling in case of a wrong url
    },

  },


  mounted() {
    // console.log("MOUNTED????", this.$route.params.contentID)
    if (this.$route.params.contentID) {
      this.topicID = this.$route.params.contentID
    }
  }
}
