import { i18n } from 'src/boot/i18n'

const messages = {
  'de-ch': {
    survey: {
      misconfiguration_error: 'Es ist ein Fehler aufgeteten für den wir um Entschuldiung bitten. Momentan ist es nicht möglich die Befragung fortzusetzen.',
      redirect_to_survey: 'Einen kleinen Moment...',
      survey_completed: 'Grossartig! Sie haben diesen Fragebogen fertig ausgefüllt. Wir können nun weiterfahren.'
    }
  }
}

export default {
  created: function () {
    i18n.mergeLocaleMessage('de-ch', messages['de-ch'])
  }
}