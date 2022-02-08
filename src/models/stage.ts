
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
    custom_data: any;
    id: number;

}

export interface IStageProgression {
    stage_id: number
    number_of_day_sessions: number
    completed?: boolean
}


export interface IStageGroup {
    name: string;
    disabled?: boolean;
    label: string;
    toc_label?: string;
    description: string;
    icon: string;
    tooltip?: string;
    expanded?: (item) => boolean;
    expandable?: boolean;
    manual_expanded?: boolean;
    to: () => any; // TODO. add route interface
  }
  