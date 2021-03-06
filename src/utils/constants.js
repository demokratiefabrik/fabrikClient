
// plugins/Constants.js
export default {
  //  create global Constants

  QTREE_NUMBER_OF_INITIALLY_EXPANDED_NODES: 7,
  TEXTTYPES: ["PARAGRAPH", "SECTION", "SUBSECTION"],
  DISCUSSIONTYPES: ["COMMENT", "QUESTION"],
  VAA_TOPIC_TYPES: ["COMMENT", "QUESTION", 'VAA_TOPIC'],
  VAA_QUESTION_TYPES: ["COMMENT", "QUESTION", 'VAA_QUESTION'],
  ICONS: {
    FOLDER: "mdi-folder-multiple-outline",
    SECTION: "mdi-folder-text-outline",
    SUBSECTION: "mdi-folder-text-outline",
    PARAGRAPH: "mdi-text",
    VAA_TOPIC: "mdi-shape",
    VAA_QUESTION: "mdi-sign-direction",
    UPDATEPROPOSAL: "mdi-lightbulb-on-outline"
  },
  TYPE_LABELS: {
    COMMENT: "KOMMENTAR",
    FOLDER: "ORDNER",
    SECTION: "KAPITEL",
    SUBSECTION: "ABSCHNITT",
    PARAGRAPH: "ABSATZ",
    VAA_TOPIC: "SMARTVOTE-THEMA",
    VAA_QUESTION: "SMARTVOTE-FRAGE",
    UPDATEPROPOSAL: "VERBESSERUNGSVORSCHLAG"
  },
  NOTIFICATION_ICONS: {
    PEERREVIEW_ASSIGNED: "mdi-scale-balance",
    PEERREVIEW_INIT_INSERT: "mdi-lightbulb-outline",
    PEERREVIEW_INIT_UPDATE: "mdi-lightbulb-outline",
    PEERREVIEW_REJECTED: "mdi-account-multiple-remove-outline",
    PEERREVIEW_APPROVED: "mdi-account-multiple-check",
    EDIT_CONTENT: "mdi-circle-edit-outline",
    MOVE_CONTENT: "mdi-truck-outline",
    DELETE_CONTENT: "mdi-trash-can-outline",
    REPLY_TO_CONTENT: "mdi-message-reply-text",
    LOCK: "mdi-sign-caution",
    MESSAGE: "mdi-message-text-outline"
  },

  NOTIFICATION_ACTIONS: [
    // "PEERREVIEW_ASSIGNED",
    "PEERREVIEW_INIT_INSERT",
    "PEERREVIEW_INIT_UPDATE",
    "PEERREVIEW_REJECTED",
    "PEERREVIEW_APPROVED",
    "EDIT_CONTENT",
    "MOVE_CONTENT",
    "REPLY_TO_CONTENT"],

  // API Events
  MONITOR_ERROR_NETWORK: 'ERROR.NETWORK',
  MONITOR_ERROR_AUTHORIZATION: 'ERROR.AUTH',
  MONITOR_ERROR_TOO_MANY_REQUESTS: 'ERROR.TOO.MANY.REQ',
  MONITOR_ERROR_INVALID_TOKEN: 'ERROR_INVALID_TOKEN',
  MONITOR_ERROR_AUTHENTICATION: 'ERROR.AUTH',
  MONITOR_WARNING_AUTHENTICATION: 'WARNING.AUTH',
  MONITOR_WARNING_MESSAGES: {
    PEERREVIEW_ALREADY_CLOSED_USER_RESPONSE_IGNORED: 'Ein Gutachten wurde gerade eben abgeschlossen. Ihre Antwort konnte dabei nicht mehr ber??cksichtigt werden.'
  },
  MONITOR_ROUTE_CHANGE: 'ROUTE',
  MONITOR_LOGIN: 'LOGIN',
  MONITOR_LOGOUT: 'LOGOUT',
  MONITOR_EXIT: 'EXIT',
  MONITOR_ACCOUNT_PROFILE_VISIT: 'PROFILE.VISIT',
  MONITOR_ACCOUNT_PROFILE_UPDATE: 'PROFILE.UPDATE',
  MONITOR_CONTEXT: 'CONTEXT',
  MONITOR_NOTIFICATION_SHOW: 'NOTIFICATION_SHOW',
  MONITOR_ASSEMBLY_ENTERING: 'ASSEMBLY.ENTER',
  MONITOR_DISCUSSION_SHOW: 'DISCUSSION.SHOW',
  MONITOR_SHOW_HISTORY: 'SHOW.HISTORY',
  MONITOR_SHOW_PROPOSE_UPDATE: 'SHOW.PROPOSE.UPDATE',

  MONITOR_TAB_SWTICH: 'TAB.SWITCH',

  MONITOR_STAGE_ENTERING: 'STAGE.ENTER',
  MONITOR_STAGE_UNALERT: 'STAGE.UNALERT',
  MONITOR_STAGE_COMPLETED: 'STAGE.COMPLETED',
  MONITOR_STAGE_FOCUSED_CONTENT: 'STAGE.FOCUSED.CONTENT',
  MONITOR_STAGE_RANDOM_SAMPLING_CONTENT: 'STAGE.RANDOM_SAMPLING_CONTENT',
  MONITOR_STAGE_OPTOUT: 'STAGE_OPTOUT',

  MONITOR_SET_RATING: 'CONTENT.RATING',
  MONITOR_SET_SALIENCE: 'CONTENT.SALIENCE',
  MONITOR_SET_CONTENT_READ: 'CONTENT.READ',
  MONITOR_SET_CONTENT_DISCUSSED: 'CONTENT.DISCUSSED',
  MONITOR_SET_CONTENT_REVIEWED: 'CONTENT.REVIEWED',

  MONITOR_SET_PEERREVIEW_RESPONSE: 'PEERREVIEW.RESPONSE',
  MONITOR_PEERREVIEW_VIEW: 'PEERREVIEW.VIEW',

  MONITOR_SALIENCELIST_SHOW_ALL: 'SALIENCELIST.SHOW.ALL',
  MONITOR_DIALOG_SMARTVOTE_CRITERIA: 'DIALOG.SMARTVOTE.CRITERIA',
  MONITOR_DIALOG_CONTENT_SIBLINGS: 'DIALOG.CONTENT.SIBLINGS',
  MONITOR_DIALOG_CONTENT_BACKGROUND: 'MONITOR.DIALOG.CONTENT.BACKGROUND'
}
