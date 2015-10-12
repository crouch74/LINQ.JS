//filterExpression => filterFn
function filterFn(obj) {
  return obj.id > 5;
}
var filterExpression = "obj=>obj.id>5";

//select mocks
//selectExpression => selectFn
function selectFn(obj) {
  return {
    id: obj.id,
    fullName: obj.firstName + " " + obj.lastName
  };
}
var selectExpression = "obj=>{id:obj.id,fullName:obj.firstName + ' ' +  obj.lastName}";
