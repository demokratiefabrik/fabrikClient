import { IAssemblyTuple } from 'src/models/assembly';
import { IStageTuple } from 'src/models/stage';


export default function () {
  return {
    assemblydata: {} as Record<string, IAssemblyTuple>,
    stages: {} as Record<string, IStageTuple>,
    milestones: {}
    }
}
