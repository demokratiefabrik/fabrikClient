import { createI18n } from 'vue-i18n';
import messages from 'src/i18n';

export default ({ app }) => {
  console.log('DEBUG boot i18n start')

  // Setup I18n instance
  const i18n = createI18n({
    // locale: 'en-US',
    legacy: false, // you must set `false`, to use Composition API
    globalInjection: true,
    locale: process.env.ENV_I18N_LOCALE, // set locale
    fallbackLocale: process.env.ENV_I18N_FALLBACK_LOCALE, // set fallback locale
    messages,
  });

  // Tell app to use the I18n instance
  app.use(i18n);

  console.log('DEBUG boot i18n end')
};