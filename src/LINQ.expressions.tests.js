//filterExpression => filterFn
function filterFn(obj) {
  return obj.id > 5;
}
function filterFn_2(obj) {
  return obj.fullName.length > 15;
}

var filterExpression = "obj=>obj.id>5";
var filterExpression_2 = "obj=>obj.fullName.length>15";

//select mocks
//selectExpression => selectFn
function selectFn(obj) {
  return {
    id: obj.id,
    fullName: obj.firstName + " " + obj.lastName
  };
}
var selectExpression = "obj=>{id:obj.id,fullName:obj.firstName + ' ' +  obj.lastName}";

function selectFn_2(obj) {
  obj.fullName;
}
var selectExpression_2 = "obj=>obj.fullName";
