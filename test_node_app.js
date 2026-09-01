
global.window = {
    addEventListener: () => {},
    localStorage: { getItem: () => null, setItem: () => {} },
    location: { reload: () => {} }
};
global.document = {
    addEventListener: () => {},
    getElementById: (id) => ({
        addEventListener: () => {},
        classList: { add: () => {}, remove: () => {}, contains: () => false },
        style: {},
        innerHTML: '',
        value: '30'
    }),
    querySelectorAll: () => [],
    querySelector: () => null
};
global.navigator = { serviceWorker: { register: () => Promise.resolve() } };

try {
    require('F:/Antigravity/Cat Day EDM 1/app.js');
    console.log("NODE JS RUN SUCCESSFUL!");
} catch (e) {
    console.error("RUNTIME ERROR IN APP.JS:", e);
}
