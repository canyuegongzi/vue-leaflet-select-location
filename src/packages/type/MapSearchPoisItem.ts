/**
 * address: "阡陌路459号"
 adname: "滨江区"
 biz_ext: {rating: [], cost: []}
 biz_type: []
 childtype: []
 cityname: "杭州市"
 distance: []
 id: "B0FFFFZJPV"
 importance: []
 location: "120.22132,30.207384"
 name: "聚光中心"
 parent: []
 photos: [,…]
 pname: "浙江省"
 poiweight: []
 shopid: []
 shopinfo: "0"
 tel: "0571-85012001"
 type: "商务住宅;楼宇;商务写字楼"
 typecode: "120201"
 */
export class MapSearchPoisItem {
    public address?: string = ''; // 阡陌路459号
    public adname?: string = '';  // 滨江区
    // tslint:disable-next-line:variable-name
    public biz_ext?: any; // {rating: [], cost: []}
    // tslint:disable-next-line:variable-name
    public biz_type?: [] = [];
    public childtype?: [] = [];
    public cityname?: string = ''; // "杭州市"
    public distance?: [] = [];
    public id?: string = "";
    public importance?: [] = [];
    public location: string = ''; //  "120.22132,30.207384"
    public name?: string = ""; // 聚光中心
    public parent?: [] = [];
    public photos?: [] = [];
    public pname?: string = ""; // 浙江省
    public poiweight: [] = [];
    public shopid: [] = [];
    public shopinfo: string = "0"; // 0
    public tel?: string = ''; // "0571-85012001"
    public type?: string = '';  // "商务住宅;楼宇;商务写字楼"
    public typecode?: string = "";
}
