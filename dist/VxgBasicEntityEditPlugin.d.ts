declare function VxgBasicEntityEditPlugin(this: any, options: any): {
    exports: {
        handle: {
            spec: any;
            slot: any;
            fields: any;
        };
        util: {
            dateTimeFromUTC: (utc: number, tz?: string) => any;
        };
    };
};
export { VxgBasicEntityEditPlugin };
