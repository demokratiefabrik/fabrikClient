
import { colors } from 'quasar';
import usePKCEComposable from 'src/plugins/VueOAuth2PKCE/pkce.composable';
const { changeAlpha } = colors


export const  randomLocalStorageSeed = (state) => {
    return (state.randomSeed)
  }

 export const  is_in_testing_phase = (state) => {
    if (!state.publicProfile) {
      return (null)
    }
    return (state.publicProfile?.configuration?.t)
  }

 export const  get_public_profile = (state) => {
    if (!state.publicProfile) {
      return (null)
    }
    return (state.publicProfile.user)
  }

 export const  lightProfileColor = (state) => {
    const profile = state.publicProfile?.user;
    if (!profile) {
      return '#CCCCCC'
    }
    return changeAlpha(profile.CO, 0.2);
  }

 export const  profileColor = (state) => {
    const profile = state.publicProfile?.user;
    if (!profile) {
      return '#AAAAAA'
    }
    return profile.CO;
  }

 export const  oauthAcls = (state: any) => {
    console.log('get acls transmitted via JWT token')
    return (state.oauthAcls)
  }

 export const translateOauthAcls = (state, getters) => (assemblyIdentifier) => {

    const roles = getters.oauthAcls
    if (!roles) {
      return []
    }

    let assembly_roles = roles.filter(el => el.endsWith(`@${assemblyIdentifier}`))
    assembly_roles = assembly_roles.map(function (el) {
      return el.split('@')[0]
    })

    const assemblyAcls: string[] = []
    if (assembly_roles.includes('administrator')) {
      assemblyAcls.push('administrate', 'manage', 'observe')
    }
    if (assembly_roles.includes('manager')) {
      assemblyAcls.push('manage', 'observe')
    }

    if (assembly_roles.includes('delegate')) {
      assemblyAcls.push('delegate', 'modify', 'add', 'observe')
    }

    if (assembly_roles.includes('contributor')) {
      assemblyAcls.push('contribute', 'observe')
    }

    if (assembly_roles.includes('expert')) {
      assemblyAcls.push('expert', 'observe')
    }

    // TODO: Are visitors welcome within this assembly???
    const {authorized}  = usePKCEComposable()
    if (authorized) {
      assemblyAcls.push('observe')
    }

    return (assemblyAcls)
  }

 export const getAMCache = (state) => (cacheKey) => {
    return state.AMCache[cacheKey];
  }

 export const  notifications = (state) => {
    return state.notifications.entries;
  }