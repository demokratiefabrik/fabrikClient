import mitt from 'mitt';
import { INotificationBanner } from 'src/models/layout';
import { IStageTuple } from 'src/models/stage';

type Events = {
    loadingGifStackChange: any;
    EventStageLoaded: IStageTuple;
    notificationBannerChange?: INotificationBanner;
    receiveBackendFeedback: any;
    showTooManyRequestsError: undefined;
    showNetworkError: undefined;
    showAuthorizationError: undefined;
    showAuthenticationWarning: undefined;
    showServiceError: undefined | {nobuttons: boolean};
    AssemblyLoaded: undefined; // assembly is loaded
    hideLoading: undefined; // hide loading elements in layout...
    showLoading: undefined; // show loading elements in layout...
    reload: undefined; // reload page (TODO: implement)...
};

const emitter = mitt<Events>();

export default function useEmitter() {
  return emitter;
}
