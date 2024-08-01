"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VxgBasicAuthPlugin = VxgBasicAuthPlugin;
const gubu_1 = require("gubu");
function VxgBasicAuthPlugin(options) {
    const seneca = this;
    const { spec, setSigninStatus, setReady } = options;
    function handleSignin(event) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email');
        const password = data.get('password');
        seneca.delegate().act('aim:req,on:auth,signin:user', { email, password }, function (err, out) {
            if (null == err && null != out && out.ok && !spec.signin.debug) {
                document.location.href = document.location.origin +
                    '/view/' + spec.signin.view;
                return;
            }
            else if (null == err && !out.ok) {
                setSigninStatus('invalid');
                return;
            }
            else if (null == err && out.ok && spec.signin.debug) {
                setSigninStatus('debug');
                return;
            }
            if (null != err) {
                console.warn('BasicAuth', 'signin', email, err);
            }
            setSigninStatus('unavailable');
        });
    }
    setReady(true);
    return {
        exports: {
            handleSignin
        }
    };
}
VxgBasicAuthPlugin.default = {
    setSigninStatus: Function,
    setReady: Function,
    spec: (0, gubu_1.Open)({
        signin: (0, gubu_1.Open)({
            debug: false
        })
    })
};
Object.defineProperty(VxgBasicAuthPlugin, 'name', { value: 'VxgBasicAuthPlugin' });
//# sourceMappingURL=VxgBasicAuthPlugin.js.map