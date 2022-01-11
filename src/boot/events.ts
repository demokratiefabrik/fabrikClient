import { boot } from 'quasar/wrappers';

// Anonther Boot Hook. For subscribing to events
export default boot(async ({ app }) => {
  console.log('BOOOT EVENTS', app)


});

