import { date } from 'quasar'
const { getDateDiff } = date

export function monitor_setup(state) {
  const now = new Date();
  state.monitor_date = now;
}

export function monitor_add(state, { eventString, data }) {
  const buffer = state.monitor_buffer;
  const now = new Date();
  buffer.push({ eventString, data, date: now });
  state.monitor_buffer = buffer;
}

export function monitor_update_date(state, { now }) {
  state.monitor_date = now;
}

/** Delete all  buffered events [ before the date transmitted...] */
export function monitor_reset(state, { now }) {
  if (!now) {
    now = new Date();
  }
  if (!state.monitor_buffer) {
    return null;
  }

  // FILTER ONLY THE ONES AFTER THE GIVEN DATE
  // console.log("reset buffer")
  const newbuffer = state.monitor_buffer.filter((event) => {
    return getDateDiff(event.date, now, 'seconds') > 0;
  });
  state.monitor_date = now;
  state.monitor_buffer =newbuffer;
}
