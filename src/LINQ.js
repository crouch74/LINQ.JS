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
    this._eSkip = eSkip;
    this._eTake = eTake;
    this._eSkipTake = eSkipTake;
    this._eReverse = eReverse;
    this._eRemoveAll = eRemoveAll;

    //API
    this.toArray = toArray;
    this.where = where;
    this.select = select;
    this.count = count;
    this.any = any;
    this.all = all;
    this.sum = sum;
    this.average = average;
    this.skip = skip;
    this.take = take;
    this.max = max;
    this.min = min;
    this.reverse = reverse;
    this.removeAll = removeAll;
    this.single = single;
    this.singleOrDefault = singleOrDefault;

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

  function skip(number) {
    checkIfNumber(number);
    this._enqueueExpression("skip", number);
    return this;
  }

  function take(number) {
    checkIfNumber(number);
    this._enqueueExpression("take", number);
    return this;
  }

  function select(fn) {
    this._enqueueExpression("select", fn);
    return this;
  }


  function reverse(){
    this._enqueueExpression("reverse");
    return this;
  }

  function removeAll(fn){
    this._enqueueExpression("removeAll",fn);
    return this;
  }

  function count(fn) {
    if (fn) {
      this.where(fn);
    }
    return this.toArray().length;
  }

  function max(fn) {
    if (fn) {
      this.select(fn);
    }
    return Math.max.apply(null,this.toArray());
  }

  function min(fn) {
    if (fn) {
      this.select(fn);
    }
    return Math.min.apply(null,this.toArray());
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

  function single(fn){
    if(fn){
      this.where(fn);
    }
    var a = this.toArray();
    if(a.length > 1){
      throw new Error ("Sequene contains " + a.length + " elements")
    }
    if(a.length === 0){
      throw new Error ("Sequene doesn't contain any elements")
    }
    return a[0];
  }

  function singleOrDefault(fn){
    if(fn){
      this.where(fn);
    }
    var a = this.toArray();
    if(a.length > 1){
      throw new Error ("Sequene contains " + a.length + " elements")
    }
    if(a.length === 0){
      return null;
    }
    return a[0];
  }

  //evaluators

  function eWhere(fn) {
    this._setArray(this._getArray().filter(parse(fn)));
  }

  function eSelect(fn) {
    this._setArray(this._getArray().map(parse(fn)));
  }

  function eSkip(number) {
    this._setArray(this._getArray().slice(number));
  }

  function eTake(number) {
    this._setArray(this._getArray().slice(0,number));
  }

  function eSkipTake(numbers){
    this._setArray(this._getArray().slice(numbers[0],numbers[0] + numbers[1]));
  }

  function eReverse(){
    this._setArray(this._getArray().reverse());
  }

  function eRemoveAll(fn) {
    fn = parse(fn);
    this._setArray(this._getArray().filter(function(d){return !fn(d);}));
  }

  //helpers
  function _enqueueExpression(eFn,param){
    var queue = this._queriesQueue;
    if(queue.length >= 1){
      var lastItemIndex = queue.length - 1;
      var lastQuery = queue[lastItemIndex];
      //combine skip-take queries
      if(eFn === "take" && lastQuery[0] === "skip"){
        queue[lastItemIndex] = ["skipTake",[lastQuery[1],param]];
      }
    }

      queue.push([eFn, param]);
  }

  function _evaluateExpressions() {
    while (this._queriesQueue.length > 0) {
      var query = this._queriesQueue.shift();
      var eFn = query[0];
      var fn = query[1];

      eFn = eFn.charAt(0).toUpperCase() + eFn.slice(1)
      eFn = "_e"+ eFn;
      if(this[eFn]){
        this[eFn](fn);
      }else{
        throw new Error("Unhandled query !")
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

  function checkIfNumber(number){
    if(typeof number !== "number"){
      throw new Error("Skip expects a number !")
    }
    return true;
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
