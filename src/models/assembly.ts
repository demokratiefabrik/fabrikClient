
export interface IAssemblyTuple {
    access_date: Date;
    access_sub: number;
    assembly: IAssembly;
    progression: IAssemblyProgression;
    configuration: IAssemblyConfiguration;
    stage_keys?: number[]
}

export interface IAssemblyTupleByApi {
    access_date: Date;
    access_sub: number;
    assembly: IAssembly;
    progression: IAssemblyProgression;
    configuration: IAssemblyConfiguration;
    stages: Record<number, number>
}

export interface IAssembly {
    // contenttree_id: number;
    date_modified: Date | null;
    title: string;
    disabled: boolean;
    // order_position: number;
    // group: string;
    type: string;
    info: string;
    
    id: number;

}

export interface IAssemblyProgression {
    assembly_id: number
}

export interface IAssemblyConfiguration{
    test: string
}



