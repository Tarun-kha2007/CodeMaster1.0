const Problem = require('../models/problem');
const Submission = require('../models/submission');
const User = require('../models/user');
const { getLanguageById, wrapCodeWithDriver, submitBatch, submitToken } = require('../utils/problemUtility');

const userSubmission = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    let { code, language } = req.body;

    if (!userId || !code || !problemId || !language) {
      return res.status(400).send("some field missing");
    }

    if (language === 'cpp') language = 'c++';

    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).send("Problem not found");

    const submittedResult = await Submission.create({
      userId,
      problemId,
      code,
      language,
      testCasesPassed: 0,
      status: 'pending',
      testCasesTotal: problem.hiddenTestCases.length
    });

    const languageId = getLanguageById(language);
    const finalCode = wrapCodeWithDriver(code, language);

    const submissions = problem.hiddenTestCases.map((testcase) => ({
      source_code: finalCode,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output
    }));

    const submitResult = await submitBatch(submissions);
    const resultToken = submitResult.map((value) => value.token);
    const testResult = await submitToken(resultToken);

    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = 'accepted';
    let errormsg = null;

    for (const test of testResult) {
      if (test.status_id === 3) {
        testCasesPassed++;
        runtime += parseFloat(test.time || 0);
        memory = Math.max(memory, test.memory || 0);
      } else {
        status = 'wrong';
        errormsg = test.stderr || test.compile_output || test.status?.description || 'Wrong Answer';
      }
    }

    submittedResult.status = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.errorMessage = errormsg;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory;
    await submittedResult.save();

    const accepted = (status === 'accepted');

    if (accepted && !req.result.problemSolved.includes(problemId)) {
      req.result.problemSolved.push(problemId);
      await req.result.save();
    }

    res.status(201).json({
      accepted,
      totalTestCases: submittedResult.testCasesTotal,
      passedTestCases: testCasesPassed,
      runtime,
      memory,
      errorMessage: errormsg
    });

  } catch (err) {
    console.error("userSubmission error:", err);
    res.status(500).send("Internal error: " + err.message);
  }
};

const runCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    let { code, language, customTestCases } = req.body;

    if (!userId || !code || !problemId || !language) {
      return res.status(400).send("some field missing");
    }

    if (language === 'cpp') { language = 'c++'; }

    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).send("Problem not found");

    const languageId = getLanguageById(language);
    const finalCode = wrapCodeWithDriver(code, language);

    let targetTestCases = problem.visibleTestCases;
    if (Array.isArray(customTestCases) && customTestCases.length > 0) {
      targetTestCases = customTestCases.map(tc => ({
        input: typeof tc === 'string' ? tc : (tc.input || tc.stdin || ''),
        output: typeof tc === 'object' ? (tc.output || tc.expected_output || '') : ''
      }));
    }

    const submissions = targetTestCases.map((testcase) => {
      const item = {
        source_code: finalCode,
        language_id: languageId,
        stdin: testcase.input
      };
      if (testcase.output && testcase.output.trim().length > 0) {
        item.expected_output = testcase.output;
      }
      return item;
    });

    const submitResult = await submitBatch(submissions);
    const resultToken = submitResult.map((value) => value.token);
    const testResult = await submitToken(resultToken);

    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = true;

    for (const test of testResult) {
      if (test.status_id === 3) {
        testCasesPassed++;
        runtime += parseFloat(test.time || 0);
        memory = Math.max(memory, test.memory || 0);
      } else {
        status = false;
      }
    }

    res.status(201).json({
      success: status,
      testCases: testResult,
      runtime,
      memory
    });
  } catch (err) {
    console.error("runCode error:", err);
    res.status(500).send("Internal error: " + err.message);
  }
};

module.exports = { userSubmission, runCode };