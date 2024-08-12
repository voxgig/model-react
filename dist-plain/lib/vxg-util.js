"use strict";
// TODO: cmap,vmap probably belong in @voxgig/model utils
Object.defineProperty(exports, "__esModule", { value: true });
exports.cmap = cmap;
exports.vmap = vmap;
exports.searchParamsToObject = searchParamsToObject;
exports.resvalue = resvalue;
exports.resdefault = resdefault;
exports.useSanitizedId = useSanitizedId;
const react_1 = require("react");
// Map child objects to new child objects
function cmap(o, p) {
    return Object.entries(o).reduce((r, n, _) => ((_ = Object.entries(p).reduce((s, m) => cmap.FILTER === s
        ? s
        : ((s[m[0]] =
            // transfom(val,key,current,parentkey,parent)
            'function' === typeof m[1]
                ? m[1](n[1][m[0]], {
                    skey: m[0],
                    self: n[1],
                    key: n[0],
                    parent: o,
                })
                : m[1]),
            cmap.FILTER === s[m[0]] ? cmap.FILTER : s), {})),
        cmap.FILTER === _ ? 0 : (r[n[0]] = _),
        r), {});
}
cmap.COPY = (x) => x;
// keep self if x is truthy, or function returning truthy-new-value or [truthy,new-value]
cmap.FILTER = (x) => 'function' === typeof x
    ? (y, p, _) => ((_ = x(y, p)), Array.isArray(_) ? (!_[0] ? _[1] : cmap.FILTER) : _)
    : x
        ? x
        : cmap.FILTER;
cmap.KEY = (_, p) => p.key;
// Map child objects to a list of child objects
function vmap(o, p) {
    return Object.entries(o).reduce((r, n, _) => ((_ = Object.entries(p).reduce((s, m) => vmap.FILTER === s
        ? s
        : ((s[m[0]] =
            // transfom(val,key,current,parentkey,parent)
            // 'function' === typeof m[1] ? m[1](n[1][m[0]], m[0], n[1], n[0], o) : m[1]
            'function' === typeof m[1]
                ? m[1](n[1][m[0]], {
                    skey: m[0],
                    self: n[1],
                    key: n[0],
                    parent: o,
                })
                : m[1]),
            vmap.FILTER === s[m[0]] ? vmap.FILTER : s), {})),
        vmap.FILTER === _ ? 0 : r.push(_),
        r), []);
}
vmap.COPY = (x) => x;
vmap.FILTER = (x) => 'function' === typeof x
    ? (y, p, _) => ((_ = x(y, p)), Array.isArray(_) ? (!_[0] ? _[1] : vmap.FILTER) : _)
    : x
        ? x
        : vmap.FILTER;
vmap.KEY = (_, p) => p.key;
function searchParamsToObject(searchParams) {
    let params = Object.create(null);
    for (let [key, value] of searchParams.entries()) {
        params[key] = value;
    }
    return params;
}
// Map a value (object, array, or string) to a value or array of values using a map function
// TODO: possibly not the best place for this, maybe in a plugin?
function resvalue(value, cat, mapFn) {
    const { item: items, multiple } = cat;
    if (!value) {
        return multiple === 1 ? '' : [];
    }
    if (Object.keys(items).length === 0) {
        return multiple === 1 ? '' : [];
    }
    if (Array.isArray(value)) {
        return multiple === 1 && value[0] ? value[0] : value.slice(0, multiple);
    }
    if (typeof value === 'object') {
        return multiple === 1 ? value : [value];
    }
    const splitValue = value.split(',');
    const mapValue = (val) => items[val] ? mapFn(val, items[val]) : undefined;
    switch (multiple) {
        case 1:
            return mapValue(splitValue[0]) || '';
        case -1:
            return splitValue.map(mapValue).filter(Boolean) || [];
        default:
            return splitValue.slice(0, multiple).map(mapValue).filter(Boolean);
    }
}
// Map a string to a value or array of values using a map function
// TODO: possibly not the best place for this, maybe in a plugin?
function resdefault(cat, mapFn) {
    const { multiple, item: items, default: defaultValues } = cat;
    if (Object.keys(items).length === 0) {
        return multiple === 1 ? '' : [];
    }
    const defaultItems = defaultValues.split(',');
    const mapResolvedDefault = (list) => list.map((val) => (items[val] ? mapFn(val, items[val]) : undefined));
    switch (multiple) {
        case 1:
            return defaultItems[0]
                ? mapFn(defaultItems[0], items[defaultItems[0]])
                : '';
        case -1:
            return mapResolvedDefault(defaultItems).filter(Boolean) || [];
        default:
            return (mapResolvedDefault(defaultItems.slice(0, multiple)).filter(Boolean) ||
                []);
    }
}
function useSanitizedId() {
    const id = (0, react_1.useId)();
    const sanitizedId = id.replace(/[^a-zA-Z0-9_]/g, 'x');
    return sanitizedId;
}
//# sourceMappingURL=vxg-util.js.map