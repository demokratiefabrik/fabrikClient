import useXHR from 'src/utils/xhr';
import usePKCEComposable from 'src/plugins/VueOAuth2PKCE/pkce.composable';

const {refresh_token_if_required} = usePKCEComposable()

interface IResponseUsers {
  data: {
    users: { string; IUser };
  };
}

interface IResponseSVG {
  data: string;
}

const xhr = useXHR();

export default function useCIRApi() {

  // CIR
  // *********************************
  /**
   * Get CIR plot svg..
   */
  const polarbee = async (url: string): Promise<IResponseSVG> => {

    await refresh_token_if_required()

    const data = {
      method: 'get',
      url: url
    };
    return xhr.customRequest(data);
  };

  //  export const SaveEvent: GeneralActionCreator<UserEvent> = (payload) => {
  const polarbeeUsers = async (): Promise<IResponseUsers> => {
    
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
