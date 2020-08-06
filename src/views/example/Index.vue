<template lang="pug">
    div()
        p vue-leaflet-location-select
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import SelectLocation from "vue-leaflet-location-select";
// import SelectLocation from "../../lib/selectLocation";
// import { SelectLocation } from "../../packages";

export default class Index extends Vue {
    private mapCenter: Array<string | number> = [];
    private N: number | string = ''; // 纬度(显示值)
    private E: number | string = ''; // 经度(显示值)
    private N1: number | string = ''; // 纬度temp  数值
    private E1: number | string = ''; // 经度temp  数值
    private N2: number | string = ''; // 鼠标滑动值
    private E2: number | string = ''; // 鼠标滑动值
    private created() {
        console.log("定位组件示例初始化");
    }
}
</script>

<style lang="stylus" scoped></style>
