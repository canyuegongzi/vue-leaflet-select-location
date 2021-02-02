<style lang="stylus"></style>
<template lang="pug">
    div
        p 定位组件, 定位位置 {{currentLocation}}
        el-button(@click="destroyMap") 销毁地图
        div(style="width: 480px; height: 28px; margin: 0 auto")
            select-location(v-model="location" :width="480" dialogWidth="600px" :toFixedNum="8" @input="getValue" ref="destroyMap")
    
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
// import SelectLocation from "vue-leaflet-location-select";
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
    private getValue(val: string[]) {
        console.log(val);
    }
    get currentLocation() {
        return this.location.join(',');
    }
    private destroyMap() {
        // @ts-ignore
        this.$refs.destroyMap.destroyMap();
    }
    private created() {
        console.log(SelectLocation);
        console.log("组件初始化");
    }

    /**
     * 自定义搜素
     * @param val
     */
    private customSearchFunction(val) {
        return [
            {
                location: '120.22132,30.207384',
                detailAddress: '拼接出的详细地址',
                name: '聚光中心',
            },
        ];
    }
}
</script>
<style lang="stylus" scoped></style>
