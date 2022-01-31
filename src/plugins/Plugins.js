// import cir_pros_and_cons_routes from 'src/plugins/CIR_PROS_AND_CONS/routes.js'
// import textsheet_AMs from 'src/plugins/TEXTSHEET/ArtificialModeration.js'
// import vaa_topics_AMs from 'src/plugins/VAA/ArtificialModeration.js';
import cir_topics_AMs from 'src/plugins/CIR/ArtificialModeration.js';
// import survey_AMs from 'src/plugins/SURVEY/ArtificialModeration.js';

// TODO: AUTO IMPORT
var plugin_AMs = {
  ...cir_topics_AMs
}
// plugin_AMs.push(...vaa_topics_AMs)
// plugin_AMs.push(...textsheet_routes)
// plugin_routes.push(...cir_pros_and_cons_routes)
// plugin_AMs.push(...survey_routes)
// console.log(plugin_AMs)
export default plugin_AMs
