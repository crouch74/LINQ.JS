/// <reference path="JSLINQ.js">

"use strict";
describe("To LINQ",function(){
  it("Is Defined",function(){
    var x = [1,2,3];
    expect(x.toLINQ).toBeDefined();
  });
  it("Returns LINQ",function(){
    var x = [1,2,3];
    expect(x.toLINQ()).toEqual(new LINQ(x));
  });
});
