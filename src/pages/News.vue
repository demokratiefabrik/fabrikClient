<template>
  <q-page class="doc_content">

    <ArtificialModeration
      :AM="AMs.news_top"
      :role="1"
      alignment="right"
      :ctx="that"
    />

    <h1>{{$t('news.h1')}}</h1>

    <div class="q-px-lg q-pb-md">
      <q-timeline color="secondary">

        <q-timeline-entry
          title="Könizer Demokratiefabrik - das Walkthrough Video"
          subtitle="1. November 2021"
          icon="mdi-video-outline"
        >

          <div>
            <a
              href="/storage/koeniz2021_walkthrough_de.mp4"
              style="float:left; padding-right: 15px; margin-bottom:1em;"
              target="_blank"
              alt="Könizer Demokratiefabrik Walkthrough Video"
            >
              <q-icon
                name="mdi-video-outline"
                class="text-grey-9"
                size="4em"
              />

              <br>Walkthrough Video (MP4)
            </a>

            <div style="block">
              Sind Sie neugierig, wie die Könizer Demokratiefabrik von Innen ausgesehen hat? Dann laden Sie hier das Walktrhough Video herunter.
            </div>

          </div>
        </q-timeline-entry>

        <q-timeline-entry
          title="Ergebnisbericht der Könizer Demokratiefabrik"
          subtitle="24. August 2021"
          icon="mdi-file-chart-outline"
        >

          <div>
            <a
              href="/upload/Ergebnisbericht_Demokratiefabrik_Koeniz_20210824.pdf"
              style="float:left; padding-right: 15px; margin-bottom:1em;"
              target="_blank"
              alt="Ergebnisbericht der Könizer Demokratiefabrik"
            >
              <q-icon
                name="mdi-file-chart-outline"
                class="text-grey-9"
                size="4em"
              />

              <br>Ergebnisbericht <br>vom 24.08.2021<br>(PDF)
            </a>

            <div style="block">
              Das Demokratiefabrik-Team der Universität Bern hat die Könizer Demokratiefabrik bereits etwas genauer angeschaut
              und einen Ergebnisbericht dazu erstellt.
              Der Bericht gibt Auskunft über die Idee und den Aufbau der Demokratiefabrik, sowie darüber, wie der smartvote-Fragebogen
              zu Stande kam und welche Personengruppen bei der Erarbeitung mitgeholfen haben. Zuletzt fasst der Ergebnisbericht
              die ersten Erkenntnisse aus der Evaluation der Demokratiefabrik zusammen.</div>

            <!-- <a 
               href="/upload/Ergebnisbericht_Demokratiefabrik_Koeniz_20210824.pdf"
              style="float:left"
              target="_blank"
              alt="Ergebnisbericht der Könizer Demokratiefabrik"
