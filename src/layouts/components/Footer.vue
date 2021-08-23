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


    <!-- Seperator  -->
    <div class="row justify-between">
      <div class="seperator">
        <q-icon name="mdi-star-four-points-outline" />
      </div>
    </div>


    <q-page class="doc_content" style="height:10em">
      <div class="q-col-gutter-md row items-start">
        <div class="col-6 footerbox">
          <div>
            <a
              href=""
              alt="Ergebnisbericht Könizer Demokratiefabrik"
            >
               <q-icon
          name="mdi-file-chart-outline"
          class="text-grey-9"
          size="4em"
        />  
              </a>
          </div>
<br>

          <!-- <div>
            <b>Ergebnisbericht</b><br>
            Der Ergebnisbericht der Könizer Demokratiefabrik vom Juni/Juli 2021 ist online. Sie können ihn hier herunterladen. <br>
            <br><a href="/impressum">Ergebnisbericht vom 24.08.2021 (PDF)</a>
          </div> -->

          <div>
            <b>Ergebnisbericht</b><br>
            Der Ergebnisbericht der Könizer Demokratiefabrik vom Juni/Juli 2021 ist bald online. Sie können ihn bald hier herunterladen. <br>
          </div>

        </div>

        <div class="col-6  footerbox">
            <div >
            <a
              href="https://41b4d1a2.sibforms.com/serve/MUIEAOqPps44Ywh4UHtxUCLCufSBHN9EsHAwfHB3OLFpmahyNcET11SuiB97sK1VBvtIVWIaz5-BpdjHzGGynB1DjYONx_4UE6qFuyR_mKjL1Vull29FU1_qCfHJJpjAMUx2PfCPmXhuiH_3RAL7olhf3SDJbRfT-Wgjro4rMzBRFOSFLkQwczHjl5OeOsSPEtfVB2doooUF3fi-"
              target="_blank"
              alt="Newsletter"
            >
         <q-icon
          name="mdi-email-variant"
          class="text-grey-9"
          size="4em"
        />  </a>
          </div>
<br>
          <div>
            <NewsletterForm></NewsletterForm>
          </div>

        </div>
      </div>


      <!-- Seperator  -->
    <!-- <div class="row justify-between">
      <div class="seperator">
        <q-icon name="mdi-minus" size="1.5em"/>
        <q-icon name="mdi-minus" size="1.5em"/>
        <q-icon name="mdi-minus" size="1.5em"/>
        
      </div>
    </div> -->
    <hr>
<br>
<br>
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
// import constants from "src/utils/constants";
import NewsletterForm from "src/components/NewsletterForm.vue";

export default {
  name: "Footer",
  components: {
    NewsletterForm
  },
  // methods: {
  //   debug() {
  //     this.$root.monitorFire(constants.MONITOR_STAGE_RANDOM_SAMPLING_CONTENT);
  //     this.$root.monitorFire(constants.MONITOR_CONTEXT);
  //   },
  // },
};
</script>