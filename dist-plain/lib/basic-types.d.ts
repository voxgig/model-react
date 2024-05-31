export type Model = Record<string, any>;
export type Spec = Record<string, any>;
export type BasicCtx = {
    model: Model;
    seneca: any;
    store: any;
    theme: any;
    cmp: Record<string, any>;
    custom: Record<string, any>;
};
export type BasicProps = {
    ctx: () => BasicCtx;
    spec: Spec;
};
