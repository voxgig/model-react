declare function VxgSeneca(this: any): void;
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
export { VxgSeneca, cmap, vmap, };
