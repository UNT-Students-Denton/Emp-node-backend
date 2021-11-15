
const express=require('express');
var cors = require('cors')
const whitelist = ["http://localhost:4200"]
var corsOptions = {
    origin:  function (origin, callback) {
        console.log(origin)
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    enablePreflight: true,
    credentials: true,


  }
var jwt = require('jsonwebtoken');


//For routing purpose
const router=express.Router();
router.use(cors())
router.options("*", cors(corsOptions))
var data=require('../datasource.js');
 var constants=require('../shared/common.js');
//Insert new row in a table
router.post("/",cors(corsOptions),(req,res)=>{
    var params=req.body;
    let response=constants.api_response;
    try{
       ValidateUser(params,function(data){
        response.data={};
        if(data.length>0){
            var token = jwt.sign(params, 'kousik@123');
             params.token=token;
             insertToken(params,data[0]["User_Id"],function(result){
              if(result["changedRows"]==1){
                response.access_token=token;
                response.data=data[0];
                response.status=constants.SUCCESS;
                res.send(response);
              } })
           }else{
            response={};
            response.status=constants.SUCCESS;
            response.data={};
            res.send(response);
           } 
       });
    }catch(err){
        response.status=constants.FAILURE;
        res.send(response)
    }
});
//valiate login user
function ValidateUser(params,result){
            data.getDataByKey("users",params.user_name,'user_name',function(err,data){ 
            if(data.length>0 &&
                params.user_name==data[0]['user_name'] &&
                 params.password==data[0]['passwords'] ){    
            result(data)
                }else{
                    console.log(data)
                    result([]);
                }
        });
}
//insert token data
function insertToken(args,id,callback){
    let params={};
    params['Token']=args["token"];
    params["is_login"]=true;
    params["User_Id"]=id;
    data.updateData("users",params,'User_Id',function(err,data){
    callback(data);
    })
}

module.exports=router;