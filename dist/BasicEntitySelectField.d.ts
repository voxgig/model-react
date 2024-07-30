declare function BasicEntitySelectField(props: any): import("react/jsx-runtime").JSX.Element;
export declare function resolveCategories(cat: any): {
    title: any;
    key: string;
}[];
export declare function resolveDefault(cat: {
    multiple: number;
    item: any;
    default: string;
}): string | any[];
export declare function resolveValue(value: any, cat: {
    multiple: number;
    item: Record<string, {
        title: string;
    }>;
}): any;
export { BasicEntitySelectField };
