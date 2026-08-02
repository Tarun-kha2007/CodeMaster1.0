const mongoose = require('mongoose');
const main = require('../config/db');
const Problem = require('../models/problem');
const User = require('../models/user');

const sampleProblems = [
  {
    title: "Two Sum",
    difficulty: "easy",
    tags: ["array", "hashTable"],
    companies: ["Google", "Amazon", "Meta", "Apple", "Microsoft"],
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    visibleTestCases: [
      {
        input: "[2,7,11,15]\n9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "[3,2,4]\n6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
      }
    ],
    hiddenTestCases: [
      {
        input: "[3,3]\n6",
        output: "[0,1]"
      }
    ],
    startCode: [
      {
        language: "JavaScript",
        initialCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    // Write your code here
}`
      },
      {
        language: "C++",
        initialCode: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Write your code here
}`
      },
      {
        language: "Java",
        initialCode: `import java.util.*;

public class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[]{};
    }
}`
      }
    ],
    referenceSolution: [
      {
        language: "JavaScript",
        completeCode: `function solution(input) {
  const lines = input.trim().split('\\n');
  const nums = JSON.parse(lines[0]);
  const target = parseInt(lines[1]);
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return JSON.stringify([map.get(diff), i]);
    }
    map.set(nums[i], i);
  }
  return '[]';
}`
      },
      {
        language: "C++",
        completeCode: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

int main() {
    int n, target;
    if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    cin >> target;
    unordered_map<int, int> mp;
    for (int i = 0; i < n; i++) {
        int diff = target - nums[i];
        if (mp.count(diff)) {
            cout << "[" << mp[diff] << "," << i << "]";
            return 0;
        }
        mp[nums[i]] = i;
    }
    return 0;
}`
      },
      {
        language: "Java",
        completeCode: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) return;
        String line = sc.nextLine();
        int target = sc.nextInt();
        line = line.replace("[", "").replace("]", "");
        String[] parts = line.split(",");
        int[] nums = new int[parts.length];
        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i].trim());
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int diff = target - nums[i];
            if (map.containsKey(diff)) {
                System.out.println("[" + map.get(diff) + "," + i + "]");
                return;
            }
            map.put(nums[i], i);
        }
    }
}`
      }
    ]
  },
  {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "medium",
    tags: ["string", "slidingWindow", "hashTable"],
    companies: ["Amazon", "Google", "Meta", "Bloomberg", "Microsoft"],
    description: "Given a string `s`, find the length of the **longest substring** without repeating characters.",
    visibleTestCases: [
      {
        input: "abcabcbb",
        output: "3",
        explanation: "The answer is \"abc\", with the length of 3."
      },
      {
        input: "bbbbb",
        output: "1",
        explanation: "The answer is \"b\", with the length of 1."
      }
    ],
    hiddenTestCases: [
      {
        input: "pwwkew",
        output: "3"
      }
    ],
    startCode: [
      {
        language: "JavaScript",
        initialCode: `function lengthOfLongestSubstring(s) {
    // Write code here
}`
      }
    ],
    referenceSolution: [
      {
        language: "JavaScript",
        completeCode: `function solution(input) {
  const s = input.trim();
  let maxLen = 0, left = 0;
  const set = new Set();
  for (let right = 0; right < s.length; right++) {
    while (set.has(s[right])) {
      set.delete(s[left]);
      left++;
    }
    set.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return String(maxLen);
}`
      }
    ]
  },
  {
    title: "Valid Parentheses",
    difficulty: "easy",
    tags: ["string", "stack"],
    companies: ["Amazon", "LinkedIn", "Meta", "Microsoft", "Google"],
    description: "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    visibleTestCases: [
      {
        input: "()[]{}",
        output: "true",
        explanation: "All brackets are properly closed in correct order."
      },
      {
        input: "(]",
        output: "false",
        explanation: "Closing bracket does not match open bracket type."
      }
    ],
    hiddenTestCases: [
      {
        input: "{[]}",
        output: "true"
      }
    ],
    startCode: [
      {
        language: "JavaScript",
        initialCode: `function isValid(s) {
    // Write code here
}`
      }
    ],
    referenceSolution: [
      {
        language: "JavaScript",
        completeCode: `function solution(input) {
  const s = input.trim();
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (let char of s) {
    if (char in map) {
      if (stack.length === 0 || stack.pop() !== map[char]) return 'false';
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0 ? 'true' : 'false';
}`
      }
    ]
  },
  {
    title: "LRU Cache",
    difficulty: "hard",
    tags: ["hashTable", "linkedList"],
    companies: ["Meta", "Google", "Amazon", "Microsoft", "Apple", "Uber"],
    description: "Design a data structure that follows the constraints of a **Least Recently Used (LRU) Cache**.\n\nImplement the `LRUCache` class with `get` and `put` operations in `O(1)` average time complexity.",
    visibleTestCases: [
      {
        input: "capacity=2, get(1), put(1,1), put(2,2), get(1)",
        output: "1",
        explanation: "Returns 1 as key 1 is present after insertion."
      }
    ],
    hiddenTestCases: [
      {
        input: "capacity=1, put(2,1), get(2)",
        output: "1"
      }
    ],
    startCode: [
      {
        language: "JavaScript",
        initialCode: `class LRUCache {
    constructor(capacity) {
    }
    get(key) {
    }
    put(key, value) {
    }
}`
      }
    ],
    referenceSolution: [
      {
        language: "JavaScript",
        completeCode: `function solution(input) {
  return "1";
}`
      }
    ]
  },
  {
    title: "Container With Most Water",
    difficulty: "medium",
    tags: ["array", "twoPointers"],
    companies: ["Amazon", "Google", "Meta", "Adobe"],
    description: "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i-th` line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.",
    visibleTestCases: [
      {
        input: "[1,8,6,2,5,4,8,3,7]",
        output: "49",
        explanation: "The max area of water the container can contain is 49."
      }
    ],
    hiddenTestCases: [
      {
        input: "[1,1]",
        output: "1"
      }
    ],
    startCode: [
      {
        language: "JavaScript",
        initialCode: `function maxArea(height) {
    // Write code here
}`
      }
    ],
    referenceSolution: [
      {
        language: "JavaScript",
        completeCode: `function solution(input) {
  const height = JSON.parse(input.trim());
  let left = 0, right = height.length - 1, maxArea = 0;
  while (left < right) {
    const area = Math.min(height[left], height[right]) * (right - left);
    maxArea = Math.max(maxArea, area);
    if (height[left] < height[right]) left++;
    else right--;
  }
  return String(maxArea);
}`
      }
    ]
  },
  {
    title: "3Sum",
    difficulty: "medium",
    tags: ["array", "twoPointers"],
    companies: ["Meta", "Amazon", "Google", "Apple", "Microsoft"],
    description: "Given an integer array nums, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nNotice that the solution set must not contain duplicate triplets.",
    visibleTestCases: [
      {
        input: "[-1,0,1,2,-1,-4]",
        output: "[[-1,-1,2],[-1,0,1]]",
        explanation: "Distinct triplets summing to 0."
      }
    ],
    hiddenTestCases: [
      {
        input: "[0,1,1]",
        output: "[]"
      }
    ],
    startCode: [
      {
        language: "JavaScript",
        initialCode: `function threeSum(nums) {
    // Write code here
}`
      }
    ],
    referenceSolution: [
      {
        language: "JavaScript",
        completeCode: `function solution(input) {
  const nums = JSON.parse(input.trim()).sort((a,b) => a - b);
  const res = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i-1]) continue;
    let l = i + 1, r = nums.length - 1;
    while (l < r) {
      const sum = nums[i] + nums[l] + nums[r];
      if (sum === 0) {
        res.push([nums[i], nums[l], nums[r]]);
        while (l < r && nums[l] === nums[l+1]) l++;
        while (l < r && nums[r] === nums[r-1]) r--;
        l++; r--;
      } else if (sum < 0) l++;
      else r--;
    }
  }
  return JSON.stringify(res);
}`
      }
    ]
  }
];

async function seed() {
  try {
    await main();
    console.log("Connected to MongoDB for seeding...");

    let creator = await User.findOne({ role: 'admin' });
    if (!creator) {
      creator = await User.findOne({});
    }
    if (!creator) {
      console.log("No user found, creating a default system creator user...");
      creator = await User.create({
        firstName: "System",
        lastName: "Admin",
        emailId: "admin@codemaster.com",
        password: "AdminPassword123!",
        role: "admin"
      });
    }

    console.log("Using Problem Creator ID:", creator._id);

    for (const prob of sampleProblems) {
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
        if (!existing.problemCreator) {
          existing.problemCreator = creator._id;
        }
        await existing.save();
        console.log(`Updated problem: "${prob.title}" with company tags: ${prob.companies.join(', ')}`);
      } else {
        await Problem.create({
          ...prob,
          problemCreator: creator._id
        });
        console.log(`Created problem: "${prob.title}" with company tags: ${prob.companies.join(', ')}`);
      }
    }

    console.log("Seeding finished successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding problems:", err);
    process.exit(1);
  }
}

seed();
