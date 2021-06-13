/**
 * Requires inherited contenttreeID
 */
import { mapGetters, mapActions } from 'vuex'
import { ReactiveProvideMixin } from 'vue-reactive-provide'
import { LayoutEventBus } from 'src/utils/eventbus.js'
import constants from 'src/utils/constants'

export default {
  mixins: [
    // StageMixin,
    ReactiveProvideMixin({
      name: 'CONTENTTREE',
      include: [
        'contenttree', 'salienceCompleted', 'rootElements', 'rootNode',
        "limitForAddingProposalsReached", "limitForAddingCommentsReached"],
    })
  ],

  provide() {
    return {
      getContentReference: this.getContentReference,
      isRead: this.isRead,
      isSalienced: this.isSalienced,
      isAlerted: this.isAlerted,
      markDiscussed: this.markDiscussed,
      markRead: this.markRead,
      getDescendantsOf: this.getDescendantsOf,
      filter_entries: this.filter_entries
    }
  },

  computed: {

    ready() {
      // console.log(this.contenttree.rootElementIds, " lll")
      // alert("L");
      const ready = this.$loaded(this.contenttree) && this.$loaded(this.contenttree.rootElementIds)

      if (ready) {
        LayoutEventBus.$emit('hideLoading')
      }
      // console.log("kkk", ready)
      return ready;
    },


    contenttree: function () {
      console.log("load contenttree in contentree.computed")
      if (!this.contenttreeID) {
        return null
      }

      // console.assert(runtimeStore.assemblyIdentifier)


      // retrieve from localStorage
      const contenttree = this.get_contenttree({
        contenttreeID: this.contenttreeID
      })


      console.log("contenttree", contenttree)
      return (contenttree)
    },

    contents() {
      return this.contenttree.entries
    },

    rootNode() {
      return {
        id: null,
        path: [],
        children: this.rootElements,
      }
    },

    rootElements() {
      // TODO: sort....

      if (this.contenttree?.rootElementIds) {
        var elements = []
        this.contenttree.rootElementIds.forEach(x => {
          const el = this.contenttree.entries[x]
          elements = this.$pushSorted(elements, el);
        })

        return elements
      }
    },

    salienceCompleted() {
      if (!this.routed_stage) { return undefined; }
      return this.numberOfUnsaliencedTopLevelEntries == 0
    },



    numberOfUnratedTopLevelEntries() {
      if (this.contenttree == null) {
        return null
      }
      const unrated_children = this.rootElements.filter(x => !this.$loaded(x.progression?.rating))

      return (Object.values(unrated_children).length)
    },

    numberOfUnsaliencedTopLevelEntries() {
      if (this.contenttree == null) {
        return null
      }
      const unsalienced_children = this.rootElements.filter(x => !this.$loaded(x.progression?.salience))
      return (Object.values(unsalienced_children).length)
    },

    ...mapGetters({
      get_contenttree: 'contentstore/get_contenttree'
    })
  },

  methods: {

    /** Filter nodes by type (positive list) */
    filter_entries: function (nodes, TYPES) {
      if (!nodes) {
        return null;
      }
      let filtered = nodes.filter(
        item => TYPES.includes(item.content.type)
      )
      return (filtered)
    },

    isRead: function (content) {
      return (!!content?.progression?.read)
    },

    isAlerted: function (content) {
      return (!!content?.progression?.alerted)
    },

    isSalienced: function (content) {
      return (this.$loaded(content.progression?.salience))
    },

    isRated: function (content) {
      this.$loaded(content.progression?.rating)
    },

    markRead(content) {
      const data = {
        contentID: content.content.id
      };
      this.$root.monitorLog(constants.MONITOR_SET_CONTENT_READ, data);

      // immediatly update vuex store
      this.update_read({
        contenttreeID: this.contenttreeID,
        contentID: content.content.id
      });
    },


    getDescendantsOf(node) {
      console.assert(node)
      const nodePathLength = node.path.length
      const nodeID = node.content.id
      return Object.filter(
        this.contenttree.entries,
        (x) =>
          x.path &&
          x.path.length > nodePathLength &&
          x.path[nodePathLength - 1] == nodeID
      );
    },

    getContentReference(nodeID) {
      console.assert(nodeID)
      const content = this.contenttree.entries[nodeID]
      return content.content.title
    },


    markDiscussed(node) {
      console.assert(node)
      const data = {
        contentID: node.content.id
      };

      this.$root.monitorLog(constants.MONITOR_SET_CONTENT_DISCUSSED, data);

      // immediatly update vuex store
      this.update_discussed({
        contenttreeID: this.contenttreeID,
        contentID: node.content.id
      });
    },

    ...mapActions("contentstore", ["update_read", 'update_discussed']),

  },
}
