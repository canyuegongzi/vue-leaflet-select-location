/**
 * 点位信息
 */
import {BaseLocation} from '@/packages/types/BaseLocation';

export class MapSearchPoisItem extends BaseLocation {
    public address?: string = '';
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
