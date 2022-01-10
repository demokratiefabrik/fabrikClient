import { createI18n } from 'vue-i18n';
import messages from 'src/i18n';



export default ({ app }) => {
  // Setup I18n instance
  const i18n = createI18n({
    // locale: 'en-US',
    legacy: false, // you must set `false`, to use Composition API
    globalInjection: true,
    locale: process.env.ENV_I18N_LOCALE, // set locale
    fallbackLocale: process.env.ENV_I18N_FALLBACK_LOCALE, // set fallback locale
    messages,
  });

// const i18n = useI18n(); // call `useI18n`, and spread `t` from  `useI18n` returning
  // return { t }; // return render context that included `t`
  // DW: added to
  // app.config.globalProperties.$i18n = i18n;
  // console.log(i18n.t('hallo'))

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
