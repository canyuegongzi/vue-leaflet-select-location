"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var vue_property_decorator_1 = require("vue-property-decorator");
var SelectLocation = /** @class */ (function (_super) {
    __extends(SelectLocation, _super);
    function SelectLocation() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'SelectLocation';
        return _this;
    }
    SelectLocation.prototype.created = function () {
        console.log('组件初始化');
    };
    return SelectLocation;
}(vue_property_decorator_1.Vue));
exports["default"] = SelectLocation;
