"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VxgBasicEntityFieldPlugin = VxgBasicEntityFieldPlugin;
const gubu_1 = require("gubu");
const { Open, Child } = gubu_1.Gubu;
const Shape = (0, gubu_1.Gubu)(Open({
    field: {},
}), { name: 'BasicEntityField' });
function VxgBasicEntityFieldPlugin(options) {
    const seneca = this;
    const spec = Shape(options.spec);
    options.setPlugin(true);
    return {
        exports: {
            handle: {},
        },
    };
}
Object.assign(VxgBasicEntityFieldPlugin, {
    defaults: {
        spec: {},
        setPlugin: Function,
    },
});
Object.defineProperty(VxgBasicEntityFieldPlugin, 'name', {
    value: 'VxgBasicEntityFieldPlugin',
});
//# sourceMappingURL=VxgBasicEntityFieldPlugin.js.map