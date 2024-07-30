declare function BasicEntityAutocompleteField(props: any): import("react/jsx-runtime").JSX.Element;
export declare function resolveCategories(cat: {
    item: Record<string, {
        title: string;
    }>;
}): {
    title: string;
    key: string;
}[];
export declare function resolveDefault(cat: {
    multiple: number;
    item: any;
    default: string;
}): "" | {
    title: any;
    key: any;
}[] | {
    key: string;
    title: any;
};
export declare function resolveValue(value: any, cat: {
    multiple: number;
    item: Record<string, {
        title: string;
    }>;
}): any;
export { BasicEntityAutocompleteField };
