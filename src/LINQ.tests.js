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
    it("To Array - From Dictionary Array", function() {
      expect((new LINQ(array).groupBy("m=>m.firstName")).toArray()).toEqual(groupedNamesArray);
    });
  });

  //To Dictionary suite
  describe("To Dictionary", function() {
    it("To Dictionary - Is defined", function() {
      expect((new LINQ(array)).toDictionary).toBeDefined();
    });
    it("To Dictionary - Array no mapping", function() {
      expect(function() {
        new LINQ(array).toDictionary()
      }).toThrow();
    });
    it("To Dictionary - Array with mapping", function() {
      expect(new LINQ(array).toDictionary("x=>x.id", "x=>x.firstName")).toEqual(idFirstNameDict);
    });
    it("To Dictionary - firstName as key , count as value", function() {
      expect(new LINQ(array).groupBy("x=>x.firstName").toDictionary("x=>x", "x=>x.length")).toEqual(firstNamesCounts);
    });
  })

  //where suite
  describe("Where function", function() {
    it("Where - defined", function() {
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
    it("Select - defined", function() {
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
    it("Count - defined", function() {
      expect(new LINQ(array).count).toBeDefined();
    });
    it("Count - isNumber", function() {
      expect((new LINQ(array)).count(filterFn)).toBeDefined();
      expect((new LINQ(array)).count(filterExpression)).toBeDefined();
      expect(typeof(new LINQ(array)).count(filterFn)).toEqual(typeof 2);
      expect(typeof(new LINQ(array)).count(filterExpression)).toEqual(typeof 2);
      expect((new LINQ(array)).count()).toBeDefined();
      expect(typeof(new LINQ(array)).count()).toEqual(typeof 2);
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
    it("Any - defined", function() {
      expect(new LINQ(array).any).toBeDefined();
    });
    it("Any - isBoolean", function() {
      expect((new LINQ(array)).any(filterFn)).toBeDefined();
      expect((new LINQ(array)).any(filterExpression)).toBeDefined();
      expect(typeof(new LINQ(array)).any(filterFn)).toEqual(typeof true);
      expect(typeof(new LINQ(array)).any(filterExpression)).toEqual(typeof true);
    });

    it("Any - Function", function() {
      expect((new LINQ(array)).any(filterFn)).toEqual(array.some(filterFn));
    });

    it("Any - Lambda", function() {
      expect((new LINQ(array)).any(filterExpression)).toEqual(array.some(filterFn));
    });

    it("Any - Lambda - Falsy", function() {
      expect((new LINQ(array)).any("x=>x.id>1000")).toBeFalsy()
    });

    it("Any - Function - False", function() {
      expect((new LINQ(array)).any(function(x) {
        return x.id > 1000
      })).toBeFalsy();
    });
  });

  //multiple queries suite
  describe("Multiple queries", function() {
    it("Where(fn)=>Select(fn)", function() {
      expect(new LINQ(array).where(filterFn).select(selectFn).toArray()).toEqual(array.filter(filterFn).map(selectFn));
    });
    it("Where(fn)=>Select(lambda)", function() {
      expect(new LINQ(array).where(filterFn).select(selectExpression).toArray()).toEqual(array.filter(filterFn).map(selectFn));
    });
    it("Where(lambda)=>Select(lambda)", function() {
      expect(new LINQ(array).where(filterExpression).select(selectExpression).toArray()).toEqual(array.filter(filterFn).map(selectFn));
    });
    it("Where(lambda)=>Select(fn)", function() {
      expect(new LINQ(array).where(filterExpression).select(selectFn).toArray()).toEqual(array.filter(filterFn).map(selectFn));
    });
    it("Where(lambda)=>Select(fn)=>Where(lambda)", function() {
      expect(new LINQ(array).where(filterExpression).select(selectFn).where(filterExpression_2).toArray()).toEqual(array.filter(filterFn).map(selectFn).filter(filterFn_2));
    });
    it("Where(lambda)=>Select(fn)=>Where(fn)", function() {
      expect(new LINQ(array).where(filterExpression).select(selectFn).where(filterFn_2).toArray()).toEqual(array.filter(filterFn).map(selectFn).filter(filterFn_2));
    });
  });

  //sum suite
  describe("Sum function", function() {
    it("Sum - defined", function() {
      expect(new LINQ(array).sum).toBeDefined();
    });
    it("Sum", function() {
      expect((new LINQ([1, 2, 3, 4])).sum()).toEqual([1, 2, 3, 4].reduce(function(c, l) {
        return c + l
      }, 0));
    });
    it("Select => Sum", function() {
      expect((new LINQ(array)).select("x=>x.id").sum()).toEqual(array.map(function(x) {
        return x.id
      }).reduce(function(c, l) {
        return c + l
      }, 0));
    });
    it("Sum(lambda)", function() {
      expect((new LINQ(array)).sum("x=>x.id")).toEqual(array.map(function(x) {
        return x.id
      }).reduce(function(c, l) {
        return c + l
      }, 0));
    });
  })

  //average suite
  describe("Average function", function() {
    it("Average - defined", function() {
      expect(new LINQ(array).average).toBeDefined();
    });
    it("Average(lambda)", function() {
      expect((new LINQ(array)).average("x=>x.id")).toEqual(array.map(function(d) {
        return d.id
      }).reduce(function(c, l) {
        return c + l;
      }, 0) / array.length)
    });
    it("Average()", function() {
      expect((new LINQ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).average()).toEqual(5.5);
    });
  });

  //all suite
  describe("All function", function() {
    it("All - defined", function() {
      expect(new LINQ(array).all).toBeDefined();
    });
    it("All - isBoolean", function() {
      expect((new LINQ(array)).all(filterFn)).toBeDefined();
      expect((new LINQ(array)).all(filterExpression)).toBeDefined();
      expect(typeof(new LINQ(array)).all(filterFn)).toEqual(typeof true);
      expect(typeof(new LINQ(array)).all(filterExpression)).toEqual(typeof true);
    });

    it("All - Function", function() {
      expect((new LINQ(array)).all(filterFn)).toEqual(array.every(filterFn));
    });

    it("All - Lambda", function() {
      expect((new LINQ(array)).all(filterExpression)).toEqual(array.every(filterFn));
    });

    it("All - Lambda - Falsy", function() {
      expect((new LINQ(array)).all("x=>x.id>1")).toBeFalsy()
    });

    it("All - Function - False", function() {
      expect((new LINQ(array)).all(function(x) {
        return x.id > 1
      })).toBeFalsy();
    });
  });

  //skip suite
  describe("Skip function", function() {
    it("Skip - defined", function() {
      expect(new LINQ(array).skip).toBeDefined();
    });
    it("Skip - number", function() {
      expect(new LINQ(array).skip(5).toArray()).toEqual(array.slice(5));
    });
    it("Skip - string", function() {
      expect(function() {
        new LINQ(array).skip("as")
      }).toThrow()
    })

  });

  //take suite
  describe("Take function", function() {
    it("Take - defined", function() {
      expect(new LINQ(array).take).toBeDefined();
    });
    it("Take - number", function() {
      expect(new LINQ(array).take(5).toArray()).toEqual(array.slice(0, 5));
    });
    it("Take - string", function() {
      expect(function() {
        new LINQ(array).take("as")
      }).toThrow()
    });

    it("Skip -> Take", function() {
      expect(new LINQ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).skip(5).take(2).toArray()).toEqual([6, 7]);
    });
  });

  //max suite
  describe("Max function", function() {
    it("Max - defined", function() {
      expect(new LINQ(array).max).toBeDefined();
    });
    it("Max - numbers", function() {
      expect(new LINQ([1, 2, 3, 4, 5, 6, 7, 8]).max()).toEqual(8);
    });
    it("Max - strings", function() {
      expect(new LINQ(["a", "b", "c"]).max()).toEqual(NaN);
    });

    it("Max objects good selection function", function() {
      expect(new LINQ(array).max(function(d) {
        return d.id
      })).toEqual(Math.max.apply(null, array.map(o => o.id)));
    });

    it("Max objects bad selection function", function() {
      expect(new LINQ(array).max(function(d) {
        return d.firstName
      })).toEqual(NaN);
    });

    it("Max objects good selection lambda", function() {
      expect(new LINQ(array).max("d=>d.id")).toEqual(Math.max.apply(null, array.map(o => o.id)));
    });

    it("Max objects bad selection lambda", function() {
      expect(new LINQ(array).max("d=>d.firstName")).toEqual(NaN);
    });
  });

  //min suite
  describe("Min function", function() {
    it("Min - defined", function() {
      expect(new LINQ(array).min).toBeDefined();
    });
    it("Min - numbers", function() {
      expect(new LINQ([1, 2, 3, 4, 5, 6, 7, 8]).min()).toEqual(1);
    });
    it("Min - strings", function() {
      expect(new LINQ(["a", "b", "c"]).min()).toEqual(NaN);
    });

    it("Min objects good selection function", function() {
      expect(new LINQ(array).min(function(d) {
        return d.id
      })).toEqual(Math.min.apply(null, array.map(o => o.id)));
    });

    it("Min objects bad selection function", function() {
      expect(new LINQ(array).min(function(d) {
        return d.firstName
      })).toEqual(NaN);
    });

    it("Min objects good selection lambda", function() {
      expect(new LINQ(array).min("d=>d.id")).toEqual(Math.min.apply(null, array.map(o => o.id)));
    });

    it("Min objects bad selection lambda", function() {
      expect(new LINQ(array).min("d=>d.firstName")).toEqual(NaN);
    });
  });

  //reverse suite
  describe("Reverse function", function() {
    it("Reverse - defined", function() {
      expect(new LINQ(array).reverse).toBeDefined();
    });
    it("Reverse - Chaining", function() {
      expect((new LINQ(array)).reverse().toArray).toBeDefined();
    });

    it("Reverse - array of objects", function() {
      expect((new LINQ(array)).reverse().toArray()).toEqual(array.reverse());
    });

    it("Reverse - array of numbers", function() {
      expect((new LINQ([1, 2, 3, 4, 5])).reverse().toArray()).toEqual([5, 4, 3, 2, 1]);
    });
  });

  //removeAll suite
  describe("ٌRemoveAll function", function() {
    it("ٌRemoveAll - defined", function() {
      expect(new LINQ(array).removeAll).toBeDefined();
    });
    it("ٌRemoveAll - Chaining", function() {
      expect((new LINQ(array)).removeAll("x=>x.id > 5").toArray).toBeDefined();
    });

    it("ٌRemoveAll - function", function() {
      expect((new LINQ(array)).removeAll(function(d) {
        return d.id > 5
      }).toArray()).toEqual(array.filter(function(d) {
        return !(d.id > 5)
      }));
      expect((new LINQ([1, 2, 3, 4, 5, 6, 7, 8, 9])).removeAll(function(d) {
        return d > 5;
      }).toArray()).toEqual([1, 2, 3, 4, 5]);
    });

    it("ٌRemoveAll - lambda", function() {
      expect((new LINQ(array)).removeAll("d=>d.id>5").toArray()).toEqual(array.filter(function(d) {
        return !(d.id > 5)
      }));
      expect((new LINQ([1, 2, 3, 4, 5, 6, 7, 8, 9])).removeAll("d=>d>5").toArray()).toEqual([1, 2, 3, 4, 5]);
    });
  });

  //single suite
  describe("Single function", function() {
    it("Single - defined", function() {
      expect(new LINQ(array).single).toBeDefined();
    });
    it("Single - not single element array", function() {
      expect(function() {
        new LINQ(array).single()
      }).toThrow();
    });
    it("Single - empty array", function() {
      expect(function() {
        new LINQ([]).single()
      }).toThrow();
    });
    it("Single - single element array", function() {
      expect(new LINQ([1]).single()).toEqual(1);
    });
    it("Single - select - not single element array", function() {
      expect(function() {
        new LINQ(array).single("x=>x.id>0")
      }).toThrow();
    });
    it("Single - select - empty array", function() {
      expect(function() {
        new LINQ(array).single("x=>x.id>10000")
      }).toThrow();
    });
    it("Single - select - single element array", function() {
      expect(new LINQ(array).single("x=>x.id==1")).toEqual(array[1]);
    });
  });

  //singleOrDefault suite
  describe("SingleOrDefault function", function() {
    it("SingleOrDefault - defined", function() {
      expect(new LINQ(array).singleOrDefault).toBeDefined();
    });
    it("SingleOrDefault - not single element array", function() {
      expect(function() {
        new LINQ(array).singleOrDefault()
      }).toThrow();
    });
    it("SingleOrDefault - empty array", function() {
      expect(new LINQ([]).singleOrDefault()).toBeNull();
    });
    it("SingleOrDefault - single element array", function() {
      expect(new LINQ([1]).singleOrDefault()).toEqual(1);
    });
    it("SingleOrDefault - select - not single element array", function() {
      expect(function() {
        new LINQ(array).singleOrDefault("x=>x.id>0")
      }).toThrow();
    });
    it("SingleOrDefault - select - empty array", function() {
      expect(new LINQ(array).singleOrDefault("x=>x.id>10000")).toBeNull();
    });
    it("SingleOrDefault - select - single element array", function() {
      expect(new LINQ(array).singleOrDefault("x=>x.id==1")).toEqual(array[1]);
    });
  });

  //first suite
  describe("First function", function() {
    it("First - defined", function() {
      expect(new LINQ(array).first).toBeDefined();
    });
    it("First - not single element array", function() {
      expect(new LINQ(array).first()).toEqual(array[0]);
    });
    it("First - empty array", function() {
      expect(function() {
        new LINQ([]).first()
      }).toThrow();
    });
    it("First - single element array", function() {
      expect(new LINQ([1]).first()).toEqual(1);
    });
    it("First - select - not single element array", function() {
      expect(new LINQ(array).first("x=>x.id>0")).toEqual(array.filter(x => x.id > 0)[0]);
    });
    it("First - select - empty array", function() {
      expect(function() {
        new LINQ(array).first("x=>x.id>10000")
      }).toThrow();
    });
    it("First - select - single element array", function() {
      expect(new LINQ(array).first("x=>x.id==1")).toEqual(array[1]);
    });
  });

  //firstOrDefault suite
  describe("FirstOrDefault function", function() {
    it("FirstOrDefault - defined", function() {
      expect(new LINQ(array).firstOrDefault).toBeDefined();
    });
    it("FirstOrDefault - not single element array", function() {
      expect(new LINQ(array).firstOrDefault()).toEqual(array[0]);
    });
    it("FirstOrDefault - empty array", function() {
      expect(new LINQ([]).firstOrDefault()).toBeNull();
    });
    it("FirstOrDefault - single element array", function() {
      expect(new LINQ([1]).firstOrDefault()).toEqual(1);
    });
    it("FirstOrDefault - select - not single element array", function() {
      expect(new LINQ(array).firstOrDefault("x=>x.id>0")).toEqual(array.filter(x => x.id > 0)[0]);
    });
    it("FirstOrDefault - select - empty array", function() {
      expect(new LINQ(array).firstOrDefault("x=>x.id>10000")).toBeNull();
    });
    it("FirstOrDefault - select - single element array", function() {
      expect(new LINQ(array).firstOrDefault("x=>x.id==1")).toEqual(array[1]);
    });
  });

  //last suite
  describe("Last function", function() {
    it("Last - defined", function() {
      expect(new LINQ(array).last).toBeDefined();
    });
    it("Last - not single element array", function() {
      expect(new LINQ(array).last()).toEqual(array[array.length - 1]);
    });
    it("Last - empty array", function() {
      expect(function() {
        new LINQ([]).last()
      }).toThrow();
    });
    it("Last - single element array", function() {
      expect(new LINQ([1]).last()).toEqual(1);
    });
    it("Last - select - not single element array", function() {
      expect(new LINQ([1, 2, 3, 4, 5]).last("x=>x<=3")).toEqual(3);
    });
    it("Last - select - empty array", function() {
      expect(function() {
        new LINQ(array).last("x=>x.id>10000")
      }).toThrow();
    });
    it("Last - select - single element array", function() {
      expect(new LINQ(array).last("x=>x.id==1")).toEqual(array[1]);
    });
  });

  //lastOrDefault suite
  describe("LastOrDefault function", function() {
    it("LastOrDefault - defined", function() {
      expect(new LINQ(array).lastOrDefault).toBeDefined();
    });
    it("LastOrDefault - not single element array", function() {
      expect(new LINQ(array).lastOrDefault()).toEqual(array[array.length - 1]);
    });
    it("LastOrDefault - empty array", function() {
      expect(new LINQ([]).lastOrDefault()).toBeNull();
    });
    it("LastOrDefault - single element array", function() {
      expect(new LINQ([1]).lastOrDefault()).toEqual(1);
    });
    it("LastOrDefault - select - not single element array", function() {
      expect(new LINQ([1, 2, 3, 4, 5]).lastOrDefault("x=>x<=3")).toEqual(3);
    });
    it("LastOrDefault - select - empty array", function() {
      expect(new LINQ(array).lastOrDefault("x=>x.id>10000")).toBeNull();
    });
    it("LastOrDefault - select - single element array", function() {
      expect(new LINQ(array).lastOrDefault("x=>x.id==1")).toEqual(array[1]);
    });
  });

  //groupBy suite
  describe("GroupBy function", function() {
    it("GroupBy - defined", function() {
      expect(new LINQ(array).groupBy).toBeDefined();
    });
    it("GroupBy - chaining", function() {
      expect(new LINQ(array).groupBy("x=>x.firstName").toArray).toBeDefined();
    });
    it("GroupBy - no param", function() {
      expect(new LINQ(array).groupBy).toThrow();
    });
    it("GroupBy - firstname as a key - toDictionary", function() {
      expect(new LINQ(array).groupBy("m=>m.firstName").toDictionary()).toEqual(groupedNames);
    });
    it("GroupBy - group by id as key and firstName as value", function() {
      expect(new LINQ(array).groupBy("m=>m.id", "m=>m.firstName").toDictionary(null, "x=>x[0]")).toEqual(idFirstNameDict);
    });
  });

  //orderBy suite
  describe("OrderBy function", function() {
    it("OrderBy - Is defined", function() {
      expect(new LINQ(array).orderBy).toBeDefined();
    });
    it("OrderBy - firstName", function() {
      expect(new LINQ(array).where("x=>x.id<=10").orderBy("x=>x.firstName").select("x=>x.id").toArray()).toEqual([9, 8, 7, 4, 6, 0, 2, 1, 3, 10, 5]);
    });
  });

  //orderByDescending suite
  describe("OrderByDescending function", function() {
    it("OrderByDescending - Is defined", function() {
      expect(new LINQ(array).orderByDescending).toBeDefined();
    });
    it("OrderByDescending - firstName", function() {
      expect(new LINQ(array).where("x=>x.id<=10").orderByDescending("x=>x.firstName").select("x=>x.id").toArray()).toEqual([5, 10, 3, 1, 2, 0, 6, 4, 7, 8, 9]);
    });
  });

  //distinct suite
  describe("Distinct function", function() {
    it("Distinct - Is defined", function() {
      expect(new LINQ(array).distinct)
        .toBeDefined()
    });
    it("Intersect - Chaining", function() {
      expect((new LINQ(array)).distinct().toArray).toBeDefined();
    });
    it("Distinct - Strings", function() {
      expect(new LINQ(["Harding", "Kristine", "Johnson", "Clay", "Owens", "Farmer", "Turner", "Gina", "Clay", "Battle", "Aguirre", "Owens", "Powell", "Mcconnell", "Alexandra", "Powell"]).distinct().toArray().length)
        .toEqual(["Harding", "Kristine", "Johnson", "Owens", "Farmer", "Turner", "Gina", "Clay", "Battle", "Aguirre", "Powell", "Mcconnell", "Alexandra"].length);
    });
    it("Distinct - Objects", function() {
      expect(new LINQ([{x:1,y:2},{x:0,y:2},{x:1,y:5},{x:4,y:7},{x:1,y:2},{x:4,y:9},{x:0,y:2}]).distinct().toArray())
        .toEqual([{x:1,y:2},{x:0,y:2},{x:1,y:5},{x:4,y:7},{x:4,y:9}]);
    });
    it("Distinct - Nested Objects", function() {
      expect(new LINQ([{x:1,y:2,z:{x:1,y:2}},{x:0,y:2,z:[1,2,3]},{x:1,y:2,z:{x:1,y:2}},{x:0,y:2,z:[1,2,3]},{x:1,y:2,z:{x:1,y:2}},{x:1,y:5},{x:4,y:7},{x:1,y:2},{x:1,y:2},{x:4,y:9},{x:0,y:2},{x:0,y:2}]).distinct().toArray())
        .toEqual([{x:1,y:2,z:{x:1,y:2}},{x:0,y:2,z:[1,2,3]},{x:1,y:5},{x:4,y:7},{x:1,y:2},{x:4,y:9},{x:0,y:2}]);
    });
  });

  //intersect suite
  describe("Intersect function",function(){
    it("Intersect - Is defined",function(){
      expect(new LINQ([1,2,3]).intersect).toBeDefined();
    });
    it("Intersect - Chaining", function() {
      expect((new LINQ(array)).intersect([]).toArray).toBeDefined();
    });
    it("Intersect - array of numbers",function(){
      expect(new LINQ([1,2,3,4,5,6,7,8]).intersect([2,4]).toArray()).toEqual([2,4]);
      expect(new LINQ([1,2,3,4,5,6,7,8]).intersect([2,4,15,25,37]).toArray()).toEqual([2,4]);
    });
    it("Intersect - array of numbers and an empty array",function(){
      expect(new LINQ([1,2,3,4,5]).intersect([]).toArray()).toEqual([]);
    });
    it("Intersect - array of objects",function(){
      expect(new LINQ([{x:"1"},{x:"2"},{x:"3"},{x:"4"}]).intersect([{x:"1"},{x:"3"},{x:"5"},{x:"9"}]).toArray()).toEqual([{x:"1"},{x:"3"}]);
    });
    it("Intersect - array of objects no distinct",function(){
      expect(new LINQ([{x:"1"},{x:"2"},{x:"3"},{x:"3"},{x:"4"}]).intersect([{x:"1"},{x:"3"},{x:"3"},{x:"5"},{x:"9"}]).toArray()).toEqual([{x:"1"},{x:"3"}]);
    });
    it("Intersect - array of objects intersect with not-array",function(){
      expect(function(){new LINQ([{x:"1"},{x:"2"},{x:"3"},{x:"3"},{x:"4"}]).intersect("test").toArray()}).toThrow();
    });
  });
  //join suite
  describe("Join function",function(){
    it("Join - Is defined",function(){
      expect(new LINQ([1,2,3]).join).toBeDefined();
    });
    it("Join - Chaining", function() {
      expect((new LINQ([1,2,3])).join(array,"x=>x","y=>y.id","x,y=>y").toArray).toBeDefined();
    });
    it("Join - array of numbers",function(){
      expect(new LINQ([1,2,3]).join(array,"x=>x","y=>y.id","x,y=>y.firstName").toArray()).toEqual(["Kristine","Johnson","Owens"]);
      expect(new LINQ([1,2,3,95,44]).join(array,"x=>x","y=>y.id","x,y=>y.firstName").toArray()).toEqual(["Kristine","Johnson","Owens"]);
    });
    it("Join - array of numbers and an empty array",function(){
      expect(new LINQ([1,2,3,4,5]).join([],"x=>x","y=>y.id","x,y=>y.firstName").toArray()).toEqual([]);
    });
    it("Join - array of objects",function(){
      expect(new LINQ([{x:"1"},{x:"2"},{x:"3"},{x:"4"}]).join([{x:1,y:1},{x:3,y:3},{x:5,y:5},{x:9}]
        ,"x=>x.x","y=>y.x","x,y=>y.x+y.y").toArray()).toEqual([2,6]);
    });
    it("Join - array of objects no distinct",function(){
      expect(new LINQ([{x:1},{x:2},{x:3},{x:3},{x:4}]).join([{x:1},{x:3},{x:3},{x:5},{x:9}],"x=>x.x","y=>y.x",
        "x,y=>x.x").toArray()).toEqual([1,3,3,3,3]);
    });
    it("Join - array of objects koins with not-array",function(){
      expect(function(){new LINQ([{x:"1"},{x:"2"},{x:"3"},{x:"3"},{x:"4"}]).join("test").toArray()}).toThrow();
    });
  });

  //selectMany suite
  describe("SelectMany function", function() {
    it("SelectMany - defined", function() {
      expect(new LINQ(petsOwners).selectMany).toBeDefined();
    });
    it("SelectMany - Chaining", function() {
      expect((new LINQ(petsOwners)).selectMany("x=>x.pets").toArray).toBeDefined();
      expect((new LINQ(petsOwners)).selectMany(function(x){return x.pets}).toArray).toBeDefined();
    });

    it("SelectMany - children only", function() {
      expect((new LINQ(petsOwners)).selectMany("x=>x.pets").toArray()).toEqual(pets);
    });
    it("SelectMany - chilren and index", function() {
      expect((new LINQ(petsOwners)).selectMany(function(pO,index){
        return pO.pets.map(function(p){return index+"-"+p;});
      }).toArray()).toEqual(petsIndex);
    });
    it("SelectMany - chilren and parents", function() {
      expect((new LINQ(petsOwners)).selectMany("pOwner=>pOwner.pets","pOwner,pName=>pOwner.id+'-'+pName").toArray()).toEqual(petsIndex);
    });
  });


})();
