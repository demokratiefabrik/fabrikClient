<template>
  <q-page class="doc_content">

    <!-- <ArtificialModeration
      :AM="AMs.news_top"
      :role="1"
      alignment="right"
      :ctx="that"
    /> -->

    <h1>{{$t('news.h1')}}</h1>

    <div class="q-px-lg q-pb-md">
      <q-timeline color="secondary">

        <!-- <q-timeline-entry heading>
          Aktuelle Einträge
        </q-timeline-entry> -->

        <q-timeline-entry
          title="Die Könizer Demokratiefabrik öffnet ihre Türen"
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


<script>
// import ArtificialModerator from "src/components/ArtificialModerator";
import AMs from "src/pages/ArtificialModeration.js";
import ArtificialModeration from "src/components/artificial_moderation/ArtificialModeration.vue";

export default {
  name: "PageNews",
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
      const email = "demokratiefabrik@protonmail.com";
      window.location.href = `mailto:${email}`;
    },
  },
};
</script>