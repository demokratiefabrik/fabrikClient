/**
 * Requires inherited contentID
 * TODO: rename node to content
 */
import { ReactiveProvideMixin } from 'vue-reactive-provide'

export default {
  // mixins: [StandaloneContentTreeMixin,
  mixins: [
    // ContentTreeMixin,
    ReactiveProvideMixin({
      name: 'CONTENT',
      include: [
        'nodeChildren', 'node'],
    })
  ],

  data() {
    return {
      // contentID: null,
      numberOfCurrentlySaliencedEntries: 0

    }
  },

  provide() {
    return {
      incrementNumberOfCurrentlySaliencedEntries: this.incrementNumberOfCurrentlySaliencedEntries,
    }
  },

  /**
   * Refrshs current content (if url changes...)
   **/
  computed: {

    node: function () {

      if (!this.contenttree) {
        return null;
      }


      if (!this.contentID) {
        return null
      }
      const node = this.contenttree?.entries[this.contentID]
      return node
    },

    nodeChildrenObject() {

      if (!this.contenttree) {
        return null;
      }


      if (!this.node) {
        return null
      }
      return Object.filter(this.contenttree?.entries, x => this.contenttree.entries[x.content.id].content.parent_id == this.contentID)
    },

    nodeChildren() {

      if (!this.contenttree) {
        return null;
      }

      if (!this.nodeChildrenObject) {
        return null
      }

      let contents = []
      Object.values(this.nodeChildrenObject).forEach(x => {
        this.$pushSorted(contents, x);
      })

      return contents
      // return Object.values(this.nodeChildrenObject)
    },

    salienceCompleted() {
      // if (!this.routed_stage) {
      //   return null;
      // }

      if (!this.contenttree) {
        return null;
      }



      if (!this.$loaded(this.nodeChildren)) {
        return null;
      }

      // console.log(this.numberOfCurrentlySaliencedEntries, "Ll")
      if (this.numberOfCurrentlySaliencedEntries >= 5) {
        return (true)
      }

      return this.numberOfUnsaliencedTopLevelEntries == 0
    },


    numberOfUnratedTopLevelEntries() {
      if (!this.$loaded(this.node) || !this.$loaded(this.nodeChildren)) {
        return null
      }

      const unrated_children = this.nodeChildren.filter(x => !this.$loaded(x.progression?.rating))
      return (unrated_children.length)
    },

    numberOfUnsaliencedTopLevelEntries() {
      if (!this.$loaded(this.node) || !this.$loaded(this.nodeChildren)) {
        return null
      }
      const unsalienced_children = this.nodeChildren.filter(x => !this.$loaded(x.progression?.salience))
      return (unsalienced_children.length)
    },
  },
  methods: {
    incrementNumberOfCurrentlySaliencedEntries() {
      this.numberOfCurrentlySaliencedEntries += 1
    },

  },
}
