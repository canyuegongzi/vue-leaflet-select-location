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
        return this.result.map((item: MapSearchPoisItem) => {
            return {
                detailAddress: this.renderDetailAddress(item),
                ...item,
            };
        });
    }

    /**
     * 渲染详细地址
     * @param row
     */
    private renderDetailAddress(row: MapSearchPoisItem): string {
        let str: string = '';
        str += row.pname ? row.pname : '';
        str += row.cityname ? row.cityname : '';
        str += row.adname ? row.adname : '';
        str += row.address ? row.address : '';
        return str;
    }
}
</script>

<style scoped lang="stylus">
 .box-card
     >>>.el-card__body
            padding 8px 0 !important
    .item
        border-bottom: 1px solid #EBEEF5
        cursor pointer
        padding 0 8px
        box-sizing border-box
        overflow hidden
        text-overflow ellipsis
        white-space normal
        word-break break-all
        color #606266
        display flex
        font-size: 12px
        justify-content space-around
        &:hover
             background #F5F7FA
        .yf_label
            display inline-block
            width 150px
            line-height 28px
            color #3385ff
            p
                margin 0
                line-height 14px
                overflow hidden
                text-overflow ellipsis
                white-space nowrap
                padding 2px 0 2px 0
            .detail
                 font-size 10px
                 color #606266
        .yf_icon
            display flex
            align-items center
            width 20px
            font-size 18px
            color #ff0000
    .yf_scroll-list
        >>>.el-scrollbar__wrap
                overflow-x hidden
    .no-search-data
         border-bottom 1px solid #ebeef5
         cursor pointer
         padding 0 8px
         box-sizing border-box
         overflow hidden
         text-overflow ellipsis
         white-space: normal
         word-break break-all
         color #606266
         display flex
         font-size 12px
         justify-content space-around
         background #ffff
         margin 0
         line-height: 48px
         border-radius 4px
</style>
