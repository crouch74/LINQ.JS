(function() {
  "use strict";

  //suits
  //TO LINQ Suite
  describe("To LINQ", function() {
    it("To LINQ - Is defined", function() {
      expect(array.toLINQ).toBeDefined();
    });
    it("To LINQ - Returns LINQ", function() {
      expect(array.toLINQ()).toEqual(new LINQ(array));
    });
  });

  //To Array suite
  describe("To Array", function() {
    it("To Array - Is defined", function() {
      expect((new LINQ(array)).toArray).toBeDefined();
    });
    it("To Array - Returns Array", function() {
      expect((new LINQ(array)).toArray()).toEqual(array);
    });
  });

  //where suite
  describe("Where function", function() {
    it("Where - defined",function(){
      expect(new LINQ(array).where).toBeDefined();
    });
    it("Where - Chaining", function() {
      expect((new LINQ(array)).where(filterFn).toArray).toBeDefined();
      expect((new LINQ(array)).where(filterExpression).toArray).toBeDefined();
    });

    it("Where - Function", function() {
      expect((new LINQ(array)).where(filterFn).toArray()).toEqual(array.filter(filterFn));
    });

    it("Where - Lambda", function() {
      expect((new LINQ(array)).where(filterExpression).toArray()).toEqual(array.filter(filterFn));
    });
  });

  //select suite
  describe("Select function", function() {
    it("Select - defined",function(){
      expect(new LINQ(array).select).toBeDefined();
    });
    it("Select - Chaining", function() {
      expect((new LINQ(array)).select(selectFn).toArray).toBeDefined();
      expect((new LINQ(array)).select(selectExpression).toArray).toBeDefined();
    });

    it("Select - Function", function() {
      expect((new LINQ(array)).select(selectFn).toArray()).toEqual(array.map(selectFn));
    });

    it("Select - Lambda", function() {
      expect((new LINQ(array)).select(selectExpression).toArray()).toEqual(array.map(selectFn));
    });
  });

  //count suite
  describe("Count function", function() {
    it("Count - defined",function(){
      expect(new LINQ(array).count).toBeDefined();
    });
    it("Count - isNumber", function() {
      expect((new LINQ(array)).count(filterFn)).toBeDefined();
      expect((new LINQ(array)).count(filterExpression)).toBeDefined();
      expect(typeof (new LINQ(array)).count(filterFn)).toEqual(typeof 2);
      expect(typeof (new LINQ(array)).count(filterExpression)).toEqual(typeof 2);
      expect((new LINQ(array)).count()).toBeDefined();
      expect(typeof (new LINQ(array)).count()).toEqual(typeof 2);
    });

    it("Count - without filter function", function() {
      expect((new LINQ(array)).count()).toEqual(array.length);
    });

    it("Count - Function", function() {
      expect((new LINQ(array)).count(filterFn)).toEqual(array.filter(filterFn).length);
    });

    it("Count - Lambda", function() {
      expect((new LINQ(array)).count(filterExpression)).toEqual(array.filter(filterFn).length);
    });
  });

  //any suite
  describe("Any function", function() {
    it("Any - defined",function(){
      expect(new LINQ(array).any).toBeDefined();
    });
    it("Any - isBoolean", function() {
      expect((new LINQ(array)).any(filterFn)).toBeDefined();
      expect((new LINQ(array)).any(filterExpression)).toBeDefined();
      expect(typeof (new LINQ(array)).any(filterFn)).toEqual(typeof true);
      expect(typeof (new LINQ(array)).any(filterExpression)).toEqual(typeof true);
    });

    it("Any - Function", function() {
      expect((new LINQ(array)).any(filterFn)).toEqual(array.some(filterFn));
    });

    it("Any - Lambda", function() {
      expect((new LINQ(array)).any(filterExpression)).toEqual(array.some(filterFn));
    });
  });

  //multiple queries suite
  describe("Multiple queries",function(){
    it("Where(fn)=>Select(fn)",function(){
      expect(new LINQ(array).where(filterFn).select(selectFn).toArray()).toEqual(array.filter(filterFn).map(selectFn));
    });
    it("Where(fn)=>Select(lambda)",function(){
      expect(new LINQ(array).where(filterFn).select(selectExpression).toArray()).toEqual(array.filter(filterFn).map(selectFn));
    });
    it("Where(lambda)=>Select(lambda)",function(){
      expect(new LINQ(array).where(filterExpression).select(selectExpression).toArray()).toEqual(array.filter(filterFn).map(selectFn));
    });
    it("Where(lambda)=>Select(fn)",function(){
      expect(new LINQ(array).where(filterExpression).select(selectFn).toArray()).toEqual(array.filter(filterFn).map(selectFn));
    });
    it("Where(lambda)=>Select(fn)=>Where(lambda)",function(){
      expect(new LINQ(array).where(filterExpression).select(selectFn).where(filterExpression_2).toArray()).toEqual(array.filter(filterFn).map(selectFn).filter(filterFn_2));
    });
    it("Where(lambda)=>Select(fn)=>Where(fn)",function(){
      expect(new LINQ(array).where(filterExpression).select(selectFn).where(filterFn_2).toArray()).toEqual(array.filter(filterFn).map(selectFn).filter(filterFn_2));
    });
  });

  //sum suite
  describe("Sum function",function(){
    it("Sum - defined",function(){
      expect(new LINQ(array).sum).toBeDefined();
    });
    it("Sum",function(){
      expect((new LINQ([1,2,3,4])).sum()).toEqual([1,2,3,4].reduce(function(c,l){return c + l},0));
    });
    it("Select => Sum",function(){
      expect((new LINQ(array)).select("x=>x.id").sum()).toEqual(array.map(function(x){return x.id}).reduce(function(c,l){return c + l},0));
    });
    it("Sum(lambda)",function(){
      expect((new LINQ(array)).sum("x=>x.id")).toEqual(array.map(function(x){return x.id}).reduce(function(c,l){return c + l},0));
    });
  })

  //average suite
  describe("Average function",function(){
    it("Average - defined",function(){
      expect(new LINQ(array).average).toBeDefined();
    });
    it("Average(lambda)",function(){
      expect((new LINQ(array)).average("x=>x.id")).toEqual(array.map(function(d){return d.id}).reduce(function(c,l){return c+l;},0)/array.length)
    });
    it("Average()",function(){
      expect((new LINQ([1,2,3,4,5,6,7,8,9,10])).average()).toEqual(5.5);
    });
  });
})();
