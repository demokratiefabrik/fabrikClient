
export interface IStageTuple {
    stage: IStage;
    progression: IStageProgression;
}

export interface IStage {
    contenttree_id: number;
    date_modified: Date | null;
    title: string;
    disabled: boolean;
    order_position: number;
    group: string;
    type: string;
    info: string;
    
    id: number;

}

export interface IStageProgression {
    stage_id: number
    number_of_day_sessions: number
}