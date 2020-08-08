import SelectLocation from "./selectLocation";

const components = [SelectLocation];

const install: any = (Vue: any) => {
    if (install.installed) { return; }
    install.installed = true;
    components.map((component) => {
        Vue.use(component);
    });
};

if (typeof window !== "undefined" && window.Vue) {
    install(window.Vue);
}

export default {
    install,
    ...components,
};
