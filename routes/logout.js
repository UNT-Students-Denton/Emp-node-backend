
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

 //update row in a table
router.put("/",verifyToken,async(req,res)=>{
    var params=req.body;
    let response=constants.api_response;
    jwt.verify(req.token,'kousik@123',(err,authData)=>{
        if(err){
         res.sendStatus(403);
        }else{
            try{
                params["Token"]=null;
                params["is_login"]=false;
                 data.updateData('users',params,'User_Id',function(err,data){
                    response.status=constants.SUCCESS;
                    response.data=data;
                    res.send(response);
            })
            }catch(err){
            response.status=constants.FAILURE;
            response.data=err.message;
            res.send(response)
        }
        }
});
});
function verifyToken(req,res,next){
    const bearHeader=req.headers.authorization;
    if(typeof bearHeader !=='undefined'){
      const bearer=bearHeader.split(' ');
      const bearerToken=bearer[1];
      req.token=bearerToken;
      next();
    }else{
     res.sendStatus(403)
    }

}
module.exports = router;
