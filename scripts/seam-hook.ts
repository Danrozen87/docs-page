import { resolveSeamRuntimeEvent, type SeamRuntimeEvent } from '../src/seam/runtime.ts';

type HookInput = {
  prompt?: string;
  tool_name?: string;
  tool_input?: {
    file_path?: string;
  };
};

async function readJsonFromStdin(): Promise<HookInput> {
  const chunks: string[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(String(chunk));
  }

  const raw = chunks.join('').trim();
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw) as HookInput;
  } catch {
    return {};
  }
}

function printAdditionalContext(hookEventName: 'SessionStart' | 'UserPromptSubmit' | 'PreToolUse', text: string) {
  if (!text) {
    return;
  }

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName,
        additionalContext: text,
      },
    }),
  );
}

async function main() {
  const mode = process.argv[2];
  const input = await readJsonFromStdin();
  let event: SeamRuntimeEvent | null = null;
  let hookEventName: 'SessionStart' | 'UserPromptSubmit' | 'PreToolUse' | null = null;

  switch (mode) {
    case 'session': {
      event = { kind: 'session-start' };
      hookEventName = 'SessionStart';
      break;
    }
    case 'prompt': {
      const prompt = input.prompt?.trim();
      if (!prompt) return;
      event = { kind: 'task-request', value: prompt };
      hookEventName = 'UserPromptSubmit';
      break;
    }
    case 'pretool': {
      const filePath = input.tool_input?.file_path?.trim();
      if (!filePath) return;
      event = { kind: 'file-open', value: filePath };
      hookEventName = 'PreToolUse';
      break;
    }
    default:
      return;
  }

  if (!event || !hookEventName) {
    return;
  }

  const resolved = resolveSeamRuntimeEvent(event, 3);
  if (!resolved) {
    return;
  }

  printAdditionalContext(hookEventName, resolved.text);
}

await main();
