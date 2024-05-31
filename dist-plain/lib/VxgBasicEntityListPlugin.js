"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VxgBasicEntityListPlugin = void 0;
const gubu_1 = require("gubu");
const { Open, Child } = gubu_1.Gubu;
const Shape = (0, gubu_1.Gubu)(Open({
    name: String,
    prefix: String,
    ent: String,
    order: [String],
    field: Child({}, {})
}), { prefix: 'BasicEntityList' });
function VxgBasicEntityListPlugin(options) {
    const seneca = this;
    const spec = Shape(options.spec);
    console.log('BasicEntityList spec', spec);
    const slot = spec.prefix + spec.name;
    // TODO: error if field missing
    const columns = spec.order.reduce((a, fn) => {
        const field = spec.field[fn];
        // console.log('CF', fn, field)
        a.push({
            accessorKey: fn,
            header: field.label,
            Cell: options.cell[fn],
        });
        return a;
    }, []);
    // console.log('BasicEntityList columns', columns)
    options.setPlugin(true);
    return {
        exports: {
            handle: {
                spec,
                slot,
                columns,
                buildFilter,
            }
        }
    };
}
exports.VxgBasicEntityListPlugin = VxgBasicEntityListPlugin;
function buildFilter(query) {
    const filter = Object.entries(query)
        .reduce((a, n) => ((n[0].startsWith('f_') ? a[n[0].substring(2)] = n[1] : null), a), {});
    const filterDesc = Object.entries(filter)
        .reduce((a, n) => a + '~' + n[0] + '=' + n[1], '');
    return { filter, filterDesc };
}
Object.assign(VxgBasicEntityListPlugin, {
    defaults: {
        spec: {},
        cell: {},
        setPlugin: Function,
    }
});
Object.defineProperty(VxgBasicEntityListPlugin, 'name', { value: 'VxgBasicEntityListPlugin' });
//# sourceMappingURL=VxgBasicEntityListPlugin.js.map