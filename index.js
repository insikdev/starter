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
    },
    {
      type: 'list',
      name: 'type',
      message: 'Choose project settings',
      choices: ['browser-react-ts-airbnb', 'node-ts-airbnb']
    }
  ])
  .then(({ package_manager, type }) => {
    console.log('Installing required modules...');
    const command = `${manager[package_manager]} ${moduleList[type].join(
      ' '
    )} -D`;
    shell.exec(command);
    generateConfigFile('eslint', type);
    generateConfigFile('prettier');
    generateConfigFile('vscode');
    console.log('\nDone');
  });

function generateConfigFile(key, type = '') {
  const BASE_URL =
    'https://raw.githubusercontent.com/insikdev/dev-starter/main';
  const options = {
    eslint: { path: `src/eslint/${type}.json`, filename: '.eslintrc.json' },
    prettier: { path: '.prettierrc.json', filename: '.prettierrc.json' },
    vscode: { path: '.vscode/settings.json', filename: '.vscode/settings.json' }
  };
  console.log(`Generate ${options[key].filename}`);

  if (options[key].filename.includes('/')) {
    const dirPath = options[key].filename.split('/')[0];
    const isExist = fs.existsSync(dirPath);
    if (!isExist) fs.mkdirSync(dirPath);
  }

  const requestURL = `${BASE_URL}/${options[key].path}`;
  https.get(requestURL, (res) => {
    const filePath = fs.createWriteStream(options[key].filename);
    res.pipe(filePath);
    filePath.on('finish', () => filePath.close());
  });
}
