import SelectLocation from "./selectLocation";

const components = { SelectLocation };

const install: any = (Vue: any) => {
    if (install.installed) { return; }
    install.installed = true;
    for (const key of Object.keys(components)) {
        // @ts-ignore
        Vue.use(component[key]);
    }
};

if (typeof window !== "undefined" && window.Vue) {
    install(window.Vue);
}

export default SelectLocation;
