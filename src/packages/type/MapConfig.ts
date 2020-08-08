export class MapConfig {
    public mapCenter: Array<number | string>  = [30.257881, 120.195923]; // 地图默认中心点
    public url?: string = "http://{s}.tile.osm.org/{z}/{x}/{y}.png";
    public maxZoom?: number = 18; // 最大缩放
    public minZoom?: number = 5; // 最效缩放
    public zoom?: number = 14; // 默认缩放
    public isSearch?: boolean = true;
    public searchConfigKey?: string = '9cb097cec23e465d5916ef63f23798db';
    public searchConfigUrl?: string = 'http://restapi.amap.com/v3/place/text';
}
