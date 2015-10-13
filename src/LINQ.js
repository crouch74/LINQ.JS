(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.LINQ = factory();
  }
})(this, function() {
  function LINQ(array) {
    //CTOR and check for valid data
    if (!array || !(array instanceof Array))
      throw new Error("You need to provide an array");

    this._list = array;
    this._queriesQueue = [];

    this._getArray = _getArray;
    this._setArray = _setArray;

    this._enqueueExpression = _enqueueExpression;
    this._evaluateExpressions = _evaluateExpressions;

    //evaluators
    this._eWhere = eWhere;
    this._eSelect = eSelect;

    //API
    this.toArray = toArray;
    this.where = where;
    this.select = select;
    this.count = count;
    this.any = any;
    this.all = all;
    this.sum = sum;
    this.average = average;

    return this;
  }

  //private
  function _getArray() {
    return this._list;
  }

  function _setArray(array) {
    this._list = array;
  }

  //API
  function toArray() {
    this._evaluateExpressions();
    return this._list;
  }

  function where(fn) {
    this._enqueueExpression("where", fn);
    return this;
  }

  function select(fn) {
    this._enqueueExpression("select", fn);
    return this;
  }

  function count(fn) {
    if (fn) {
      this.where(fn);
    }
    return this.toArray().length;
  }

  function any(fn) {
    return this.toArray().some(parse(fn));
  }

  function all(fn){
    return this.toArray().every(parse(fn));
  }

  function sum(fn){
    if (fn) {
      this.select(fn);
    }
    return this.toArray().reduce(function(c,l){return c+l},0);
  }

  function average(fn){
    if(fn){
      this.select(fn);
    }
    var a = this.toArray();
    return a.reduce(function(c,l){return c+l},0)/a.length;
  }


  //evaluators

  function eWhere(fn) {
    this._setArray(this._getArray().filter(parse(fn)));
  }

  function eSelect(fn) {
    this._setArray(this._getArray().map(parse(fn)));
  }


  //helpers
  function _enqueueExpression(eFn,fn){
    this._queriesQueue.push([eFn, fn]);
  }

  function _evaluateExpressions() {
    while (this._queriesQueue.length > 0) {
      var query = this._queriesQueue.shift();
      var eFn = query[0];
      var fn = query[1];

      switch (eFn) {
        case "select":
          this._eSelect(fn);
          break;
        case "where":
          this._eWhere(fn);
          break;
      }

    }
  }

  function parse(query) {
    var lambdaRegex = /w*\s*=>\s*w*/
    if (typeof query !== "string" && !query) {
      throw new Error("Not a valid fuction or lambda expression");
    }
    if (isFunction(query)) {
      return query;
    }
    if (typeof query === "string" && lambdaRegex.test(query)) {
      return lambdaToFunction(query)
    }
    throw new Error("Not a valid fuction or lambda expression");
  }

  function lambdaToFunction(expression) {
    var tokens = expression.split("=>");
    if(tokens.length > 2){
      throw new Error("LINQ.js doesn't support nested lambda yet!")
    }
    return (function() {
      var fn = "temp = function(" + tokens[0].trim() + "){return " + tokens[1].trim() + "}";
      return eval(fn)
    })();
  }

  function isFunction(obj) {
    //isFunction from underscore.js
    return !!(obj && obj.constructor && obj.call && obj.apply);
  }

  function ctor(array) {
    return new LINQ(array);
  }

  // add toLinq in Array.prototype
  Array.prototype.toLINQ = function() {
      return new LINQ(this);
    }
    //Exports functions
  return ctor;
});
