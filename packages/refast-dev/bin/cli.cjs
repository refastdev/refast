#!/usr/bin/env node

'use strict';
const { program } = require('commander');
const i18nExtract = require('@refastdev/i18n-extract').default;

const runI18nExtract = async (options) => {
  const result = await i18nExtract(options);
  const count = (result && result.length) || 0;
  console.log(`${count} messages extracted.`);
};

function parseCmd(argv) {
  return program
    .option('--cmd [optional]', 'cmd', '')
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
  if (options.cmd === undefined || options.cmd === '') {
    console.error(`please input --cmd [cmd]`);
    return;
  }
  if (options.cmd === 'i18n-extract') {
    runI18nExtract(options);
  } else {
    console.error(`not support cmd: ${options.cmd}`);
    return;
  }
}

execute();
