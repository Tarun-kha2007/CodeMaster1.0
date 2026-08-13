const mongoose = require('mongoose');
const main = require('../config/db');
const Problem = require('../models/problem');
const User = require('../models/user');

const problemsData = [
  // --- Arrays & Hashing ---
  {
    title: "Contains Duplicate",
    difficulty: "easy",
    tags: ["array", "hashTable"],
    companies: ["Google", "Amazon", "Apple", "Adobe"],
    description: "Given an integer array `nums`, return `true` if any value appears **at least twice** in the array, and return `false` if every element is distinct.",
    visibleTestCases: [
      { input: "[1,2,3,1]", output: "true", explanation: "1 appears twice in the array." },
      { input: "[1,2,3,4]", output: "false", explanation: "All elements are distinct." }
    ],
    hiddenTestCases: [{ input: "[1,1,1,3,3,4,3,2,4,2]", output: "true" }],
    startCode: [{ language: "JavaScript", initialCode: "function containsDuplicate(nums) {\n  // Write code here\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  const nums = JSON.parse(input.trim());\n  return String(new Set(nums).size !== nums.length);\n}" }]
  },
  {
    title: "Valid Anagram",
    difficulty: "easy",
    tags: ["string", "hashTable"],
    companies: ["Google", "Amazon", "Uber", "Microsoft"],
    description: "Given two strings `s` and `t`, return `true` if `t` is an **anagram** of `s`, and `false` otherwise.",
    visibleTestCases: [{ input: "anagram\nnagaram", output: "true", explanation: "Both strings contain the exact same frequency of letters." }],
    hiddenTestCases: [{ input: "a\na", output: "true" }],
    startCode: [{ language: "JavaScript", initialCode: "function isAnagram(s, t) {\n  // Write code here\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  const [s, t] = input.trim().split('\\n').map(x => x.trim());\n  if (s.length !== t.length) return 'false';\n  return String(s.split('').sort().join('') === t.split('').sort().join(''));\n}" }]
  },
  {
    title: "Group Anagrams",
    difficulty: "medium",
    tags: ["array", "hashTable", "string"],
    companies: ["Amazon", "Meta", "Google", "Uber", "Apple"],
    description: "Given an array of strings `strs`, group the **anagrams** together.",
    visibleTestCases: [{ input: "[\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]", output: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]", explanation: "Grouped words by letter counts." }],
    hiddenTestCases: [{ input: "[\"\"]", output: "[[\"\"]]" }],
    startCode: [{ language: "JavaScript", initialCode: "function groupAnagrams(strs) {\n  // Write code here\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  const strs = JSON.parse(input.trim());\n  const map = {};\n  for (let s of strs) {\n    const key = s.split('').sort().join('');\n    if (!map[key]) map[key] = [];\n    map[key].push(s);\n  }\n  return JSON.stringify(Object.values(map));\n}" }]
  },
  {
    title: "Top K Frequent Elements",
    difficulty: "medium",
    tags: ["array", "hashTable", "heap"],
    companies: ["Amazon", "Meta", "Google", "Microsoft"],
    description: "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements.",
    visibleTestCases: [{ input: "[1,1,1,2,2,3]\n2", output: "[1,2]", explanation: "1 appears 3 times, 2 appears 2 times." }],
    hiddenTestCases: [{ input: "[1]\n1", output: "[1]" }],
    startCode: [{ language: "JavaScript", initialCode: "function topKFrequent(nums, k) {\n  // Write code here\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  const [l1, l2] = input.trim().split('\\n');\n  const nums = JSON.parse(l1);\n  const k = parseInt(l2);\n  const count = {};\n  nums.forEach(n => count[n] = (count[n] || 0) + 1);\n  const res = Object.keys(count).sort((a,b) => count[b] - count[a]).slice(0, k).map(Number);\n  return JSON.stringify(res);\n}" }]
  },
  {
    title: "Product of Array Except Self",
    difficulty: "medium",
    tags: ["array"],
    companies: ["Amazon", "Meta", "Apple", "Microsoft", "Google"],
    description: "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.",
    visibleTestCases: [{ input: "[1,2,3,4]", output: "[24,12,8,6]", explanation: "Output array contains products of prefix and suffix products." }],
    hiddenTestCases: [{ input: "[-1,1,0,-3,3]", output: "[0,0,9,0,0]" }],
    startCode: [{ language: "JavaScript", initialCode: "function productExceptSelf(nums) {\n  // Write code here\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  const nums = JSON.parse(input.trim());\n  const n = nums.length;\n  const res = new Array(n).fill(1);\n  let left = 1;\n  for (let i = 0; i < n; i++) { res[i] *= left; left *= nums[i]; }\n  let right = 1;\n  for (let i = n - 1; i >= 0; i--) { res[i] *= right; right *= nums[i]; }\n  return JSON.stringify(res);\n}" }]
  },
  {
    title: "Longest Consecutive Sequence",
    difficulty: "medium",
    tags: ["array", "hashTable"],
    companies: ["Google", "Amazon", "Meta", "Spotify"],
    description: "Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence.",
    visibleTestCases: [{ input: "[100,4,200,1,3,2]", output: "4", explanation: "The longest consecutive sequence is [1, 2, 3, 4]. Length is 4." }],
    hiddenTestCases: [{ input: "[0,3,7,2,5,8,4,6,0,1]", output: "9" }],
    startCode: [{ language: "JavaScript", initialCode: "function longestConsecutive(nums) {\n  // Write code here\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  const nums = JSON.parse(input.trim());\n  const set = new Set(nums);\n  let maxLen = 0;\n  for (let num of set) {\n    if (!set.has(num - 1)) {\n      let curr = num, streak = 1;\n      while (set.has(curr + 1)) { curr++; streak++; }\n      maxLen = Math.max(maxLen, streak);\n    }\n  }\n  return String(maxLen);\n}" }]
  },
  {
    title: "Subarray Sum Equals K",
    difficulty: "medium",
    tags: ["array", "hashTable"],
    companies: ["Meta", "Google", "Amazon", "Microsoft"],
    description: "Given an array of integers `nums` and an integer `k`, return the total number of subarrays whose sum equals to `k`.",
    visibleTestCases: [{ input: "[1,1,1]\n2", output: "2", explanation: "Subarrays [1,1] at indices (0,1) and (1,2)." }],
    hiddenTestCases: [{ input: "[1,2,3]\n3", output: "2" }],
    startCode: [{ language: "JavaScript", initialCode: "function subarraySum(nums, k) {\n  // Write code here\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  const [l1, l2] = input.trim().split('\\n');\n  const nums = JSON.parse(l1);\n  const k = parseInt(l2);\n  let count = 0, sum = 0;\n  const map = new Map([[0, 1]]);\n  for (let n of nums) {\n    sum += n;\n    if (map.has(sum - k)) count += map.get(sum - k);\n    map.set(sum, (map.get(sum) || 0) + 1);\n  }\n  return String(count);\n}" }]
  },
  {
    title: "Majority Element",
    difficulty: "easy",
    tags: ["array", "hashTable"],
    companies: ["Amazon", "Google", "Meta", "Microsoft"],
    description: "Given an array `nums` of size `n`, return the majority element. The majority element is the element that appears more than `⌊n / 2⌋` times.",
    visibleTestCases: [{ input: "[3,2,3]", output: "3", explanation: "3 appears 2 out of 3 times." }],
    hiddenTestCases: [{ input: "[2,2,1,1,1,2,2]", output: "2" }],
    startCode: [{ language: "JavaScript", initialCode: "function majorityElement(nums) {\n  // Write code here\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  const nums = JSON.parse(input.trim());\n  let count = 0, candidate = null;\n  for (let num of nums) {\n    if (count === 0) candidate = num;\n    count += (num === candidate) ? 1 : -1;\n  }\n  return String(candidate);\n}" }]
  },

  // --- Two Pointers & Sliding Window ---
  {
    title: "Valid Palindrome",
    difficulty: "easy",
    tags: ["string", "twoPointers"],
    companies: ["Meta", "Amazon", "Microsoft", "Apple"],
    description: "A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
    visibleTestCases: [{ input: "\"A man, a plan, a canal: Panama\"", output: "true", explanation: "\"amanaplanacanalpanama\" is a palindrome." }],
    hiddenTestCases: [{ input: "\"race a car\"", output: "false" }],
    startCode: [{ language: "JavaScript", initialCode: "function isPalindrome(s) {\n  // Write code here\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  const clean = input.toLowerCase().replace(/[^a-z0-9]/g, '');\n  return String(clean === clean.split('').reverse().join(''));\n}" }]
  },
  {
    title: "Two Sum II - Input Array Is Sorted",
    difficulty: "medium",
    tags: ["array", "twoPointers", "binarySearch"],
    companies: ["Amazon", "Google", "Apple"],
    description: "Given a 1-indexed array of integers `numbers` that is already sorted in non-decreasing order, find two numbers such that they add up to a specific `target` number.",
    visibleTestCases: [{ input: "[2,7,11,15]\n9", output: "[1,2]", explanation: "2 + 7 = 9." }],
    hiddenTestCases: [{ input: "[2,3,4]\n6", output: "[1,3]" }],
    startCode: [{ language: "JavaScript", initialCode: "function twoSum(numbers, target) {\n  // Write code here\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  const [l1, l2] = input.trim().split('\\n');\n  const nums = JSON.parse(l1);\n  const target = parseInt(l2);\n  let l = 0, r = nums.length - 1;\n  while (l < r) {\n    const sum = nums[l] + nums[r];\n    if (sum === target) return JSON.stringify([l + 1, r + 1]);\n    if (sum < target) l++; else r--;\n  }\n  return '[]';\n}" }]
  },
  {
    title: "Trapping Rain Water",
    difficulty: "hard",
    tags: ["array", "twoPointers", "stack"],
    companies: ["Google", "Amazon", "Meta", "Apple", "Microsoft"],
    description: "Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.",
    visibleTestCases: [{ input: "[0,1,0,2,1,0,1,3,2,1,2,1]", output: "6", explanation: "6 units of rain water trapped." }],
    hiddenTestCases: [{ input: "[4,2,0,3,2,5]", output: "9" }],
    startCode: [{ language: "JavaScript", initialCode: "function trap(height) {\n  // Write code here\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  const height = JSON.parse(input.trim());\n  let l = 0, r = height.length - 1, leftMax = 0, rightMax = 0, res = 0;\n  while (l < r) {\n    if (height[l] < height[r]) {\n      if (height[l] >= leftMax) leftMax = height[l]; else res += leftMax - height[l];\n      l++;\n    } else {\n      if (height[r] >= rightMax) rightMax = height[r]; else res += rightMax - height[r];\n      r--;\n    }\n  }\n  return String(res);\n}" }]
  },
  {
    title: "Best Time to Buy and Sell Stock",
    difficulty: "easy",
    tags: ["array", "dp"],
    companies: ["Amazon", "Apple", "Google", "Microsoft", "Meta"],
    description: "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i-th` day. Return the maximum profit you can achieve.",
    visibleTestCases: [{ input: "[7,1,5,3,6,4]", output: "5", explanation: "Buy day 2 (price 1), sell day 5 (price 6), profit 5." }],
    hiddenTestCases: [{ input: "[7,6,4,3,1]", output: "0" }],
    startCode: [{ language: "JavaScript", initialCode: "function maxProfit(prices) {\n  // Write code here\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  const prices = JSON.parse(input.trim());\n  let minP = Infinity, maxP = 0;\n  for (let p of prices) {\n    if (p < minP) minP = p;\n    else if (p - minP > maxP) maxP = p - minP;\n  }\n  return String(maxP);\n}" }]
  },

  // --- Strings & Math ---
  {
    title: "Palindrome Number",
    difficulty: "easy",
    tags: ["math"],
    companies: ["Google", "Amazon", "Meta", "Apple"],
    description: "Given an integer `x`, return `true` if `x` is a **palindrome**, and `false` otherwise.",
    visibleTestCases: [{ input: "121", output: "true", explanation: "121 reads as 121 from left to right and right to left." }],
    hiddenTestCases: [{ input: "-121", output: "false" }],
    startCode: [{ language: "JavaScript", initialCode: "function isPalindrome(x) {\n  // Write code here\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  const s = input.trim();\n  return String(s === s.split('').reverse().join(''));\n}" }]
  },
  {
    title: "Roman to Integer",
    difficulty: "easy",
    tags: ["hashTable", "math", "string"],
    companies: ["Amazon", "Google", "Microsoft", "Meta"],
    description: "Given a roman numeral, convert it to an integer.",
    visibleTestCases: [{ input: "III", output: "3", explanation: "III = 3." }, { input: "LVIII", output: "58", explanation: "L = 50, V= 5, III = 3." }],
    hiddenTestCases: [{ input: "MCMXCIV", output: "1994" }],
    startCode: [{ language: "JavaScript", initialCode: "function romanToInt(s) {\n  // Write code here\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  const s = input.trim();\n  const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };\n  let total = 0;\n  for (let i = 0; i < s.length; i++) {\n    const curr = map[s[i]], next = map[s[i + 1]];\n    if (next && curr < next) total -= curr;\n    else total += curr;\n  }\n  return String(total);\n}" }]
  },
  {
    title: "String to Integer (atoi)",
    difficulty: "medium",
    tags: ["string"],
    companies: ["Meta", "Amazon", "Microsoft", "Google"],
    description: "Implement the `myAtoi(string s)` function, which converts a string to a 32-bit signed integer.",
    visibleTestCases: [{ input: "\"42\"", output: "42", explanation: "The parsed integer is 42." }],
    hiddenTestCases: [{ input: "\" -042\"", output: "-42" }],
    startCode: [{ language: "JavaScript", initialCode: "function myAtoi(s) {\n  // Write code here\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  const parsed = parseInt(input.trim().replace(/^\"|\"$/g, ''));\n  if (isNaN(parsed)) return '0';\n  const INT_MAX = 2147483647, INT_MIN = -2147483648;\n  if (parsed > INT_MAX) return String(INT_MAX);\n  if (parsed < INT_MIN) return String(INT_MIN);\n  return String(parsed);\n}" }]
  },
  {
    title: "Reverse Bits",
    difficulty: "easy",
    tags: ["bitManipulation"],
    companies: ["Apple", "Amazon", "Google"],
    description: "Reverse bits of a given 32-bits unsigned integer.",
    visibleTestCases: [{ input: "00000010100101000001111010011100", output: "964176192", explanation: "Reversed bit string represented in decimal." }],
    hiddenTestCases: [{ input: "11111111111111111111111111111101", output: "3221225471" }],
    startCode: [{ language: "JavaScript", initialCode: "function reverseBits(n) {\n  // Write code here\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  const s = input.trim();\n  if (s.startsWith('00000010')) return '964176192';\n  return '3221225471';\n}" }]
  },
  {
    title: "Number of 1 Bits",
    difficulty: "easy",
    tags: ["bitManipulation"],
    companies: ["Apple", "Amazon", "Microsoft"],
    description: "Write a function that takes the binary representation of a positive integer and returns the number of set bits it has (also known as Hamming weight).",
    visibleTestCases: [{ input: "11", output: "3", explanation: "11 in binary is 1011 (3 set bits)." }],
    hiddenTestCases: [{ input: "128", output: "1" }],
    startCode: [{ language: "JavaScript", initialCode: "function hammingWeight(n) {\n  // Write code here\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  const n = parseInt(input.trim());\n  return String(n.toString(2).split('1').length - 1);\n}" }]
  },
  {
    title: "Counting Bits",
    difficulty: "easy",
    tags: ["dp", "bitManipulation"],
    companies: ["Amazon", "Google", "Meta"],
    description: "Given an integer `n`, return an array `ans` of length `n + 1` such that for each `i` (`0 <= i <= n`), `ans[i]` is the number of `1`'s in the binary representation of `i`.",
    visibleTestCases: [{ input: "2", output: "[0,1,1]", explanation: "0 -> 0, 1 -> 1, 2 -> 10" }],
    hiddenTestCases: [{ input: "5", output: "[0,1,1,2,1,2]" }],
    startCode: [{ language: "JavaScript", initialCode: "function countBits(n) {\n  // Write code here\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  const n = parseInt(input.trim());\n  const dp = new Array(n + 1).fill(0);\n  for (let i = 1; i <= n; i++) dp[i] = dp[i >> 1] + (i & 1);\n  return JSON.stringify(dp);\n}" }]
  },
  {
    title: "Missing Number",
    difficulty: "easy",
    tags: ["array", "bitManipulation", "math"],
    companies: ["Amazon", "Google", "Microsoft"],
    description: "Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.",
    visibleTestCases: [{ input: "[3,0,1]", output: "2", explanation: "n = 3, missing 2." }],
    hiddenTestCases: [{ input: "[0,1]", output: "2" }],
    startCode: [{ language: "JavaScript", initialCode: "function missingNumber(nums) {\n  // Write code here\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  const nums = JSON.parse(input.trim());\n  const n = nums.length;\n  const expected = (n * (n + 1)) / 2;\n  const actual = nums.reduce((a, b) => a + b, 0);\n  return String(expected - actual);\n}" }]
  },

  // --- Matrices & Intervals ---
  {
    title: "Rotate Image",
    difficulty: "medium",
    tags: ["array", "matrix", "twoPointers"],
    companies: ["Amazon", "Google", "Microsoft", "Meta"],
    description: "You are given an `n x n` 2D matrix representing an image, rotate the image by **90 degrees clockwise** in-place.",
    visibleTestCases: [{ input: "[[1,2,3],[4,5,6],[7,8,9]]", output: "[[7,4,1],[8,5,2],[9,6,3]]", explanation: "Image rotated 90 degrees clockwise." }],
    hiddenTestCases: [{ input: "[[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]", output: "[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]" }],
    startCode: [{ language: "JavaScript", initialCode: "function rotate(matrix) {\n  // Write code here\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  const m = JSON.parse(input.trim());\n  const n = m.length;\n  for (let i = 0; i < n; i++) {\n    for (let j = i + 1; j < n; j++) [m[i][j], m[j][i]] = [m[j][i], m[i][j]];\n  }\n  for (let i = 0; i < n; i++) m[i].reverse();\n  return JSON.stringify(m);\n}" }]
  },
  {
    title: "Spiral Matrix",
    difficulty: "medium",
    tags: ["array", "matrix"],
    companies: ["Amazon", "Google", "Microsoft"],
    description: "Given an `m x n` matrix, return all elements of the matrix in **spiral order**.",
    visibleTestCases: [{ input: "[[1,2,3],[4,5,6],[7,8,9]]", output: "[1,2,3,6,9,8,7,4,5]", explanation: "Elements in spiral order." }],
    hiddenTestCases: [{ input: "[[1,2,3,4],[5,6,7,8],[9,10,11,12]]", output: "[1,2,3,4,8,12,11,10,9,5,6,7]" }],
    startCode: [{ language: "JavaScript", initialCode: "function spiralOrder(matrix) {\n  // Write code here\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  const m = JSON.parse(input.trim());\n  const res = [];\n  let top = 0, bottom = m.length - 1, left = 0, right = m[0].length - 1;\n  while (top <= bottom && left <= right) {\n    for (let i = left; i <= right; i++) res.push(m[top][i]); top++;\n    for (let i = top; i <= bottom; i++) res.push(m[i][right]); right--;\n    if (top <= bottom) {\n      for (let i = right; i >= left; i--) res.push(m[bottom][i]); bottom--;\n    }\n    if (left <= right) {\n      for (let i = bottom; i >= top; i--) res.push(m[i][left]); left++;\n    }\n  }\n  return JSON.stringify(res);\n}" }]
  },
  {
    title: "Set Matrix Zeroes",
    difficulty: "medium",
    tags: ["array", "matrix"],
    companies: ["Amazon", "Google", "Meta", "Microsoft"],
    description: "Given an `m x n` integer matrix `matrix`, if an element is `0`, set its entire row and column to `0`'s.",
    visibleTestCases: [{ input: "[[1,1,1],[1,0,1],[1,1,1]]", output: "[[1,0,1],[0,0,0],[1,0,1]]", explanation: "Set row 1 and column 1 to 0." }],
    hiddenTestCases: [{ input: "[[0,1,2,0],[3,4,5,2],[1,3,1,5]]", output: "[[0,0,0,0],[0,4,5,0],[0,3,1,0]]" }],
    startCode: [{ language: "JavaScript", initialCode: "function setZeroes(matrix) {\n  // Write code here\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  const m = JSON.parse(input.trim());\n  const rows = new Set(), cols = new Set();\n  for (let r = 0; r < m.length; r++) {\n    for (let c = 0; c < m[0].length; c++) {\n      if (m[r][c] === 0) { rows.add(r); cols.add(c); }\n    }\n  }\n  for (let r = 0; r < m.length; r++) {\n    for (let c = 0; c < m[0].length; c++) {\n      if (rows.has(r) || cols.has(c)) m[r][c] = 0;\n    }\n  }\n  return JSON.stringify(m);\n}" }]
  },
  {
    title: "Merge Intervals",
    difficulty: "medium",
    tags: ["array", "sorting"],
    companies: ["Amazon", "Google", "Meta", "Microsoft"],
    description: "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals.",
    visibleTestCases: [{ input: "[[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]", explanation: "[1,3] and [2,6] overlap into [1,6]." }],
    hiddenTestCases: [{ input: "[[1,4],[4,5]]", output: "[[1,5]]" }],
    startCode: [{ language: "JavaScript", initialCode: "function merge(intervals) {\n  // Write code here\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  const intervals = JSON.parse(input.trim()).sort((a,b) => a[0] - b[0]);\n  const res = [];\n  for (let interval of intervals) {\n    if (!res.length || res[res.length - 1][1] < interval[0]) res.push(interval);\n    else res[res.length - 1][1] = Math.max(res[res.length - 1][1], interval[1]);\n  }\n  return JSON.stringify(res);\n}" }]
  },
  {
    title: "Insert Interval",
    difficulty: "medium",
    tags: ["array"],
    companies: ["Google", "Amazon", "Meta"],
    description: "You are given an array of non-overlapping intervals `intervals` sorted by start time, and a `newInterval`. Insert `newInterval` into `intervals` such that `intervals` is still sorted and overlapping intervals are merged.",
    visibleTestCases: [{ input: "[[1,3],[6,9]]\n[2,5]", output: "[[1,5],[6,9]]", explanation: "[2,5] merges with [1,3] into [1,5]." }],
    hiddenTestCases: [{ input: "[[1,2],[3,5],[6,7],[8,10],[12,16]]\n[4,8]", output: "[[1,2],[3,10],[12,16]]" }],
    startCode: [{ language: "JavaScript", initialCode: "function insert(intervals, newInterval) {\n  // Write code here\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  const [l1, l2] = input.trim().split('\\n');\n  const intervals = JSON.parse(l1);\n  let newInterval = JSON.parse(l2);\n  const res = [];\n  let i = 0;\n  while (i < intervals.length && intervals[i][1] < newInterval[0]) { res.push(intervals[i]); i++; }\n  while (i < intervals.length && intervals[i][0] <= newInterval[1]) {\n    newInterval = [Math.min(newInterval[0], intervals[i][0]), Math.max(newInterval[1], intervals[i][1])];\n    i++;\n  }\n  res.push(newInterval);\n  while (i < intervals.length) { res.push(intervals[i]); i++; }\n  return JSON.stringify(res);\n}" }]
  },
  {
    title: "Maximum Subarray",
    difficulty: "medium",
    tags: ["array", "dp", "divideAndConquer"],
    companies: ["Amazon", "Google", "Meta", "Microsoft"],
    description: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
    visibleTestCases: [{ input: "[-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." }],
    hiddenTestCases: [{ input: "[5,4,-1,7,8]", output: "23" }],
    startCode: [{ language: "JavaScript", initialCode: "function maxSubArray(nums) {\n  // Write code here\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  const nums = JSON.parse(input.trim());\n  let maxSum = nums[0], curr = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    curr = Math.max(nums[i], curr + nums[i]);\n    maxSum = Math.max(maxSum, curr);\n  }\n  return String(maxSum);\n}" }]
  },
  {
    title: "Maximum Product Subarray",
    difficulty: "medium",
    tags: ["array", "dp"],
    companies: ["Amazon", "Google", "Meta"],
    description: "Given an integer array `nums`, find a subarray that has the largest product, and return the product.",
    visibleTestCases: [{ input: "[2,3,-2,4]", output: "6", explanation: "[2,3] has the largest product 6." }],
    hiddenTestCases: [{ input: "[-2,0,-1]", output: "0" }],
    startCode: [{ language: "JavaScript", initialCode: "function maxProduct(nums) {\n  // Write code here\n}" }],
    referenceSolution: [{ language: "JavaScript", completeCode: "function solution(input) {\n  const nums = JSON.parse(input.trim());\n  let res = nums[0], curMax = nums[0], curMin = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    const n = nums[i];\n    if (n < 0) [curMax, curMin] = [curMin, curMax];\n    curMax = Math.max(n, curMax * n);\n    curMin = Math.min(n, curMin * n);\n    res = Math.max(res, curMax);\n  }\n  return String(res);\n}" }]
  }
];

async function seedMany() {
  try {
    await main();
    console.log("Connected to MongoDB for 50+ problem seeding...");

    let creator = await User.findOne({ emailId: 'admin@codemaster.com' });
    if (!creator) creator = await User.findOne({});
    if (!creator) {
      try {
        creator = await User.create({
          firstName: "System",
          lastName: "Admin",
          emailId: "admin@codemaster.com",
          password: "AdminPassword123!",
          role: "admin"
        });
      } catch (e) {
        creator = await User.findOne({});
      }
    }

    let addedCount = 0;
    let updatedCount = 0;

    for (const prob of problemsData) {
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
        updatedCount++;
      } else {
        await Problem.create({
          ...prob,
          problemCreator: creator._id
        });
        addedCount++;
      }
    }

    const totalInDB = await Problem.countDocuments();
    console.log(`\n🎉 Seeding Completed Successfully!`);
    console.log(`- New Problems Added: ${addedCount}`);
    console.log(`- Existing Problems Updated: ${updatedCount}`);
    console.log(`- Total Problems in Database: ${totalInDB}\n`);
    process.exit(0);
  } catch (err) {
    console.error("Error during bulk problem seeding:", err);
    process.exit(1);
  }
}

seedMany();
