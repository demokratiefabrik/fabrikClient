// functional COmponent:
// <i18n path="term" tag="label" for="tos">
// <a :href="url" target="_blank"> {{ $t('tos') }}</a>
// </i18n>
// => <label>Accept <a href="...">terms of services</a></label>
// https://kazupon.github.io/vue-i18n/guide/interpolation.html#basic-usage

export default {
  // btn_ready_to_enter: 'Ja, ich bin bereit',

  app: {
    name: 'Demokratiefabrik',
    version: 'v1.0',
    error: {
      toomanyrequests_error_title: 'Das waren gerade sehr viele Anfragen an unsere Server.',
      toomanyrequests_error_body: 'Diese Meldung kann viele Ursachen haben: Zum Beispiel bei zuvielen Anfragen in kurzer Zeit oder auch bei zuvielen verwendeten Geräten pro User. Haben Sie etwas Geduld. Es kann gut sein, dass es nach einer Pause wieder funktioniert.',
      authorization_error_title: 'Zugang verweigert',
      authorization_error_body: 'Sie sind nicht berechtigt auf diesen Bereich der Demokratiefabrik zuzugreifen.',
      service_error_title: 'Betriebsstörung',
      service_error_body: 'Im Betrieb der Demokratiefabrik ist eine Störung aufgetreten. Wir bitten Sie um Entschuldigung. Wenn dies das erste Mal auftritt, schlagen wir vor, die Seite neu zu laden.',
      network_error_title: 'Kommunikationsstörung',
      network_error_body: 'Die Kommunikation innnerhalb der Demokratiefabrik ist gerade beeinträchtigt. Es kann sein, dass dadurch einige Angaben, die sie gemacht haben, nicht an den Server übermittelt werden konnten. Wir bitten dafür um Entschuldigung.',
    },
    btn_close: 'Schliessen',
    btn_back: 'Zurück',
    btn_next: 'Weiter',
    btn_reload: 'Seite neu laden',
    btn_skip: 'Überspringen',
    btn_cancel: 'Abbrechen',
    btn_home: 'Zur Startseite',
    btn_goto_profile: 'Zum Sekretariat',
    ask_for_bookmark_title: 'Hinweis:',
    ask_for_bookmark: 'Möchten Sie diese Webseite während dem Event in Ihren Favoriten/Lesezeichen speichern? Dann drücken Sie die beiden Tasten {bookmarkKeys}'
  },

  disclaimer: {
    btnLabel: 'Weiterführende Erläuterungen',
    contenttree: {
      basic: `Um die Diskussion übersichtlich zu halten, behalten wir uns vor, die Inhalte innerhalb des Forums
      neu zu strukturieren und auch ohne Angaben von Gründen (insbesondere bei Verstössen gegen unseren Verhaltenskodex) zu löschen. Die Inhalte in diesem Forum werden
      in hierarchischer (und nicht in chronologischer) Reihenfolge aufgelistet.
      Die Reihenfolge der Inhalte auf gleicher Hierarchiestufe ist zufällig und variiert von Benutzer zu Benutzer.`,
      extensionExtraLarge: `Die Diskussion ist schon recht umfassend. Welche übersichtlich bleibt,
      wurden nur wenige zufällig ausgewählte Beiträge vollständig aufgeklappt.
      Sie können die restlichen Beiträge selbst per Mausklick öffnen.`,
      peerreview: `Alle Teilnehmende können auf dieser Seite neue Vorschläge einbringen, wie der smartvote-Fragebogen besser gemacht werden kann. 
        Sie können also vorschlagen, smartvote- Fragen zu erstellen, zu bearbeiten oder auch zu löschen.
        Zufällig ausgewählte Teilnehmende werden hier dann angefragt zu diesen Vorschlägen Stellung zu nehmen.
        Nach 24 Stunden wird aufgelöst: Bei einer Mehrheit an positiven Antworten, werden die Vorschläge automatisch umgesetzt. `
    }
  },

  am: {
    actor: {
      1: 'Felix',
      2: 'Sophie'
    },

    /* Male: 0; female: 1 */
    gender: {
      1: () => 0,
      2: () => 1
    },

    // Use pluralization for gender... 
    reference: 'Meine Kollegin {actorPartner} | Mein Kollege {actorPartner}',

    tooltip: {
      1: 'Ich bin {actor}.',
      2: 'Hallo, mein Name ist {actor}'
    }
  },

  language: {
    switcher_label: 'Sprachwahl',
    items: {
      'en-us': { label: 'English' },
      'de-ch': { label: 'Deutsch' }
    }
  },

  menu: {
    items: {
      locked: {
        tooltip: 'Dieser Bereich ist noch nicht zugänglich. Wir haben zuerst noch eine andere Bitte an Sie.'
      }
    }
  },

  auth: {
    name_derivation: 'Ihr Namensgeber ist der {altitude} Meter hohe Berg "{fullname}" ({canton})',
    name_derivation_3rd_party: 'Der Namensgeber ist der {altitude} Meter hohe Berg "{fullname}" ({canton})',
    name_derivation_3rd_party_short: 'in Köniz stimmberechtigt. Das Pseudonym stammt vom {altitude} Meter hohen Berg "{fullname}" ({canton})',
    login_button_label: 'Anmeldung',
    logout: 'Abmelden',
    login_button_text: 'Klicken Sie auf \'Anmeldung\', wenn Sie sich anmelden möchten. Eine Anmeldung ist notwendig, um sich aktiv in der Fabrik zu beteiligen.',
    registered_as: 'Ihr Pseudonym',
    not_registered: 'Nicht angmeldet',
    profile_last_name: 'Pseudonym',
    profile_email: 'E-Mail',
    profile_email_hint: 'Falls Sie keine E-Mail-Adresse besitzen, können Sie auch ihre Handy-Nummer   eingeben. Wir werden Sie dann via SMS kontaktieren.',
    profile_email_disclaimer: 'Sie fragen sich, wozu wir Ihre E-Mail-Adresse oder Handy-Nummer benötigen? Wir werden Ihnen in den kommenden Tagen wenige Nachrichten zusenden, um Sie über Updates zu Ihren Beiträgen zu informieren und um Sie erneut  um Ihre Mitarbeit zu beten. Gleichzeitig erlaubt uns das, Ihnen Ihre Zugangsdaten erneut zuzustellen, sollten Sie diese verlegen. Die Daten werden anonymisiert auf dem Server der Universität Bern gespeichert und vertraulich behandelt. Gleich nach Ende des Projekts werden wir sämtliche E-Mail-Adressen und Telefonnummern wieder vom Server löschen.',
    profile_update_action: 'Speichern',
    profile_update_success: 'Das Benutzerprofil wurde gespeichert',
    profile_update_error: 'Das Benutzerprofil konnte nicht gespeichert werden',
    profile_load_error: 'Das Benutzerprofil konnte nicht geladen werden',
    goto_authentication_form: 'Zur Anmeldung',
    goto_profile_page: 'Benutzerprofil überarbeiten',
    tooltip_authenticated: 'Klicken Sie hier um Ihr Benutzerprofil einzusehen oder sich abzumelden.',
    tooltip_non_authenticated: 'Sie sind noch nicht in der Demokratiefabrik angemeldet. Hier können Sie dies tun.',
    logout_succeeded_title: 'Vielen Dank und auf Wiedersehen',
    logout_succeeded_caption: 'Wir freuen uns, wenn Sie die Demokratiefabrik bald wieder besuchen.',
    authentication_succeeded_title: 'Anmeldung erfolgreich.',
    authentication_succeeded_caption: 'Sie haben sich erfolgreich bei der Demokratiefabrik angemeldet. Wir danken Ihnen schon jetzt für Ihre Mithilfe.',
    authentication_warning_title: 'Anmeldung erforderlich.',
    authentication_warning_body: 'Sie haben sich noch nicht bei der Demokratiefabrik angemeldet. Für den Zugriff auf diesen Bereich ist dies jedoch erforderlich.',
    authentication_invalid_warning_title: 'Session beendet.',
    authentication_invalid_warning_body: 'Um weiterzufahren müssen Sie sich erneut anmelden.',
    authentication_error_title: 'Anmeldung schlug fehl.',
    authentication_error_body: 'Bei der Anmeldung tratt ein unerwarteter Fehler auf. Bitte kontakieren Sie uns via E-Mail: info@demokratiefabrik.ch'
  },


  stages: {
    home_title: 'Ihre Agenda für den {current_date}',
    status_completed: 'Nicht mehr zugänglich',
    status_not_yet_accessible: 'Noch nicht zugänglich',
    status_disabled: 'Deaktiviert',
    status_deleted: 'Gelöscht',
    please_enter_stage: 'Öffnen',
    goto_next_stage: 'Weiter zum nächsten Punkt',
    am: {
      welcome_full_schedule: 'Dann legen wir los. Heute sind {numberOfStages} Punkte auf Ihrer Agenda.',
      welcome_partial_schedule: 'Nun habe ich nur noch eine Bitte für Heute. | Nun sind es nur noch {numberOfScheduledStages} Punkte für heute.',
      welcome_empty_schedule: 'Super! Ich glaube für heute haben wir keine konkreten Fragen mehr an sie.',
      enter_first: 'Wir fangen hier an. Sind Sie bereit?',
      enter_continue: 'Wir fahren hier nun weiter. Sind Sie bereit?',
      enter_end: 'Das ist nun mein letzter Wunsch für heute. Folgen Sie mir bitte folgen.',
      already_seen: 'Das haben Sie sich schon angesehen. Jetzt brauchen wir Sie andernorts. Kommen Sie mit?',
      all_stages_already_seen: 'Wenn Sie möchten, können Sie sich das natürlich noch einmal ansehen?',
      already_completed: 'Dieser Bereich haben Sie bereits abgeschlossen.',
      attention_needed: 'Bitte folgen Sie mir.',
      enter_unique_stage: 'Dies ist heute der einzige Punkt auf dem Programm. Sind Sie bereit?',
    }
  },


  background: {
    h1: 'Alles über die Demokratiefabrik',
    citizen_assemblies: {
      label: 'Die Demokratiefabrik – ein neuer Ort für digitale Beteiligung',
      text: `Die Demokratiefabrik ist ein digitaler Ort, wo sich Bürgerinnen und Bürger treffen, um gemeinsam über verschiedene Themen zu diskutieren und festgelegte Endprodukte zu fabrizieren. Ziel der Demokratiefabrik ist, die Bevölkerung stärker in politische Entscheidungsprozesse einzubeziehen. Obwohl die Digitalisierung hierzu eigentlich zahlreiche Chancen bietet, sind digitale Beteiligungsformate aus verschiedenen Gründen noch stark limitiert, bergen Risiken und haben nicht selten einen schlechten Ruf. Es fehlen sorgfältig entworfene digitale Beteiligungsformate, die es ermöglichen, die Demokratie im digitalen Zeitalter zu stärken. Mit diesem vom Schweizerischen Nationalfond (SNF) unterstützten Forschungsprojekt wollen wir die Forschung in diesem Bereich vorantreiben. Zu wissen, unter welchen Bedingungen digitale Beteiligungsformen die Demokratie stärken können, stellt die Grundlage für eine erfolgreiche Bürgerbeteiligung im digitalen Zeitalter dar.`
    },

    digital_participation: {
      label: 'Was Sie auf unserer digitalen Plattform erwartet',
      text: `Wir haben mit der Demokratiefabrik ein digitales Beteiligungsformat entwickelt, das den Bürgerinnen und Bürgern ermöglicht, eigene Argumente und Überzeugungen in den Abstimmungs- und Wahldiskurs einzubringen. Damit soll nicht nur das Vertrauen in Online-Infrastruktur gestärkt, sondern auch die Legitimität der direkten Demokratie erhöht werden. Damit das gelingt, setzen wir auf folgende Neuerungen: zum einen auf die zufällige Auswahl einer repräsentativen Stichprobe von Personen und zum anderen auf technische Innovation, die gewährleistet, dass eine maximale Diversität von Argumenten und Positionen in die Diskussion einfliessen sowie, dass Teilnehmende im politischen Gestaltungsprozess eine autonome Rolle spielen. Teilnehmende an der Demokratiefabrik haben die Möglichkeit, eigene Beiträge zu verfassen sowie zufällig ausgeloste Beiträge von anderen Nutzenden zu bewerten und zu kommentieren.`
    },

    team: {
      label: 'Wer für die Demokratiefabrik verantwortlich ist',
      text: `Beteiligt an den Projekten sind für die Projektleitung Dr. Marlène Gerber (Hauptverantwortliche), Prof. Dr. Marc Bühlmann, Dr. Anja Heidelberger, Dr. Dominik Wyss (Verantwortlicher Plattform) und Giada Gianola (Doktorandin im Projekt) am Institut für Politikwissenschaft der Universität Bern. Das Projekt profitiert vom Expertenwissen von Prof. Dr. André Bächtiger (Universität Stuttgart) und Dr. Marc Klein (MIT, Center for Collective Intelligence). Die smartvote-Fallstudie erfolgt in Zusammenarbeit mit smartvote (Michael Erne). Der Schweizerische Nationalfonds unterstützt das Projekt seit April 2020 für eine Dauer von 36 Monaten im Rahmen des NFP77 «Digitale Transformation».`
    },

    artificialmoderators: {
      label: '@:am.actor.2 und @:am.actor.1 - Das Moderatorenteam',
      text: `Bestimmt sind Ihnen bereits Sophie und Felix begegnet. Unsere Moderatorin und unser Moderator begleiten Sie bei der Mitarbeit in der Demokratiefabrik. Sie machen Sie auf die wichtigsten Aufgaben aufmerksam und führen Sie Schritt für Schritt durch unsere Plattform.`
    },

    next_steps: {
      label: 'Die nächsten Schritte',
      text: `Konkret werden im Projekt zwei Prototypen digitaler Beteiligung getestet: 1) Wahlberechtigte stellen einen smartvote-Fragenkatalog zusammen und 2) Stimmberechtigte erstellen ein Argumentarium zu einer eidgenössischen Abstimmungsvorlage. Die Demokratiefabrik ist erstmals vom 14. Juni bis am 4. Juli 2021 im Einsatz: 9'000 zufällig ausgewählte Wahlberechtigte der Gemeinde Köniz erhalten dann die Gelegenheit, den smartvote-Fragebogen für die Gemeindewahlen vom 26. September 2021 mitzugestalten.`
    },

    transparency: {
      label: 'Vollständige Transparenz',
      text: `Ein wichtiges Anliegen von uns ist, dass die Funktionsweise unserer Software von der interessierten Öffentlichkeit jederzeit nachvollzogen und auf Herz und Nieren überprüft werden kann. Unsere Software ist Open Source, das heisst der Quelltext ist öffentlich und kann von Dritten eingesehen, geändert und genutzt werden. Die Software kann kostenlos verwendet werden. Doch auch für Leute ohne IT-Kenntnisse schaffen wir Transparenz. Allem voran finden sich auf der Plattform an verschiedensten Stellen das folgende Icon {iconTechnicalTransparency}. Dahinter verbergen sich jeweils Erläuterungen, wie genau und warum etwas gemacht wurde.`
    },

    privacy: {
      label: 'Hoher Datenschutz und Pseudonyme',
      text: `Die Privatsphäre aller teilnehmenden Personen ist uns wichtig. Daher arbeiten wir auf der Plattform ausschliesslich mit Pseudonymen. Wir erfassen einzig Personendaten (namentlich die E-Mail-Adresse oder alternativ die Handy-Nummer), welche für das Funktionieren der Demokratiefabrik notwendig sind. Diese Daten werden nach Beendigung der Demokratiefabrik auf unseren Servern gelöscht. Auch während der Projektphase werden diese zu keinem Zeitpunkt mit den Nutzungsaktivitäten innerhalb der Demokratiefabrik verknüpft, so dass Rückschlüsse auf Ihre Person nicht möglich sind. Die Daten werden allesamt ausschliesslich in der Schweiz auf hauseigenen Servern gehostet (Universität Bern). Wir behandeln Ihre Personendaten vertraulich und werden sie keinesfalls an Dritte weitergegeben.`
    },

    technologies: {
      label: 'Die Technologie, welche die Fabrik antreibt',
      text: `Für den Aufbau der Demokratiefabrik setzen wir auf moderne Software-Architektur und breit angewendete Open-Source-Software. Sie finden im Folgenden eine kleine Auswahl der verwendeten Technologien und Konzepte.`
    },

    am: {
      page_introduction: 'Wir haben auf dieser Seite die wichtigsten Informationen zur Demokratiefabrik zusammengetragen.',
      open_questions: 'Bleiben noch Fragen offen? Dann können Sie uns auch gerne via E-Mail kontaktieren.',
      cmd_email_composer: 'Email verfassen'
    }
  },



  news: {
    h1: 'Was aktuell in der Demokratiefabrik läuft',
    am: {
      newsletter: 'Möchten Sie bezüglich der Demokratiefabrik auf dem Laufenden bleiben? Dann können sie unseren Newsletter abonnieren.',
      cmd_newsletter_abo: 'Newsletter-Abo',
      // tooltip: {
      //   2: [
      //     // Tooltips for the second AM displayed on the page
      //     'Schauen Sie sich doch auch noch auf der Seite "Hintergrund" um.'
      //   ]
      // }
    }
  },

  contenttree: {
    comment_section_tooltip: 'Haben Sie an dieser Stelle Fragen oder Anregungen?',
    close_comment_section_tooltip: 'Klicken Sie hier um die Kommentarspalte wieder zu schliessen',
    no_entries: 'Es sind noch keine Kommentare oder Fragen vorhanden. Machen Sie den Anfang?',
    no_filter_results: 'Keine Einträge passen zu dieser Sucheingabe!',
    created_by: 'von {username}',
    search_button: 'Suche',
    search_field_label: 'Suchbegriff...',
    add_comment_or_question: 'Neuer Beitrag',
    close_comment_section: 'Forum schliessen',
    notification_number_of_expanded: 'Sie sehen aktuell {nof_shown} von {nof_total} Beiträgen.',
    expand_all: 'Beiträge ausklappen',
    collapse_all: 'Beiträge einklappen',
    toolbar: {
      reply: 'Möchten Sie diesem Beitrag antworten?',
      edit: 'Möchten Sie diesen Beitrag bearbeiten?',
      delete: 'Möchten Sie diesen Beitrag wirklich löschen?',
      reply_proposal: 'Möchten Sie eine Antwort vorschlagen?',
      edit_proposal: 'Möchten Sie eine Überarbeitung vorschlagen?',
      delete_proposal: 'Möchten Sie eine Löschung dieses Beitrags vorschlagen?',
      track_changes: 'Möchten Sie diesen zur Nachverfolgung kennzeichnen?',
      show_background: 'Beitragssummarium anzeigen.'
    },
    types: {
      'COMMENT': 'Kommentar',
      'QUESTION': 'Frage',
      'ANSWER': 'Antwort',
      'PARAGRAPH': 'Absatz',
      'FOLDER': 'Ordner  ',
      'SECTION': 'Kapitel',
      'SUBSECTION': 'Unterkapitel',
      'VAA_QUESTION': 'smartvote-Frage', // TODO: Move to plugin, right? and hook translation......
      'VAA_TOPIC': 'smartvote-Thema'
    },
    rating: {
      1: 'Nicht hilfreich',
      2: 'Mittelmässig hilfreich',
      3: 'Sehr hilfreich'
    },
    rating_response: 'Danke! Ihre Bewertung wurde vermerkt.',
    editor: {
      head_create: 'Neuer Beitrag',
      head_reply: 'Antwort schreiben',
      head_edit: 'Bearbeiten',
      content_title: 'Überschrift',
      content_title_shadow: 'Geben Sie Ihrem Beitrag eine prägnante Überschrift',
      content_text: 'Text',
      content_text_shadow: 'Geben Sie hier Ihren Beitrag ein.',
      content_text_hint: 'Damit ihr Beitrag möglichst prägnant wird, haben wir das Feld auf 300 Zeichen begrenzt.',
      content_type: 'Art des Beitrags',
      content_type_hint: 'Ordnen Sie den Beitrag einer Beitragskategorie zu.',
      error: {
        wrong_contenttype: 'The content has a wrong type.',
        type_misconfiguration: 'The Contenttree is misconfigured. No type can be assigned to the content.'
      }
    },
    am: {
      index: `Haben an dieser Stelle Fragen oder Anregungen? Die anderen Delegierten
                würde das sicher auch interessieren. | Hier ist Platz für Fragen und Kommentare zum obigen Abschnitt. | Hier wurden von anderen Besuchern bereits Beiträge eingegeben.`
    }
  },


  common_properties: {
    insert: {
      criteria_accept: {
        1: `Die vorgeschlagene Frage ist noch nicht - so oder ähnlich - oben im Fragenkatalog drin.`,
        2: `Die vorgeschlagene Frage passt zum Thema '{topic}'.`,
        3: `Die vorgeschlagene Frage entspricht den smartvote-Kriterien.`
      },
    },
    update: {
      criteria_accept: {
        1: 'Die ursprüngliche Idee der Frage bleibt erhalten.',
        2: "Ihre Änderung stellt nach bestem Wissen und Gewissen eine Verbesserung der Frage dar.",
        3: 'Der geänderte Beitrag entspricht den smartvote-Kriterien.'
      },
    },
    am: {
      index: `Haben an dieser Stelle Fragen oder Anregungen? Die anderen Delegierten
                würde das sicher auch interessieren. | Hier ist Platz für Fragen und Kommentare zum obigen Abschnitt. | Hier wurden von anderen Besuchern bereits Beiträge eingegeben.`
    }
  },

  notifications: {
    PEERREVIEW_ASSIGNED: `Sie dürfen sich heute an {value} Gutachten zur Änderung/Ergänzung des Fragenkatalogs beteiligen.`,
    PEERREVIEW_INIT_INSERT: `Der von Ihnen erstellte Fragenvorschlag «{value}» wird nun von anderen Teilnehmenden begutachtet. Wir halten Sie hier auf dem Laufenden.`,
    PEERREVIEW_INIT_UPDATE: `Ihr Änderungsvorschlag zur Frage «{value}» wird nun von anderen Teilnehmenden begutachtet. Wir halten Sie hier auf dem Laufenden.`,
    PEERREVIEW_REJECTED: `Der von Ihnen eingereichte Antrag (Frage: «{value}») wurde abgelehnt.`,
    PEERREVIEW_APPROVED: `Der von Ihnen erstellte Antrag (Frage: «{value}») wurde angenommen.`,
    EDIT_CONTENT: `Der folgende, von Ihnen erstellte Kommentar wurde durch das Moderationsteam bearbeitet: «{value}»`,
    MOVE_CONTENT: `Der folgende, von Ihnen erstellte Kommentar wurde durch das Moderationsteam verschoben: «{value}»`,
    REPLY_TO_CONTENT: `Sie haben vom User {value} eine Antwort erhalten.`,
    DELETE_CONTENT: `Ein Beitrag wurde vom Administrator mit folgender Begründung gelöscht: «{value}».`,
    LOCK: `Der Zugang zur Könizer Demokratiefabrik wurde mit folgender Begründung gesperrt: «{value}»`,
    MESSAGE: `Sie haben eine Nachricht vom Moderationsteam erhalten: «{value}»`,
  }
}
