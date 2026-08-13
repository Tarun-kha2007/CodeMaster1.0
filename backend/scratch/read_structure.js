const fs = require('fs');
const readline = require('readline');

async function readStructure() {
  const fileStream = fs.createReadStream('C:\\Users\\tarun\\.gemini\\antigravity-ide\\brain\\6f78580d-370f-418e-9c1e-f456b8dfaa12\\.system_generated\\logs\\transcript_full.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const step = JSON.parse(line);
      // Let's find a step where write_to_file or a response to view_file occurs
      if (step.tool_calls) {
        for (const tc of step.tool_calls) {
          if (tc.name === 'replace_file_content' && tc.args.TargetFile && tc.args.TargetFile.includes('ProblemPage.jsx')) {
            console.log("Found replace_file_content call:", JSON.stringify(tc, null, 2).substring(0, 1000));
          }
        }
      }
      if (step.content && step.content.includes('File Path:') && step.content.includes('ProblemPage.jsx')) {
        console.log("Found view_file output in content:", step.content.substring(0, 500));
      }
    } catch (e) {
      // Ignore
    }
  }
}

readStructure();
