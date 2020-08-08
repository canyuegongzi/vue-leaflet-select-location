import SelectLocation from "./SelectLocation.vue";

(SelectLocation as any).install = (Vue) =>
    Vue.component(SelectLocation.name, SelectLocation);

export default SelectLocation;
