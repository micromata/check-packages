'use strict';

const updateNotifier = require('update-notifier');
const pkg = require('../package.json');
const chalk = require('chalk');
const ora = require('ora');

const readCliOptions = require('./read-cli-options');
const analyzeDependencies = require('./analyze-dependencies');

const run = cli => {
  updateNotifier({ pkg }).notify();

  const options = readCliOptions(cli.input, cli.flags);

  if (options.valid && options.nextCliAction) {
    cli[options.nextCliAction]();
  }

  if (!options.valid) {
    console.log(chalk.red(`${options.error} Please check the help below:`));
    cli.showHelp();
  }

  const spinner = ora('analysing dependencies...').start();
  const result = analyzeDependencies(options);

  if (result.error) {
    spinner.fail(`Dependency analysis error: ${result.error}`);

    return process.exit(1);
  }

  spinner.succeed('Dependencies analysed');

  if (result.warning) {
    console.log(chalk.black(chalk.bgYellow(result.warning)));
  }

  if (!result.error && result.unallowedPackages.length === 0) {
    spinner.succeed('Congratulations, all dependencies are allowed!');

    return process.exit(0);
  }

  /* istanbul ignore else */
  if (result.unallowedPackages.length) {
    spinner.fail(`Found ${result.unallowedPackages.length} unallowed dependencies!`);

    if (options.verbose) {
      console.log(chalk.red(result.verboseOutput));
    }
  }

  process.exit(1);
};

module.exports = run;
