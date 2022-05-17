#!/usr/bin/env node
import shell from 'shelljs';
import inquirer from 'inquirer';
import fs from 'fs';
import https from 'https';
import { manager, moduleList } from './src/options.js';

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
    console.log('Installing required modules...');
    const command = `${manager[package_manager]} ${moduleList.join(' ')} -D`;
    shell.exec(command);
    generateConfigFile('eslint', 'airbnb');
    generateConfigFile('prettier');
    shell.echo('\nDone');
  });

function generateConfigFile(key, type = '') {
  console.log(`Generate .${key}rc.json`);
  const BASE_URL =
    'https://raw.githubusercontent.com/insikdev/dev-starter/main';
  const options = {
    eslint: `src/eslint/${type}.json`,
    prettier: '.prettierrc.json'
  };
  const requestURL = `${BASE_URL}/${options[key]}`;
  https.get(requestURL, (res) => {
    const filePath = fs.createWriteStream(`.${key}rc.json`);
    res.pipe(filePath);
    filePath.on('finish', () => filePath.close());
  });
}
