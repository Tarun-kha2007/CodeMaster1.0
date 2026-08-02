const { wrapCodeWithDriver, submitBatch, submitToken } = require('../src/utils/problemUtility');

async function testCpp() {
  const cppCode = `
#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> mp;
        for (int i = 0; i < nums.size(); i++) {
            int diff = target - nums[i];
            if (mp.count(diff)) return {mp[diff], i};
            mp[nums[i]] = i;
        }
        return {};
    }
};
`;

  const driver = wrapCodeWithDriver(cppCode, 'cpp');
  console.log("--- C++ Wrapped Code ---");
  console.log(driver);

  try {
    const batch = await submitBatch([
      { source_code: driver, language_id: 54, stdin: '[2,7,11,15] 9', expected_output: '[0,1]' }
    ]);
    const tokens = batch.map(b => b.token);
    const results = await submitToken(tokens);
    console.log("--- Results ---", JSON.stringify(results, null, 2));
  } catch(e) {
    console.error("C++ test error:", e);
  }
  process.exit(0);
}

testCpp();
