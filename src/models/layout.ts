// import { RouteParams } from '@quasar/app';
import { RouteLocationRaw } from 'vue-router';

export interface INotificationBanner {
    type: string;
    // 'error' | 'warning';
    title: string;
    body: string;
    icon: string;
    buttons?: string[];
    settimer?: boolean;
    redirectRoute?: RouteLocationRaw;
  }


