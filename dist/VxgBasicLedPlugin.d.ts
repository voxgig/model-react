declare function VxgBasicLedPlugin(this: any, options: any): {
    exports: {
        spec: {
            list: any;
            edit: any;
            head: any;
            foot: any;
        };
        util: {
            dateTimeFromUTC: (utc: number, tz?: string) => any;
        };
    };
};
declare namespace VxgBasicLedPlugin {
    var defaults: {
        spec: {};
        navigate: FunctionConstructor;
    };
}
export { VxgBasicLedPlugin };
