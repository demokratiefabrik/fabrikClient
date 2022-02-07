import { RouteRecordRaw } from 'vue-router';
import textsheet_routes from 'src/plugins/TEXTSHEET/routes'
import cir_routes from 'src/plugins/CIR/routes';
import survey_routes from 'src/plugins/SURVEY/routes';
import profileupdate_routes from 'src/plugins/PROFILEUPDATE/routes';
// import vaa_topics_routes from 'src/plugins/VAA/routes.js';

const plugin_routes: RouteRecordRaw[] = []

// plugin_routes.push(...vaa_topics_routes)
plugin_routes.push(...textsheet_routes)
plugin_routes.push(...cir_routes)
plugin_routes.push(...survey_routes)
plugin_routes.push(...profileupdate_routes)

export default plugin_routes
