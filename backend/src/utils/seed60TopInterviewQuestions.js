const mongoose = require('mongoose');
const main = require('../config/db');
const Problem = require('../models/problem');
const User = require('../models/user');

const interviewProblems = [
  {
    title: "Merge Sorted Array",
    description: "You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order, and two integers `m` and `n`, representing the number of elements in `nums1` and `nums2` respectively.\n\nMerge `nums1` and `nums2` into a single array sorted in non-decreasing order.",
    difficulty: "easy",
    tags: ["Array", "Two Pointers", "Sorting"],
    companies: ["Amazon", "Microsoft", "Meta"],
    visibleTestCases: [
      { input: "[1,2,3,0,0,0]\n3\n[2,5,6]\n3", output: "[1,2,2,3,5,6]", explanation: "The arrays we are merging are [1,2,3] and [2,5,6]. The result of the merge is [1,2,2,3,5,6]." },
      { input: "[1]\n1\n[]\n0", output: "[1]", explanation: "The arrays we are merging are [1] and []. The result of the merge is [1]." }
    ],
    hiddenTestCases: [
      { input: "[0]\n0\n[1]\n1", output: "[1]" },
      { input: "[4,5,6,0,0,0]\n3\n[1,2,3]\n3", output: "[1,2,3,4,5,6]" }
    ],
    startCode: [
      { language: "JavaScript", initialCode: "function merge(nums1, m, nums2, n) {\n  // Write your code here\n}" },
      { language: "C++", initialCode: "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {\n        \n    }\n};" },
      { language: "Java", initialCode: "public class Solution {\n    public void merge(int[] nums1, int m, int[] nums2, int n) {\n        \n    }\n}" }
    ],
    referenceSolution: [
      { language: "JavaScript", completeCode: "function merge(nums1, m, nums2, n) {\n    let p1 = m - 1, p2 = n - 1, p = m + n - 1;\n    while (p1 >= 0 && p2 >= 0) {\n        if (nums1[p1] > nums2[p2]) {\n            nums1[p] = nums1[p1]; p1--;\n        } else {\n            nums1[p] = nums2[p2]; p2--;\n        }\n        p--;\n    }\n    while (p2 >= 0) { nums1[p] = nums2[p2]; p2--; p--; }\n    return nums1;\n}" },
      { language: "C++", completeCode: "#include <vector>\nusing namespace std;\nclass Solution {\npublic:\n    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {\n        int p1 = m - 1, p2 = n - 1, p = m + n - 1;\n        while (p1 >= 0 && p2 >= 0) {\n            if (nums1[p1] > nums2[p2]) nums1[p--] = nums1[p1--];\n            else nums1[p--] = nums2[p2--];\n        }\n        while (p2 >= 0) nums1[p--] = nums2[p2--];\n    }\n};" },
      { language: "Java", completeCode: "public class Solution {\n    public void merge(int[] nums1, int m, int[] nums2, int n) {\n        int p1 = m - 1, p2 = n - 1, p = m + n - 1;\n        while (p1 >= 0 && p2 >= 0) {\n            if (nums1[p1] > nums2[p2]) nums1[p--] = nums1[p1--];\n            else nums1[p--] = nums2[p2--];\n        }\n        while (p2 >= 0) nums1[p--] = nums2[p2--];\n    }\n}" }
    ]
  },
  {
    title: "Remove Element",
    description: "Given an integer array `nums` and an integer `val`, remove all occurrences of `val` in `nums` in-place. The order of the elements may be changed. Return the number of elements in `nums` which are not equal to `val`.",
    difficulty: "easy",
    tags: ["Array", "Two Pointers"],
    companies: ["Google", "Amazon", "Microsoft"],
    visibleTestCases: [
      { input: "[3,2,2,3]\n3", output: "2", explanation: "Your function should return k = 2, with the first two elements of nums being 2." },
      { input: "[0,1,2,2,3,0,4,2]\n2", output: "5", explanation: "Your function should return k = 5, with the first five elements of nums containing 0, 1, 3, 0, and 4." }
    ],
    hiddenTestCases: [
      { input: "[1]\n1", output: "0" },
      { input: "[4,5]\n2", output: "2" }
    ],
    startCode: [
      { language: "JavaScript", initialCode: "function removeElement(nums, val) {\n  // Write your code here\n}" },
      { language: "C++", initialCode: "#include <vector>\nusing namespace std;\nclass Solution {\npublic:\n    int removeElement(vector<int>& nums, int val) {\n        \n    }\n};" },
      { language: "Java", initialCode: "public class Solution {\n    public int removeElement(int[] nums, int val) {\n        \n    }\n}" }
    ],
    referenceSolution: [
      { language: "JavaScript", completeCode: "function removeElement(nums, val) {\n    let k = 0;\n    for (let i = 0; i < nums.length; i++) {\n        if (nums[i] !== val) {\n            nums[k] = nums[i]; k++;\n        }\n    }\n    return k;\n}" },
      { language: "C++", completeCode: "#include <vector>\nusing namespace std;\nclass Solution {\npublic:\n    int removeElement(vector<int>& nums, int val) {\n        int k = 0;\n        for (int i = 0; i < nums.size(); i++) {\n            if (nums[i] != val) nums[k++] = nums[i];\n        }\n        return k;\n    }\n};" },
      { language: "Java", completeCode: "public class Solution {\n    public int removeElement(int[] nums, int val) {\n        int k = 0;\n        for (int i = 0; i < nums.length; i++) {\n            if (nums[i] != val) nums[k++] = nums[i];\n        }\n        return k;\n    }\n}" }
    ]
  },
  {
    title: "Remove Duplicates from Sorted Array",
    description: "Given an integer array `nums` sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. Return the number of unique elements.",
    difficulty: "easy",
    tags: ["Array", "Two Pointers"],
    companies: ["Meta", "Microsoft", "Google"],
    visibleTestCases: [
      { input: "[1,1,2]", output: "2", explanation: "Your function should return k = 2, with the first two elements of nums being 1 and 2 respectively." },
      { input: "[0,0,1,1,1,2,2,3,3,4]", output: "5", explanation: "Your function should return k = 5, with the first five elements being 0, 1, 2, 3, and 4." }
    ],
    hiddenTestCases: [
      { input: "[1,1,1,1]", output: "1" }
    ],
    startCode: [
      { language: "JavaScript", initialCode: "function removeDuplicates(nums) {\n  // Write your code here\n}" },
      { language: "C++", initialCode: "#include <vector>\nusing namespace std;\nclass Solution {\npublic:\n    int removeDuplicates(vector<int>& nums) {\n        \n    }\n};" },
      { language: "Java", initialCode: "public class Solution {\n    public int removeDuplicates(int[] nums) {\n        \n    }\n}" }
    ],
    referenceSolution: [
      { language: "JavaScript", completeCode: "function removeDuplicates(nums) {\n    if (nums.length === 0) return 0;\n    let i = 0;\n    for (let j = 1; j < nums.length; j++) {\n        if (nums[j] !== nums[i]) {\n            i++; nums[i] = nums[j];\n        }\n    }\n    return i + 1;\n}" },
      { language: "C++", completeCode: "#include <vector>\nusing namespace std;\nclass Solution {\npublic:\n    int removeDuplicates(vector<int>& nums) {\n        if (nums.empty()) return 0;\n        int i = 0;\n        for (int j = 1; j < nums.size(); j++) {\n            if (nums[j] != nums[i]) {\n                i++; nums[i] = nums[j];\n            }\n        }\n        return i + 1;\n    }\n};" },
      { language: "Java", completeCode: "public class Solution {\n    public int removeDuplicates(int[] nums) {\n        if (nums.length == 0) return 0;\n        int i = 0;\n        for (int j = 1; j < nums.length; j++) {\n            if (nums[j] != nums[i]) {\n                i++; nums[i] = nums[j];\n            }\n        }\n        return i + 1;\n    }\n}" }
    ]
  },
  {
    title: "Rotate Array",
    description: "Given an integer array `nums`, rotate the array to the right by `k` steps, where `k` is non-negative.",
    difficulty: "medium",
    tags: ["Array", "Two Pointers"],
    companies: ["Amazon", "Microsoft", "Apple"],
    visibleTestCases: [
      { input: "[1,2,3,4,5,6,7]\n3", output: "[5,6,7,1,2,3,4]", explanation: "rotate 1 steps right: [7,1,2,3,4,5,6]\nrotate 2 steps right: [6,7,1,2,3,4,5]\nrotate 3 steps right: [5,6,7,1,2,3,4]" },
      { input: "[-1,-100,3,99]\n2", output: "[3,99,-1,-100]", explanation: "rotate 1 steps right: [99,-1,-100,3]\nrotate 2 steps right: [3,99,-1,-100]" }
    ],
    hiddenTestCases: [
      { input: "[1,2]\n3", output: "[2,1]" }
    ],
    startCode: [
      { language: "JavaScript", initialCode: "function rotate(nums, k) {\n  // Write your code here\n}" },
      { language: "C++", initialCode: "#include <vector>\nusing namespace std;\nclass Solution {\npublic:\n    void rotate(vector<int>& nums, int k) {\n        \n    }\n};" },
      { language: "Java", initialCode: "public class Solution {\n    public void rotate(int[] nums, int k) {\n        \n    }\n}" }
    ],
    referenceSolution: [
      { language: "JavaScript", completeCode: "function rotate(nums, k) {\n    k %= nums.length;\n    const reverse = (l, r) => {\n        while (l < r) {\n            [nums[l], nums[r]] = [nums[r], nums[l]];\n            l++; r--;\n        }\n    };\n    reverse(0, nums.length - 1);\n    reverse(0, k - 1);\n    reverse(k, nums.length - 1);\n    return nums;\n}" },
      { language: "C++", completeCode: "#include <vector>\n#include <algorithm>\nusing namespace std;\nclass Solution {\npublic:\n    void rotate(vector<int>& nums, int k) {\n        k %= nums.size();\n        reverse(nums.begin(), nums.end());\n        reverse(nums.begin(), nums.begin() + k);\n        reverse(nums.begin() + k, nums.end());\n    }\n};" },
      { language: "Java", completeCode: "public class Solution {\n    public void rotate(int[] nums, int k) {\n        k %= nums.length;\n        reverse(nums, 0, nums.length - 1);\n        reverse(nums, 0, k - 1);\n        reverse(nums, k, nums.length - 1);\n    }\n    private void reverse(int[] nums, int start, int end) {\n        while (start < end) {\n            int temp = nums[start];\n            nums[start] = nums[end];\n            nums[end] = temp;\n            start++; end--;\n        }\n    }\n}" }
    ]
  },
  {
    title: "Length of Last Word",
    description: "Given a string `s` consisting of words and spaces, return the length of the last word in the string.",
    difficulty: "easy",
    tags: ["String"],
    companies: ["Amazon", "Apple", "Google"],
    visibleTestCases: [
      { input: "\"Hello World\"", output: "5", explanation: "The last word is 'World' with length 5." },
      { input: "\"   fly me   to   the moon  \"", output: "4", explanation: "The last word is 'moon' with length 4." }
    ],
    hiddenTestCases: [
      { input: "\"luffy is still joyboy\"", output: "6" }
    ],
    startCode: [
      { language: "JavaScript", initialCode: "function lengthOfLastWord(s) {\n  // Write your code here\n}" },
      { language: "C++", initialCode: "#include <string>\nusing namespace std;\nclass Solution {\npublic:\n    int lengthOfLastWord(string s) {\n        \n    }\n};" },
      { language: "Java", initialCode: "public class Solution {\n    public int lengthOfLastWord(String s) {\n        \n    }\n}" }
    ],
    referenceSolution: [
      { language: "JavaScript", completeCode: "function lengthOfLastWord(s) {\n    const words = s.trim().split(/\\s+/);\n    return words[words.length - 1].length;\n}" },
      { language: "C++", completeCode: "#include <string>\nusing namespace std;\nclass Solution {\npublic:\n    int lengthOfLastWord(string s) {\n        int len = 0, i = s.length() - 1;\n        while (i >= 0 && s[i] == ' ') i--;\n        while (i >= 0 && s[i] != ' ') { len++; i--; }\n        return len;\n    }\n};" },
      { language: "Java", completeCode: "public class Solution {\n    public int lengthOfLastWord(String s) {\n        s = s.trim();\n        return s.length() - s.lastIndexOf(' ') - 1;\n    }\n}" }
    ]
  },
  {
    title: "Longest Common Prefix",
    description: "Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string `\"\"`.",
    difficulty: "easy",
    tags: ["String", "Trie"],
    companies: ["Amazon", "Google", "Microsoft"],
    visibleTestCases: [
      { input: "[\"flower\",\"flow\",\"flight\"]", output: "\"fl\"", explanation: "The common prefix amongst flower, flow, and flight is 'fl'." },
      { input: "[\"dog\",\"racecar\",\"car\"]", output: "\"\"", explanation: "There is no common prefix among the input strings." }
    ],
    hiddenTestCases: [
      { input: "[\"interspecies\",\"interstellar\",\"interstate\"]", output: "\"inters\"" }
    ],
    startCode: [
      { language: "JavaScript", initialCode: "function longestCommonPrefix(strs) {\n  // Write your code here\n}" },
      { language: "C++", initialCode: "#include <vector>\n#include <string>\nusing namespace std;\nclass Solution {\npublic:\n    string longestCommonPrefix(vector<string>& strs) {\n        \n    }\n};" },
      { language: "Java", initialCode: "public class Solution {\n    public String longestCommonPrefix(String[] strs) {\n        \n    }\n}" }
    ],
    referenceSolution: [
      { language: "JavaScript", completeCode: "function longestCommonPrefix(strs) {\n    if (!strs.length) return '';\n    let prefix = strs[0];\n    for (let i = 1; i < strs.length; i++) {\n        while (strs[i].indexOf(prefix) !== 0) {\n            prefix = prefix.substring(0, prefix.length - 1);\n            if (!prefix) return '';\n        }\n    }\n    return prefix;\n}" },
      { language: "C++", completeCode: "#include <vector>\n#include <string>\nusing namespace std;\nclass Solution {\npublic:\n    string longestCommonPrefix(vector<string>& strs) {\n        if (strs.empty()) return \"\";\n        string prefix = strs[0];\n        for (int i = 1; i < strs.size(); i++) {\n            while (strs[i].find(prefix) != 0) {\n                prefix = prefix.substr(0, prefix.length() - 1);\n                if (prefix.empty()) return \"\";\n            }\n        }\n        return prefix;\n    }\n};" },
      { language: "Java", completeCode: "public class Solution {\n    public String longestCommonPrefix(String[] strs) {\n        if (strs.length == 0) return \"\";\n        String prefix = strs[0];\n        for (int i = 1; i < strs.length; i++) {\n            while (strs[i].indexOf(prefix) != 0) {\n                prefix = prefix.substring(0, prefix.length() - 1);\n                if (prefix.isEmpty()) return \"\";\n            }\n        }\n        return prefix;\n    }\n}" }
    ]
  },
  {
    title: "Reverse Words in a String",
    description: "Given an input string `s`, reverse the order of the words. A word is defined as a sequence of non-space characters. The words in `s` will be separated by at least one space.",
    difficulty: "medium",
    tags: ["String", "Two Pointers"],
    companies: ["Microsoft", "Amazon", "Apple"],
    visibleTestCases: [
      { input: "\"the sky is blue\"", output: "\"blue is sky the\"", explanation: "Reversing words gives 'blue is sky the'." },
      { input: "\"  hello world  \"", output: "\"world hello\"", explanation: "Reversed string should not contain leading or trailing spaces." }
    ],
    hiddenTestCases: [
      { input: "\"a good   example\"", output: "\"example good a\"" }
    ],
    startCode: [
      { language: "JavaScript", initialCode: "function reverseWords(s) {\n  // Write your code here\n}" },
      { language: "C++", initialCode: "#include <string>\nusing namespace std;\nclass Solution {\npublic:\n    string reverseWords(string s) {\n        \n    }\n};" },
      { language: "Java", initialCode: "public class Solution {\n    public String reverseWords(String s) {\n        \n    }\n}" }
    ],
    referenceSolution: [
      { language: "JavaScript", completeCode: "function reverseWords(s) {\n    return s.trim().split(/\\s+/).reverse().join(' ');\n}" },
      { language: "C++", completeCode: "#include <string>\n#include <sstream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nclass Solution {\npublic:\n    string reverseWords(string s) {\n        stringstream ss(s);\n        string word, res = \"\";\n        vector<string> words;\n        while (ss >> word) words.push_back(word);\n        reverse(words.begin(), words.end());\n        for (int i = 0; i < words.size(); i++) {\n            res += words[i] + (i + 1 < words.size() ? \" \" : \"\");\n        }\n        return res;\n    }\n};" },
      { language: "Java", completeCode: "public class Solution {\n    public String reverseWords(String s) {\n        String[] parts = s.trim().split(\"\\\\s+\");\n        StringBuilder sb = new StringBuilder();\n        for (int i = parts.length - 1; i >= 0; i--) {\n            sb.append(parts[i]).append(i > 0 ? \" \" : \"\");\n        }\n        return sb.toString();\n    }\n}" }
    ]
  },
  {
    title: "Is Subsequence",
    description: "Given two strings `s` and `t`, return `true` if `s` is a subsequence of `t`, or `false` otherwise.",
    difficulty: "easy",
    tags: ["Two Pointers", "String"],
    companies: ["Google", "Meta", "Amazon"],
    visibleTestCases: [
      { input: "\"abc\"\n\"ahbgdc\"", output: "true", explanation: "'abc' appears inside 'ahbgdc' in order." },
      { input: "\"axc\"\n\"ahbgdc\"", output: "false", explanation: "'axc' is not a subsequence of 'ahbgdc'." }
    ],
    hiddenTestCases: [
      { input: "\"\"\n\"ahbgdc\"", output: "true" }
    ],
    startCode: [
      { language: "JavaScript", initialCode: "function isSubsequence(s, t) {\n  // Write your code here\n}" },
      { language: "C++", initialCode: "#include <string>\nusing namespace std;\nclass Solution {\npublic:\n    bool isSubsequence(string s, string t) {\n        \n    }\n};" },
      { language: "Java", initialCode: "public class Solution {\n    public boolean isSubsequence(String s, String t) {\n        \n    }\n}" }
    ],
    referenceSolution: [
      { language: "JavaScript", completeCode: "function isSubsequence(s, t) {\n    let i = 0, j = 0;\n    while (i < s.length && j < t.length) {\n        if (s[i] === t[j]) i++;\n        j++;\n    }\n    return i === s.length;\n}" },
      { language: "C++", completeCode: "#include <string>\nusing namespace std;\nclass Solution {\npublic:\n    bool isSubsequence(string s, string t) {\n        int i = 0, j = 0;\n        while (i < s.length() && j < t.length()) {\n            if (s[i] == t[j]) i++;\n            j++;\n        }\n        return i == s.length();\n    }\n};" },
      { language: "Java", completeCode: "public class Solution {\n    public boolean isSubsequence(String s, String t) {\n        int i = 0, j = 0;\n        while (i < s.length() && j < t.length()) {\n            if (s.charAt(i) == t.charAt(j)) i++;\n            j++;\n        }\n        return i == s.length();\n    }\n}" }
    ]
  },
  {
    title: "Search Insert Position",
    description: "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order. You must write an algorithm with `O(log n)` runtime complexity.",
    difficulty: "easy",
    tags: ["Array", "Binary Search"],
    companies: ["Google", "Amazon", "Microsoft"],
    visibleTestCases: [
      { input: "[1,3,5,6]\n5", output: "2", explanation: "Target 5 is found at index 2." },
      { input: "[1,3,5,6]\n2", output: "1", explanation: "Target 2 should be inserted at index 1." }
    ],
    hiddenTestCases: [
      { input: "[1,3,5,6]\n7", output: "4" }
    ],
    startCode: [
      { language: "JavaScript", initialCode: "function searchInsert(nums, target) {\n  // Write your code here\n}" },
      { language: "C++", initialCode: "#include <vector>\nusing namespace std;\nclass Solution {\npublic:\n    int searchInsert(vector<int>& nums, int target) {\n        \n    }\n};" },
      { language: "Java", initialCode: "public class Solution {\n    public int searchInsert(int[] nums, int target) {\n        \n    }\n}" }
    ],
    referenceSolution: [
      { language: "JavaScript", completeCode: "function searchInsert(nums, target) {\n    let l = 0, r = nums.length - 1;\n    while (l <= r) {\n        let mid = Math.floor((l + r) / 2);\n        if (nums[mid] === target) return mid;\n        else if (nums[mid] < target) l = mid + 1;\n        else r = mid - 1;\n    }\n    return l;\n}" },
      { language: "C++", completeCode: "#include <vector>\nusing namespace std;\nclass Solution {\npublic:\n    int searchInsert(vector<int>& nums, int target) {\n        int l = 0, r = nums.size() - 1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] == target) return mid;\n            else if (nums[mid] < target) l = mid + 1;\n            else r = mid - 1;\n        }\n        return l;\n    }\n};" },
      { language: "Java", completeCode: "public class Solution {\n    public int searchInsert(int[] nums, int target) {\n        int l = 0, r = nums.length - 1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] == target) return mid;\n            else if (nums[mid] < target) l = mid + 1;\n            else r = mid - 1;\n        }\n        return l;\n    }\n}" }
    ]
  },
  {
    title: "Find Peak Element",
    description: "A peak element is an element that is strictly greater than its neighbors. Given a 0-indexed integer array `nums`, find a peak element, and return its index. If the array contains multiple peaks, return the index to any of the peaks. You must write an algorithm that runs in `O(log n)` time.",
    difficulty: "medium",
    tags: ["Array", "Binary Search"],
    companies: ["Google", "Meta", "Amazon"],
    visibleTestCases: [
      { input: "[1,2,3,1]", output: "2", explanation: "Index 2 is a peak element and your function should return index 2." },
      { input: "[1,2,1,3,5,6,4]", output: "5", explanation: "Your function can return either index 1 where element is 2, or index 5 where element is 6." }
    ],
    hiddenTestCases: [
      { input: "[1]", output: "0" }
    ],
    startCode: [
      { language: "JavaScript", initialCode: "function findPeakElement(nums) {\n  // Write your code here\n}" },
      { language: "C++", initialCode: "#include <vector>\nusing namespace std;\nclass Solution {\npublic:\n    int findPeakElement(vector<int>& nums) {\n        \n    }\n};" },
      { language: "Java", initialCode: "public class Solution {\n    public int findPeakElement(int[] nums) {\n        \n    }\n}" }
    ],
    referenceSolution: [
      { language: "JavaScript", completeCode: "function findPeakElement(nums) {\n    let l = 0, r = nums.length - 1;\n    while (l < r) {\n        let mid = Math.floor((l + r) / 2);\n        if (nums[mid] > nums[mid + 1]) r = mid;\n        else l = mid + 1;\n    }\n    return l;\n}" },
      { language: "C++", completeCode: "#include <vector>\nusing namespace std;\nclass Solution {\npublic:\n    int findPeakElement(vector<int>& nums) {\n        int l = 0, r = nums.size() - 1;\n        while (l < r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] > nums[mid + 1]) r = mid;\n            else l = mid + 1;\n        }\n        return l;\n    }\n};" },
      { language: "Java", completeCode: "public class Solution {\n    public int findPeakElement(int[] nums) {\n        int l = 0, r = nums.length - 1;\n        while (l < r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] > nums[mid + 1]) r = mid;\n            else l = mid + 1;\n        }\n        return l;\n    }\n}" }
    ]
  },
  {
    title: "Single Number",
    description: "Given a non-empty array of integers `nums`, every element appears twice except for one. Find that single one. You must implement a solution with a linear runtime complexity and use only constant extra space.",
    difficulty: "easy",
    tags: ["Array", "Bit Manipulation"],
    companies: ["Amazon", "Google", "Meta"],
    visibleTestCases: [
      { input: "[2,2,1]", output: "1", explanation: "1 is the single element that appears once." },
      { input: "[4,1,2,1,2]", output: "4", explanation: "4 is the single element that appears once." }
    ],
    hiddenTestCases: [
      { input: "[1]", output: "1" }
    ],
    startCode: [
      { language: "JavaScript", initialCode: "function singleNumber(nums) {\n  // Write your code here\n}" },
      { language: "C++", initialCode: "#include <vector>\nusing namespace std;\nclass Solution {\npublic:\n    int singleNumber(vector<int>& nums) {\n        \n    }\n};" },
      { language: "Java", initialCode: "public class Solution {\n    public int singleNumber(int[] nums) {\n        \n    }\n}" }
    ],
    referenceSolution: [
      { language: "JavaScript", completeCode: "function singleNumber(nums) {\n    let res = 0;\n    for (let n of nums) res ^= n;\n    return res;\n}" },
      { language: "C++", completeCode: "#include <vector>\nusing namespace std;\nclass Solution {\npublic:\n    int singleNumber(vector<int>& nums) {\n        int res = 0;\n        for (int n : nums) res ^= n;\n        return res;\n    }\n};" },
      { language: "Java", completeCode: "public class Solution {\n    public int singleNumber(int[] nums) {\n        int res = 0;\n        for (int n : nums) res ^= n;\n        return res;\n    }\n}" }
    ]
  }
];

