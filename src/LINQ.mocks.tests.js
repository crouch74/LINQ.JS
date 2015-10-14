var array = [{
  "id": 0,
  "firstName": "Harding",
  "lastName": "Mills"
}, {
  "id": 1,
  "firstName": "Kristine",
  "lastName": "Vazquez"
}, {
  "id": 2,
  "firstName": "Johnson",
  "lastName": "Rowe"
}, {
  "id": 3,
  "firstName": "Owens",
  "lastName": "Calderon"
}, {
  "id": 4,
  "firstName": "Farmer",
  "lastName": "Haynes"
}, {
  "id": 5,
  "firstName": "Turner",
  "lastName": "Clemons"
}, {
  "id": 6,
  "firstName": "Gina",
  "lastName": "Talley"
}, {
  "id": 7,
  "firstName": "Clay",
  "lastName": "Duran"
}, {
  "id": 8,
  "firstName": "Battle",
  "lastName": "Vincent"
}, {
  "id": 9,
  "firstName": "Aguirre",
  "lastName": "Guerra"
}, {
  "id": 10,
  "firstName": "Powell",
  "lastName": "Hunt"
}, {
  "id": 11,
  "firstName": "Mcconnell",
  "lastName": "Ochoa"
}, {
  "id": 12,
  "firstName": "Alexandra",
  "lastName": "Villarreal"
}, {
  "id": 13,
  "firstName": "Brandi",
  "lastName": "Harmon"
}, {
  "id": 14,
  "firstName": "Karyn",
  "lastName": "Small"
}, {
  "id": 15,
  "firstName": "Suzanne",
  "lastName": "Chandler"
}, {
  "id": 16,
  "firstName": "Suzanne",
  "lastName": "Small"
},{
  "id": 17,
  "firstName": "Karyn",
  "lastName": "Harmon"
}, {
  "id": 18,
  "firstName": "Alexandra",
  "lastName": "Chandler"
}, {
  "id": 19,
  "firstName": "Battle",
  "lastName": "Duran"
}];

var groupedNames = {"Harding":[{"id":0,"firstName":"Harding","lastName":"Mills"}],"Kristine":[{"id":1,"firstName":"Kristine","lastName":"Vazquez"}],"Johnson":[{"id":2,"firstName":"Johnson","lastName":"Rowe"}],
"Owens":[{"id":3,"firstName":"Owens","lastName":"Calderon"}],"Farmer":[{"id":4,"firstName":"Farmer","lastName":"Haynes"}],"Turner":[{"id":5,"firstName":"Turner","lastName":"Clemons"}],
"Gina":[{"id":6,"firstName":"Gina","lastName":"Talley"}],"Clay":[{"id":7,"firstName":"Clay","lastName":"Duran"}],"Battle":[{"id":8,"firstName":"Battle","lastName":"Vincent"},
{"id":19,"firstName":"Battle","lastName":"Duran"}],"Aguirre":[{"id":9,"firstName":"Aguirre","lastName":"Guerra"}],"Powell":[{"id":10,"firstName":"Powell","lastName":"Hunt"}],
"Mcconnell":[{"id":11,"firstName":"Mcconnell","lastName":"Ochoa"}],"Alexandra":[{"id":12,"firstName":"Alexandra","lastName":"Villarreal"},{"id":18,"firstName":"Alexandra","lastName":"Chandler"}],
"Brandi":[{"id":13,"firstName":"Brandi","lastName":"Harmon"}],"Karyn":[{"id":14,"firstName":"Karyn","lastName":"Small"},{"id":17,"firstName":"Karyn","lastName":"Harmon"}],
"Suzanne":[{"id":15,"firstName":"Suzanne","lastName":"Chandler"},{"id":16,"firstName":"Suzanne","lastName":"Small"}]};

var groupedNamesArray = Object.keys(groupedNames).map(key=>[key,groupedNames[key]]);

var idFirstNameDict = array.reduce(function(c,l){
  c[l.id] =l.firstName;
  return c;
},{})
