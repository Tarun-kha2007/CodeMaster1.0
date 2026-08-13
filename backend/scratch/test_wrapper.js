const userCode = `
function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const diff = target - nums[i];
        if (map.has(diff)) return [map.get(diff), i];
        map.set(nums[i], i);
    }
    return [];
}
`;

const stdinInput = `[2,7,11,15]\n9`;

const driver = `
try {
    const fs = require('fs');
    const input = \`${stdinInput}\`.trim().split('\\n').filter(Boolean);
    const parsedArgs = input.map(arg => {
        try { return JSON.parse(arg); } catch(e) { return arg.trim(); }
    });
    
    // Find exported or globally defined function
    const fnNames = ['twoSum', 'containsDuplicate', 'isAnagram', 'groupAnagrams', 'topKFrequent', 'productExceptSelf', 'longestConsecutive', 'isPalindrome', 'maxProfit', 'lengthOfLongestSubstring', 'isValid', 'maxSubArray', 'climbStairs', 'missingNumber', 'reverseBits', 'hammingWeight', 'trap', 'threeSum', 'maxArea'];
    let fn = null;
    for (const name of fnNames) {
        if (typeof global[name] === 'function') { fn = global[name]; break; }
        try { if (eval(\`typeof \${name}\`) === 'function') { fn = eval(name); break; } } catch(e){}
    }
    if (fn) {
        const result = fn(...parsedArgs);
        console.log(typeof result === 'object' ? JSON.stringify(result) : result);
    }
} catch(e) {
    console.error('Driver execution error:', e);
}
`;

eval(userCode + driver);
