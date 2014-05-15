﻿var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var _ = require('lodash');
var Protocol = require('./base');

/** Protocol for a suspendable function which accepts a node-style callback. */
var CPSProtocol = (function (_super) {
    __extends(CPSProtocol, _super);
    function CPSProtocol() {
        _super.call(this);
    }
    CPSProtocol.prototype.invoke = function (func, this_, args) {
        var _this = this;
        //TODO: allow callback to be omitted if arity is known (need option for this?)
        this.callback = args.pop();
        if (!_.isFunction(this.callback))
            throw new Error('Expected final argument to be a callback');
        _super.prototype.invoke.call(this, func, this_, args);
        setImmediate(function () {
            return _super.prototype.resume.call(_this);
        });
    };

    CPSProtocol.prototype.return = function (result) {
        this.callback(null, result);
    };

    CPSProtocol.prototype.throw = function (error) {
        this.callback(error);
    };

    CPSProtocol.arityFor = function (func) {
        return func.length + 1;
    };
    return CPSProtocol;
})(Protocol);
module.exports = CPSProtocol;
//# sourceMappingURL=cps.js.map
