<template>
  <div>
    <select v-model="distribution" @change="plot()">
      <option value="uniform">Uniform</option>
      <option value="skewed-slight">Slightly Skewed</option>
      <option value="skewed-normal">Moderately Skewed</option>
      <option value="skewed-strong">Strongly Skewed</option>
      <option value="polarized-slight">Slightly Polarized</option>
      <option value="polarized-strong">Strongly Polarized</option>
    </select>

    <select v-model="number" @change="plot()">
      <option value="0">0</option>
      <option value="5">5</option>
      <option value="100">100</option>
      <option value="300">300</option>
      <option value="700">700</option>
      <option value="1000">1000</option>
    </select>

    &nbsp; MARKER-SIZE:
    <select v-model="markerSizeFactor" @change="plot()">
      <option value="0.1">---</option>
      <option value="0.3">--</option>
      <option value="0.5">0</option>
      <option value="0.8">+</option>
      <option value="1">++</option>
    </select>
    &nbsp; MARKER-COLOR:
    <select v-model="markerColorMap" @change="plot()">
      <option value="viridis">viridis</option>
      <option value="winter">winter</option>
      <option value="rainbow">rainbow</option>
      <option value="brg">brg</option>
      <option value="BrBG">BrBG</option>
      <option value="tab10">tab10 [Categorial]</option>
      <option value="tab20c">tab20c</option>
    </select>

    <button type="buton" @click="plot()">Just refresh</button>
  </div>

  <div
    v-html="cirplot"
    class="svg-container"
    :class="loading ? 'loading' : ''"
  ></div>

  <div id="userBoxHighlighted" v-if="highlightedUser && selectedEl">
    <q-card class="my-card">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">{{highlightedUser.U}}</div>
      </q-card-section>
    </q-card>

  </div>

  <div id="userBoxSelected" v-if="selectedUser && selectedEl">

     <q-card class="my-card" flat bordered>
      <q-card-section horizontal>

        <q-card-section class="q-pt-xs">
          <div class="text-overline">Zustimmung: {{selectedEl.getAttribute('value')}}/100</div>
          <div class="text-h5 q-mt-sm q-mb-xs">{{selectedUser.U}}</div>
          <div class="text-caption text-grey">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </div>
        </q-card-section>

        <!-- <q-card-section class="col-5 flex flex-center">
          <q-img
            class="rounded-borders"
            src="https://cdn.quasar.dev/img/parallax2.jpg"
          />
        </q-card-section> -->
      </q-card-section>

      <!-- <q-separator /> -->

      <q-card-actions>
        <q-btn flat round icon="message" />
        <q-btn flat>
          Nachricht senden
        </q-btn>
        <q-btn flat color="primary">
          Melden
        </q-btn>
      </q-card-actions>
    </q-card>

  </div>
</template> 

<script lang="ts">
interface ExtWindowObject extends Window {
  dmclick(l: HTMLElement, id: number): void;
  dmover(l: HTMLElement, id: number): void;
  dmout(l: HTMLElement, id: number): void;
}
declare var window: ExtWindowObject;

import { defineComponent } from 'vue';
import useCIRApi from '../utils/api';

interface IUser {
  U: string
}

