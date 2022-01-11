import useAuthComposable from 'src/composables/auth.composable';
const {authorized, login} = useAuthComposable();


const AMs = {


  indexpage_left: {
    id: 'indexpage_left',
    prosa: ' Erster AM: Begrüsst die Leute auf der Webseite.',
    loading: (ctx) => authorized === null || (authorized && !ctx.get_public_profile),
    items: [
      {
        id: 1,
        prosa: 'GÄSTE',
        condition: () => !authorized,
        body: (ctx) => [
          'Guten Tag liebe Besucherinnen und Besucher!',
          `Wir sind ${ctx.$.t('am.actor.2')} und ${ctx.$t('am.actor.1')} und wir freuen uns sehr, dass Sie hier sind.`
        ]
      },

      {
        id: 4,
        prosa: 'Authorized: LONGTERM!',
        condition: (ctx) => authorized && ctx.$options.filters.minutesSince(ctx.get_public_profile.date_created) > 60,
        body: (ctx) => `Herzlich willkommen zurück, ${ctx.get_public_profile.U}! Es freut uns, dass Sie wieder hier sind!`
      },

      {
        id: 5,
        prosa: 'Authorized: FIRST HOUR!',
        condition: (ctx) => authorized && ctx.$options.filters.minutesSince(ctx.get_public_profile.date_created) <= 60,
        body: (ctx) => {
          return [
            'Herzlich willkommen!',
            `In der Demokratiefabrik tragen Sie den Namen ${ctx.get_public_profile.U}. ${ctx.$root.username_derivation(ctx.get_public_profile, false, false)}. So bleiben Sie in der Demokratiefabrik anonym.`
          ]
        }
      },
    ]
  },

  indexpage_right: {
    id: 'indexpage_right',
    prosa: ' Zweite: Informiert über Aktualität.',
    loading: (ctx) => authorized === null || (authorized && !ctx.get_public_profile),
    items: [

      // {
      //   id: 101,
      //   prosa: 'Not authenticated && assembly is ONGOING => Assuming that visitor is a delegate',
      //   condition: (ctx) => !authorized && ctx.IsThereAnAssemblyOngoing,
      //   body: (ctx) => {
      //     return [
      //       // `Es findet in diesen Tagen die Könizer Online-Versammlung statt.`,
      //       `Am 14. Juni geht es los. Wir halten Sie hier auf dem Laufenden.`
      //     ]
      //   }
      // },

      {
        id: 1,
        prosa: 'Not authenticated && assembly is ONGOING => Assuming that visitor is a delegate',
        condition: (ctx) => !authorized && ctx.IsThereAnAssemblyOngoing,
        body: () => {
          return [
            // `Es findet in diesen Tagen die Könizer Online-Versammlung statt.`,
            // `Sind Sie in Köniz stimmberechtigt und wurden Sie zur Könizer Online-Versammlung eingeladen? Dann möchten wir Sie bitten sich hier einzuloggen.`
            // `Wurden Sie von der Gemeinde Demokratiefabrik zufällig ausgewählt,
            'Wir führen Sie Schritt für Schritt durch die Demokratiefabrik. Möchten Sie gleich beginnen?'
          ]
        },
        buttons: [
          {
            condition: (ctx) => !authorized && ctx.IsThereAnAssemblyOngoing,
            action: () => login({ name: 'home' }),
            // action: (ctx) => login(ctx.$root.getAssemblyHomeRoute(ctx.ongoing_assemblies[0])),
            label: () => 'Zum Login der Könizer Demokratiefabrik'
          }],

      },
      {
        id: 2,
        condition: (ctx) => authorized && ctx.IsUserDelegateOfOngoingAssembly,
        body: (ctx) => {
          const firstDay = ctx.get_public_profile && (ctx.$options.filters.minutesSince(ctx.get_public_profile.date_created) <= 60);
          return [
            firstDay ? 'Wir freuen uns sehr, dass Sie hier sind! Ist es für Sie in Ordnung, wenn wir gleich starten?' :
              'Wir können gleich wieder weiterfahren. Sind Sie bereit?',
          ]
        }
      },
      {
        id: 3,
        condition: (ctx) => authorized && !ctx.IsThereAnAssemblyOngoing && ctx.IsThereAnAssemblyInPublicState,
        body: () => 'Auf dieser Webseite finden Sie spannende Ergebnisse von unserer Online-Versammlung. Schauen Sie sich bitte um!'
      },
      {
        id: 4,
        condition: (ctx) => authorized && !ctx.IsUserDelegateOfOngoingAssembly && ctx.IsThereAnAssemblyOngoing,
        body: () => 'Wir sind aktuell gerade an der Durchführung der Könizer Demokratiefabrik. Sie finden auf dieser Webseite viele Informationen dazu.'
      },
      {
        id: 5,
        condition: (ctx) => ctx.IsThereNothingGoingOn,
        body: () => [
          'Sie finden auf dieser Seite viele Informationen über die Demokratiefabrik.',
          'Zum Beispiel finden Sie unter der Rubrik "News" den Ergebnisbericht zur Könizer Demokratiefabrik und eine Möglichkeit, unseren Newsletter zu abonnieren.']
      }
    ],

    buttons: [
      {
        condition: (ctx) => authorized && ctx.IsUserDelegateOfOngoingAssembly,
        action: (ctx) => ctx.$root.gotoAssemblyHome(ctx.UsersDelegateAssemblies[0]),
        label: () => 'Zur Könizer Demokratiefabrik, bitte!'
      },
      {
        condition: (ctx) => authorized && ctx.IsUserObserverOfOngoingAssembly && !ctx.IsUserDelegateOfOngoingAssembly && !ctx.UsersManagerAssemblies?.length,
        action: (ctx) => ctx.$root.gotoAssemblyHome(ctx.UsersObserverAssemblies[0]),
        label: () => 'Eintreten als Beobachter'
      },
      {
        condition: (ctx) => authorized && ctx.UsersManagerAssemblies?.length > 0,
        action: (ctx) => ctx.$root.gotoAssemblyManage(ctx.UsersManagerAssemblies[0]),
        label: () => 'Verwaltung'

      }

    ]
  },

  background_top: {
    id: 'background_top',
    prosa: ' Hintergrund-oben',
    items: [
      {
        id: 1,
        body: (ctx) => ctx.$t('background.am.page_introduction')
      }
    ]
  },

  background_bottom: {
    id: 'background_bottom',
    prosa: ' Hintergrund: unten.',
    items: [
      {
        id: 2,
        body: (ctx) => ctx.$t('background.am.open_questions')
      }
    ],

            // TODO: disabled due to migration to vue3

    // buttons: [
    //   {
    //     action: (ctx) => ctx.clickSendEmail(),
    //     label: (ctx) => ctx.$t('background.am.cmd_email_composer')
    //   },
    //   {
    //     condition: (ctx) => authorized && ctx.IsUserDelegateOfOngoingAssembly,
    //     action: (ctx) => ctx.$root.gotoAssemblyHome(ctx.UsersDelegateAssemblies[0]),
    //     label: () => 'Zur Könizer Demokratiefabrik, bitte!'
    //   },

    //   {
    //     // condition: (ctx) => !authorized && ctx.IsThereAnAssemblyOngoing,
    //     action: (ctx) => login({ name: 'home' }),
    //     label: () => 'Demokratiefabrik-Login'
    //   },
    // ]
  },

  news_top: {
    id: 'news_top',
    prosa: ' News Zuoberst.',
    items: [
      {
        id: 1,
        body: (ctx) => ctx.$t('news.am.newsletter')
      }
    ],

    buttons: [
      {
        action: (ctx) => ctx.clickNewsletter(),
        label: (ctx) => ctx.$t('news.am.cmd_newsletter_abo')
      }
    ]
  }
}

export default AMs
