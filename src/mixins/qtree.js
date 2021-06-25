/*
contains all method that are specific to q-tree. 
i.e.  filtering and management of expanded content .
*/

import constants from 'src/utils/constants'
import { mapActions, mapGetters } from 'vuex'
import { runtimeStore } from "src/store/runtime.store"
import { dom } from 'quasar'
const { offset } = dom
import { scroll } from 'quasar'
const { getScrollPosition, setScrollPosition } = scroll


export default {
    data() {
        return {
            tempBufferForJustReadContent: [],
            animationDuration: 150,
            // TODO: performance optimization by disable animation...
            expanded: null,
            // last_expanded_node: null,  // for lazy refresh when filter criteria do not meet anymore...
            treeFilter: {},
            highlightedNodeID: null,
            expanded_filter: null
        }
    },

    /*
    Which <label> should be displayed on top of the ContentTree?
    SHould the Tree be displayed in <dense> layout?
    SHould the whole ContentTree be displayed or only a specific <childrenNodes>?

    <filterTypes>: You may additionaly limit the nodetypes to insert:...
    If nothing is indicated: every type is allowed, that is allowed for the given parent. */

    props: [
        'label',
        "accordion", // bool. Note: Default qtree accoridion does not work here
        'dense',
        'doNotExpandNodesAtInitialization',
        'node',
    ],
    provide() {
        return {
            // contenttreeID: this.STAGE.contenttreeID,
            toggle_node: this.toggle_node,
            // markDiscussed: this.markDiscussed,
            is_currently_expanded_id: this.is_currently_expanded_id,
            is_currently_expanded: this.is_currently_expanded,
        }
    },
    // 'STAGE'
    inject: ['CONTENTTREE', 'isRead', 'markRead'],
    computed: {

        total_nof_contents: function () {
            return this.node.nof_descendants
        },

        ...mapGetters({
            public_profile: "publicprofilestore/get_public_profile",
            IsManager: "assemblystore/IsManager",
            get_allowed_node_types: 'contentstore/get_allowed_node_types',
            getExpandedBranches: 'contentstore/getExpandedBranches'
        }),
    },

    methods: {
        is_currently_expanded: function (node) {
            if (this.$loaded(this.expanded)) {
                return (this.expanded.includes(`${node.id}`))
            }
        },

        is_currently_expanded_id: function (node_id) {
            return (this.expanded.includes(`${node_id}`))
        },

        toggle_node: function (node) {
            if (this.expanded.includes(node.id)) {
                this.collapse_node(node)
            } else {
                // this.last_expanded_node = node
                this.tempBufferForJustReadContent.push(node.content.id)
                this.expand_node(node)
            }
        },

        // scroll_and_expand_node(node) {
        //     this.expand_node(node)
        //   this.  
        // },

        collapse_node: function (node) {
            this.expanded = this.expanded.filter(x => x != `${node.id}`)
            this.highlightNode(node)
            this.updateExpanded()
        },

        /* expand node and a few of its children */
        expand_node: function (node) {
            let newlyExpanded = null
            const isTopBranch = node.content.parent_id === null || node.content.parent_id == this.node.id
            if (this.accordion && isTopBranch) {
                newlyExpanded = this.expand_node_accordion(node)
            } else {
                // console.log("EXPAND THIS", node, node?.nof_descendants);
                newlyExpanded = this.calculate_default_expanded_branches(node, 3);
                this.expanded = this.expanded.concat(newlyExpanded);
                this.updateExpanded()
            }
            // mark newly Expanded as Read...
            this.highlightNode(node.content)
            this.markAsReadByIDs(newlyExpanded)
        },


        /* expand root-branch  and a few of its children, while closing all other branches */
        expand_node_accordion: function (node) {

            let originOffsetTop = null
            let originalScrollPosition = null

            const rootIds = this.node.children.map(x => x.content.id)
            const anchor = `NODE${node.content.id}`
            const dom = document.getElementsByName(anchor);
            const ele = dom?.item(0)

            // dont use animations for this stepp:
            const originalAnimationDuration = this.animationDuration
            this.animationDuration = 0

            // close all branches
            this.expanded = this.expanded.filter(x => !rootIds.includes(parseInt(x)))

            // get original scroll position...
            originalScrollPosition = getScrollPosition(window);
            // get original position of clicked node...
            originOffsetTop = this.$getOffsetTop(ele)
            console.log("originalScrollPosition", originalScrollPosition, "originOffsetTop", originOffsetTop)

            // console.log("EXPAND THIS", node);
            const newlyExpanded = this.calculate_default_expanded_branches(node, 3);
            this.expanded = this.expanded.concat(newlyExpanded);
            this.updateExpanded()


            // Scroll to newly opened element... (WHEN Root-Branch changes...)
            setTimeout(() => {
                const offsetDiff = this.$getOffsetTop(ele) - originOffsetTop
                if (offsetDiff < 0) {
                    setScrollPosition(window, originalScrollPosition + offsetDiff, 0);

                    // reset animations :
                    this.animationDuration = originalAnimationDuration
                }
            }, 60 * 5);

            return (newlyExpanded)
        },

        highlightNode(node) {
            this.highlightedNodeID = node ? node.id : null
        },

        markAsReadByIDs(ids) {
            ids.forEach(nodeId => {
                if (!nodeId) { return; }
                const entry = this.CONTENTTREE.contenttree.entries[parseInt(nodeId)]
                if (entry && !this.isRead(entry)) {
                    console.log("not read...")
                    this.markRead(entry)
                }
            })
        },

        expand_none: function () {
            console.log('expand_none')
            this.expanded = []
            this.highlightNode(null)
            this.updateExpanded()
        },

        focus_on_branch: function (node) {
            this.$root.scrollToAnchor(`NODE${node.content.id}`, 0)
            this.expanded_filter = false
            this.expand_node(node)
            console.assert(node.content.id)
        },

        // SELECT X elements that are expanded initially..
        calculate_default_expanded_branches: function (node, QTREE_NUMBER_OF_INITIALLY_EXPANDED_NODES = null) {
            if (!QTREE_NUMBER_OF_INITIALLY_EXPANDED_NODES) {
                QTREE_NUMBER_OF_INITIALLY_EXPANDED_NODES = constants.QTREE_NUMBER_OF_INITIALLY_EXPANDED_NODES
            }
            if (node.content && !node.id) {
                node.id = node.content.id
            }
            const selected = node ? [`${node.id}`] : []
            if (!node?.nof_descendants) {
                return (selected)
            }

            let sample = node.children;
            function weighted_random(items, weights) {
                var i;
                for (i = 0; i < weights.length; i++) {
                    weights[i] += weights[i - 1] || 0;
                }
                var random = Math.random() * weights[weights.length - 1];
                for (i = 0; i < weights.length; i++) {
                    if (weights[i] > random) {
                        break;
                    }
                }
                return items[i];
            }
            while (selected.length <= QTREE_NUMBER_OF_INITIALLY_EXPANDED_NODES && sample.length > 0) {
                // add newSelected to selected / remove newSelected from sample / add their children to sample
                const weights = sample.map(child => child.nof_descendants + 1);
                const newSelected = weighted_random(sample, weights);
                selected.push(`${newSelected.id}`);
                sample = sample.filter(child => child.id !== newSelected.id)
                sample = sample.concat(newSelected.children);
            }
            return (selected);
        },

        /* Method store list of expanded array in localstorage */
        updateExpanded: function () {

            // remove duplciateds
            this.expanded = [...new Set(this.expanded)];

            // PERFORMANCE: 
            // Either: 
            // // inform children...
            // this.expanded.forEach(                
            // )

            this.update_expanded_branches({
                contenttreeID: this.CONTENTTREE.contenttree.id,
                rootNodeID: this.node.id,
                expanded: this.expanded
            })

            this.$store.dispatch('contentstore/syncContenttree', {
                assemblyIdentifier: runtimeStore.assemblyIdentifier,
                contenttreeID: this.CONTENTTREE.contenttree.id,
                oauthUserID: this.oauth.userid
            })

        },

        // FILTER TREE
        treeFilterMethod(node, enabledFilter) {

            if (this.treeFilter.focus) {
                // False, if at least one path element is not in the current node' path.
                // console.log(this.treeFilter.path, node.path)
                if (this.treeFilter.focus.path.find(id => !node.path.includes(id))) {
                    return false
                }
            }

            if (!this.expanded_filter) {
                return true;
            }
            if (this.treeFilter.own) {
                if (node.creator.id !== this.public_profile.id) {
                    return false;
                }
            }
            if (this.treeFilter.new) {
                if (node.progression?.read && !this.tempBufferForJustReadContent.includes(node.content.id)) {
                    // if (node.progression?.read && node !== this.last_expanded_node) {
                    return false
                }
            }
            if (this.treeFilter.unreviewed) {
                if (node.content?.reviewed || !node.content.private_property) {
                    return false;
                }
            }
            if (this.treeFilter.text.length) {
                var searchable = '';
                searchable += `${node.content.title} ${node.content.text} #${node.content.id}  @${node.creator.FN} `
                if (searchable.toLowerCase().indexOf(this.treeFilter.text.toLowerCase()) == -1) {
                    return false;
                }
            }

            return true;
        },

        resetFilter() {
            // console.log('reset filter')
            this.treeFilter = {
                text: '',
                focus: null,
                own: false,
                new: false,
                unreviewed: false // used for manager review
            }
        },

        resetFilterFocus() {
            // console.log('reset filter focus')
            this.treeFilter = {
                focus: null,
            }
        },

        ...mapActions("contentstore", ["update_read", 'update_expanded_branches']),
    },

    created: function () {

        this.resetFilter()

        this.expanded_filter = this.IsManager;
        console.log(this.CONTENTTREE.contenttree, "Lllllllll")
        // set expanded branches
        this.expanded = this.getExpandedBranches({
            contenttreeID: this.CONTENTTREE.contenttree.id,
            rootNodeID: this.node.id
        });

        if (this.expanded === null) {
            console.assert(this.CONTENTTREE.contenttree)
            // Nothing expaneded here: so expand 15 random branchens
            if (this.doNotExpandNodesAtInitialization) {
                this.expanded = []
            } else {
                this.expanded = this.calculate_default_expanded_branches(this.node)
            }
            this.update_expanded_branches({
                contenttreeID: this.CONTENTTREE.contenttree.id,
                rootNodeID: this.node.id,
                expanded: this.expanded
            })

            // mark newly Expanded as Read...
            this.markAsReadByIDs(this.expanded);
        }
    }
}
