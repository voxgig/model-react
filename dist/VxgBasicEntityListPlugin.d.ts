declare function VxgBasicEntityListPlugin(this: any, options: any): {
    exports: {
        handle: {
            spec: any;
            slot: any;
            columns: any;
            buildFilter: typeof buildFilter;
        };
    };
};
declare function buildFilter(query: any): {
    filter: any;
    filterDesc: any;
};
export { VxgBasicEntityListPlugin };
