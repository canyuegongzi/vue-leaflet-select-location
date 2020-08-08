declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}
declare module 'vue-leaflet-location-select' {
    const SelectLocation:any;
    export default SelectLocation;
}
declare module 'leaflet';
declare module 'coordtransform';

declare module coordtransform {
    const gcj02towgs84: any;
    export { gcj02towgs84 }
}
declare module L {}