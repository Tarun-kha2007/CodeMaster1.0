const { wrapCodeWithDriver, submitBatch, submitToken } = require('../src/utils/problemUtility');

async function testScreenshot() {
  const userCode = `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const diff = target - nums[i];
        if (map.has(diff)) return [map.get(diff), i];
        map.set(nums[i], i);
    }
    return [];
}`;

  const driverCode = wrapCodeWithDriver(userCode, 'javascript');
  console.log("--- Driver Code ---");
  console.log(driverCode);

  const batch = await submitBatch([
    { source_code: driverCode, language_id: 63, stdin: '[2,7,11,15] 9', expected_output: '[0,1]' },
    { source_code: driverCode, language_id: 63, stdin: '[3,2,4] 6', expected_output: '[1,2]' }
  ]);

  const tokens = batch.map(b => b.token);
  const results = await submitToken(tokens);

  console.log("--- Execution Results ---");
  console.log(JSON.stringify(results.map(r => ({
    status: r.status,
    stdout: r.stdout,
    expected: r.expected_output,
    stderr: r.stderr
  })), null, 2));

  process.exit(0);
}

testScreenshot();
