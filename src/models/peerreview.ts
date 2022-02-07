// import { INode } from "./content"

import { INode } from './content';

export interface IPeerreview {
  rejected: boolean | null;
  approved: boolean | null;
  date_rejected: Date | null;
  date_approved: Date | null;
}

export interface IPeerreviewProgression {
  date_responded: Date | null;
  response: boolean | null
}

export interface IPeerreviewTuple {
  disabled: boolean | null;
  peerreview: IPeerreview;
  progression: IPeerreviewProgression;
  content: INode;
}
