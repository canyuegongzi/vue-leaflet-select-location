<template lang="pug">
    div(class="result-list-wrapper" ref="resultWrapper")
        el-card(class="box-card" v-show="result.length > 0 &&! isNoData")
            el-scrollbar(class="yf_scroll-list" style="height:250px;")
                .item(v-for="(item, index) in addressList " :key="item.index" @click="setLocationItem(item, index)")
                    span(class="el-icon-location-information yf_icon" :style="{color: index === activeIndex ? '#3385ff' : '#ff0000'}")
                    span.yf_label()
                        p(:title="item.name") {{item.name}}
                        p.detail(:title="item.detailAddress") {{item.detailAddress}}
        p.no-search-data(v-show="isNoData && result.length === 0") 暂无记录    
</template>

<script lang="ts">
import { Vue, Prop, Watch, Emit, Component, Ref } from "vue-property-decorator";
import { MapSearchPoisItem } from "../types/MapSearchPoisItem";
@Component({
    components: {},
    name: "SearchList",
})
export default class SearchList extends Vue {
    @Prop({ default: () => { return []; }}) private result!: MapSearchPoisItem[];
    @Prop({ default: 32 }) private left!: number;
    @Prop({ default: 76 }) private top!: number;
    @Prop({ default: 0 }) private width!: number;
    @Prop({ default: 0 }) private height!: number;
    @Prop({ default: false }) private isNoData!: boolean;
    @Prop({ default: -1 }) private activeIndex!: number;
    @Emit('setLocationItem')
    private setLocationItem(item: MapSearchPoisItem, index: number): {item: MapSearchPoisItem, index: number} {
        return {item, index};
    }
    get addressList(): MapSearchPoisItem[] {
        return this.result;
    }
}
</script>

<style scoped lang="stylus" src="./index.styl"></style>
