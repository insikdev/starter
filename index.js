#!/usr/bin/env node

import shell from 'shelljs';
import inquirer from 'inquirer';
import { manager, moduleList } from './options.js';

inquirer
  .prompt([
    {
      type: 'list',
      name: 'package_manager',
      message: 'Choose package manager',
      choices: ['npm', 'yarn']
    }
  ])
  .then(({ package_manager }) => {
    shell.echo('Generate .eslintrc.json & .prettierrc.json');
    const command = `${manager[package_manager]} ${moduleList.join(' ')} -D`;
    shell.exec(command);
    shell.cp(['airbnb/.eslintrc.json', 'airbnb/.prettierrc.json'], './');
    shell.echo('\nDone');
  });
