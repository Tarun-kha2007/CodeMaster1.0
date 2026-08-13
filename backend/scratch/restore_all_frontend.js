const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function restoreFiles() {
  const fileStream = fs.createReadStream('C:\\Users\\tarun\\.gemini\\antigravity-ide\\brain\\6f78580d-370f-418e-9c1e-f456b8dfaa12\\.system_generated\\logs\\transcript_full.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const fileContents = {};

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const step = JSON.parse(line);

      // 1. Check tool calls (writing to files)
      if (step.tool_calls) {
        for (const tc of step.tool_calls) {
          if (tc.name === 'write_to_file') {
            const target = tc.args.TargetFile;
            const content = tc.args.CodeContent;
            if (target && content && target.includes('frontend')) {
              fileContents[target] = content;
            }
          }
          if (tc.name === 'replace_file_content') {
            const target = tc.args.TargetFile;
            const content = tc.args.ReplacementContent;
            // Note: replace_file_content only has replacement content, not the whole file,
            // but we might find the full viewed content in tool responses.
          }
        }
      }

      // 2. Check tool response contents (which contain read files!)
      if (step.type === 'PLANNER_RESPONSE' && step.tool_calls) {
        // Wait, the response to a tool call is in the next step or in the same step depending on format.
      }
      
      // Let's also look for view_file output in the step content if it's SYSTEM/USER source
      if (step.content) {
        // Look for file path markers in view_file outputs
        const viewFileRegex = /File Path: `file:\/\/\/([a-zA-Z]:\/[^`]+)`[^]*?Showing lines \d+ to (\d+)[^]*?\n([^]*)/g;
        let match;
        while ((match = viewFileRegex.exec(step.content)) !== null) {
          const rawPath = match[1];
          const normalizedPath = path.normalize(rawPath.replace(/\//g, '\\'));
          const fileBody = match[3];
          
          // Clean line numbers (e.g., "1: import...", "2: ...")
          const lines = fileBody.split('\n');
          const cleanedLines = lines.map(l => {
            const lineMatch = l.match(/^\d+:\s?(.*)/);
            return lineMatch ? lineMatch[1] : l;
          });
          
          // Only store if it's a frontend file
          if (normalizedPath.includes('frontend')) {
            fileContents[normalizedPath] = cleanedLines.join('\n');
          }
        }
      }
    } catch (e) {
      // Ignore
    }
  }

  // Restore the files to disk
  console.log("Restoring files found in transcript...");
  for (const [filePath, content] of Object.entries(fileContents)) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`- Restored: ${filePath} (${content.length} bytes)`);
  }
  console.log("Done!");
}

restoreFiles();
