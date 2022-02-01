
export interface IAssemblyTuple {
    assembly: IAssembly;
    progression: IAssemblyProgression;
    configuration: IAssemblyConfiguration;
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