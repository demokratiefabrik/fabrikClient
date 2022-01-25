import { deCH } from 'src/i18n';
import { createI18n } from 'vue-i18n';
import { boot } from 'quasar/wrappers';

// export default boot({ app }) => {
export default boot(({ app }) => {
  // console.log('DEBUG boot i18n start')

  // Setup I18n instance
  const i18n = createI18n({
    // locale: 'en-US',
    // messages,
    // legacy: false, // you must set `false`, to use Composition API
    // globalInjection: true,
    // fullInstall: false,
    // fallbackLocale: 'de', // set fallback locale
    // locale: 'en-US',
    // messages,
    // legacy: false, // you must set `false`, to use Composition API
    // globalInjection: true,
    // fullInstall: false,
    // fallbackLocale: 'de', // set fallback locale

    locale: 'de_CH',
    legacy: false, // you must set `false`, to use Composition API
    globalInjection: true,
    // locale: process.env.ENV_I18N_LOCALE, // set locale
    fullInstall: true,
    // fallbackLocale: process.env.ENV_I18N_FALLBACK_LOCALE, // set fallback locale
    messages: { de_CH: deCH },
  });

  app.use(i18n);
});

// export default boot(({ app }) => {
//   const i18n = createI18n({
//     locale: 'en-US',
//     messages,
//     legacy: false, // you must set `false`, to use Composition API
//     globalInjection: true,
//     fullInstall: false,
//     fallbackLocale: 'de', // set fallback locale

//   });

//   // Set i18n instance on app
//   app.use(i18n);
// });

// // NOT SURE IF USED
// // import {SUPPORTED_LOCALES} from "@/config"
// // import {get_cookie_value, set_cookie_value} from 'src/utils/cookie.service'
// // import i18n from "src/utils/i18n/i18n"
// import moment from "moment"
// /**
// * Does this vue-app support given locale? (check config file)
// * @param {locale candidate} locale
// */
// // const supportedLocalesInclude = function(locale) {
// //   return Object.keys(SUPPORTED_LOCALES).includes(locale)
// // }

// /**
//  * Get browserlangages (if there are more than one, take first one.)
//  */
// // const getBrowserLocale = function() {
// //   let locales = navigator.languages !== undefined
// //     ? navigator.languages
// //     : [navigator.language]
// //   let first = locales[0]
// //   let language = first.slice(0, 2).toLowerCase()
// //   let country = first.length == 5 ? first.slice(3, 5).toUpperCase() : null
// //   let combination = language + "-" + country

// //   // search exact match
// //   if (country) {
// //     let hits = Object.keys(SUPPORTED_LOCALES).filter(x => x == combination)
// //     if (hits) {
// //       return (hits[0])
// //     }
// //   }

// //   // take first entry in same language region
// //   let hits = Object.keys(SUPPORTED_LOCALES).filter(x => x.slice(0, 2) == language)
// //   if (hits) {
// //     return (hits[0])
// //   }
// // }

// /**
//  * Which is the starting locale string?
//  * 1) check cookie from last website visit
//  * 2) check browser language
//  * 3) check default language of Vue-app.
//  */
// // export function getStartingLocale() {

// //   // check cookie
// //   var browserLocale = get_cookie_value('i18n')
// //   if(browserLocale) {
// //     return(browserLocale)
// //   }

// //   // take default browser language
// //   browserLocale = getBrowserLocale();
// //   if (browserLocale && supportedLocalesInclude(browserLocale)) {
// //     return browserLocale
// //   }
// //   // take default language
// //   return Configuration('I18N_LOCALE') || "de"
// // }

// /**
//  * Load all messages from currently chosen locale
//  */
// export function loadLocaleMessages () {
//   const locales = require.context('@/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
//   const messages = {};
//   locales.keys().forEach(key => {
//     const matched = key.match(/([A-Za-z0-9-_]+)\./i);
//     if (matched && matched.length > 1) {
//       const locale = matched[1];
//       messages[locale] = locales(key)
//     }
//   });
//   return messages
// }

// /**
//  * A new locale has been choosen
//  * 1.) update runtime variable
//  * 2.) update cookie
//  */
// export function set_new_locale(newLocale) {
//   console.assert(newLocale, 'locale string not transmitted')
//   console.assert(supportedLocalesInclude(newLocale), 'locale string not allowed')
//   i18n.locale = newLocale
//   moment.locale(newLocale)
//   const durable = true
//   set_cookie_value('i18n', newLocale, durable)
// }
