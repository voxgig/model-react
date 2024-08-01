"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VxgBasicLedPlugin = VxgBasicLedPlugin;
const gubu_1 = require("gubu");
const { Open } = gubu_1.Gubu;
const Shape = (0, gubu_1.Gubu)({
    name: String,
    title: String,
    active: Boolean,
    kind: String,
    def: {
        ent: String,
        head: Open({
            active: false,
        }),
        list: Open({
            active: false,
        }),
        edit: Open({
            active: false,
        }),
        foot: Open({
            active: false,
        }),
    },
}, { name: 'BasicLed' });
function VxgBasicLedPlugin(options) {
    const seneca = this;
    const spec = Shape(options.spec);
    const navigate = options.navigate;
    const name = spec.name;
    const entCanon = spec.def.ent;
    const slotName = 'BasicLed_' + name;
    // console.log('VxgBasicLedPlugin', 'name', name, 'init')
    seneca
        .add('on:BasicLed')
        .fix({ view: name })
        .add('aim:app,on:view,init:state,redux$:true', function (_msg, reply, meta) {
        const state = meta.custom.state();
        let view = state.view[name];
        view.mode = 'list';
        view.status = 'init';
        view.ready = true;
        this.export('Redux/entityPrepare')(state, slotName);
        reply();
    })
        .add('aim:app,on:BasicLed,ready:list,redux$:true', function (msg, reply, meta) {
        const setReady = msg.setReady;
        const view = meta.custom.state().view[name];
        view.mode = 'list';
        view.status = 'list-item';
        setReady(true);
        reply();
    })
        .add('aim:app,on:BasicLed,ready:edit,redux$:true', function (msg, reply, meta) {
        const setReady = msg.setReady;
        // Update the view state
        const view = meta.custom.state().view[name];
        view.mode = 'edit';
        view.status = 'edit-item';
        setReady(true);
        reply();
    })
        .add('aim:app,on:BasicLed,modify:edit', function modify_edit(msg) {
        let item = msg.item;
        // let fields = msg.fields
        if (null == item)
            return item;
        item = { ...item };
        return { ...msg, item };
    })
        .add('aim:app,on:BasicLed,modify:save', function modify_save(msg) {
        let item = msg.data;
        let fields = msg.fields;
        if (null == item)
            return item;
        item = { ...item };
        // This code does not belong here
        for (const field of fields) {
            if ('Slider' === field.ux.kind) {
                console.log('VxgBasicLedPlugin', 'modify:save', 'field', field);
                console.log('VxgBasicLedPlugin', 'modify:save', 'item', item);
                item[field.name] = Number(item[field.name]) * 60;
            }
        }
        console.log('modify:save', 'item', item);
        return item;
    })
        .message('aim:app,on:BasicLed,edit:item,redux$:true', { item_id: String }, async function (msg, meta) {
        const state = meta.custom.state();
        let view = state.view[name];
        const { item_id } = msg;
        view.mode = 'edit';
        const fields$ = Object.keys(spec.def.edit.field);
        navigate('/view/' + name + '/edit/' + item_id);
        const item = await this.entity(entCanon).load$({
            id: msg.item_id,
            slot$: slotName,
            fields$,
        });
        return item;
    })
        .message('aim:app,on:BasicLed,add:item', async function (_msg) {
        await seneca.entity(entCanon).save$({ add$: true, slot$: slotName });
        navigate('/view/' + name + '/add');
    })
        .message('aim:app,on:BasicLed,save:item', async function (msg) {
        const data = Object.entries(spec.def.edit.field)
            .filter((n) => false !== n[1].ux.edit)
            .reduce((a, n) => ((a[n[0]] = msg.data[n[0]]), a), {});
        const item = await seneca.entity(entCanon).save$(data);
        // TODO: navigate to edit view
        // navigate('/view/' + name + '/edit/' + item.id)
        navigate('/view/' + name);
    });
    seneca.prepare(async function () {
        this.act('aim:app,on:view,init:state,direct$:true', { view: name });
    });
    const sharedSpec = {
        name,
        ent: entCanon,
        prefix: 'BasicLed_',
    };
    const listSpec = {
        ...spec.def.list,
        ...sharedSpec,
    };
    const editSpec = {
        ...spec.def.edit,
        ...sharedSpec,
    };
    const headSpec = {
        ...spec.def.head,
        ...sharedSpec,
    };
    const footSpec = {
        ...spec.def.foot,
        ...sharedSpec,
    };
    return {
        exports: {
            spec: {
                list: listSpec,
                edit: editSpec,
                head: headSpec,
                foot: footSpec,
            },
            util,
        },
    };
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
VxgBasicLedPlugin.defaults = {
    spec: {},
    navigate: Function,
};
Object.defineProperty(VxgBasicLedPlugin, 'name', { value: 'VxgBasicLedPlugin' });
//# sourceMappingURL=VxgBasicLedPlugin.js.map