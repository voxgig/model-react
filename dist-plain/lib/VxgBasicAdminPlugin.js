"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VxgBasicAdminPlugin = VxgBasicAdminPlugin;
const vxg_util_1 = require("./vxg-util");
function VxgBasicAdminPlugin() {
    const seneca = this;
    const { Exact, Default } = seneca.valid;
    seneca.root.context.cmap = vxg_util_1.cmap;
    seneca.root.context.vmap = vxg_util_1.vmap;
    seneca
        .message('aim:app,prepare:app,redux$:true', prepareApp)
        .message('aim:app,sync:view,redux$:true', { name: String, query: {}, hash: Default('') }, syncView)
        .message('aim:app,area:nav,set:mode,redux$:true', { mode: Exact('shown', 'hidden') }, setMode)
        .message('aim:app,on:nav,set:path', { navigate: Function, view: String }, setPath)
        .prepare(async function () {
        await this.post('aim:app,prepare:app');
    });
    async function setPath(msg, meta) {
        const q = Object.entries(msg.query)
            .reduce((s, n) => (s + ('' === s ? '?' : '') +
            (encodeURIComponent(n[0]) + '=' + encodeURIComponent(n[1]))), '');
        const path = '/view/' + msg.view + q;
        msg.navigate(path);
    }
    async function setMode(msg, meta) {
        meta.custom.state().nav.mode = msg.mode;
    }
    async function syncView(msg, meta) {
        meta.custom.state().current.view.name = msg.name;
        meta.custom.state().current.view.query = msg.query;
        meta.custom.state().current.view.hash = msg.hash;
    }
    async function prepareApp(_msg, meta) {
        let state = meta.custom.state();
        let model = seneca.context.model;
        let frame = model.app.web.frame.private;
        let viewMap = frame.view;
        // let partMap = frame.part
        let sectionMap = frame.nav.section;
        state.current = {
            view: {
                name: '',
                query: {},
                hash: ''
            }
        };
        const viewState = (0, vxg_util_1.cmap)(viewMap, {
            name: vxg_util_1.cmap.COPY,
            active: vxg_util_1.cmap.FILTER,
        });
        state.view = viewState;
        state.nav = {
            mode: 'shown',
            section: (0, vxg_util_1.cmap)(sectionMap, {
                name: vxg_util_1.cmap.COPY,
                active: vxg_util_1.cmap.FILTER,
                item: (x) => (0, vxg_util_1.cmap)(x, {
                    active: vxg_util_1.cmap.FILTER,
                    view: vxg_util_1.cmap.COPY,
                    name: vxg_util_1.cmap.COPY,
                })
            })
        };
    }
}
//# sourceMappingURL=VxgBasicAdminPlugin.js.map