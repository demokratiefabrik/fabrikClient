import useXHR from 'src/utils/xhr';
import usePKCEComposable from 'src/plugins/VueOAuth2PKCE/pkce.composable';


interface IResponseUsers {
  data: {
    users: { string; IUser };
  };
}

interface IResponseSVG {
  data: string;
}


export default function useCIRApi() {

  const xhr = useXHR();

  // CIR
  // *********************************
  /**
   * Get CIR plot svg..
   */
  const polarbee = async (url: string): Promise<IResponseSVG> => {

    const {refresh_token_if_required} = usePKCEComposable()
    await refresh_token_if_required()

    const data = {
      method: 'get',
      url: url
    };
    return xhr.customRequest(data);
  };

  //  export const SaveEvent: GeneralActionCreator<UserEvent> = (payload) => {
  const polarbeeUsers = async (): Promise<IResponseUsers> => {
    
    const {refresh_token_if_required} = usePKCEComposable()
    await refresh_token_if_required()

    const url = '/users';
    const data = {
      method: 'get',
      url: url
    };

    return xhr.customRequest(data);
  };

  return {
    polarbee,
    polarbeeUsers,
  };
}
