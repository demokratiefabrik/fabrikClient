import useXHR from 'src/utils/xhr';

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
    // Renew token (if required)
    // await Vue.prototype.oauth.refresh_token_if_required()
    // const url = `${process.env.ENV_OAUTH_BASE_URL}/user`
    const data = {
      method: 'get',
      url: url
    };
    return xhr.customRequest(data);
  };

  //  export const SaveEvent: GeneralActionCreator<UserEvent> = (payload) => {
  const polarbeeUsers = async (): Promise<IResponseUsers> => {
    // Renew token (if required)
    // await Vue.prototype.oauth.refresh_token_if_required()
    const url = '/users';
    const data = {
      method: 'get',
      url: url,
      // headers: {
      //   'content-type': 'application/json',
      // },
    };

    return xhr.customRequest(data);
  };

  return {
    polarbee,
    polarbeeUsers,
  };
}
