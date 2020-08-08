<style lang="stylus"></style>
<template lang="pug">
    div
        p 定位组件
        div(style="width: 480px; height: 28px; margin: 0 auto")
            select-location(v-model="location" :width="480" dialogWidth="600px" :toFixedNum="8")
    
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
//import SelectLocation from "vue-leaflet-location-select";
// import "vue-leaflet-location-select/library/vue-leaflet-location-select.css";
import SelectLocation from "./packages/selectLocation/SelectLocation.vue";
@Component({
    components: {
        'select-location': SelectLocation,
        // 'select-location': SelectLocation.SelectLocation,
    },
})
export default class App extends Vue {
    public location: number[] = [30.257881, 120.195923];
    private created() {
        console.log(SelectLocation);
        console.log("组件初始化");
    }
}
</script>
<style lang="stylus" scoped></style>
