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
    //API
    this.toArray = toArray;
    this.where = where;
    this.select = select;
    this.count = count;
    this.any = any;

    return this;
  }
  //API
  function toArray() {
    return this._list;
  }

  function where(fn) {
    var resArray = this.toArray().filter(parse(fn));
    return new LINQ(resArray);
  }

  function select(fn) {
    var resArray = this.toArray().map(parse(fn));
    return new LINQ(resArray);
  }

  function count(fn) {
    if (!fn) {
      return this.toArray().length;
    }
    return this.toArray().filter(parse(fn)).length;
  }

  function any(fn){
    return this.toArray().some(parse(fn));
  }

  //helpers
  function parse(query) {
    var lambdaRegex = /w*\s*=>\s*w*/
    if(typeof query !== "string" && !query){
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
