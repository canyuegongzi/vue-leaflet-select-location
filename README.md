## 经纬度选择器
[在线地址](http://canyuegongzi.xyz/vue-leaflet-location-select/) 
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
| width |Number  | 组件宽度 | 320  | 否 |
| customSearchFunction |() => void  | 自定义搜索函数(返回数据必须是BaseLocation类型数组) | (searchStr):BaseLocation[] => {return []}  | 否 |

### BaseLocation
```
location: string = ''; // 具体位置经度在前， 维度在后 "120.22132,30.207384"
detailAddress?: string = ""; // 拼接出的详细地址
name?: string = ""; // 聚光中心
```
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
| 事件名 | 参数类型 | 描述 |
| --- | --- | --- |
| input | String[] | value修改 |

### method
| 事件名 | 参数类型 | 描述 |
| --- | --- | --- |
| clearValue | -- | 清楚value |
| destroyMap | -- | 销毁地图 |
### slot
| 名称 | 描述 |
| --- | --- |
| customContent |地图自定义内容 |


### 提示
1. 组件内部集成leaflet.js，不建议使用全局注册，按需加载即可。
2. 地图定位使用EPSG3857坐标。
3. 组价基于elementui。

### 版本更迭
1. 数据流修改为双向绑定；
2. 添加搜索列表功能
