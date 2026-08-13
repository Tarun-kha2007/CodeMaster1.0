const axios = require('axios');

const getLanguageById = (lang) => {
  const language = {
    "c++": 54,
    "cpp": 54,
    "java": 62,
    "javascript": 63,
    "js": 63
  };
  return language[lang.toLowerCase()] || 63;
};

const wrapCodeWithDriver = (code, lang) => {
  const language = lang.toLowerCase();

  // ── JavaScript Driver Wrapper ──
  if (language === 'javascript' || language === 'js') {
    if (!code.includes('require("fs")') && !code.includes("require('fs')")) {
      const driver = `
\ntry {
  const fs = require('fs');
  const rawInput = fs.readFileSync(0, 'utf-8');
  if (rawInput && rawInput.trim().length > 0) {
    function parseInput(raw) {
      raw = raw.trim();
      const args = [];
      let current = '';
      let inString = false;
      let bracketDepth = 0;
      for (let i = 0; i < raw.length; i++) {
        const ch = raw[i];
        if (ch === '"' && (i === 0 || raw[i-1] !== '\\\\')) {
          inString = !inString;
          current += ch;
        } else if (!inString && (ch === '[' || ch === '{')) {
          bracketDepth++;
          current += ch;
        } else if (!inString && (ch === ']' || ch === '}')) {
          bracketDepth--;
          current += ch;
        } else if (!inString && bracketDepth === 0 && (ch === ' ' || ch === '\\n' || ch === ',')) {
          if (current.trim().length > 0) {
            const val = current.trim();
            try { args.push(JSON.parse(val)); } catch(e) { args.push(val); }
            current = '';
          }
        } else {
          current += ch;
        }
      }
      if (current.trim().length > 0) {
        const val = current.trim();
        try { args.push(JSON.parse(val)); } catch(e) { args.push(val); }
      }
      return args;
    }

    const parsedArgs = parseInput(rawInput);

    const knownFuncs = [
      'twoSum', 'containsDuplicate', 'isAnagram', 'groupAnagrams',
      'topKFrequent', 'productExceptSelf', 'longestConsecutive',
      'isPalindrome', 'maxProfit', 'lengthOfLongestSubstring',
      'isValid', 'maxSubArray', 'climbStairs', 'missingNumber',
      'reverseBits', 'hammingWeight', 'trap', 'threeSum', 'maxArea',
      'solution', 'solve'
    ];

    let fn = null;
    for (const name of knownFuncs) {
      try {
        if (eval("typeof " + name) === 'function') {
          fn = eval(name);
          break;
        }
      } catch(e) {}
    }

    if (fn) {
      const res = fn(...parsedArgs);
      if (res !== undefined) {
        console.log(typeof res === 'object' ? JSON.stringify(res) : res);
      }
    }
  }
} catch(e) {
  // Pass through
}
`;
      return code + driver;
    }
  }

  // ── C++ Driver Wrapper ──
  if (language === 'c++' || language === 'cpp') {
    if (!code.includes('int main(') && !code.includes('int main ()')) {
      const driver = `
\n#ifndef MAIN_DRIVER
#define MAIN_DRIVER
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
using namespace std;

static vector<int> parseVectorInt(const string& s) {
    vector<int> res;
    string clean = "";
    for (char c : s) {
        if (c == '[' || c == ']' || c == ',' || c == '"') clean += ' ';
        else clean += c;
    }
    stringstream ss(clean);
    int num;
    while (ss >> num) res.push_back(num);
    return res;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string s1, s2;
    if (cin >> s1) {
        vector<int> nums = parseVectorInt(s1);
        int target = 0;
        if (cin >> s2) {
            try { target = stoi(s2); } catch(...) {}
        }
        Solution sol;
        vector<int> ans = sol.twoSum(nums, target);
        cout << "[";
        for (size_t i = 0; i < ans.size(); i++) {
            cout << ans[i] << (i + 1 < ans.size() ? "," : "");
        }
        cout << "]" << endl;
    }
    return 0;
}
#endif
`;
      return code + driver;
    }
  }

  // ── Java Driver Wrapper ──
  if (language === 'java') {
    if (!code.includes('public static void main(') && !code.includes('public static void main (')) {
      // If code doesn't have main method, wrap in Driver
      const driver = `
\nclass MainDriver {
    public static void main(String[] args) {
        java.util.Scanner sc = new java.util.Scanner(System.in);
        if (sc.hasNext()) {
            String line1 = sc.next();
            String line2 = sc.hasNext() ? sc.next() : "0";
            line1 = line1.replaceAll("[\\\\[\\\\]\\\\\\"\\\\,]", " ").trim();
            String[] parts = line1.split("\\\\s+");
            int[] nums = new int[parts.length];
            for (int i = 0; i < parts.length; i++) {
                try { nums[i] = Integer.parseInt(parts[i]); } catch(Exception e) {}
            }
            int target = 0;
            try { target = Integer.parseInt(line2.trim()); } catch(Exception e) {}
            Solution sol = new Solution();
            int[] ans = sol.twoSum(nums, target);
            System.out.print("[");
            for (int i = 0; i < ans.length; i++) {
                System.out.print(ans[i] + (i + 1 < ans.length ? "," : ""));
            }
            System.out.println("]");
        }
    }
}
`;
      return code + driver;
    }
  }

  return code;
};

const submitBatch = async (submissions) => {
  if (!process.env.RAPIDAPI_KEY || process.env.RAPIDAPI_KEY === 'your_rapidapi_judge0_key_here') {
    throw new Error("Missing RAPIDAPI_KEY. Please get a free API key from https://rapidapi.com/judge0-official/api/judge0-ce and add it to backend/.env");
  }

  const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
      base64_encoded: 'false'
    },
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
      'Content-Type': 'application/json'
    },
    data: {
      submissions
    }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error("submitBatch error:", error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || error.message || "Failed to submit batch to judge");
  }
};

const waiting = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const submitToken = async (resultToken) => {
  if (!Array.isArray(resultToken) || resultToken.length === 0) {
    return [];
  }

  const options = {
    method: 'GET',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
      tokens: resultToken.join(","),
      base64_encoded: 'false',
      fields: '*'
    },
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY || '',
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
    }
  };

  const maxAttempts = 15;
  let attempts = 0;

  while (attempts < maxAttempts) {
    attempts++;
    try {
      const response = await axios.request(options);
      const result = response.data;

      if (result && Array.isArray(result.submissions)) {
        const isResultObtained = result.submissions.every(r => r.status_id > 2);
        if (isResultObtained) {
          return result.submissions;
        }
      }
    } catch (error) {
      console.error("submitToken error:", error?.response?.data || error.message);
    }
    await waiting(1000);
  }

  throw new Error("Execution timed out waiting for judge results");
};

module.exports = { getLanguageById, wrapCodeWithDriver, submitBatch, submitToken };
