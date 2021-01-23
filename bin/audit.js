#!/usr/bin/env node
/* eslint no-console: off */

/*
 * CLI script to run 'yarn audit' and change the exit code. Only dependency is yargs, which is usually installed with other dev libraries anyways.
 * 
 * By default, yarn gives us the following exit codes when at least one module with a given severity level has been found (returning the sum):
 *  
    1 for INFO
    2 for LOW
    4 for MODERATE
    8 for HIGH
    16 for CRITICAL --- but you should ALWAYS fail CI here, anyways, because this indicates malicious code

 * So a result with 2 moderate vulnerabilities and 1 critical vulnerability would return an exit code of 20 - classifications of vulnerabilities after the first don't add to the exit code.
 *
 * This is problematic when running in CI, since we may only want to send a non-zero exit code on a certain error level. This is kind of annoying, and Yarn 2 isn't planning on fixing this.
 * It does not matter to Yarn if you pass in --level as an argument - the exit code doesn't change.
 * 
 * NPM audit handles this correctly, but that's pointless in CI/CD - we want to verify the yarn lockfile, and we don't really want to change the lockfile in the middle of CI/CD. 
 * 
 * All this does is print to stdout - up to you if you want to send it to a file, print it to the console, or just rely on CI/CD seeing the error code and failing.
 * 
 * This script also prints more useful information than the default yarn audit command, but doesn't print all the garbage from --verbose or --json. 
 * It is deliberately impossible to pass audits with a 'critical' severity because that indicates malicious code.
 * 
 */

// severity order from least to most
const AUDIT_SEVERITY_OPTIONS = ['info', 'low', 'moderate', 'high', 'critical'];

const argv = require('yargs')
  .usage('Usage: $0 [options]')
  .option('groups', {
    alias: 'g',
    type: 'array',
    description: 'Only audit dependencies from listed groups. Follows yarn defaults if not specified (all but peerDependencies)',
    choices: ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'],
  })
  .option('level', {
    alias: 'l',
    type: 'string',
    description:
      'Minimum severity level which should throw an error. No option provided means any audits will result in a non-zero exit code.',
    choices: AUDIT_SEVERITY_OPTIONS,
  })
  .option('ignoreLessSevere', {
    alias: 'i',
    type: 'boolean',
    description: 'If set, do not output vulnerabilities with lower severity than provided "level"',
    implies: 'level',
  })
  .option('silent', {
    alias: 's',
    type: 'boolean',
    description: 'If set, do not output anything at all. Overrides all other output flags.',
  })
  .option('json', {
    alias: 'j',
    type: 'boolean',
    description: 'If set, output result as JSON instead of table.',
  })
  .alias('help', 'h')
  .alias('version', 'v')
  .showHelpOnFail()
  .strict()
  .epilogue('Purpose: Control "yarn audit" exit code and output relevant information').argv;

function run() {
  const yarnArgs = ['audit'];
  argv.silent ? yarnArgs.push('--silent') : yarnArgs.push('--json');
  if (argv.groups) {
    yarnArgs.push('--groups');
    argv.groups.forEach((arg) => yarnArgs.push(arg));
  }
  argv.ignoreLessSevere && yarnArgs.push('--level', argv.level);

  const yarn = require('child_process').spawn('yarn', yarnArgs);

  // stdout will not be filled all at once, so append to a string
  let output = '';
  yarn.stdout.on('data', (data) => (output += data.toString()));
  let errorOutput = '';
  yarn.stderr.on('data', (data) => (errorOutput += data.toString()));

  yarn.on('close', (code) => {
    // if stderr was printed to, the yarn audit failed
    if (errorOutput) {
      console.error(argv.silent ? errorOutput : JSON.parse(errorOutput).data);
    } else if (!argv.silent) {
      generateOutput(output);
    }
    process.exit(!errorOutput || !getExitCode(code));
  });
}

function generateOutput(output) {
  // the command returns LINES of JSON, not automatically valid JSON
  let lines = output.split('\n');
  // last line is empty, get rid of it
  lines.pop();
  lines = lines.map((line) => JSON.parse(line.trim()));

  const adviceLines = lines.filter((line) => line.type === 'auditAdvisory').map((line) => line.data.advisory);
  const summaryLine = lines[lines.length - 1].data.vulnerabilities;
  const MINIMUM_SEVERITY_INDEX = AUDIT_SEVERITY_OPTIONS.indexOf(argv.level);

  // the '--lines' flag in 'yarn audit' gets rid of the 'adviceLines', but does not change the output of summaryLine.
  if (argv.ignoreLessSevere) {
    Object.keys(summaryLine).forEach((key) => {
      if (MINIMUM_SEVERITY_INDEX > AUDIT_SEVERITY_OPTIONS.indexOf(key)) {
        delete summaryLine[key];
      }
    });
  }
  summaryLine.total = Object.values(summaryLine).reduce((previous, current) => previous + current);

  if (argv.json) {
    // give it everything in one JSON object (so you can pipe this script into a .json file)
    console.log(JSON.stringify({modules: adviceLines, summary: summaryLine}, null, 2));
  } else {
    // opinionated output
    adviceLines.forEach((line) => {
      console.log(`SEVERITY:            ${line.severity.toUpperCase()}`);
      console.log(`MODULE:              ${line.module_name}`);
      console.log(`VULNERABILITY:       ${line.title}`);
      console.log(`PATCHED VERSIONS:    ${line.patched_versions[0] === '<' ? 'NONE' : line.patched_versions}`);
      console.log('OVERVIEW:');
      console.log(`  - ${line.overview}`);
      console.log('RECOMMENDATION:');
      console.log(`  - ${line.recommendation}`);
      console.log('MORE INFORMATION:');
      console.log(`  - ${line.url}`);
      console.log('');
    });

    console.log('-----------------------------------------------------------------------------------------------------\n');
    for (let i = argv.ignoreLessSevere ? MINIMUM_SEVERITY_INDEX : 0; i < AUDIT_SEVERITY_OPTIONS.length; i++) {
      const value = AUDIT_SEVERITY_OPTIONS[i];
      console.log(`${value.toUpperCase()} vulnerabilities: ${value.length >= 8 ? '\t' : '\t\t'}${summaryLine[value]}`);
    }
    console.log(`TOTAL vulnerabilities: \t\t${summaryLine.total}`);
  }
}

function getExitCode(code) {
  switch (argv.level) {
    case 'low':
      return code < 2;
    case 'moderate':
      return code < 4;
    case 'high':
      return code < 8;
    case 'critical':
      return code < 16;
    default:
      return code < 1;
  }
}

process.chdir(`${__dirname}/..`);
run();
