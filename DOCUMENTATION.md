NOTES
=====

-	This library implements the concept of deferred evaluation just as .NET LINQ does ,, so functions like : select, selectMany , where , etc. will not be evaluated until you use toArray or toDictionary functions .. otherwise functions like : sum , average , max , min , etc. will be executed immediately.

-	This library supports chaining like this

```javascript
var points = [{"x":0,"y":0},{"x":0,"y":1},{"x":1,"y":0},{"x":1,"y":1}];
new LINQ(points)
      .select("p=>p.x")
      .where("p=>p.x>=1")
      .toArray()
```

-	This library supports C#-Lambda expression as literals or function and of course if you support ES6 it can support JS arrow functions as follows

```javascript
new LINQ([1,2,3,4]).where("n=>n>2");
new LINQ([1,2,3,4]).where(function(n){return n>2});
//if you support ES6
new LINQ([1,2,3,4]).where(n=>n>2);
// all of the above is the same
```

-	This library supports one level lambda expressions and without parentheses around the parameters

```javascript
s=>s.age //accepted
s,t=>{"studentName":s.name , "teacherName":t.name} //accepted
(s)=>s.age //not accepted
(s,t)=>{"studentName":s.name , "teacherName":t.name} //not accepted
petOwner=>petOwner.pets.select(pet=>pet.name) //not accepted
```

select
======

This function maps a list of objects to a new list of objects based on a function you provide that accepts an object as a parameter and returns an object

```javascript
var points = [{"x":0,"y":0},{"x":0,"y":1},{"x":1,"y":0},{"x":1,"y":1}];
new LINQ(points).select("p=>p.x").toArray() // [0,0,1,1]
```

where
=====

This function is used to filter an array based on a specific criteria provided as a function that accepts an object as a param and returns a boolean

```javascript
var points = [{"x":0,"y":0},{"x":0,"y":1},{"x":1,"y":0},{"x":1,"y":1}];
new LINQ(points).where("p=>p.x==p.y").toArray() // [{"x":0,"y":0},{"x":1,"y":1}]
```

count
=====

This function evaluates all the queries and returns the count of the result

```javascript
var points = [{"x":0,"y":0},{"x":0,"y":1},{"x":1,"y":0},{"x":1,"y":1}];
new LINQ(points).where("p=>p.x==p.y").count(); // 2
new LINQ(points).count("p=>p.x==p.y"); // 2
```

any
===

This function evaluates all the queries and returns true if there is at least one object in the array that matches the provided criteria

```javascript
var points = [{"x":0,"y":0},{"x":0,"y":1},{"x":1,"y":0},{"x":1,"y":1}];
new LINQ(points).any("p=>p.x==p.y"); // true
new LINQ(points).any("p=>p.x>10"); // false
```

all
===

This function evaluates all the queries and returns true only if all the objects inside an array meets a specific criteria

```javascript
var points = [{"x":0,"y":0},{"x":0,"y":1},{"x":1,"y":0},{"x":1,"y":1}];
new LINQ(points).all("p=>p.x==p.y"); // false
new LINQ(points).all("p=>p.x<10"); // true
```

sum
===

This function evaluates all the queries and returns the sum of all the array or you can pass a selector function as a parameter to it

```javascript
var numbers = [1,2,3,4,5,6,7,8,9,10];
new LINQ(numbers)
      .where("x=>x%2==0")
      .sum(); //30
var classes = [{"class":"1",numberOfStudens:20},{"class":"2",numberOfStudens:15},{"class":"3",numberOfStudens:30},{"class":"4",numberOfStudens:50}]
new LINQ(classes)
  .sum("c=>c.numberOfStudens"); //115
```

average
=======

This function evaluates all the queries and returns the average of all the array or you can pass a selector function as a parameter to it

```javascript
var classes = [{"class":"1",numberOfStudens:20},{"class":"2",numberOfStudens:15},{"class":"3",numberOfStudens:30},{"class":"4",numberOfStudens:50}]
new LINQ(classes)
  .average("c=>c.numberOfStudens"); //28.75
```

