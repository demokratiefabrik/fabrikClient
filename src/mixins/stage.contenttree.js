import { mapGetters, mapActions } from 'vuex'
import StageMixin from 'src/mixins/stage'
import { ReactiveProvideMixin } from 'vue-reactive-provide'
import { runtimeStore } from "src/store/runtime.store"
import { LayoutEventBus } from 'src/utils/eventbus.js'
import constants from 'src/utils/constants'
import StandaloneContentTreeMixin from "src/mixins/standalone.contenttree";


export default {
  mixins: [
    StageMixin,
    StandaloneContentTreeMixin,
    // ReactiveProvideMixin({
    //   name: 'CONTENTTREE',
    //   include: [
    //     'contenttreeID', 'contenttree', 'salienceCompleted', 'rootElements', 'rootNode',
    //     "limitForAddingProposalsReached", "limitForAddingCommentsReached"],
    // })
  ],

  provide() {
    return {
      // getContentReference: this.getContentReference,
      // isRead: this.isRead,
      // isAlerted: this.isAlerted,
      // markDiscussed: this.markDiscussed,
      // markRead: this.markRead,
      // getDescendantsOf: this.getDescendantsOf,
      // openIndex: this.openIndex,
      // openArgument: this.openArgument,
      // filter_entries: this.filter_entries
    }
  },

  watch: {
    contenttreeID(to, from) {
      if (to) {
        this.$store.dispatch('contentstore/syncContenttree', {
          assemblyIdentifier: runtimeStore.assemblyIdentifier,
          contenttreeID: to,
          oauthUserID: this.oauth.userid
        })
      }
    },
  },

  computed: {

    // ready() {
    //   // console.log(this.contenttree.rootElementIds, " lll")
    //   // alert("L");
    //   const ready = this.$loaded(this.contenttree) && this.$loaded(this.contenttree.rootElementIds)

    //   if (ready) {
    //     LayoutEventBus.$emit('hideLoading')
    //   }
    //   // console.log("kkk", ready)
    //   return ready;
    // },

    contenttreeID: function () {
      // Mixin is only usable for pages with assemblyIdentifier in the URL
      console.log("load contenttreeID in contentree.computed")

      // console.log("RETRIEVE contenttreeID..", this.routed_stage)
      if (!this.routed_stage || !this.routed_stage?.stage?.contenttree_id) {
        console.log(" routed_stage not loaded")
        return (null)
      }

      console.log("contenttreeID", this.routed_stage?.stage?.contenttree_id)
      return (this.routed_stage?.stage?.contenttree_id)
    },


    // contenttree: function () {
    //   console.log("load contenttree in contentree.computed")
    //   if (!this.contenttreeID) {
    //     return null
    //   }

    //   console.assert(runtimeStore.assemblyIdentifier)


    //   // retrieve from localStorage
    //   const contenttree = this.get_contenttree({
    //     contenttreeID: this.contenttreeID
    //   })


    //   console.log("contenttree", contenttree)
    //   return (contenttree)
    // },

    // contents() {
    //   return this.contenttree.entries
    // },

    // rootNode() {
    //   return {
    //     id: null,
    //     path: [],
    //     children: this.rootElements,
    //   }
    // },

    // rootElements() {
    //   // TODO: sort....

    //   if (this.contenttree?.rootElementIds) {
    //     var elements = []
    //     this.contenttree.rootElementIds.forEach(x => {
    //       const el = this.contenttree.entries[x]
    //       elements = this.$pushSorted(elements, el);
    //     })

    //     return elements
    //   }
    // },

    // salienceCompleted() {
    //   // if (!this.routed_stage) { return undefined; }
    //   return this.numberOfUnsaliencedTopLevelEntries == 0
    // },



    // numberOfUnratedTopLevelEntries() {
    //   if (this.contenttree == null) {
    //     return null
    //   }
    //   const unrated_children = this.rootElements.filter(x => !this.$loaded(x.progression?.rating))

    //   return (Object.values(unrated_children).length)
    // },

    // numberOfUnsaliencedTopLevelEntries() {
    //   if (this.contenttree == null) {
    //     return null
    //   }
    //   const unsalienced_children = this.rootElements.filter(x => !this.$loaded(x.progression?.salience))
    //   return (Object.values(unsalienced_children).length)
    // },

    // ...mapGetters({
    //   get_contenttree: 'contentstore/get_contenttree'
    // })
  },

  methods: {

    // openIndex: function () {

    //   // REDIRECT TO ARGUMENT PAGE
    //   this.$router.push({
    //     name: this.routed_stage.stage.type, params: {
    //       assemblyIdentifier: runtimeStore.assemblyIdentifier,
    //       stageID: runtimeStore.stageID
    //       // contenttreeID: this.contenttreeID
    //     }
    //   })
    // },

    // openArgument: function (contentID) {

    //   if (this.standalone) {
    //     return
    //   }

    //   // REDIRECT TO ARGUMENT PAGE
    //   this.$router.push({
    //     name: this.routed_stage.stage.type,
    //     params: {
    //       assemblyIdentifier: runtimeStore.assemblyIdentifier,
    //       stageID: runtimeStore.stageID,
    //       contentID: contentID
    //     }
    //   })
    // },


    // /** Filter nodes by type (positive list) */
    // filter_entries: function (nodes, TYPES) {
    //   if (!nodes) {
    //     return null;
    //   }
    //   let filtered = nodes.filter(
    //     item => TYPES.includes(item.content.type)
    //   )
    //   return (filtered)
    // },

    // isRead: function (content) {
    //   return (!!content?.progression?.read)
    // },

    // isAlerted: function (content) {
    //   return (!!content?.progression?.alerted)
    // },

    // isSalienced: function (content) {
    //   return (this.$loaded(content.progression?.salience))
    // },

    // isRated: function (content) {
    //   this.$loaded(content.progression?.rating)
    // },

    // markRead(content) {
    //   const data = {
    //     contentID: content.content.id
    //   };
    //   this.$root.monitorLog(constants.MONITOR_SET_CONTENT_READ, data);

    //   // immediatly update vuex store
    //   this.update_read({
    //     contenttreeID: this.contenttreeID,
    //     contentID: content.content.id
    //   });
    // },


    // getDescendantsOf(node) {

    //   const nodePathLength = node.path.length
    //   const nodeID = node.content.id
    //   return Object.filter(
    //     this.contenttree.entries,
    //     (x) =>
    //       x.path &&
    //       x.path.length > nodePathLength &&
    //       x.path[nodePathLength - 1] == nodeID
    //   );
    // },

    // getContentReference(nodeID) {
    //   console.assert(nodeID)
    //   const content = this.contenttree.entries[nodeID]
    //   return content.content.title
    // },


    // markDiscussed(node) {
    //   console.assert(node)
    //   const data = {
    //     contentID: node.content.id
    //   };

    //   this.$root.monitorLog(constants.MONITOR_SET_CONTENT_DISCUSSED, data);

    //   // immediatly update vuex store
    //   this.update_discussed({
    //     contenttreeID: this.STAGE.contenttreeID,
    //     contentID: node.content.id
    //   });
    // },

    // ...mapActions("contentstore", ["update_read", 'update_discussed']),

  },

  mounted() {

    // when stage has been loaded already
    if (this.routed_stage?.stage.contenttree_id && this.oauth.userid) {
      this.$store.dispatch('contentstore/syncContenttree', {
        assemblyIdentifier: runtimeStore.assemblyIdentifier,
        contenttreeID: this.routed_stage.stage.contenttree_id,
        oauthUserID: this.oauth.userid
      })
    }

    // else {
    //   // Stage is not yet loaded: so wait until it is...
    //   LayoutEventBus.$once("EventStageLoaded", (stage) => {
    //     this.$store.dispatch('contentstore/syncContenttree', {
    //       assemblyIdentifier: runtimeStore.assemblyIdentifier,
    //       contenttreeID: stage.stage.contenttree_id,
    //       oauthUserID: this.oauth.userid
    //     })
    //   });
    // }
  }
}