export default defineComponent({
  name: 'PySwarmPlot',

  setup(){
    const cirapi = useCIRApi()
    return {api: cirapi}
  },

  data() {
    return {
      distribution: 'uniform',
      number: '700',
      markerSizeFactor: 0.5,
      markerColorMap: 'winter',
      loading: false,
      // message: '',
      cirplot: undefined as string | undefined,
      users: null as Record<string, IUser> | null,
      window,

      // chart interactivity
      highlightedId: null as number | null,
      highlightedEl: null as HTMLElement | null,
      highlightedUser: null as IUser | null,
      selectedUser: null as IUser | null,
      selectedId: null as number | null,
      selectedEl: null as HTMLElement | null,
      placeholderEl: null as HTMLElement | null,
    };
  },


  mounted() {

    const dotClick = (el: HTMLElement, id: number) => {
      this.selectedId = id;
      this.selectedEl = el;
      this.selectedUser = this.loadUser(id);

    };
    const dotMouseOver = (dotEl: HTMLElement, id: number) => {
      if (this.highlightedId !== id) {
        
        // de-highlight previous highlight
        if (this.highlightedId) {
          this.reorderChild(this.highlightedEl, true);
        }
        
        this.highlightedId = id;
        this.highlightedEl = dotEl;
        this.highlightedUser = this.loadUser(id);
        this.reorderChild(dotEl);
      }
    };

    this.window.dmclick = dotClick;
    this.window.dmover = dotMouseOver;
    this.plot();
    this.getUsers();
  },

  methods: {

    /**
     * Move child element to another position in the same tree
     * if reset= true: put element back to original position...
     * if reset = false: puts element to last position (z.index:top)
     */
    reorderChild(dotEl: HTMLElement | null, reset=false) {      
      const parentEl: HTMLElement | null = window.document.getElementById('scatgrid');
      let originalPos = dotEl?.getAttribute('pos');
      if (!parentEl || !dotEl || originalPos===undefined || originalPos===null || !dotEl.parentElement) {
        console.error('cannot find parent element (scatgrid)');
        return;
      }

      // Check if not already in front
      let gEl = dotEl.parentElement;
      if (reset) {
        parentEl.insertBefore(gEl, parentEl.children[originalPos]);
        // console.log(originalPos)
      } else {
        // Put in front
        parentEl.appendChild(gEl);
      }
    },

    plot: function () {
      this.loading = true;
      
      // TODO: transmit get object and not the final url...
      const url = `/cirplot?distribution=${this.distribution}&marker-color-map=${this.markerColorMap}&number=${this.number}&marker-size-factor=${this.markerSizeFactor}`
      this.api.polarbee(url).then(response => {
        this.loading = false;
        this.cirplot = response.data
      })
    },

    loadUser: function(userId: number): IUser | null {
      if (!this.users){
        console.error('users not yet loaded.')
        return null;
      }
      const userid = Object.keys(this.users)[userId]
      return this.users[userid];
    },

    getUsers: function () {
      this.loading = true;
      this.api.polarbeeUsers().then(response => {
        console.log('lll')
        this.users = response.data.users
      })
      

    // void api
    //   .get('/users')
    //   .then((response: IResponseUsers) => {
    //       return response.data.users;
    //   });




      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      // void api
      //   .get('/users')
      //   .then((response: IResponseUsers) => {
      //       this.users = response.data.users;
      //   });
    },
  },
});
</script>

<style lang="scss">
.svg-container {
  // padding: 1em;
  max-width: 1300px;
  display: inline-block;
  position: relative;
  width: 100%;

  &.loading {
    background-color: yellow;

    svg {
      background-color: grey;
      visibility: hidden;
    }
  }
}

svg {
  vertical-align: top;
  display: inline-block;
}

#dot60 {
  stroke-width: 20;
  stroke-opacity: 1 !important;
  stroke: yellow !important;

}

/* use { */
/* stroke-width: 10; */
/* cursor:pointer; */
/* d: path("M150, 10 L40, 200 L260, 200 L260, 200Z"); */
/* fill: #4c6edb;
  transition: all 0.35s ease; */
/* } */

/* use:active {
  d: path("M220, 10 L40, 10 L40, 220 L220, 220Z");
  fill: #6e40aa;
} */

#scatgrid use {
  cursor: pointer;

  /* OLD */
  /* fill: red; */
  /* stroke: pink; */
  /* stroke-width: 10px;
  stroke-dasharray: 125;
  stroke-dashoffset: -125;
  stroke-linecap: butt; */
  /* -webkit-transition: all 2s ease-out;
  -moz-transition: all 2s ease-out;
  -ms-transition: all 2s ease-out;
  -o-transition: all 2s ease-out;
  transition: all 2s ease-out; */
}

#scatgrid use:hover {
  // Hover
  fill: white !important;
  stroke-width: 3%;
  stroke-dashoffset: 0;
  stroke-opacity: 1 !important;
  stroke: red !important;
  stroke-dasharray: 125;
  z-index: +1000;
}

#matplotlib\.axis_1 path,
#matplotlib\.axis_2 path {
  stroke-dasharray: 125;
  stroke-dashoffset: -125;
  stroke-opacity: 0.8;
  stroke-width: 0.02em !important;
}

#patch_2 path,
#patch_3 path,
#patch_4 path,
#patch_5 path {
  // Disable borders
  stroke-opacity: 0;
}


#userBoxHighlighted{
  position:absolute;
  left:0px;
  top:100px;

}
</style>
