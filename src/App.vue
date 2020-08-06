<style lang="stylus"></style>
<template lang="pug">
    div
        p 445555
        div(style="width: 320px; height: 28px")
            select-location()
    
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
// import SelectLocation from "vue-leaflet-location-select";
import SelectLocation from "./packages/selectLocation/SelectLocation.vue";
@Component({
    components: {
        // 'select-location': SelectLocation.SelectLocation,
        'select-location': SelectLocation,
    },
})
export default class App extends Vue {
    private created() {
        console.log("组件初始化");
    }
}
</script>
<style lang="stylus" scoped></style>
