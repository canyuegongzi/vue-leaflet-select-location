<template lang="pug">
    .select-location()
        el-form(class="select-location-con" :style="containerStyle" v-show="isInput" :model="form" ref="selectLocation")
            el-form-item(class = "select-longitude" :style="inputStyle" prop="E" :rules='rulesE')
                el-input(placeholder="请输入经度" :style="inputStyle" :disabled="disable" v-model="E" @change='inputChange')
            el-form-item(class="select-latitude" :style="inputStyle" prop="N" :rules='rulesN')
                el-input( placeholder="请输入纬度" :style="inputStyle" :disabled="disable" v-model="N" @change='inputChange')
        i(class="zmdi zmdi-zmdi-pin el-icon-location map-icon " @click="openMapDialog" v-if="!disable")
        .selct-dialog
            el-dialog(size="mini" :visible.sync="dialogVisible" :lock-scroll="true" id="mapEditContainer" @close="closeMapSelect" width="600px")
                span(slot="title") 请在地图上单击选择坐标点
                div(:id="mapId" class="map-box")
                    .mapTip
                        .text 经度：{{E1}}
                        .text 纬度：{{N1}}
                div(class="map-search")
                    el-input(v-model="searchQuery" placeholder="请输入关键词搜索"  @blur="getLocationQuery"  @keyup.enter.native="getLocationQuery" size="mini" suffix-icon="el-icon-search")
                span(slot="footer" class="dialog-footer")
                    el-button(@click="cancleFun" size="mini") 取 消
                    el-button(type="primary" @click="okFun" size="mini") 确 定
