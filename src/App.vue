<style lang="stylus"></style>
<template lang="pug">
    div
        p 445555
        div(style="width: 320px; height: 28px; margin: 0 auto")
            select-location(v-model="location")
    
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SelectLocation from "vue-leaflet-location-select";
import "vue-leaflet-location-select/library/vue-leaflet-location-select.css";
// import SelectLocation from "./packages/selectLocation/SelectLocation.vue";
@Component({
    components: {
        'select-location': SelectLocation[0],
        // 'select-location': SelectLocation,
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
