
import { date } from 'quasar'
const { getDateDiff, formatDate } = date

const filters = {

  // Date Filters:
  /////////////////////////////////

  // Format Date
  formatDate(value: undefined | null | string) {
    // TODO: add time when its today...
    if (value) {
      return formatDate(value, process.env.ENV_I18N_DATEFORMAT)
    }

    return ''
  },

  // Format Date
  formatDatetime(value) {
    // var offset = new Date().getTimezoneOffset();
    // if (offset) {
    //   value = date.subtractFromDate(value, { minutes: offset })
    // }
    if (value) {
      const datef = formatDate(value, process.env.ENV_I18N_DATEFORMAT)
      return `${datef} ${formatDate(value, process.env.ENV_I18N_TIME)}`
    }
  },


  // Format Date
  minutesSince(value) {
    // TODO: add time when its today...
    return getDateDiff(Date.now(), value, 'minutes')
  },

  // Calculate & Format Time Left
  formatTimeLeft(value, baseTime: null | number =null) {
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
    const months = Math.abs(getDateDiff(value, baseTime, 'months'))
    const result: any[] = []
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
    if (minutes > 15) {
      result.push(`${roundToFive(minutes)} Minuten`)
      minutes = 0
      // seconds -= (60 * seconds)
    }
    if (minutes > 5) {
      result.push('wenigen Minuten')
      minutes = 0
      // seconds -= (60 * seconds)
    }

    if (!result.length) {
      return ('gerade jetzt')
    }

    return (`${prefix} ${result.join(',')}`)
  }
}

export default filters;

