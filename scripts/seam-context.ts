import { resolveSeamRuntimeEvent } from '../src/seam/runtime.ts';

function printUsage() {
  process.stderr.write(
    [
      'Usage:',
      '  node --experimental-strip-types ./scripts/seam-context.ts session',
      '  node --experimental-strip-types ./scripts/seam-context.ts file <path>',
      '  node --experimental-strip-types ./scripts/seam-context.ts task <text>',
      '',
    ].join('\n'),
  );
}

function main() {
  const mode = process.argv[2];
  const value = process.argv.slice(3).join(' ').trim();

  switch (mode) {
    case 'session': {
      const resolved = resolveSeamRuntimeEvent({ kind: 'session-start' });
      if (resolved) {
        process.stdout.write(resolved.text);
      }
      return;
    }
    case 'file': {
      if (!value) {
        printUsage();
        process.exitCode = 1;
        return;
      }

      const resolved = resolveSeamRuntimeEvent({ kind: 'file-open', value });
      if (resolved) {
        process.stdout.write(resolved.text);
      }
      return;
    }
    case 'task': {
      if (!value) {
        printUsage();
        process.exitCode = 1;
        return;
      }

      const resolved = resolveSeamRuntimeEvent({ kind: 'task-request', value });
      if (resolved) {
        process.stdout.write(resolved.text);
      }
      return;
    }
    default:
      printUsage();
      process.exitCode = 1;
  }
}

main();
