import { INodeTuple } from './content';

export interface IContentTree {
    date_last_tree_modification?: Date | string;
    id: number;
    entries: Record<string, INodeTuple>;
    rootElementIds: number[];
}

export interface IContentTreeProgression {
    contenttree_id?: number;
}

export interface IContentTreeTuple {
    contenttree: IContentTree
    progression: IContentTreeProgression
}