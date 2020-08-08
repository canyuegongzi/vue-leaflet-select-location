## 经纬度选择器
### 开始
安装
```
npm install vue-leaflet-location-select
or
yarn add vue-leaflet-location-select
```
使用
```
import SelectLocation from "vue-leaflet-location-select";
import "vue-leaflet-location-select/library/vue-leaflet-location-select.css";
// 组件内部同步加载
components: {'select-location': SelectLocation}
// 组件内部异步加载
components： { 'my-component': () => import('vue-leaflet-location-select')}
}
<template lang="pug">
    div
        p 定位组件
        div(style="width: 480px; height: 28px; margin: 0 auto")
            select-location(v-model="location" :width="480" dialogWidth="600px" :toFixedNum="8")
    
</template>
```
### props

| 参数名 | 类型 | 描述 | 默认值 |  必须   |
| --- | --- | --- | --- |  --- | 
| mapConfig | MapConfig | 地图加载的一些配置 | -- |  是 |
| value（v-model） | Array  | 组件的值  | [] |  是  |
| mapId | String | map标识 | 'map' | 否 |
| dialogWidth | String  | 弹框宽度 | '600px' | 否 |
| toFixedNum |Number  | 经纬度有效位 | 6  | 否 |
| isInput |Boolean  | 是否显示输入框(特定场合只用定位功能) | true  | 否 |
| disable |Boolean  | 组件禁用 | false  | 否 |
### MapConfig
```
mapCenter: Array<number | string>  = [30.257881, 120.195923]; // 地图默认中心点
url?: string = "http://{s}.tile.osm.org/{z}/{x}/{y}.png";
maxZoom?: number = 18; // 最大缩放
minZoom?: number = 5; // 最效缩放
zoom?: number = 14; // 默认缩放
isSearch?: boolean = true;
searchConfigKey?: string = '9cb097cec23e465d5916ef63f23798db'; // 地图搜索应用key
searchConfigUrl?: string = 'http://restapi.amap.com/v3/place/text';
```
### event
暂无
### method
暂无
### slot
暂无
### 版本更迭
### 提示
1. 组件内部集成leaflet.js，不建议使用全局注册，按需加载即可。
