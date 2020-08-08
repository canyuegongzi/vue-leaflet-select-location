<template lang="pug">
    div(class="result-list-wrapper" ref="resultWrapper")
        el-scrollbar(class="dynamic-page fpi-scroll" style="height:250px;")
            el-card(class="box-card" v-show="result.length > 0")
                .item(v-for="(item, index) in result " :key="item.index") {{item.name}}
</template>

<script lang="ts">
import { Vue, Prop, Watch, Emit, Component, Ref } from "vue-property-decorator";
import { MapSearchPoisItem } from "../type/MapSearchPoisItem";
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
    private activeIndex: number = 0;
    @Emit('setLocationItem')
    private setLocationItem(item: MapSearchPoisItem) {
        return item;
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
        line-height: 28px;
        padding: 0 8px
        box-sizing: border-box;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        word-break: break-all;
        color #606266
</style>
