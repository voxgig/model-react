declare function BasicEntityAutocompleteField(props: any): import("react/jsx-runtime").JSX.Element;
export declare const resolveCategories: ({ item, }: {
    item: Record<string, {
        title: string;
    }>;
}) => {
    key: string;
    title: string;
}[];
export declare function resolveDefault(cat: {
    multiple: number;
    item: any;
    default: string;
}): any;
export declare function resolveValue(value: any, cat: {
    multiple: number;
    item: Record<string, {
        title: string;
    }>;
}): any;
export { BasicEntityAutocompleteField };
