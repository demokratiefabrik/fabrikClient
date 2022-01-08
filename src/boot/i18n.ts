/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { createI18n } from 'vue-i18n';
import messages from 'src/i18n';

export default ({ app }) => {
  // Create I18n instance
  const i18n = createI18n({
    // locale: 'en-US',
    locale: process.env.ENV_I18N_LOCALE, // set locale
    fallbackLocale: process.env.ENV_I18N_FALLBACK_LOCALE, // set fallback locale
    messages,
  });

  // Tell app to use the I18n instance
  app.use(i18n);
};

// const i18n = VueI18n.createI18n({
//   legacy: false, // you must set `false`, to use Composition API
//   locale: process.env.ENV_I18N_LOCALE, // set locale
//   fallbackLocale: process.env.ENV_I18N_FALLBACK_LOCALE, // set fallback locale
//   messages, // set locale messages
//   // If you need to specify other options, you can set other options
//   // ...
// })

// export default ({ app }) => {
//   // Set i18n instance on app
//   app.i18n = i18n
// }

// export { i18n }
