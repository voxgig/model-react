"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VxgBasicEntityEditPlugin = VxgBasicEntityEditPlugin;
const gubu_1 = require("gubu");
const { Open, Child } = gubu_1.Gubu;
const Shape = (0, gubu_1.Gubu)(Open({
    name: String,
    prefix: String,
    ent: String,
    order: [String],
    field: Child({}, {}),
}), { name: 'BasicEntityEdit' });
function VxgBasicEntityEditPlugin(options) {
    const seneca = this;
    const spec = Shape(options.spec);
    const slot = spec.prefix + spec.name;
    const fields = spec.order.reduce((a, fn) => (fixField(fn, spec.field[fn], spec), a.push(spec.field[fn]), a), []);
    for (const field of fields) {
        if ('Date' === field.ux.kind) {
            seneca.add('aim:app,on:BasicLed,modify:edit,view:' + spec.name, async function modify_edit_Date(msg) {
                const out = await this.prior(msg);
                let { item } = out;
                item = { ...item };
                if (!item[field.name + '_orig$']) {
                    const dt = util.dateTimeFromUTC(item[field.name]);
                    item[field.name + '_orig$'] = item[field.name];
                    item[field.name + '_udm$'] = dt.udm;
                    item[field.name] = dt.localt;
                }
                return { ...msg, item };
            });
        }
        else if ('Time' === field.ux.kind) {
            seneca.add('aim:app,on:BasicLed,modify:edit,view:' + spec.name, async function modify_edit_Time(msg) {
                const out = await this.prior(msg);
                let { item } = out;
                item = { ...item };
                if (!item[field.name + '_orig$']) {
                    const dt = util.dateTimeFromUTC(item[field.name]);
                    item[field.name + '_orig$'] = item[field.name];
                    item[field.name + '_udm$'] = dt.udm;
                    item[field.name] = dt.localt;
                }
                return { ...msg, item };
            });
        }
        else if ('DateTime' === field.ux.kind) {
            seneca.add('aim:app,on:BasicLed,modify:edit,view:' + spec.name, async function modify_edit_Datetime(msg) {
                const out = await this.prior(msg);
                let { item } = out;
                item = { ...item };
                if (!item[field.name + '_orig$']) {
                    const dt = util.dateTimeFromUTC(item[field.name]);
                    item[field.name + '_orig$'] = item[field.name];
                    item[field.name + '_udm$'] = dt.udm;
                    item[field.name] = dt.locald + 'T' + dt.localt;
                }
                return { ...msg, item };
            });
        }
        else if ('Slider' === field.ux.kind) {
            // console.log('VxgBasicEntityEditPlugin', 'Slider')
            seneca.add('aim:app,on:BasicLed,modify:edit,view:' + spec.name, async function modify_edit_Slider(msg) {
                const out = await this.prior(msg);
                let { item } = out;
                item = { ...item };
                if (!item[field.name + '_orig$']) {
                    item[field.name + '_orig$'] = item[field.name];
                    item[field.name] = Number(item[field.name]) / 60;
                }
                return { ...msg, item };
            });
        }
    }
    options.setPlugin(true);
    return {
        exports: {
            handle: {
                spec,
                slot,
                fields,
            },
            util,
        },
    };
}
function fixField(name, field, spec) {
    field.id = 'vxg-field-' + spec.name + '-' + name;
    field.name = name;
    field.ux = field.ux || {};
    field.ux.size = null == field.ux.size ? 4 : parseInt(field.ux.size, 10);
}
const util = {
    dateTimeFromUTC: (utc, tz) => {
        const date = new Date(utc);
        const iso = date.toISOString();
        const isod = iso.split('T')[0];
        const isot = iso.split('T')[1].split('.')[0];
        // UTC millis into day (since midnight)
        const udm = date.getUTCHours() * 60 * 60 * 1000 +
            date.getUTCMinutes() * 60 * 1000 +
            date.getUTCSeconds() * 1000 +
            date.getUTCMilliseconds();
        let out = {
            utc,
            date,
            isod,
            isot,
            udm,
        };
        tz = tz || Intl.DateTimeFormat().resolvedOptions().timeZone;
        const dateFormatter = new Intl.DateTimeFormat('en-GB', {
            timeZone: tz,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
        const timeFormatter = new Intl.DateTimeFormat('en-GB', {
            timeZone: tz,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });
        const [{ value: day }, , { value: month }, , { value: year }] = dateFormatter.formatToParts(date);
        const [{ value: hour }, , { value: minute }, , { value: second }] = timeFormatter.formatToParts(date);
        out.locald = `${year}-${month}-${day}`;
        out.localt = `${hour}:${minute}:${second}`;
        return out;
    },
};
Object.assign(VxgBasicEntityEditPlugin, {
    defaults: {
        spec: {},
        setPlugin: Function,
    },
});
Object.defineProperty(VxgBasicEntityEditPlugin, 'name', {
    value: 'VxgBasicEntityEditPlugin',
});
//# sourceMappingURL=VxgBasicEntityEditPlugin.js.map