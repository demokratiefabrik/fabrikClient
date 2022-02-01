
export interface INode {
    id: number | null;
    contenttree_id: number | null;
    reviewed: boolean;
    private_property: boolean;
    title: string;
    type: string;
    disabled: boolean;
    text: string;
    date_created: Date | string;
    rejected?: boolean | null;
    S?: {
      SA: number
    }
  }

export interface INodeProgression {
  content_id?: number | null;
  read: boolean | null,
  discussed: boolean | null,
  rating: null | number,
  salience: null | number
  view: boolean | null
}

export interface INodeTuple {
  content?: INode;
  progression?: INodeProgression;
  path: number[];
  children: INodeTuple[];
  nof_descendants?: number;
  creator?: any;

}