"use strict";
// TODO: cmap,vmap probably belong in @voxgig/model utils
Object.defineProperty(exports, "__esModule", { value: true });
exports.cmap = cmap;
exports.vmap = vmap;
exports.searchParamsToObject = searchParamsToObject;
// Map child objects to new child objects
function cmap(o, p) {
    return Object
        .entries(o)
        .reduce((r, n, _) => (_ = Object
        .entries(p)
        .reduce((s, m) => (cmap.FILTER === s ? s : (s[m[0]] = (
    // transfom(val,key,current,parentkey,parent)
    'function' === typeof m[1] ? m[1](n[1][m[0]], {
        skey: m[0], self: n[1], key: n[0], parent: o
    }) : m[1]), (cmap.FILTER === s[m[0]] ? cmap.FILTER : s))), {})
        , (cmap.FILTER === _ ? 0 : r[n[0]] = _), r), {});
}
cmap.COPY = (x) => x;
// keep self if x is truthy, or function returning truthy-new-value or [truthy,new-value]
cmap.FILTER = (x) => 'function' === typeof x ? ((y, p, _) => (_ = x(y, p), Array.isArray(_) ? !_[0] ? _[1] : cmap.FILTER : _)) : (x ? x : cmap.FILTER);
cmap.KEY = (_, p) => p.key;
// Map child objects to a list of child objects
function vmap(o, p) {
    return Object
        .entries(o)
        .reduce((r, n, _) => (_ = Object
        .entries(p)
        .reduce((s, m) => (vmap.FILTER === s ? s : (s[m[0]] = (
    // transfom(val,key,current,parentkey,parent)
    // 'function' === typeof m[1] ? m[1](n[1][m[0]], m[0], n[1], n[0], o) : m[1]
    'function' === typeof m[1] ? m[1](n[1][m[0]], {
        skey: m[0], self: n[1], key: n[0], parent: o
    }) : m[1]), (vmap.FILTER === s[m[0]] ? vmap.FILTER : s))), {})
        , (vmap.FILTER === _ ? 0 : r.push(_)), r), []);
}
vmap.COPY = (x) => x;
vmap.FILTER = (x) => 'function' === typeof x ? ((y, p, _) => (_ = x(y, p), Array.isArray(_) ? !_[0] ? _[1] : vmap.FILTER : _)) : (x ? x : vmap.FILTER);
vmap.KEY = (_, p) => p.key;
function searchParamsToObject(searchParams) {
    let params = Object.create(null);
    for (let [key, value] of searchParams.entries()) {
        params[key] = value;
    }
    return params;
}
//# sourceMappingURL=vxg-util.js.map