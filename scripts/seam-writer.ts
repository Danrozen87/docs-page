import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { seamGraph, type SeamNode } from '../src/seam/graph.ts';

const SEAM_UPDATE_PATTERNS = [
  '.seam/graph.json',
  '.seam/audit/**',
  'src/seam/**',
  'AGENTS.md',
  'CLAUDE.md',
  '.claude/settings.json',
];

type WriterStatus = 'clean' | 'covered' | 'drift';

interface WriterFinding {
  file: string;
  nodes: SeamNode[];
}

interface WriterReport {
  status: WriterStatus;
  files: string[];
  findings: WriterFinding[];
  seamTouched: boolean;
}

function matchesPattern(filePath: string, pattern: string): boolean {
  if (pattern.endsWith('/**')) {
    return filePath.startsWith(pattern.slice(0, -3));
  }

  return filePath === pattern;
}

function listUniqueFiles(files: string[]): string[] {
  return [...new Set(files.map((file) => file.trim()).filter(Boolean))].sort();
}

function gitChangedFiles(args: string[]): string[] {
  try {
    const output = execFileSync('git', args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    return listUniqueFiles(output.split('\n'));
  } catch {
    return [];
  }
}

function stagedFiles(): string[] {
  return gitChangedFiles(['diff', '--cached', '--name-only', '--diff-filter=ACMR']);
}

function rangeFiles(baseRef: string, headRef: string): string[] {
  return gitChangedFiles(['diff', '--name-only', '--diff-filter=ACMR', baseRef, headRef]);
}

function seamTouched(files: string[]): boolean {
  return files.some((file) => SEAM_UPDATE_PATTERNS.some((pattern) => matchesPattern(file, pattern)));
}

function collectFindings(files: string[]): WriterFinding[] {
  return files
    .map((file) => {
      const nodes = seamGraph.nodes.filter((node) =>
        node.watchFiles.some((pattern) => matchesPattern(file, pattern)),
      );

      if (nodes.length === 0) {
        return null;
      }

      return {
        file,
        nodes,
      } satisfies WriterFinding;
    })
    .filter((finding): finding is WriterFinding => finding !== null);
}

function buildReport(files: string[]): WriterReport {
  const normalizedFiles = listUniqueFiles(files);
  const findings = collectFindings(normalizedFiles);
  const touched = seamTouched(normalizedFiles);

  if (findings.length === 0) {
    return {
      status: 'clean',
      files: normalizedFiles,
      findings,
      seamTouched: touched,
    };
  }

  return {
    status: touched ? 'covered' : 'drift',
    files: normalizedFiles,
    findings,
    seamTouched: touched,
  };
}

function printReport(report: WriterReport) {
  switch (report.status) {
    case 'clean':
      process.stdout.write('SEAM Writer: clean\n');
      return;
    case 'covered':
      process.stdout.write('SEAM Writer: governed files changed and SEAM was updated in the same change.\n');
      for (const finding of report.findings) {
        process.stdout.write(`- ${finding.file}\n`);
      }
      return;
    case 'drift':
      process.stderr.write('SEAM Writer: drift detected\n\n');
      for (const finding of report.findings) {
        process.stderr.write(`- ${finding.file}\n`);
        for (const node of finding.nodes) {
          process.stderr.write(`  -> ${node.id} [${node.type} · ${node.authority}]\n`);
          process.stderr.write(`     ${node.summary}\n`);
        }
      }

      process.stderr.write('\nSEAM-governed files changed without a graph, audit, or runtime-layer update.\n');
      process.stderr.write('Update .seam/graph.json / src/seam / agent instructions, or record an explicit ack:\n');
      process.stderr.write('  node --experimental-strip-types ./scripts/seam-writer.ts ack --reason "<why no graph change is needed>"\n');
  }
}

function createAck(reason: string, files: string[]) {
  const report = buildReport(files);
  const auditDir = join('.seam', 'audit');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const auditPath = join(auditDir, `${timestamp}-ack.json`);

  mkdirSync(auditDir, { recursive: true });

  const record = {
    kind: 'seam-ack',
    createdAt: new Date().toISOString(),
    reason,
    files: report.files,
    nodes: report.findings.flatMap((finding) => finding.nodes.map((node) => node.id)),
  };

  writeFileSync(auditPath, `${JSON.stringify(record, null, 2)}\n`, 'utf8');
  process.stdout.write(`${auditPath}\n`);
}

function parseAckArgs(args: string[]): { reason: string; files: string[] } {
  const reasonIndex = args.indexOf('--reason');
  if (reasonIndex === -1 || !args[reasonIndex + 1]?.trim()) {
    throw new Error('Missing --reason for seam-writer ack.');
  }

  const reason = args[reasonIndex + 1].trim();
  const files = listUniqueFiles(
    args.filter((_, index) => index !== reasonIndex && index !== reasonIndex + 1),
  );

  return {
    reason,
    files,
  };
}

function main() {
  const mode = process.argv[2];
  const args = process.argv.slice(3);

  switch (mode) {
    case 'staged': {
      const files = stagedFiles();
      if (files.length === 0) {
        process.stdout.write('SEAM Writer: no staged files or no Git repository detected.\n');
        return;
      }

      const report = buildReport(files);
      printReport(report);
      process.exitCode = report.status === 'drift' ? 2 : 0;
      return;
    }
    case 'range': {
      const [baseRef, headRef] = args;
      if (!baseRef || !headRef) {
        throw new Error('Usage: seam-writer.ts range <base> <head>');
      }

      const files = rangeFiles(baseRef, headRef);
      if (files.length === 0) {
        throw new Error('No files found for the requested Git range.');
      }

      const report = buildReport(files);
      printReport(report);
      process.exitCode = report.status === 'drift' ? 2 : 0;
      return;
    }
    case 'files': {
      const report = buildReport(args);
      printReport(report);
      process.exitCode = report.status === 'drift' ? 2 : 0;
      return;
    }
    case 'ack': {
      const { reason, files } = parseAckArgs(args);
      const ackFiles = files.length > 0 ? files : stagedFiles();
      if (ackFiles.length === 0) {
        throw new Error('No files available to acknowledge. Pass files explicitly or run inside a Git repo with staged changes.');
      }

      createAck(reason, ackFiles);
      return;
    }
    default:
      throw new Error(
        'Usage: seam-writer.ts <staged|range <base> <head>|files <paths...>|ack --reason "<text>" [paths...]>',
      );
  }
}

main();
