declare function VxgSeneca(this: any): void;
declare function cmap(o: any, p: any): any;
declare namespace cmap {
    var ID: (x: any) => any;
    var DEL: (x: any) => any;
    var KEY: (_x: any, _k: string, _c: any, j: string) => string;
}
declare function vmap(o: any, p: any): any;
declare namespace vmap {
    var ID: (x: any) => any;
    var DEL: (x: any) => any;
    var KEY: (_x: any, _k: string, _c: any, j: string) => string;
}
export { VxgSeneca, cmap, vmap, };
