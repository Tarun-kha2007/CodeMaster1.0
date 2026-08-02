const express =require('express');
const userMiddleware = require('../middleware/userMiddleware');
const{ userSubmission ,runCode} = require('../controller/userSubmission')
const submitRouter = express.Router();
submitRouter.post("/submit/:id",userMiddleware,userSubmission);
submitRouter.post("/run/:id",userMiddleware,runCode);

module.exports = submitRouter;