async function seedTopInterviewQuestions() {
  try {
    await main();
    console.log("Connected to MongoDB CodeMaster database...");

    let admin = await User.findOne({ role: 'admin' });
    if (!admin) admin = await User.findOne({});
    const creatorId = admin ? admin._id : new mongoose.Types.ObjectId();

    let addedCount = 0;
    let updatedCount = 0;

    for (const prob of interviewProblems) {
      prob.problemCreator = creatorId;

      const existing = await Problem.findOne({ title: prob.title });
      if (existing) {
        existing.description = prob.description;
        existing.difficulty = prob.difficulty;
        existing.tags = prob.tags;
        existing.companies = prob.companies;
        existing.visibleTestCases = prob.visibleTestCases;
        existing.hiddenTestCases = prob.hiddenTestCases;
        existing.startCode = prob.startCode;
        existing.referenceSolution = prob.referenceSolution;
        existing.problemCreator = creatorId;
        await existing.save();
        updatedCount++;
      } else {
        await Problem.create(prob);
        addedCount++;
      }
    }

    const totalInDb = await Problem.countDocuments();
    console.log(`🎉 SUCCESS! Added ${addedCount} new problems, updated ${updatedCount} existing problems. Total problems in database: ${totalInDb}`);
    process.exit(0);
  } catch (err) {
    console.error("Error seeding interview problems:", err);
    process.exit(1);
  }
}

seedTopInterviewQuestions();
