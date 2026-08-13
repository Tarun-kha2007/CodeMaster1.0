const {getLanguageById,submitBatch,submitToken} = require("../utils/problemUtility");
const Problem = require("../models/problem");
const User = require("../models/user");
const Submission = require('../models/submission')
const SolutionVideo = require("../models/solutionVideo")
const createProblem = async (req,res)=>{

    const {title,description,difficulty,tags,
        visibleTestCases,hiddenTestCases,startCode,
        referenceSolution
    } = req.body;


    try{
       
      for(const {language,completeCode} of referenceSolution){
         

        // source_code:
        // language_id:
        // stdin: 
        // expectedOutput:

        const languageId = getLanguageById(language);
          
        // I am creating Batch submission
        const submissions = visibleTestCases.map((testcase)=>({
            source_code:completeCode,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));

        const submitResult = await submitBatch(submissions);

        const resultToken = submitResult.map((value)=> value.token);

        // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]
       const testResult = await submitToken(resultToken);
       for(const test of testResult){
        if(test.status_id!=3){
         return res.status(400).send("Error Occured");
        }
       }

      }


      // We can store it in our DB

    const userProblem =  await Problem.create({
        ...req.body,
        problemCreator: req.result._id
      });

      res.status(201).send("Problem Saved Successfully");
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}
const updateProblem = async (req,res)=>{
    
  const {id} = req.params;
  const {title,description,difficulty,tags,
    visibleTestCases,hiddenTestCases,startCode,
    referenceSolution, problemCreator
   } = req.body;
      if(!id){
      return res.status(400).send("Missing ID Field");
     }
         const DsaProblem =  await Problem.findById(id);
    if(!DsaProblem)
    {
      return res.status(404).send("ID is not persent in server");
    }
      
  try{
    for(const {language,completeCode} of referenceSolution){
      const languageId = getLanguageById(language);
      const submissions = visibleTestCases.map((testcase)=>({
          source_code:completeCode,
          language_id: languageId,
          stdin: testcase.input,
          expected_output: testcase.output
      }));
      const submitResult = await submitBatch(submissions);
      // console.log(submitResult);
      const resultToken = submitResult.map((value)=> value.token);
      // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]      
     const testResult = await submitToken(resultToken);
    //  console.log(testResult);
     for(const test of testResult){
      if(test.status_id!=3){
       return res.status(400).send("Error Occured");
      }
     }

    }


  const newProblem = await Problem.findByIdAndUpdate(id , {...req.body}, {runValidators:true, new:true});
   
  res.status(200).send(newProblem);
  }
  catch(err){
      res.status(500).send("Error: "+err);
  }
}
const deleteProblem = async(req,res)=>{

  const {id} = req.params;
  try{ 
    if(!id) return res.status(400).send("ID is Missing");
   const deletedProblem = await Problem.findByIdAndDelete(id);
   if(!deletedProblem)
    return res.status(404).send("Problem is Missing");
   res.status(200).send("Successfully Deleted");
  }
  catch(err){
   res.status(500).send("Error: "+err);
  }
}


const getProblemById = async(req,res)=>{

  const {id} = req.params;
  try{
      console.log("id"+id);
    if(!id)
      return res.status(400).send("ID is Missing");
      console.log("id"+id);

    const getProblem = await Problem.findById(id).select('_id title description difficulty tags companies visibleTestCases startCode referenceSolution');
   
   if(!getProblem)
    return res.status(404).send("Problem is Missing");

 console.log(getProblem);
   res.status(200).send(getProblem);
}
  catch(err){
    res.status(500).send("Error: "+err);
  }
}

const getAllProblem = async(req,res)=>{

  try{
    const getProblem = await Problem.find({}).select('_id title difficulty tags companies');
   if(getProblem.length==0)
    return res.status(404).send("Problem is Missing");


   res.status(200).send(getProblem);
  }
  catch(err){
    res.status(500).send("Error: "+err);
  }
}
 const solvedAllProblemByUser = async(req,res)=>{
 try{
     const userId = req.result._id;
     const user = await User.findById(userId).populate({
       path:"problemSolved",
       select :"_id title difficulty tags"
     });
 //    const count = req.result.problemSolved.length;
     res.status(200).send(user.problemSolved);
 } catch(err){
     res.send("Server Error");
 }
 }

const submittedProblem = async(req,res)=>{
  try{ 
    let userId = req.result._id;
    let problemId = req.params.pid;
    const result = await Submission.find({userId,problemId});
    res.status(200).json(result);
  }catch(err){
    res.status(500).json({ message: "Internal Server Error: " + err.message });
  }
}



module.exports = {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblemByUser,submittedProblem};