skip
====

Bypasses a specified number of elements in a sequence and then returns the remaining elements. [MSDN](https://msdn.microsoft.com/en-us/library/vstudio/bb358985.aspx)

```javascript
new LINQ([1,2,3,4,5,6,7]).skip(3).toArray(); //[4,5,6,7]
```

take
====

Returns a specified number of contiguous elements from the start of a sequence. [MSDN](https://msdn.microsoft.com/en-us/library/vstudio/bb503062.aspx)

```javascript
new LINQ([1,2,3,4,5,6,7]).take(4).toArray(); //[1,2,3,4]
```

max
===

Returns the maximum value in the array .

This function can accept a selector function

```javascript
new LINQ([1,2,3,4,5,6]).max(); //6
```

min
===

Returns the minimum value in the array .

This function can accept a selector function

```javascript
new LINQ([1,2,3,4,5,6]).min(); //1
```

reverse
=======

Inverts the order of the elements in a sequence. [MSDN](https://msdn.microsoft.com/en-us/library/vstudio/bb358497.aspx)

```javascript
new LINQ([1,2,3,4,5]).reverse().toArray(); //[5,4,3,2,1]
```

removeAll
=========

This function removes all elements that matches a specific criteria provided as a function in the first parameter

```javascript

new LINQ([1,2,3,4,5,6,7]).removeAll("x=>x<5").toArray(); //[5,6,7]

```

single / singleOrDefault
========================

```javascript
new LINQ([1]).single(); //1
new LINQ([1,2]).single(); //exception
new LINQ([]).single(); //exception
new LINQ([1]).singleOrDefault(); //1
new LINQ([1,2]).singleOrDefault(); //exception
new LINQ([]).singleOrDefault(); //null

```

first / firstOrDefault
======================

```javascript
new LINQ([1]).first(); //1
new LINQ([1,2]).first(); //1
new LINQ([]).first(); //exception
new LINQ([1]).firstOrDefault(); //1
new LINQ([1,2]).firstOrDefault(); //1
new LINQ([]).firstOrDefault(); //null

```

last / lastOrDefault
====================

```javascript
new LINQ([1]).last(); //1
new LINQ([1,2]).last(); //2
new LINQ([]).last(); //exception
new LINQ([1]).lastOrDefault(); //1
new LINQ([1,2]).lastOrDefault(); //2
new LINQ([]).lastOrDefault(); //null

```

groupBy
=======

Groups the elements of the array by a key.

```javascript
var students = [{"id":1, "name":"Harding", "age":18},{"id":2, "name":"Johnson", "age":17},{"id":3, "name":"Farmer", "age":20},{"id":4, "name":"Owens", "age":17}];

new LINQ(students)
      .groupBy("s=>s.age")
      .toDictionary();
      //{"17":[{"id":2,"name":"Johnson","age":17},{"id":4,"name":"Owens","age":17}],"18":[{"id":1,"name":"Harding","age":18}],"20":[{"id":3,"name":"Farmer","age":20}]}

      new LINQ(students)
            .groupBy("s=>s.age","s.name")
            .toDictionary();
            //{{"17":["Johnson","Owens"],"18":["Harding"],"20":["Farmer"]}
```

orderBy
=======

Order the array ASC according to a specific key

```javascript
var students = [{"id":1, "name":"Harding", "age":18},{"id":2, "name":"Johnson", "age":17},{"id":3, "name":"Farmer", "age":20},{"id":4, "name":"Owens", "age":17}];

new LINQ(students)
      .orderBy("s=>s.age")
      .toArray(); //[{"id":2,"name":"Johnson","age":17},{"id":4,"name":"Owens","age":17},{"id":1,"name":"Harding","age":18},{"id":3,"name":"Farmer","age":20}]
```

orderByDescending
=================

Order the array DESC according to a specific key

```javascript
var students = [{"id":1, "name":"Harding", "age":18},{"id":2, "name":"Johnson", "age":17},{"id":3, "name":"Farmer", "age":20},{"id":4, "name":"Owens", "age":17}];

new LINQ(students)
      .orderByDescending("s=>s.age")
      .toArray(); //[{"id":3,"name":"Farmer","age":20},{"id":1,"name":"Harding","age":18},{"id":4,"name":"Owens","age":17},{"id":2,"name":"Johnson","age":17}]
```

distinct
========

Returns distinct elements from an array.

```javascript
new LINQ([1,1,2,1,4,5,2,3,4,5])
      .distinct()
      .toArray(); //[1,2,4,5,3]
```

intersect
=========

Produces the set intersection of two sequences .

```javascript
new LINQ([1,2,3,4,5,6])
      .intersect([2,4,6,8])
      .toArray(); //[2,4,6]
```

join
====

Correlates the elements of two sequences based on matching keys. [MSDN](https://msdn.microsoft.com/en-us/library/system.linq.enumerable.join.aspx)

First parameter : first array selector

Second parameter : second array selector

Third parameter : result selector

```javascript
var students = [{"id":1, "name":"Harding", "age":18,"class":1},{"id":2, "name":"Johnson", "age":17,"class":2},{"id":3, "name":"Farmer", "age":20,"class":2},{"id":4, "name":"Owens", "age":17,"class":3}];
var classes = [{"number":1,"teacher":"Suzanne"},{"number":2,"teacher":"Adrian"},{"number":3,"teacher":"Brown"},{"number":4,"teacher":"White"}]

new LINQ(students)
      .join(classes,"s=>s.class","c=>c.number","s,c=>{name:s.name,teacher:c.teacher}")
      .toArray(); //[{"name":"Harding","teacher":"Suzanne"},{"name":"Johnson","teacher":"Adrian"},{"name":"Farmer","teacher":"Adrian"},{"name":"Owens","teacher":"Brown"}]


```

toArray
=======

This function will evaluate all the queries you chained to the list and then it will return a javascript normal Array with the result

```javascript

new LINQ([1,2,3,4])
      .where("n=>n>2")
      .toArray(); // [3,4]

```

\** This function should be used only when you chain queries that returns lists ,, or it will throw an exception

toDictionary
============

This function will return a dictionary from the queries you request - If it was used with a function that returns a dictionary like [groupBy](#groupby) it will evaluate the queries and returns a dictionary

```javascript
var points = [{"x":0,"y":0},{"x":0,"y":1},{"x":1,"y":0},{"x":1,"y":1}];

new LINQ(points)
      .groupBy("p=>p.x")
      .toDictionary() //{0:[{"x":0,"y":0},{"x":0,"y":1}],1:[{"x":1,"y":0},{"x":1,"y":1}]}

```

-	You can provide a keySelectorFunction and/or a valueSelectorFunction as params to this functions

```javascript
var points = [{"x":0,"y":0},{"x":0,"y":1},{"x":1,"y":0},{"x":1,"y":1}];

new LINQ(points)
    .groupBy("p=>p.x") // {0:[{"x":0,"y":0},{"x":0,"y":1}],1:[{"x":1,"y":0},{"x":1,"y":1}]}
    .toDictionary("x=>x","p=>p.y"); // {0:[0,1],1:[0,1]}

```

-	If the result of evaluating the queries was an array, you need to provide a keySelectorFunction and a valueSelectorFunction

```javascript
var students = [{"id":1, "name":"Harding", "age":18},{"id":2, "name":"Johnson", "age":17},{"id":3, "name":"Farmer", "age":20},{"id":4, "name":"Owens", "age":13}];

new LINQ(points)
      .where("s=>s.age >= 18")
      .toDictionary("s=>s.id","s=>s.name") //{1:"Harding",3:"Farmer"}

```