>Ergebnisbericht vom 24.08.2021 (PDF)</a> -->

          </div>
          <div style="padding-top:5px; clear:both;">
            Regionale Medien berichteten über das Projekt: In der August-Ausgabe von Köniz Innerorts, die diese Woche erscheint, finden Sie ebenfalls eine kurze Zusammenfassung des Ergebnisberichts.
            In der Ausgabe des Regionaljournals Bern Fribourg Wallis des Schweizer Radio und Fernsehen (SRF) vom 17. August 2021 können Sie <a
              href="https://www.srf.ch/audio/regionaljournal-bern-freiburg-wallis/wahlen-koeniz-buerger-stellen-den-kandidierenden-fragen?id=12038889"
              target="_blank"
            >ein Gespräch mit dem Könizer Gemeindeschreiber Pascal Arnold und der Projektleiterin der Demokratiefabrik zum Könizer smartvote-Fragebogen nachhören</a> (ab 08:35).

            <br><br>
            Möchten Sie übrigens über die kommenden Etappen der Demokratiefabrik auf dem Laufenden bleiben? Dann können Sie sich zum Newsletter anmelden:
            <a
              href="https://41b4d1a2.sibforms.com/serve/MUIEALtZ0tbJUdnbW6ml1EOJEi6-GVTwt8TQOQDOH_7-Uz2XSsrJTzb5FWqz7uR9jbRyWMUke45Y1ZUaT9Ckw4KzzG4aQ2FM-R6akCrwWKr9_KqSXGQg5B0gXZTn1PXhzYWb-bJsCpGN20EmFuXXmhlVKgqD4INCKAZpsTfyqK9dPa3FDyoox8Z2Ey6yrizGtLJZzVoL45NWTPpc"
              target="_blank"
            >Newsletter-Anmeldung</a>
          </div>
        </q-timeline-entry>

        <q-timeline-entry
          title="Die Könizer Demokratiefabrik schliesst ihre Tore"
          subtitle="4. Juli 2021"
          icon="mdi-flag-checkered"
        >
          Der in der Demokratiefabrik zusammengestellte smartvote-Fragebogen wird aktuell vom Projektteam
          bereinigt und steht ab Mitte August auf der Online-Wahlhilfe www.smartvote.ch zur Verfügung.
        </q-timeline-entry>

        <q-timeline-entry
          title="Eröffnung der Könizer Demokratiefabrik"
          subtitle="14. Juni 2021"
          icon="mdi-door-open"
        >
          <div>
            Wir sind bereit für die Könizerinnen und Könizer, die sich in den nächsten Wochen in der Demokratiefabrik engagieren werden. <br><br>
            <img
              src="/upload/demokratiefabrik-team-medium.png"
              class="full-width"
            />
            <div>Von links nach rechts: Catalina Schmid, Dominik Wyss, Viktoria Kipfer, Marlène Gerber und Giada Gianola</div>

            <br>
          </div>
        </q-timeline-entry>

        <q-timeline-entry
          title="Medienberichterstattung zum Projekt-Auftakt in Köniz"
          subtitle="27. Mai 2021"
          icon="mdi-newspaper-variant-multiple-outline"
        >
          <div>
            Kurz vor Projektstart haben die Medien bereits über unser Projekt berichtet:<br><br>
            <ul>
              <li>der Bund vom 12. Mai 2021 (<a
                  target="_blank"
                  href="/upload/media/Seite_25_Der_Bund_2021-05-12.pdf"
                >PDF</a>)</li>
              <li>Berner Zeitung vom 14. Mai 2021 (<a
                  target="_blank"
                  href="/upload/media/K_20210514_BZ_smartvote.pdf"
                >PDF</a>)</li>
              <li>Könizer Zeitung vom 27. Mai 2021 (<a
                  target="_blank"
                  href="/upload/media/koenizerZeitung_mai_27.pdf"
                >PDF</a>)</li>
            </ul>
            <br>
            Die Medienmitteilung der Gemeinde Köniz zum Projekt finden Sie auf der <a
              target="_blank"
              href="https://www.koeniz.ch/aktuell/medieninformation/medieninformation.page/1018/news/9023"
            >Webseite der Gemeinde.</a>
          </div>
        </q-timeline-entry>

        <q-timeline-entry
          title="Aufschaltung der Online-Plattform Demokratiefabrik"
          subtitle="30. April 2021"
          icon="mdi-wifi"
        >
          <div>
            Die vom Team entwickelte Online-Plattform Demokratiefabrik ist online! Das Team wird in den kommenden Monaten zwei Fallstudien damit durchführen.
          </div>
        </q-timeline-entry>

        <!-- <q-timeline-entry heading>
          2020
        </q-timeline-entry> -->

        <q-timeline-entry
          title="Start des SNF-Projekts «Digital Democratic Innovations to Empower Citizens in the Digital Age»"
          subtitle="1. April 2020"
          icon="mdi-rocket-launch-outline"
        >
          <div>
            Im April 2020 startete das Projekt «Digital Democratic Innovations to Empower Citizens in the Digital Age» unter der Mitarbeit von Prof. Dr. Marc Bühlmann, Dr. Marlène Gerber, Dr. Anja Heidelberger, Dr. Dominik Wyss und MA Giada Gianola, alle am Institut für Politikwissenschaft der Universität Bern tätige Forschende. Zudem ergänzt Prof. Dr. André Bächtiger (Universität Stuttgart) das Team. Der Schweizerische Nationalfonds unterstützt das Projekt für eine Dauer von 36 Monaten im Rahmen des NFP77 «Digitale Transformation». Untersucht wird, ob die Digitalisierung in der Schweiz eine Chance für mehr demokratische Mitsprache bietet. Im Rahmen des Projekts wird ein digitales Beteiligungsformat entwickelt, das den Bürgerinnen und Bürgern ermöglicht, eigene Argumente und Überzeugungen in den Abstimmungs- und Wahldiskurs einzubringen. Damit soll nicht nur das Vertrauen in Online-Infrastruktur gestärkt, sondern auch die Legitimität der direkten Demokratie erhöht werden. Konkret werden im Projekt zwei Prototypen digitaler Bürger*innenbeteiligung getestet: 1) Wahlberechtigte stellen einen smartvote-Fragenkatalog zusammen und 2) Stimmberechtigte erstellen ein Argumentarium zu einer eidgenössischen Abstimmungsvorlage. Um das zu ermöglichen, entwickelten wir die Plattform Demokratiefabrik, die den Teilnehmenden eine autonome Rolle im politischen Gestaltungsprozess ermöglicht. Die Innovation unseres Projekts liegt in einer engen Verzahnung sozialer und technischer Ansätze: Wir übernehmen ein in der Politikwissenschaft etabliertes Konzept der repräsentativ zusammengestellten Bürgerinnen- und Bürgerversammlungen. Im 21. Jahrhundert erleben verschiedenste Formen der Bürgerinnen- und Bürgerbeteiligung einen Aufschwung. Zu wissen, unter welchen Bedingungen digitale Beteiligungsformen die Demokratie stärken können, stellt die Grundlage für eine erfolgreiche demokratische Beteiligung im digitalen Zeitalter dar.
            <br>
            <br>
            Informationen zum Projekt finden Sie auch auf der
            <a
              target="_blank"
              href="https://www.nfp77.ch/portfolio/mehr-demokratische-mitsprache-dank-digitalisierung/"
            >
              NFP77-Projektseite</a>
          </div>
        </q-timeline-entry>

      </q-timeline>
    </div>
  </q-page>
</template>


<script  lang="ts">
// import ArtificialModerator from "src/components/ArtificialModerator";
import AMs from 'src/pages/ArtificialModeration';
import ArtificialModeration from 'src/components/artificial_moderation/ArtificialModeration.vue';

export default {
  name: 'PageNews',
  components: { ArtificialModeration },
  data() {
    return {
      that: this,
      AMs,
    };
  },
  methods: {
    clickNewsletter: function () {
      // TODO: take email from environment variables
      const email = 'demokratiefabrik@protonmail.com';
      window.location.href = `mailto:${email}`;
    },
  },
};
</script>