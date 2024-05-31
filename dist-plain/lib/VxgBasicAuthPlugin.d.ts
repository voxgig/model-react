declare function VxgBasicAuthPlugin(this: any, options: any): {
    exports: {
        handleSignin: (event: any) => void;
    };
};
declare namespace VxgBasicAuthPlugin {
    var _a: {
        setSigninStatus: FunctionConstructor;
        setReady: FunctionConstructor;
        spec: import("gubu").Node<{
            signin: import("gubu").Node<{
                debug: boolean;
            }>;
        }>;
    };
    export { _a as default };
}
export { VxgBasicAuthPlugin };
