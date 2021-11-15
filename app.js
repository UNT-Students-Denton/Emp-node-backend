const express=require('express');
const app=express();
var constants=require('./shared/common.js');


//db connection
var data=require('./datasource');
app.use(express.json())
//routing
const empRouter=require("./routes/emp");
const loginRouter=require("./routes/login");
const signOutRouter=require("./routes/logout");
const departmentRouter=require("./routes/department");
const questionsRouter=require("./routes/questions");
const userRouter=require("./routes/user");
app.use('/emp',empRouter);
app.use('/emp/:id',empRouter);
app.use('/logout',signOutRouter);
app.use('/login',loginRouter);
app.use('/department',departmentRouter);
app.use('/questions',questionsRouter);
app.use('/user',userRouter);

app.listen(8080,function(){
    console.log("Server started");
});
