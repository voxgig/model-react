declare function VxgBasicEntityEditPlugin(this: any, options: any): {
    exports: {
        handle: {
            spec: any;
            slot: any;
            fields: any;
        };
        util: {
            dateTimeFromUTC: (utc: number, tz?: string) => any;
            localTimeToUTC: (timeString: string, tz?: string) => number;
            localDateTimeToUTC: (dateOrDateTimeString: string, tz?: string) => number;
        };
    };
};
export { VxgBasicEntityEditPlugin };
