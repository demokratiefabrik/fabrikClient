import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from 'src/i18n'
// import { Quasar } from 'quasar'
import { date } from 'quasar'
const { getDateDiff, formatDate } = date

Vue.use(VueI18n)


// Date Filters:
/////////////////////////////////

// Format Date
Vue.filter('formatDate', function (value) {
  // TODO: add time when its today...
  if (value) {
    return formatDate(value, process.env.ENV_I18N_DATEFORMAT)
  }
})

// Format Date
Vue.filter('formatDatetime', function (value) {
  // var offset = new Date().getTimezoneOffset();
  // if (offset) {
  //   value = date.subtractFromDate(value, { minutes: offset })
  // }
  if (value) {
    const datef = formatDate(value, process.env.ENV_I18N_DATEFORMAT)
    return `${datef} ${formatDate(value, process.env.ENV_I18N_TIME)}`
  }
})


// Format Date
Vue.filter('minutesSince', function (value) {
  // TODO: add time when its today...
  return getDateDiff(Date.now(), value, 'minutes')
})

// Calculate & Format Time Left
Vue.filter('formatTimeLeft', function (value, baseTime) {
  if (!baseTime) {
    baseTime = Date.now()
  }
  if (!value) {
    return '';
  }

  const roundToFive = function (val) {
    if (val > 20) {
      return Math.round(val / 5) * 5
    }
    return val
  }

  let seconds = getDateDiff(value, baseTime, 'seconds')
  let minutes = Math.abs(getDateDiff(value, baseTime, 'minutes'))
  let hours = Math.abs(getDateDiff(value, baseTime, 'hours'))
  let days = Math.abs(getDateDiff(value, baseTime, 'days'))
  let months = Math.abs(getDateDiff(value, baseTime, 'months'))
  const result = new Array()
  let prefix = 'in'
  if (seconds < 0) {
    prefix = 'vor'
  }

  seconds = Math.abs(seconds)

  if (months > 1) {
    result.push(`${months} Monate`)
    days -= (30 * days)
    // console.log(days)
    hours = 0
    minutes = 0
    // seconds = 0
  }
  if (days > 1) {
    result.push(`${days} Tage`)
    hours -= (24 * hours)
    minutes = 0
    // seconds = 0
  }
  // console.log(result, days, minutes, hours)
  if (hours > 1) {
    result.push(`${hours} Stunden`)
    minutes -= (60 * minutes)
    // seconds = 0
  }
  // console.log(result)
  // console.log(hours)
  if (minutes > 15) {
    result.push(`${roundToFive(minutes)} Minuten`)
    minutes = 0
    // seconds -= (60 * seconds)
  }
  if (minutes > 5) {
    result.push(`wenigen Minuten`)
    minutes = 0
    // seconds -= (60 * seconds)
  }

  if (!result.length) {
    return (`gerade jetzt`)
  }

  return (`${prefix} ${result.join(',')}`)
})

const i18n = new VueI18n({
  locale: process.env.ENV_I18N_LOCALE,
  fallbackLocale: process.env.ENV_I18N_FALLBACK_LOCALE,
  messages
})

export default ({ app }) => {
  // Set i18n instance on app
  app.i18n = i18n
  // Quasar.lang.set(process.env.ENV_I18N_LOCALE)
  // Quasar.lang.set(Quasar.lang.de)
}

export { i18n }
