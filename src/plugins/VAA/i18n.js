import { i18n } from '../boot/i18n'

const messages = {
    'de-ch': {

    }
}

export default {
    created: function () {
        i18n.mergeLocaleMessage('de-ch', messages['de-ch'])
    }
}

// i18n: {
//     messages: {
//         'en': require('~/locales/en_button.json'),
//         'fr': require('~/locales/fr_button.json')
//     }
// }
// https://forum.vuejs.org/t/multiple-translations-files-per-language-with-vue-i18n-and-nuxtjs/27892/3