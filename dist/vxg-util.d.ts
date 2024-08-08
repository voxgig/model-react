declare function cmap(o: any, p: any): any;
declare namespace cmap {
    var COPY: (x: any) => any;
    var FILTER: (x: any) => any;
    var KEY: (_: any, p: any) => any;
}
declare function vmap(o: any, p: any): any;
declare namespace vmap {
    var COPY: (x: any) => any;
    var FILTER: (x: any) => any;
    var KEY: (_: any, p: any) => any;
}
declare function searchParamsToObject(searchParams: URLSearchParams): any;
declare function resvalue(value: object | any[] | string, cat: {
    multiple: number;
    item: Record<string, {
        title: string;
    }>;
}, mapFn: (val: string, item: {
    title: string;
}) => any): any;
declare function resdefault(cat: {
    multiple: number;
    item: Record<string, {
        title: string;
    }>;
    default: string;
}, mapFn: (val: string, item: {
    title: string;
}) => any): any;
declare function useSanitizedId(): string;
export { cmap, vmap, searchParamsToObject, resvalue, resdefault, useSanitizedId, };
