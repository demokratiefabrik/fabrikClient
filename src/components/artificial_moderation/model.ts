
export interface IArtificialModerationButton {
    condition: (ctx) => boolean;
    action: (ctx) => () => void;
    label: (ctx) => string;
    size: (ctx) => string | undefined;
    icon: (ctx) => string | undefined;
  }
  
export interface IArtificialModeration {
    id: number;
    prosa: string;
    priority: number | undefined;
    loading: (ctx) => boolean;
    condition: (ctx, params: Record<string, unknown>) => boolean;
    buttons: IArtificialModerationButton[];
    items: IArtificialModeration[] | undefined;
    body: (ctx, params: Record<string, unknown>) => string[];
  }