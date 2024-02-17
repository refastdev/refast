#!/usr/bin/env node

'use strict';
const { program } = require('commander');
const script = require('../dist/index.cjs').default;

const runScript = async (options) => {
  const result = await script(options);
  const count = (result && result.length) || 0;
  console.log(`${count} messages extracted.`);
};

function parseCmd(argv) {
  return program
    .option('--source-path [optional]', 'The source code directory. Example: "./src"', './src')
    .option(
      '--output-path [optional]',
      'The output path for extracted messages. Example: "./src/locales"',
      './src/locales/en-US.json',
    )
    .parse(argv)['_optionValues'];
}

function execute() {
  const options = parseCmd(process.argv);
  runScript(options);
}

execute();
