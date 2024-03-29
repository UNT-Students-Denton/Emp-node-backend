var mySql=require("mysql");
var pool=mySql.createPool({
    connectionLimit : 100, //important
    host: 'localhost',
    user: 'root',
    password: 'Kousik@123',
    database: 'sepro'
});
pool.on('acquire', function (connection) {
    console.log('Connection %d acquired', connection.threadId);
  });
//getData
var result;
exports.getData=function getData(tableName,callback){
    let query;
    if(tableName){
        query=`SELECT * from ${tableName}`;
    }else{ 
        query=`select * from employee INNER JOIN users ON employee.Emp_Id=users.User_Id`;    }
     getQueryStructure(query, function(err,data){
      callback(err,data)
 });
}
//getData by key
exports.getDataByKey=function getDataByKey(tableName,id,key,callback){
    let query;
    if(tableName && key){
         query=`SELECT * from ${tableName} where ${key}="${id}"`;
    }
 getQueryStructure(query,function(err,data){
     callback(err,data);
 });
}

//getData by Id
exports.getDataById=function getDataById(tableName,id,callback){
    let query;
    if(tableName){
         query=`SELECT * from ${tableName} where Emp_id=${id}`;
    }else{
        query=`select * from employee INNER JOIN users ON employee.Emp_Id=users.User_Id
        where Emp_Id=${id}`;
    console.log(query)    }
 getQueryStructure(query,function(err,data){
     callback(err,data);
 });
}
 
//Insert new row
exports.insertData=function insertData(tableName,params,callback){
    var columns=Object.keys(params);
    var values=Object.values(params);
    let query;
    if(tableName){
         query=`INSERT INTO ${tableName}(${setColumns(columns)})
         Values(${setValues(values)})`;
    }else{
        query=`INSERT INTO employee(${setColumns(columns)}) Values(${setValues(values)})`;

    }
    getQueryStructure(query,function(err,data){
        callback(err,data);
   
 });  
}
    //update a row
exports.updateData=function updateData(tableName,params,whereKey,callback){
    var columns=Object.keys(params);
    var values=Object.values(params);
    let query;

    if(tableName && !whereKey){
        query=`UPDATE ${tableName} SET ${setUpdateColumns(columns,values)} Where emp_id=${params['emp_id']}`
    } else if(tableName && whereKey){
       let id= params[whereKey];
        query=`UPDATE ${tableName} SET ${setUpdateColumns(columns,values)} Where ${whereKey}=${id}`
    }else{
        query=`UPDATE employee SET ${setUpdateColumns(columns,values)} Where emp_id=${params['emp_id']}`
    }
 getQueryStructure(query,function(err,data){
    callback(err,data);

});  
}

    //Delete row in table
    exports.deleteData=function deleteData(tableName,params,callback){
        let query;
        if(tableName){
            query=`DELETE FROM ${tableName} WHERE emp_id=${params['emp_id']}`
        }else{
            query=`DELETE FROM employee WHERE emp_id=${params['emp_id']}`
    
        }
    
 getQueryStructure(query,function(err,data){
        callback(err,data);
   
 });  
}
 function getQueryStructure(query,call){
        pool.getConnection((err, connection) => {
            if(err) throw err;
            connection.query(query, (error, rows) => {
                 connection.release(); // return the connection to pool
                if(error) throw error;
                call(null,rows)
            });
     })
     
 
}
//set values
function setValues(values){
    var totalColumnValues="";
    values.forEach((value,valueIndex) => {
      totalColumnValues=totalColumnValues+`"${value}"`+(valueIndex!==values.length-1?',':''); 
    });
   return totalColumnValues;
  }

//set Columns
function setColumns(columns){
  var totalColumns="";
  columns.forEach((column,columnIndex) => {
    totalColumns=totalColumns+column+(columnIndex!==columns.length-1?',':''); 
  });
 return totalColumns;
}
//set update Columns
function setUpdateColumns(columns,values){
    console.log(values)
    columnStruct="";
    columns.forEach((column,columnIndex)=>{
        let type=typeof(values[columnIndex]);
        if(type=="string"){
            columnStruct=columnStruct+`${column}="${values[columnIndex]}"`+(columnIndex!==columns.length-1?',':'')
        }else{
            columnStruct=columnStruct+`${column}=${values[columnIndex]}`+(columnIndex!==columns.length-1?',':'')

        }
    });
    return columnStruct;
}
  

