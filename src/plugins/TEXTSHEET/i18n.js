import { i18n } from 'src/boot/i18n'

const messages = {
    'de-ch': {

        index: {
            leave_a_preliminary_completed_stage: 'Danke! Das reicht mir vorerst.',
            button_end_of_page_on_last_stage: 'Hier geht es lang.',
            button_end_of_page_on_early_stage: 'Ja, ich komme mit.'
        }
    }
}

export default {
    created: function () {
        console.log("CREATED in i18.js")
        i18n.mergeLocaleMessage('de-ch', messages['de-ch'])
    }
}