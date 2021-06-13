// import cir_pros_and_cons_routes from 'src/plugins/CIR_PROS_AND_CONS/routes.js'
import textsheet_routes from 'src/plugins/TEXTSHEET/routes.js'
import vaa_topics_routes from 'src/plugins/VAA/routes.js';
import survey_routes from 'src/plugins/SURVEY/routes.js';
import profileupdate_routes from 'src/plugins/PROFILEUPDATE/routes.js';

// TODO: AUTO IMPORT
var plugin_routes = []
plugin_routes.push(...vaa_topics_routes)
plugin_routes.push(...textsheet_routes)
// plugin_routes.push(...cir_pros_and_cons_routes)
plugin_routes.push(...survey_routes)
plugin_routes.push(...profileupdate_routes)
// console.log(plugin_routes)
export default plugin_routes
