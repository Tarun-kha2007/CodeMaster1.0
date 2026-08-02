const fs = require('fs');
const readline = require('readline');

async function listFilesFromTranscript() {
  const fileStream = fs.createReadStream('C:\\Users\\tarun\\.gemini\\antigravity-ide\\brain\\6f78580d-370f-418e-9c1e-f456b8dfaa12\\.system_generated\\logs\\transcript_full.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const fileActions = {};

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const step = JSON.parse(line);
      if (step.tool_calls) {
        for (const tc of step.tool_calls) {
          if (tc.name === 'write_to_file' || tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content') {
            const target = tc.args.TargetFile;
            if (target) {
              fileActions[target] = (fileActions[target] || 0) + 1;
            }
          }
        }
      }
    } catch (e) {
      // Ignore
    }
  }

  console.log("Files written/modified in transcript:", JSON.stringify(fileActions, null, 2));
}

listFilesFromTranscript();
