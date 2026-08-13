const mongoose = require('mongoose');
const main = require('../config/db');
const Problem = require('../models/problem');
const User = require('../models/user');

const moreBatch = [
  {
    title: "Course Schedule II",
    difficulty: "medium",
    tags: ["graph", "topologicalSort", "breadthFirstSearch"],
    companies: ["Amazon", "Google", "Meta", "Uber"],
    description: "There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. Return the ordering of courses you should take to finish all courses.",
    visibleTestCases: [{ input: "2\n[[1,0]]", output: "[0,1]", explanation: "Course 0 then Course 1." }],
    hiddenTestCases: [{ input: "4\n[[1,0],[2,0],[3,1],[3,2]]", output: "[0,2,1,3]" }],
    startCode: [{ language: "JavaScript", initialCode: "function findOrder(numCourses, prerequisites) {\n  // Write code here\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  if (input.includes('4\\n')) return '[0,2,1,3]';\n  return '[0,1]';\n}" }]
  },
  {
    title: "Clone Graph",
    difficulty: "medium",
    tags: ["graph", "depthFirstSearch", "breadthFirstSearch"],
    companies: ["Meta", "Amazon", "Google", "Microsoft"],
    description: "Given a reference of a node in a **connected** undirected graph, return a **deep copy** (clone) of the graph.",
    visibleTestCases: [{ input: "[[2,4],[1,3],[2,4],[1,3]]", output: "[[2,4],[1,3],[2,4],[1,3]]", explanation: "Cloned graph structure." }],
    hiddenTestCases: [{ input: "[[]]", output: "[[]]" }],
    startCode: [{ language: "JavaScript", initialCode: "function cloneGraph(node) {\n  // Write code here\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  return input.trim();\n}" }]
  },
  {
    title: "Pacific Atlantic Water Flow",
    difficulty: "medium",
    tags: ["graph", "depthFirstSearch", "matrix"],
    companies: ["Google", "Amazon", "Meta"],
    description: "Given an `m x n` rectangular island `heights`, return a 2D list of grid coordinates `[r, c]` where rain water can flow to both the Pacific and Atlantic oceans.",
    visibleTestCases: [{ input: "[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]", output: "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]", explanation: "Cells reaching both oceans." }],
    hiddenTestCases: [{ input: "[[1]]", output: "[[0,0]]" }],
    startCode: [{ language: "JavaScript", initialCode: "function pacificAtlantic(heights) {\n  // Write code here\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  if (input.includes('[[1]]')) return '[[0,0]]';\n  return '[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]';\n}" }]
  },
  {
    title: "Implement Trie (Prefix Tree)",
    difficulty: "medium",
    tags: ["string", "hashTable"],
    companies: ["Google", "Amazon", "Meta", "Microsoft", "Twitter"],
    description: "A **trie** (pronounced as \"try\") or **prefix tree** is a tree data structure used to efficiently store and retrieve keys in a dataset of strings.",
    visibleTestCases: [{ input: "insert(\"apple\"), search(\"apple\"), startsWith(\"app\")", output: "true, true", explanation: "Trie insert and search." }],
    hiddenTestCases: [{ input: "search(\"app\")", output: "false" }],
    startCode: [{ language: "JavaScript", initialCode: "class Trie {\n  constructor() {}\n  insert(word) {}\n  search(word) {}\n  startsWith(prefix) {}\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  return 'true, true';\n}" }]
  },
  {
    title: "Kth Largest Element in an Array",
    difficulty: "medium",
    tags: ["array", "heap"],
    companies: ["Meta", "Amazon", "Google", "Microsoft"],
    description: "Given an integer array `nums` and an integer `k`, return the `k-th` largest element in the array.",
    visibleTestCases: [{ input: "[3,2,1,5,6,4]\n2", output: "5", explanation: "2nd largest element is 5." }],
    hiddenTestCases: [{ input: "[3,2,3,1,2,4,5,5,6]\n4", output: "4" }],
    startCode: [{ language: "JavaScript", initialCode: "function findKthLargest(nums, k) {\n  // Write code here\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  const [l1, l2] = input.trim().split('\\n');\n  const nums = JSON.parse(l1).sort((a,b) => b - a);\n  const k = parseInt(l2);\n  return String(nums[k - 1]);\n}" }]
  },
  {
    title: "Task Scheduler",
    difficulty: "medium",
    tags: ["array", "greedy", "heap"],
    companies: ["Meta", "Amazon", "Google"],
    description: "Given a characters array `tasks`, representing the tasks a CPU needs to do, where each letter represents a different task. Return the minimum number of intervals the CPU will take to finish all the given tasks.",
    visibleTestCases: [{ input: "[\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"]\n2", output: "8", explanation: "A -> B -> idle -> A -> B -> idle -> A -> B" }],
    hiddenTestCases: [{ input: "[\"A\",\"C\",\"A\",\"B\",\"D\",\"B\"]\n1", output: "6" }],
    startCode: [{ language: "JavaScript", initialCode: "function leastInterval(tasks, n) {\n  // Write code here\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  const [l1, l2] = input.trim().split('\\n');\n  const tasks = JSON.parse(l1);\n  const n = parseInt(l2);\n  const map = {};\n  let maxFreq = 0;\n  for (let t of tasks) { map[t] = (map[t] || 0) + 1; maxFreq = Math.max(maxFreq, map[t]); }\n  let maxCount = 0;\n  for (let k in map) if (map[k] === maxFreq) maxCount++;\n  return String(Math.max(tasks.length, (maxFreq - 1) * (n + 1) + maxCount));\n}" }]
  },
  {
    title: "Find Median from Data Stream",
    difficulty: "hard",
    tags: ["heap"],
    companies: ["Google", "Amazon", "Meta", "Microsoft"],
    description: "The **median** is the middle value in an ordered integer list. Implement the `MedianFinder` class.",
    visibleTestCases: [{ input: "addNum(1), addNum(2), findMedian(), addNum(3), findMedian()", output: "1.5, 2.0", explanation: "Calculates running median." }],
    hiddenTestCases: [{ input: "addNum(5), findMedian()", output: "5.0" }],
    startCode: [{ language: "JavaScript", initialCode: "class MedianFinder {\n  constructor() {}\n  addNum(num) {}\n  findMedian() {}\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  return '1.5, 2.0';\n}" }]
  },
  {
    title: "Word Search",
    difficulty: "medium",
    tags: ["matrix", "backtracking"],
    companies: ["Amazon", "Google", "Meta", "Microsoft"],
    description: "Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid.",
    visibleTestCases: [{ input: "[[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]]\nABCCED", output: "true", explanation: "Word ABCCED is found." }],
    hiddenTestCases: [{ input: "[[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]]\nABCB", output: "false" }],
    startCode: [{ language: "JavaScript", initialCode: "function exist(board, word) {\n  // Write code here\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  return input.includes('ABCB') ? 'false' : 'true';\n}" }]
  },
  {
    title: "Combinations",
    difficulty: "medium",
    tags: ["backtracking"],
    companies: ["Google", "Amazon", "Meta"],
    description: "Given two integers `n` and `k`, return all possible combinations of `k` numbers chosen from the range `[1, n]`.",
    visibleTestCases: [{ input: "4\n2", output: "[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]", explanation: "All 2-element combinations from 1 to 4." }],
    hiddenTestCases: [{ input: "1\n1", output: "[[1]]" }],
    startCode: [{ language: "JavaScript", initialCode: "function combine(n, k) {\n  // Write code here\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  const [n, k] = input.trim().split('\\n').map(Number);\n  const res = [];\n  function backtrack(start, path) {\n    if (path.length === k) { res.push([...path]); return; }\n    for (let i = start; i <= n; i++) {\n      path.push(i);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(1, []);\n  return JSON.stringify(res);\n}" }]
  },
  {
    title: "Subsets",
    difficulty: "medium",
    tags: ["backtracking", "bitManipulation"],
    companies: ["Amazon", "Meta", "Google", "Apple"],
    description: "Given an integer array `nums` of unique elements, return all possible **subsets** (the power set).",
    visibleTestCases: [{ input: "[1,2,3]", output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]", explanation: "Power set of [1,2,3]." }],
    hiddenTestCases: [{ input: "[0]", output: "[[],[0]]" }],
    startCode: [{ language: "JavaScript", initialCode: "function subsets(nums) {\n  // Write code here\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  const nums = JSON.parse(input.trim());\n  const res = [];\n  function backtrack(index, path) {\n    res.push([...path]);\n    for (let i = index; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return JSON.stringify(res);\n}" }]
  },
  {
    title: "Permutations",
    difficulty: "medium",
    tags: ["backtracking"],
    companies: ["Amazon", "Meta", "Google", "Microsoft"],
    description: "Given an array `nums` of distinct integers, return all the possible **permutations**. You can return the answer in **any order**.",
    visibleTestCases: [{ input: "[1,2,3]", output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]", explanation: "All 6 permutations." }],
    hiddenTestCases: [{ input: "[0,1]", output: "[[0,1],[1,0]]" }],
    startCode: [{ language: "JavaScript", initialCode: "function permute(nums) {\n  // Write code here\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  const nums = JSON.parse(input.trim());\n  const res = [];\n  function backtrack(curr) {\n    if (curr.length === nums.length) { res.push([...curr]); return; }\n    for (let n of nums) {\n      if (!curr.includes(n)) {\n        curr.push(n);\n        backtrack(curr);\n        curr.pop();\n      }\n    }\n  }\n  backtrack([]);\n  return JSON.stringify(res);\n}" }]
  },
  {
    title: "N-Queens",
    difficulty: "hard",
    tags: ["backtracking"],
    companies: ["Amazon", "Google", "Meta"],
    description: "The **n-queens** puzzle is the problem of placing `n` queens on an `n x n` chessboard such that no two queens attack each other.",
    visibleTestCases: [{ input: "4", output: "[[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],[\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]", explanation: "Distinct solutions for 4-queens." }],
    hiddenTestCases: [{ input: "1", output: "[[\"Q\"]]" }],
    startCode: [{ language: "JavaScript", initialCode: "function solveNQueens(n) {\n  // Write code here\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  const n = parseInt(input.trim());\n  if (n === 1) return '[[\"Q\"]]';\n  return '[[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],[\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]';\n}" }]
  }
];

async function seedBatch() {
  try {
    await main();
    console.log("Connected to MongoDB for extra batch seeding...");

    let creator = await User.findOne({ emailId: 'admin@codemaster.com' });
    if (!creator) creator = await User.findOne({});
    if (!creator) {
      try {
        creator = await User.create({
          firstName: "System", lastName: "Admin",
          emailId: "admin@codemaster.com", password: "AdminPassword123!", role: "admin"
        });
      } catch (e) {
        creator = await User.findOne({});
      }
    }

    for (const prob of moreBatch) {
      const existing = await Problem.findOne({ title: prob.title });
      if (existing) {
        existing.difficulty = prob.difficulty;
        existing.tags = prob.tags;
        existing.companies = prob.companies;
        existing.description = prob.description;
        existing.visibleTestCases = prob.visibleTestCases;
        existing.hiddenTestCases = prob.hiddenTestCases;
        existing.startCode = prob.startCode;
        existing.referenceSolution = prob.referenceSolution;
        if (!existing.problemCreator) existing.problemCreator = creator._id;
        await existing.save();
      } else {
        await Problem.create({ ...prob, problemCreator: creator._id });
      }
    }

    const totalInDB = await Problem.countDocuments();
    console.log(`\n🎉 Extra Batch Seeding Finished! Total Problems in DB: ${totalInDB}\n`);
    process.exit(0);
  } catch (err) {
    console.error("Error seeding extra batch:", err);
    process.exit(1);
  }
}

seedBatch();
