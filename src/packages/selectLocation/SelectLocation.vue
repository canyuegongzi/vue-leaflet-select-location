<template lang="pug">
    .select-location(ref="selectLocationContainer")
        el-form(class="select-location-con" v-if="isInput" :model="form" ref="selectLocation")
            el-form-item(class = "select-longitude" :style="{width: inputStyleWidth + 'px'}" prop="E" :rules='rulesE')
                el-input(placeholder="请输入经度" style="width: 100%" :disabled="disable" v-model="E" @change='inputChange')
            el-form-item(class="select-latitude" :style="{width: inputStyleWidth + 'px'}" prop="N" :rules='rulesN')
                el-input( placeholder="请输入纬度" style="width: 100%" :disabled="disable" v-model="N" @change='inputChange')
        i(class="zmdi zmdi-zmdi-pin el-icon-location map-icon " @click="openMapDialog" v-if="!disable")
        .selct-dialog
            el-dialog(size="mini" :visible.sync="dialogVisible" custom-class='yf_map-dialog-select' :lock-scroll="true" id="mapEditContainer" @close="closeMapSelect" :width="dialogWidth")
                span(slot="title") 请在地图上单击选择坐标点
                div(:id="mapId" class="map-box")
                    .mapTip
                        .text 经度：{{E1}}
                        .text 纬度：{{N1}}
                div(class="map-search" style="width: 200px" v-if="componentConfig.isSearch")
                    el-input(v-model="searchQuery" clearable placeholder="请输入关键词搜索" @blur="searchBlur" @clear="clearAddressList" @keyup.enter.native="searchLocation" size="mini" suffix-icon="el-icon-search")
                div(class="map-search-list" style="width: 200px")
                    search-list(:result="positionList" @setLocationItem="setLocationItem" :activeIndex="activeIndex" :isNoData="searchIsNoData")
                span(slot="footer" class="dialog-footer")
                    el-button(@click="cancleFun" size="mini") 取 消
                    el-button(type="primary" @click="okFun" size="mini") 确 定
