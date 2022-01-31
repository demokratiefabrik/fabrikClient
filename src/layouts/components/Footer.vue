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
              target="_blank"
               href="/storage/upload/Ergebnisbericht_Demokratiefabrik_Koeniz_20210824.pdf"
              alt="Ergebnisbericht der Könizer Demokratiefabrik"
            >
               <q-icon
          name="mdi-file-chart-outline"
          class="text-grey-9"
          size="4em"
        />  
              </a>
          </div>
<br>

          <div>
            <b>Ergebnisbericht</b><br>
            Der Ergebnisbericht der Könizer Demokratiefabrik 2021 ist online. Sie können ihn hier herunterladen. <br><br>
            <a 
               href="/storage/upload/Ergebnisbericht_Demokratiefabrik_Koeniz_20210824.pdf"
              style="float:left"
              target="_blank"
              alt="Ergebnisbericht der Könizer Demokratiefabrik"
>Ergebnisbericht vom 24.08.2021 (PDF)</a>
          </div>


        </div>

        <div class="col-6  footerbox">
            <div >
            <a
              href="https://41b4d1a2.sibforms.com/serve/MUIEALtZ0tbJUdnbW6ml1EOJEi6-GVTwt8TQOQDOH_7-Uz2XSsrJTzb5FWqz7uR9jbRyWMUke45Y1ZUaT9Ckw4KzzG4aQ2FM-R6akCrwWKr9_KqSXGQg5B0gXZTn1PXhzYWb-bJsCpGN20EmFuXXmhlVKgqD4INCKAZpsTfyqK9dPa3FDyoox8Z2Ey6yrizGtLJZzVoL45NWTPpc"
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
        <div class="col-6 footerbox">
          <div class="imagebox">
            <a
              href="https://www.unibe.ch"
              target="_blank"
              alt="Universität Bern"
            >
              <q-img
                src='layout/logoaps.png'
                contain
                class="q-ma-sm"
                style="max-width: 180px; width: 80%;"
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

<!-- 
        <div class="col-4  footerbox">
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
            <b>Universität Bern</b><br>
            Fabrikstrasse 8<br>
3012 Bern<br><br>
          </div>

        </div> -->



      <!-- SNF -->
        <div class="col-6  footerbox">
          <div class="imagebox">
            <a
              href="https://www.unibe.ch"
              target="_blank"
              alt="Schweizerischer Nationalfonds (SNF)"
            >
              <q-img
                src='layout/logosnf.png'
                contain
                class="q-ma-sm"
                style="max-width: 180px; width: 80%;"
              >
              </q-img>
            </a>
          </div>

          <div>
            <b>Schweizerischer Nationalfonds (SNF)</b><br>
            Dieses Projekt wird vom Schweizerischen Nationalfonds SNF im Rahmen des NFP77-Projektes "Digitale Transformation" finanziert (Projekt-Nr. 187496).<br><br>
          </div>

        </div>



        <!-- <div class="col-4  footerbox">
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

        </div> -->

        <!-- <div class="col-4  footerbox">
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
          </div>
        </div> -->
      </div>
    </q-page>
  </div>
</template>

<script lang="ts">
// import constants from "src/utils/constants";
import NewsletterForm from 'src/components/NewsletterForm.vue';
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Footer',
  components: {
    NewsletterForm
  }
});
</script>