</template>
<script>
import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import coordtransform from "coordtransform";
export default {
    name: "SelectLocation",
    props: {
        // 地图默认配置
        mapConfig: {
            type: Object,
            default: () => {
                return {
                    mapCenter: [30.257881, 120.195923], // 地图默认中心点
                    url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
                    maxZoom: 18, // 最大缩放
                    minZoom: 5, // 最效缩放
                    zoom: 14, // 默认缩放
                    isSearch: true,
                    searchKey: "" // 搜索服务应用key
                };
            }
        },
        // 外容器样式
        containerStyle: {
            type: Object,
            default: () => {
                return {
                    width: "320px"
                };
            }
        },
        // 输入框样式
        inputStyle: {
            type: Object,
            default: () => {
                return {
                    width: "140px"
                };
            }
        },
        // 经纬度值
        value: {
            type: Array
        },
        // 地图唯一标识
        mapId: {
            type: String,
            default: "map"
        },
        // 考虑和mapId合并
        locationId: {
            type: String,
            default: "1"
        },
        //  默认选中的类型，1-度分秒(120°12′122″)；2-度(120.0.0)
        mapType: {
            type: String,
            default: "2"
        },
        // 输入框是否显示
        isInput: {
            type: Boolean,
            default: function() {
                return true;
            }
        },
        // 组件是否禁用
        disable: {
            type: Boolean,
            default: function() {
                return false;
            }
        },
        // 组件是否清除数据
        isClear: {
            type: Boolean,
            default: function() {
                return false;
            }
        }
    },
    data() {
        return {
            // 租价内部默认配置
            componentConfig: {
                mapCenter: [30.257881, 120.195923], // 地图默认中心点
                url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
                maxZoom: 18, // 最大缩放
                minZoom: 5, // 最效缩放
                zoom: 14, // 默认缩放
                isSearch: true,
                searchKey: "" // 搜索服务应用key
            },
            mapCenter: [], // 地图默认中心
            N: "", // 纬度(显示值)
            E: "", // 经度(显示值)
            N1: "", // 纬度temp  数值
            E1: "", // 经度temp  数值
            N2: "", // 鼠标滑动值
            E2: "", // 鼠标滑动值
            select: this.mapType, // 1-度分秒；2-度
            dialogVisible: false,
            map: null,
            marker: null,
            searchQuery: "",
            rulesE: [
                {
                    validator: (rule, value, callback, source, options) => {
                        if (value == "" || value == null) {
                            callback();
                        }
                        if (
                            !/^\d+(\.\d+)?$/.test(this.E) ||
                            Number(value) > 180 ||
                            Number(value) < 0
                        ) {
                            callback(new Error("请输入合法的经度值"));
                        } else {
                            callback();
                        }
                    },
                    trigger: "blur"
                }
            ],
            rulesN: [
                {
                    validator: (rule, value, callback, source, options) => {
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
                    trigger: "blur"
                }
            ]
        };
    },
    computed: {
        form: function() {
            return {
                E: this.E ? Number(this.E).toFixed(6) : "",
                N: this.N ? Number(this.N).toFixed(6) : ""
            };
        }
    },
    methods: {
        /**
         * 组件配置初始化
         */

        initConfig() {
            this.componentConfig = {
                ...this.componentConfig,
                ...this.mapConfig
            };
        },
        /**
         * 打开弹框
         */
        openMapDialog() {
            if (this.disable) return false;
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
                            L.latLng(54, 135)
                        ),
                        zoom: 14
                    });
                    L.tileLayer
                        .wms(this.componentConfig.url, {
                            LAYERS: "全国县@全国县",
                            TRANSPARENT: true,
                            format: "image/png"
                        })
                        .addTo(this.map);

                    // 初始化时如果有点位值，设置点位
                    if (this.N1 && this.E1) {
                        this.setMarker();
                        this.map.setView([this.N1, this.E1]);
                    }
                    this.map.on("click", e => {
                        this.N1 = e.latlng.lat.toFixed(6);
                        this.E1 = e.latlng.lng.toFixed(6);
                        this.setMarker();
                    });
                    this.map.on("mousemove", e => {
                        // debugger
                        this.N2 = e.latlng.lat.toFixed(6);
                        this.E2 = e.latlng.lng.toFixed(6);
                    });
                    this.map.on("zoomend", e => {
                        // 获取当前放大或者缩小的等级
                        console.log(e.target.getZoom());
                    });
                }
                this.mapOnloadView();
            }, 300);
            if (this.map) {
                this.mapOnloadView();
            }
        },
        /**
         * 输入框修改
         */
        inputChange() {},
        /**
         * 关闭弹框
         */
        closeMapSelect() {},
        /**
         * 地图位置搜索
         */
        getLocationQuery() {},
        /**
         * 弹框关闭
         */
        cancleFun() {},
        /**
         * 值修改
         */
        okFun() {},
        /**
         * 绘制地图标记
         */
        setMarker() {
            if (!this.marker) {
                this.marker = L.marker([this.N1, this.E1], {
                    icon: new L.icon({
                        iconUrl: require("./images/selectLocation.png"),
                        iconAnchor: [16, 32]
                    })
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
        },
        /**
         * 输入框数据转换
         */
        change(val) {
            if (val === "1") {
                // 十进制转度分秒
                this.N = this.floatToStr(this.N);
                this.E = this.floatToStr(this.E);
            } else {
                // 度分秒转十进制
                this.N = this.strToFloat(this.N);
                this.E = this.strToFloat(this.E);
            }
            this.sync();
        },
        /**
         * 十进制转换度分秒
         */
        floatToStr(ft) {
            if (ft !== "" && /^\d+(\.\d+)?$/.test(ft)) {
                let ret = null;

                const du = parseInt(ft);
                const fendoc = ft - du;
                const fens = fendoc * 60;
                const fen = parseInt(fens);
                const miaodoc = fens - fen;
                const miao = Math.floor(miaodoc * 60 * 100) / 100;

                ret = du + "°" + fen + "′" + miao + "″";

                // 返回结果
                return ret;
            } else {
                return "";
            }
        },
        /**
         * 度分秒转十进制（度）
         */
        strToFloat(ret) {
            if (ret !== "") {
                let ft = null;
                let fen = 0;
                let miao = 0;
                const splitFirst = ret.split("°");
                const du = parseFloat(splitFirst[0]);

                if (isNaN(du)) {
                    return "";
                }

                if (splitFirst.length > 1) {
                    const splitSecond = splitFirst[1].split("′");
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

                return ft.toFixed(6);
            } else {
                return "";
            }
        },
        /**
         * 地图加载视图
         */
        mapOnloadView() {
            if (this.N1 && this.E1) {
                this.setMarker();
                this.map.setView([
                    this.N1 || this.componentConfig.mapCenter[0],
                    this.E1 || this.componentConfig.mapCenter[1]
                ]);
            } else {
                this.map.setView(
                    [
                        this.N1 || this.componentConfig.mapCenter[0],
                        this.E1 || this.componentConfig.mapCenter[1]
                    ],
                    14,
                    { animate: true, duration: 0.25 }
                );
            }
        }
    },
    mounted() {},
    created() {
        this.initConfig();
    }
};
</script>
<style lang="stylus" scoped src="./index.styl"></style>
