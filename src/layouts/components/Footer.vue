<style lang="sass">
.footerbox
  min-width: 200px !important
  margin-bottom: 4em

  .imagebox
    height: 130px
    vertical-align: bottom
</style>
<template>

  <div class=" full-width text-primary  bg-white ">
    <!-- Footer  -->
    <div class="row justify-between">
      <div class="seperator">
        <q-icon name="mdi-star-four-points-outline" />
      </div>
    </div>
    <!-- bg-blue-grey-2 -->
    <!-- style="border-top: 1px solid black" -->
    <br><br>
    <br>
    <q-page class="doc_content">
      <div class="q-col-gutter-md row items-start">
        <div class="col-4 footerbox">
          <div class="imagebox">
            <a
              href="https://www.unibe.ch"
              target="_blank"
              alt="Universität Bern"
            >
              <q-img
                src='layout/logounibe.png'
                contain
                class="q-ma-sm"
                style="max-width: 120px; width: 80%;"
              >
              </q-img>
            </a>
          </div>

          <div>
            <b>Projektleitung Bürgerbeteiligung und Plattformbetreiberin</b><br>
            Année Politique Suisse<br>
            Institut für Politikwissenschaft<br>
            Universität Bern<br>
            Fabrikstrasse 8<br>
            CH-3012 Bern<br>
            demokratiefabrik.ipw@unibe.ch<br>
            Tel. +41 (0)31 684 32 83<br><br>
            <a href="/impressum">Impressum & Datenschutzerklärung</a>
          </div>

        </div>

        <div class="col-4  footerbox">
          <div class="imagebox">
            <a
              href='https://www.politools.net'
              target="_blank"
              alt="Politools"
            >
              <q-img
                src='layout/logosmartvote.jpg'
                contain
                class="q-ma-sm"
                style="max-width: 170px; width: 100%;"
              >
              </q-img>
            </a>
          </div>

          <div>
            <b>Online-Wahlhilfe smartvote</b><br>
            Betrieben vom neutralen non-profit Verein
            <a
              href='https://www.politools.net'
              target="_blank"
              alt="Politools"
            >Politools</a>, 3000 Bern<br><br>
          </div>

        </div>

        <div class="col-4  footerbox">
          <div
            class="imagebox "
            style="text-align:center"
          >

            <a
              href="http://www.koeniz.ch"
              target="_blank"
              alt="Gemeinde Köniz"
            >
              <q-img
                src='layout/logokoeniz.svg'
                contain
                class="q-ma-sm"
                style="max-width: 120px; width: 80%;"
              >
              </q-img>
            </a>
          </div>
          <div>
            <b>Gemeinde Köniz</b> Partnergemeinde während der Könizer Demokratiefabrik
            <!-- <q-btn @click="debug">DEBUG</q-btn> -->
          </div>
        </div>
      </div>
    </q-page>
  </div>
</template>

<script>
import constants from "src/utils/constants";

export default {
  name: "Footer",
  // methods: {
  //   debug() {
  //     this.$root.monitorFire(constants.MONITOR_STAGE_RANDOM_SAMPLING_CONTENT);
  //     this.$root.monitorFire(constants.MONITOR_CONTEXT);
  //   },
  // },
};
</script>