#!/usr/bin/env node

import * as Yargs from 'yargs';
import { MODEL_COMMAND } from './commands/model/model';
import { SHOWCASE_COMMAND } from './commands/showcase/showcase';

// Monkey patch JSDOM to support the non-standard characters
// that are used in Angular attributes.
// https://github.com/jsdom/jsdom/issues/2477
(function monkeyPatch() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const validateNames = require('jsdom/lib/jsdom/living/helpers/validate-names.js');
  const qname_ = validateNames.qname;
  validateNames.qname = (name: string) => {
    try {
      qname_(name);
    } catch {} // eslint-disable-line no-empty
  };
})();

function handleError(error: any) {
  console.error(error);
  process.exit(1);
}

process.on('unhandledRejection', (reason) => {
  handleError(reason);
});

process.on('uncaughtException', (error) => {
  handleError(error);
});

void (async function run() {
  const commandChain = Yargs.command(SHOWCASE_COMMAND).command(MODEL_COMMAND);

  await commandChain
    .usage('\n Usage: berg <command>')
    .wrap(Math.min(Yargs.terminalWidth(), 150))
    .version(false)
    .demandCommand()
    .recommendCommands()
    .help()
    .strict().argv;
})();
