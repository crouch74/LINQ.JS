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
    this._eGroupBy = eGroupBy;
    this._eOrderBy = eOrderBy;
    this._eDistinct = eDistinct;
    this._eIntersect = eIntersect

    //API
    this.toArray = toArray;
    this.toDictionary = toDictionary;
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
    this.first = first;
    this.firstOrDefault = firstOrDefault;
    this.last = last;
    this.lastOrDefault = lastOrDefault;
    this.groupBy = groupBy;
    this.orderBy = orderBy;
    this.orderByDescending = orderByDescending;
    this.distinct = distinct;
    this.intersect = intersect;

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
    if(!Array.isArray(this._list)){
      this._list = dictionaryToArray(this._list);
    }
    return this._list;
  }

  function toDictionary(keyFn,valueFn){
    this._evaluateExpressions();
    if(Array.isArray(this._list)){
      if(!keyFn && !valueFn){
        throw new Exception("An array can't be converted to a dictionary without mapping functions");
      }else{
        keyFn = parse(keyFn);
        valueFn = parse(valueFn);
        this._list = arrayToDictionary(this._list,keyFn,valueFn);
      }
    }else if (keyFn || valueFn) {
      keyFn = parse(keyFn || "x=>x");
      valueFn = parse(valueFn || "x=>x");
      this._list = mapDictionary(this._list,keyFn,valueFn)
    }
    return this._list;
  }

  function where(fn) {
    this._enqueueExpression("where", fn);
    return this;
  }
  function groupBy(keyFn,valueFn) {
    this._enqueueExpression("groupBy", [keyFn,valueFn || "x=>x"]);
    return this;
  }

  function skip(number) {
    checkIfNumber(number,"Skip");
    this._enqueueExpression("skip", number);
    return this;
  }

  function take(number) {
    checkIfNumber(number,"Take");
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

  function orderBy(fn){
    this._enqueueExpression("orderBy",fn);
    return this;
  }

  function orderByDescending(fn){
    this.orderBy(fn).reverse();
    return this;
  }

  function distinct(){
    this._enqueueExpression("distinct");
    return this;
  }

  function intersect(array){
    this.distinct();
    this._enqueueExpression("intersect",array)
    return this;
  }

  function count(fn) {
    checkIflist(this._getArray(),"Count");
    if (fn) {
      this.where(fn);
    }
    return this.toArray().length;
  }

  function max(fn) {
    checkIflist(this._getArray(),"Max");
    if (fn) {
      this.select(fn);
    }
    return Math.max.apply(null,this.toArray());
  }

  function min(fn) {
    checkIflist(this._getArray(),"Min");
    if (fn) {
      this.select(fn);
    }
    return Math.min.apply(null,this.toArray());
  }

  function any(fn) {
    checkIflist(this._getArray(),"Any");
    return this.toArray().some(parse(fn));
  }

  function all(fn){
    checkIflist(this._getArray(),"All");
    return this.toArray().every(parse(fn));
  }

  function sum(fn){
    checkIflist(this._getArray(),"Sum");
    if (fn) {
      this.select(fn);
    }
    return this.toArray().reduce(function(c,l){return c+l},0);
  }

  function average(fn){
    checkIflist(this._getArray(),"Average");
    if(fn){
      this.select(fn);
    }
    var a = this.toArray();
    return a.reduce(function(c,l){return c+l},0)/a.length;
  }

  function single(fn){
    checkIflist(this._getArray(),"Single");
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
    checkIflist(this._getArray(),"SingleOrDefault");
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

  function first(fn){
    checkIflist(this._getArray(),"First");
    if(fn){
      this.where(fn);
    }
    var a = this.toArray();
    if(a.length === 0){
      throw new Error("Sequence doesn't contain any elements")
    }
    return a[0];
  }

  function firstOrDefault(fn){
    checkIflist(this._getArray(),"FirstOrDefault");
    if(fn){
      this.where(fn);
    }
    var a = this.toArray();
    if(a.length === 0){
      return null;
    }
    return a[0];
  }

  function last(fn){
    checkIflist(this._getArray(),"Last");
    if(fn){
      this.where(fn);
    }
    var a = this.toArray();
    if(a.length === 0){
      throw new Error("Sequence doesn't contain any elements")
    }
    return a[a.length - 1];
  }

  function lastOrDefault(fn){
    checkIflist(this._getArray(),"LastOrDefault");
    if(fn){
      this.where(fn);
    }
    var a = this.toArray();
    if(a.length === 0){
      return null;
    }
    return a[a.length - 1];
  }

  //evaluators

  function eWhere(fn) {
    checkIflist(this._getArray(),"Where");
    this._setArray(this._getArray().filter(parse(fn)));
  }

  function eSelect(fn) {
    checkIflist(this._getArray(),"Select");
    this._setArray(this._getArray().map(parse(fn)));
  }

  function eSkip(number) {
    checkIflist(this._getArray(),"Skip");
    this._setArray(this._getArray().slice(number));
  }

  function eTake(number) {
    checkIflist(this._getArray(),"Take");
    this._setArray(this._getArray().slice(0,number));
  }

  function eSkipTake(numbers){
    checkIflist(this._getArray(),"SkipTake");
    this._setArray(this._getArray().slice(numbers[0],numbers[0] + numbers[1]));
  }

  function eReverse(){
    checkIflist(this._getArray(),"Reverse");
    this._setArray(this._getArray().reverse());
  }

  function eRemoveAll(fn) {
    checkIflist(this._getArray(),"RemoveAll");
    fn = parse(fn);
    this._setArray(this._getArray().filter(function(d){return !fn(d);}));
  }

  function eGroupBy(mappingFunctions) {
    checkIflist(this._getArray(),"GroupBy");
    keyFn = parse(mappingFunctions[0]);
    valueFn = parse(mappingFunctions[1]);
    this._setArray(this._getArray().reduce(function(c,l){
      var key = keyFn(l);
      var value = valueFn(l);
      if(c[key]){
        c[key].push(value);
      }else{
        c[key] = [value];
      }
      return c;
    },{}));
  }
  function eOrderBy(fn) {
    checkIflist(this._getArray(),"OrderBy");
    fn = parse(fn);
    this._setArray(this._getArray().sort(sortingFn(fn)));
  }

  function eIntersect(array) {
    checkIflist(this._getArray(),"Intersect");
    checkIflist(array,"Intersect");
    if(array.length == 0 ) {
      this._setArray([]);
      return;
    }
    this._setArray(this._getArray().reduce(function(c,l){
      if(indexOf(array,l) > -1){
        c.push(l);
      }
      return c;
    },[]));
  }

  function eDistinct(){
    checkIflist(this._getArray(),"Distinct");
    var arr = this._getArray();
    this._setArray(arr.reduce(function(c,l,i){
      if(indexOf(arr,l) === i){
        c.push(l);
      };
      return c;
    },[]));
  }

  //helpers
  function indexOf(arr,obj){
    for(i in arr){
      if(typeof obj === "object"?isEqual(arr[i],obj) : arr[i] == obj){
        return parseInt(i);
      }
    }
    return -1;
  }
  function isEqual(a,b){
    //implement in case of arrays
    ////optimize by length first
    if(a === b) return true;
    if(a == b) return true;
    if(typeof a !== typeof b) return false;
    if (typeof a !== "object")
      return a == b;
    if(Array.isArray(a)){
      if(Array.isArray(b)){
        if(a.length !== b.length)return false;
        return (a.every(function(e){
          return indexOf(b,e) > -1;
        }) && b.every(function(e){
          return indexOf(a,e) > -1;
        }));
      }
      return false;
    }
    aProps = Object.keys(a);
    bProps = Object.keys(b);
    if(aProps.length !== bProps.length) return false;
    return (aProps.every(function(k){
      return (typeof a[k] === 'object') ? isEqual(a[k], b[k]) : isEqual(a[k],b[k]);
    }) && bProps.every(function(k){
      return (typeof b[k] === 'object') ? isEqual(b[k], a[k]) : isEqual(b[k],a[k]);
    }));
  }

  function sortingFn(fn){
    return function(a,b){
      a = fn(a);
      b = fn(b);
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    };
  }

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

  function checkIfNumber(number,fName){
    if(typeof number !== "number"){
      throw new Error(fName + " expects a number !")
    }
    return true;
  }
  function checkIflist(array,fName){
    if(!Array.isArray(array)){
      throw new Error(fName + " expects an array !")
    }
    return true;
  }

  function dictionaryToArray(dic){
    keys = Object.keys(dic);
    return keys.map(function(key){
      return [key,dic[key]];
    });
  }

  function mapDictionary(dict,keyFn,valueFn){
    return Object.keys(dict).reduce(function(c,l){
      c[keyFn(l)] = valueFn(dict[l]);
      return c;
    },{})
  }

  function arrayToDictionary(array,keyFn,valueFn){
    return array.reduce(function(c,l){
      c[keyFn(l)] = valueFn(l);
      return c;
    },{});
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