</template>
<script lang="ts">
import "leaflet/dist/leaflet.css";
import { Vue, Prop, Watch, Emit, Component } from "vue-property-decorator";
import { MapConfig } from "../types/MapConfig";
import {debounce, jsonpHttp} from '../utils/utils';
import {MapSearchPoisItem} from '../types/MapSearchPoisItem';
import SearchList from '../searchList/SearchList.vue';
import * as coordtransform from "coordtransform";
import L from "leaflet";
@Component({
    components: {SearchList},
    name: "SelectLocation",
})
export default class SelectLocation extends Vue {
    @Prop({ default: () => { return new MapConfig(); } }) private mapConfig!: MapConfig;
    @Prop({ default: 320 }) private width: number | undefined;
    @Prop({ default: () => { return []; }}) private value!: Array<number | string>;
    @Prop({ default: "map" }) private mapId!: string;
    @Prop({ default: "600px" }) private dialogWidth: string | undefined;
    @Prop({ default: "2" }) private mapType!: number | string;
    @Prop({ default: 6 }) private toFixedNum!: number;
    @Prop({ default: true }) private isInput: boolean | undefined;
    @Prop({ default: false }) private disable: boolean | undefined;
    @Prop({ default: false }) private isClear: boolean | undefined;
    private activeIndex: number = -1;
    get form() {
        return {
            E: this.E ? Number(this.E).toFixed(this.toFixedNum) : "",
            N: this.N ? Number(this.N).toFixed(this.toFixedNum) : "",
        };
    }
    get inputStyleWidth() {
        return this.width ? (this.width / 2 - 30) : 140;
    }
    private componentConfig: MapConfig = {
        mapCenter: [30.257881, 120.195923],
        url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
        maxZoom: 18,
        minZoom: 5,
        zoom: 14,
        isSearch: true,
        searchConfigKey: 'cb097cec23e465d5916ef63f23798db',
        searchConfigUrl: 'http://restapi.amap.com/v3/place/text',
    };
    private positionList: MapSearchPoisItem[] = [];
    private N: number | string | null = ""; // 纬度(显示值)
    private E: number | string | null = ""; // 经度(显示值)
    private N1: number | string | null = ""; // 纬度temp  数值
    private E1: number | string | null = ""; // 经度temp  数值
    private N2: number | string | null = ""; // 鼠标滑动值
    private E2: number | string | null = ""; // 鼠标滑动值
    private select: number | string = this.mapType; // 1-度分秒；2-度
    private dialogVisible: boolean = false;
    private searchIsNoData: boolean = false;
    private map: any = null; // 地图
    private marker: any = null; // masker
    private searchQuery: string = ""; // 地图搜索内容
    private rulesE: any = [
        {
            validator: (
                rule: any,
                value: string,
                callback: any,
                source: any,
                options: any,
            ) => {
                if (value == "" || value == null) {
                    callback();
                }
                if (
                    !/^\d+(\.\d+)?$/.test(value) ||
                    Number(value) > 180 ||
                    Number(value) < 0
                ) {
                    callback(new Error("请输入合法的经度值"));
                } else {
                    callback();
                }
            },
            trigger: "blur",
        },
    ]; // 经度校验规则
    private rulesN: any = [
        {
            validator: (
                rule: any,
                value: string,
                callback: any,
                source: any,
                options: any,
            ) => {
                if (value == "" || value == null) {
                    callback();
                }
                if (
                    !/^\d+(\.\d+)?$/.test(value) ||
                    Number(value) > 90 ||
                    Number(value) < 0
                ) {
                    callback(new Error("请输入合法的维度值"));
                } else {
                    callback();
                }
            },
            trigger: "blur",
        },
    ]; // 经度校验规则
    @Watch('value', { immediate: true })
    public tableDataChange(val: string[] | number[], oldVal: any) {
        this.initValue(val);
    }
    /**
     * 无值得默认填充
     */
    get nullValueStr() {
        const zero: number = 0;
        return zero.toFixed(this.toFixedNum);
    }
    /**
     * 销毁地图
     */
    public destroyMap() {
        if (this.map) {
            this.map.remove();
            this.map = null;
            this.marker = null;
            this.N = this.N1 = this.N2 = '';
            this.E = this.E1 = this.E2 = '';
            this.activeIndex = -1;
            this.sync();
        }
    }
    /**
     * 清除value
     */
    public clearValue() {
        this.N = this.N1 = this.N2 = '';
        this.E = this.E1 = this.E2 = '';
        this.activeIndex = -1;
    }
    /**
     * 组件配置初始化
     */
    protected initConfig(): void {
        this.componentConfig = {
            ...this.componentConfig,
            ...this.mapConfig,
        };
    }
    /**
     * 打开弹框
     */
    protected openMapDialog(): void | boolean {
        if (this.disable) {
            return false;
        }
        this.dialogVisible = true;
        const that = this;
        // 选择类型是度分秒 对值进行一次转化
        this.N1 = this.select === "1" ? this.strToFloat(this.N) : this.N;
        this.E1 = this.select === "1" ? this.strToFloat(this.E) : this.E;
        setTimeout(() => {
            if (!this.map) {
                this.map = L.map(this.mapId, {
                    crs: L.CRS.EPSG3857,
                    center: this.componentConfig.mapCenter,
                    maxZoom: 18,
                    minZoom: 5,
                    maxBounds: L.latLngBounds(
                        L.latLng(4, 73),
                        L.latLng(54, 135),
                    ),
                    zoom: 14,
                });
                L.tileLayer
                    .wms(this.componentConfig.url, {
                        LAYERS: "全国县@全国县",
                        TRANSPARENT: true,
                        format: "image/png",
                    })
                    .addTo(this.map);
                if (this.N1 && this.E1) {
                    this.setMarker();
                    this.map.setView([this.N1, this.E1]);
                }
                this.map.on("click", (e: any) => {
                    this.N1 = e.latlng.lat.toFixed(this.toFixedNum);
                    this.E1 = e.latlng.lng.toFixed(this.toFixedNum);
                    this.setMarker();
                });
                this.map.on("mousemove", (e: any) => {
                    this.N2 = e.latlng.lat.toFixed(this.toFixedNum);
                    this.E2 = e.latlng.lng.toFixed(this.toFixedNum);
                });
                this.map.on("zoomend", (e: any) => {
                    console.log(e.target.getZoom());
                });
            }
            this.mapOnloadView();
        }, 300);
        if (this.map) {
            this.mapOnloadView();
        }
    }
    /**
     * 输入框修改
     */
    protected inputChange(): void {
        const arr: string[] = [
            Number(this.form.N).toFixed(this.toFixedNum),
            Number(this.form.E).toFixed(this.toFixedNum),
        ];
        this.sync(arr);
    }
    /**
     * 关闭弹框
     */
    private closeMapSelect(): void | boolean {
        this.searchQuery = '';
        this.positionList = [];
        this.searchIsNoData = false;
        if (this.marker) {
            try {
                this.map.removeLayer(this.marker);
            } catch (e) {
                return true;
            }
        }
        if (this.map) {
            this.map.setView([
                this.N1 || this.componentConfig.mapCenter[0],
                this.E1 || this.componentConfig.mapCenter[1]],
                14, { animate: true, duration: 0.25 });
        }
    }
    /**
     * 节流触发搜索
     */
    private searchLocation(): void {
        if (this.searchQuery) {
            debounce(this.getLocationQuery, 250)();
        }
    }
    /**
     * 清空搜索数据
     */
    private clearAddressList(): void {
        this.positionList = [];
        this.searchIsNoData = false;
    }
    /**
     * 搜索框焦点
     */
    private searchBlur(): void {
        if (!this.searchQuery) {
            this.positionList = [];
            this.searchIsNoData = false;
        } else {
            this.searchLocation();
        }
    }
    /**
     * 地图位置搜索
     */
    private async getLocationQuery(): Promise<any> {
        let positionList: MapSearchPoisItem[] = [];
        this.activeIndex = -1;
        const res: any = await jsonpHttp(
            this.componentConfig.searchConfigUrl,
            { keywords: this.searchQuery, key: this.componentConfig.searchConfigKey});
        if (res.info == 'OK') {
            positionList = res.pois;
        }
        this.positionList = positionList;
        this.searchIsNoData = this.positionList.length === 0;
    }
    /**
     * 定位当前选中的地址
     */
    private async setLocationItem({ item, index } ): Promise<any> {
        if (item.location) {
             const temp = item.location.split(',');
             this.activeIndex = index;
             const loacation = await coordtransform.gcj02towgs84(temp[0], temp[1]);
             this.N1 = loacation[1].toFixed(this.toFixedNum);
             this.E1 = loacation[0].toFixed(this.toFixedNum);
             this.setMarker();
             this.map.setView(
                 [this.N1 || 30, this.E1 || 120],
                 12,
                 { animate: true, duration: 0.25 },
             );
        }
    }
    /**
     * 弹框关闭
     */
    private cancleFun(): void {
        this.dialogVisible = false;
        this.closeMapSelect();
    }
    /**
     * 定位点确认修改
     */
    private okFun(): void {
        this.dialogVisible = false;
        if (this.select === '1') { // 当前选中为度分秒，则转换回去
            this.N = this.floatToStr(this.N1);
            this.E = this.floatToStr(this.E1);
        } else {
            this.N = this.N1;
            this.E = this.E1;
        }
        this.sync();
    }
    /**
     * 绘制地图标记
     */
    private setMarker(): void | boolean {
        if (!this.marker) {
            this.marker = L.marker([this.N1, this.E1], {
                icon: new L.icon({
                    iconUrl: require("./images/selectLocation.png"),
                    iconAnchor: [16, 32],
                }),
            });
            try {
                this.marker.setLatLng([this.N1, this.E1]);
                this.map.addLayer(this.marker);
            } catch (e) {
                return true;
            }
        } else {
            try {
                this.marker.setLatLng([this.N1, this.E1]);
                this.map.addLayer(this.marker);
            } catch (e) {
                return true;
            }
        }
    }
    /**
     * 十进制转换度分秒
     */
    private floatToStr(ft: any): string {
        if (ft !== "" && /^\d+(\.\d+)?$/.test(ft)) {
            let ret: any = null;
            const du: number = parseInt(ft, 10);
            const fendoc: number = ft - du;
            const fens: number = fendoc * 60;
            const fen: number = parseInt(String(fens), 10);
            const miaodoc: number = fens - fen;
            const miao: number = Math.floor(miaodoc * 60 * 100) / 100;
            ret = du + "°" + fen + "′" + miao + "″";
            return ret;
        } else {
            return "";
        }
    }
    /**
     * 度分秒转十进制（度）
     */
    private strToFloat(ret: any): string {
        if (ret !== "") {
            let ft: any = null;
            let fen: number = 0;
            let miao: number = 0;
            const splitFirst: string[] = ret.split("°");
            const du: number = parseFloat(splitFirst[0]);
            if (isNaN(du)) {
                return "";
            }
            if (splitFirst.length > 1) {
                const splitSecond: string[] = splitFirst[1].split("′");
                fen = parseFloat(splitSecond[0]);
                if (isNaN(fen)) {
                    fen = 0;
                }
                if (splitSecond.length > 1) {
                    miao = parseFloat(splitSecond[1]);
                    isNaN(fen) && (miao = 0);
                }
            }
            ft = du + fen / 60 + miao / 3600;
            return ft.toFixed(this.toFixedNum);
        } else {
            return "";
        }
    }
    /**
     * 地图加载视图
     */
    private mapOnloadView(): void {
        if (this.N1 && this.E1) {
            this.setMarker();
            this.map.setView(
                [
                    this.N1 || this.componentConfig.mapCenter[0],
                    this.E1 || this.componentConfig.mapCenter[1],
                ],
                12,
                { animate: true, duration: 0.25 });
        } else {
            this.map.setView(
                [
                    this.N1 || this.componentConfig.mapCenter[0],
                    this.E1 || this.componentConfig.mapCenter[1],
                ],
                14,
                { animate: true, duration: 0.25 },
            );
        }
    }
    /**
     * 地图value初始化
     * @param val
     */
    private initValue(val: string[] | number[]): void {
        if (val && val.length > 1) {
            const N: string | null = Number(val[0]) ?  Number(val[0]).toFixed(this.toFixedNum) : null;
            const E: string | null = Number(val[1]) ?  Number(val[1]).toFixed(this.toFixedNum) : null;
            this.N = this.N1 = this.N2 = N;
            this.E = this.E1 = this.E2 = E;
            this.closeMapSelect();
            this.setMarker();
        } else {
            this.N = this.N1 = this.N2 = '';
            this.E = this.E1 = this.E2 = '';
            this.closeMapSelect();
        }
    }
    /**
     * 位置数据双向绑定
     */
    @Emit('input')
    private sync(val?: string[]): any[] | undefined {
        if (Array && Array.isArray(val) && val.length === 2) {
            return val;
        }
        if (this.E != this.nullValueStr || this.N != this.nullValueStr) {
            return [this.N, this.E];
        }
    }
    private created() {
        this.initConfig();
    }
}
</script>
<style lang="stylus" scoped src="./index.styl"></style>
<style lang="stylus">
    .yf_map-dialog-select
        .el-dialog__body
            padding-top 0
            padding-bottom 0
</style>
