import { IPeerreviewTuple } from 'src/models/peerreview';

interface IPeerreviewContentTreeStore {
  entries: IPeerreviewTuple[]
}

export default function () {
  return {
    peerreviews: {} as Record<number, IPeerreviewContentTreeStore>
  };
}
