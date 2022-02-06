export interface IArtificialModerationButton {
  condition?: (ctx) => boolean;
  action: (ctx) => void;
  label: (ctx) => string;
  size?: (ctx) => string | undefined;
  icon?: (ctx) => string | undefined;
}

export interface IArtificialModeration {
  id: number | string;
  prosa?: string;
  priority?: number | undefined;
  loading?: (ctx) => boolean;
  condition?: (ctx, params: Record<string, unknown>) => boolean;
  buttons?: IArtificialModerationButton[];
  // items?: IArtificialModeration[] | undefined;
  body: (ctx, params: Record<string, unknown>) => string[] | string;
}

export interface IArtificialModerationGroup {
  id: number | string;
  prosa?: string;
  // priority?: number | undefined;
  loading?: (ctx) => boolean;
  // condition?: (ctx, params: Record<string, unknown>) => boolean;
  buttons?: IArtificialModerationButton[];
  items?: IArtificialModeration[] | undefined;
  // body: (ctx, params: Record<string, unknown>) => string[] | string;
}

export type IArtificialModerationFile = Record<string, IArtificialModerationGroup>
