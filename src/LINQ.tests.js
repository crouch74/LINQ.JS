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
      expect(linqObj.toArray).toBeDefined();
    });
    it("To Array - Returns Array", function() {
      expect(linqObj.toArray()).toEqual(array);
    });
  });

  //where suite
  describe("Where function", function() {
    it("Where - Chaining", function() {
      expect(linqObj.where(filterFn).toArray).toBeDefined();
      expect(linqObj.where(filterExpression).toArray).toBeDefined();
    });

    it("Where - Function", function() {
      expect(linqObj.where(filterFn)).toEqual(new LINQ(array.filter(filterFn)));
    });

    it("Where - Lambda", function() {
      expect(linqObj.where(filterExpression)).toEqual(new LINQ(array.filter(filterFn)));
    });
  });

  //select suite
  describe("Select function", function() {
    it("Select - Chaining", function() {
      expect(linqObj.select(selectFn).toArray).toBeDefined();
      expect(linqObj.select(selectExpression).toArray).toBeDefined();
    });

    it("Select - Function", function() {
      expect(linqObj.select(selectFn)).toEqual(new LINQ(array.map(selectFn)));
    });

    it("Select - Lambda", function() {
      expect(linqObj.select(selectExpression)).toEqual(new LINQ(array.map(selectFn)));
    });
  });

  //count suite
  describe("Count function", function() {
    it("Count - isNumber", function() {
      expect(linqObj.count(filterFn)).toBeDefined();
      expect(linqObj.count(filterExpression)).toBeDefined();
      expect(typeof linqObj.count(filterFn)).toEqual(typeof 2);
      expect(typeof linqObj.count(filterExpression)).toEqual(typeof 2);
      expect(linqObj.count()).toBeDefined();
      expect(typeof linqObj.count()).toEqual(typeof 2);
    });

    it("Count - without filter function", function() {
      expect(linqObj.count()).toEqual(array.length);
    });

    it("Count - Function", function() {
      expect(linqObj.count(filterFn)).toEqual(array.filter(filterFn).length);
      expect(linqObj.count(filterFn)).toEqual(array.filter(filterFn).length);
    });

    it("Count - Lambda", function() {
      expect(linqObj.count(filterExpression)).toEqual(array.filter(filterFn).length);
      expect(linqObj.count(filterExpression)).toEqual(array.filter(filterFn).length);
    });
  });

})();
