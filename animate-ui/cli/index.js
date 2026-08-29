#!/usr/bin/env node
/*
 * Animate UI CLI - minimal registry client.
 *
 * Usage:
 *   node cli/index.js add <component> [--dir <target>]
 *   node cli/index.js list
 *
 * Runs from anywhere: paths are resolved against this repository's
 * root, found from the script location. Plain Node ESM, no dependencies.
 */
import { addComponents, listComponents, printHelp } from './commands.js';

const [, , command, ...args] = process.argv;

function parseOptions(args) {
  const options = { dir: './components/ui', names: [] };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--dir' || arg === '-d') {
      options.dir = args[i + 1] ?? options.dir;
      i++;
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else {
      options.names.push(arg);
    }
  }
  return options;
}

async function main() {
  switch (command) {
    case 'add': {
      const { names, dir } = parseOptions(args);
      if (names.length === 0) {
        printHelp();
        process.exit(1);
      }
      const ok = await addComponents(names, dir);
      process.exit(ok ? 0 : 1);
      break;
    }
    case 'list': {
      const ok = listComponents();
      process.exit(ok ? 0 : 1);
      break;
    }
    default:
      printHelp();
      process.exit(command ? 1 : 0);
  }
}

main();
