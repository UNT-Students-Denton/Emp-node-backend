const express=require('express');
var cors = require('cors')
const whitelist = ["http://localhost:4200"]
var jwt = require('jsonwebtoken');
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

//For routing purpose
const router=express.Router();
router.use(cors())
var data=require('../datasource.js');
 var constants=require('../shared/common.js');


//get all data
router.get("/",verifyToken,(req,res)=>{
    let response=constants.api_response;
    jwt.verify(req.token,'kousik@123',(err,authData)=>{
        if(err){
         res.sendStatus(403);
        }else{
            try{
                if(req 
                    && req.query.emp_id){
                    var id=req.query.emp_id;
                    data.getDataById(null,id,function(err,data){
                        response={};
                        response.status=constants.SUCCESS;
                        response.data=data[0];
                        res.send(response)
                });
                }else{
                    data.getData(null,function(err,data){
                        response.status=constants.SUCCESS;
                        response.data=data;
                        response.Totalrecords=data.length;
                        res.send(response)
                    });
                }
            
            }catch(err){
                response.status=constants.FAILURE;
                response.data=err.message;
                res.send(response)
            }
        }
    }) 
})
//get Data by id
router.get("/:id",cors(corsOptions),(req,res)=>{
    let response=constants.api_response;
    try{
        var id=req.params.id;
        data.getDataById(null,id,function(err,data){
            response.status=constants.SUCCESS;
            response.data=data;
            res.send(response)
    });
       
    }catch(err){
        response.status=constants.FAILURE;
        response.data=err.message;
        res.send(response)
    }
    
})
//Insert new row in a table
router.post("/",(req,res)=>{
    var params=req.body;
    let response=constants.api_response;
    try{
        data.insertData(null,params,function(err,data){
                response.status==constants.SUCCESS;
                response.data=data;
                res.send(response);
        })
    }catch(err){
        response.status=constants.FAILURE;
        response.data=err.message;
        res.send(response)
    }
});

//update row in a table
router.put("/",async(req,res)=>{
    var params=req.body;
    let response=constants.api_response;
    try{
        await data.updateData('employee',params,'Emp_Id',function(err,data){
            response.status=constants.SUCCESS;
            if(req.body["Training_Status"]){
                response.data="Status Changed";

            }else{
                response.data=data;

            }
            res.send(response);
    })
    }catch(err){
    response.status=constants.FAILURE;
    response.data=err.message;
    res.send(response)
}
});
//delete row in a table
router.delete("/",async(req,res)=>{
    var params=req.body;
    let response=constants.api_response;
    try{
        await data.deleteData(null,params,function(err,data){
        console.log(params)
            response.status==constants.SUCCESS;
            response.data=data;
            res.send(response);
    })
    }catch(err){
    response.status=constants.FAILURE;
    response.data=err.message;
    res.send(response)
}
});

function verifyToken(req,res,next){
    const bearHeader=req.headers.authorization;
    if(typeof bearHeader !=='undefined'){
      const bearer=bearHeader.split(' ');
      const bearerToken=bearer[1];
      req.token=bearerToken;
      console.log(bearerToken)
      next();
    }else{
     res.sendStatus(403)
    }

}

module.exports=router 