"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VxgBasicEntityEditPlugin = void 0;
const gubu_1 = require("gubu");
const { Open, Child } = gubu_1.Gubu;
const Shape = (0, gubu_1.Gubu)(Open({
    name: String,
    prefix: String,
    ent: String,
    order: [String],
    field: Child({}, {})
}), { prefix: 'BasicEntityEdit' });
function VxgBasicEntityEditPlugin(options) {
    const seneca = this;
    const spec = Shape(options.spec);
    console.log('QQQ', spec);
    const slot = spec.prefix + spec.name;
    const fields = spec.order.reduce((a, fn) => (fixField(fn, spec.field[fn], spec), a.push(spec.field[fn]), a), []);
    options.setPlugin(true);
    return {
        exports: {
            handle: {
                spec,
                slot,
                fields,
            }
        }
    };
}
exports.VxgBasicEntityEditPlugin = VxgBasicEntityEditPlugin;
function fixField(name, field, spec) {
    field.id = 'vxg-field-' + spec.name + '-' + name;
    field.name = name;
    field.ux = field.ux || {};
    field.ux.size = null == field.ux.size ? 4 : parseInt(field.ux.size, 10);
}
Object.assign(VxgBasicEntityEditPlugin, {
    defaults: {
        spec: {},
        setPlugin: Function,
    }
});
Object.defineProperty(VxgBasicEntityEditPlugin, 'name', { value: 'VxgBasicEntityEditPlugin' });
//# sourceMappingURL=VxgBasicEntityEditPlugin.js.map