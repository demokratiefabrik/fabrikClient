export const storeProfile = (state, { data }) => {
  state.profile = data;
};

// export const storeOauthAcls = (state, oauthAcls) => {
//   state.oauthAcls = oauthAcls;
// };

export const set_random_seed = (state) => {
  // console.log('SET RANDOM SEED IF NOT YET DONE')
  if (!state.randomSeed) {
    // TODO: ???? Math.floor(99)
    const randomSeed = Math.floor(Math.random() * Math.floor(99)) + 1;
    state.randomSeed = randomSeed;
  }
};

/* Cache a currently selected AM intervention. */
export const setAMCache = (state, { cacheKey, itemId }) => {
  state.AMCache[cacheKey] = itemId;
};
export const deleteAMCache = (state) => {
  state.AMCache = {};
};

export const storeNotifications = (state, {}) => {
  state.notifications = {};
};

export const deleteNotification = (state, { notificationID }) => {
  console.log('deleteNotification 2/2', notificationID);
  delete state.notifications.entries[notificationID];
};

export const set_notification_update_date_to_current = (state) => {
  const now = new Date();
  state.notifications.update_date = now;
};

export const update_notifications = (state, { notifications }) => {
  console.log('ENTRIES...');
  // NEW ENTRIES
  if (!('entries' in state.notifications)) {
    state.notifications.entries = {};
  }
  console.log('ENTRIES...II');

  Object.values(notifications).forEach((notification: any) => {
    if (!(notification.id in state.notifications.entries)) {
      state.notifications.entries[notification.id] = {};
    }

    state.notifications.entries.notificationsID = notification;
  });
};
