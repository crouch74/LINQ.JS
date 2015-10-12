(function() {
  "use strict";

  //mocks
  var array = [13,2,5,6,2,7,9,5,0,1,10,59];
  var linqObj = new LINQ(array);
  var filterFn = function(n){
    return n > 5;
  }
  var filterExpression = "n=>n>5";

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
  describe("Where functions", function() {
    it("Where - Chaining",function(){
      expect(linqObj.where(filterFn).toArray).toBeDefined();
    });

    it("Where - Function",function(){
      expect(linqObj.where(filterFn)).toEqual(new LINQ(array.filter(filterFn)));
    });

    it("Where - Lambda",function(){
      expect(linqObj.where(filterExpression)).toEqual(new LINQ(array.filter(filterFn)));
    });
  });


})();
