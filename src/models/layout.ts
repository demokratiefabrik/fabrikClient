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



  
export interface IContributionLimits {
  number_of_proposals: {
    daylimit: number;
    overalllimit: number;
    overallCurrent: number;
    current: number;
  };
  number_of_comments: {
    daylimit: number;
    current: number;
  };
}
