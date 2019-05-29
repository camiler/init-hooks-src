#!/usr/bin/env node
const fs = require('fs-extra'); //文件系统
const path = require('path');
const program = require('commander'); //终端输入处理框架
const package = require('./package.json'); //获取版本信息
const chalk = require('chalk');
const inquirer = require('inquirer');
const {menuFileName} = require('./util');
const handlebars = require('handlebars');

const pathTip = 'menu configuration file path, default is: ';
const distTip = 'src dist dir, default is: ';
const defaultPath = './menu.json';
const defaultDist = './src';

const templatePath = path.resolve(process.cwd(), 'node_modules', package.name, 'template');
let config = {};
let menus = [];

const genContainer = async () => {
  console.log(chalk.blue('start to create container...'));
  try{
    await fs.ensureDir(`${config.dist}/container`, {recursive: true});
    menus.forEach(async menu => {
      const name = menuFileName(menu);
      await fs.ensureDir(`${config.dist}/container/${name}`);
      const tempContent = await fs.readFile(`${templatePath}/page/temp.js`);
      const temp = handlebars.compile(tempContent.toString())({serviceName: menu, containerName: name})
      await fs.writeFile(`${config.dist}/container/${name}/index.js`, temp);
      await fs.copy(`${templatePath}/page/enum.js`, `${config.dist}/container/${name}/enum.js`);
    })
    console.log(chalk.green('create container success'));
  } catch(err) {
    console.log(chalk.red(`create container error：${JSON.stringify(err)}`));
  }
}

const genService = async () => {
  console.log(chalk.blue('start to create service...'));
  try{
    await fs.ensureDir(`${config.dist}/service`, {recursive: true});
    await fs.copy(`${templatePath}/service/api.js`, `${config.dist}/service/api.js`);
    menus.forEach(async menu =>  {
      const serviceContent = await fs.readFile(`${templatePath}/service/temp.js`);
      const temp = handlebars.compile(serviceContent.toString())({serviceName: `${menuFileName(menu)}Service`});
      await fs.writeFile(`${config.dist}/service/${menu}.js`, temp);
    })
    console.log(chalk.green('create service success'));
  } catch (err) {
    console.log(chalk.red(`create service error: ${JSON.stringify(err)}`))
  }
}

const getMenus = async (path) => {
  console.log(chalk.blue(`reading menu configuration file:  ${path}...`));
  const exist = await fs.pathExists(path);
  if (exist) {
    try {
      const data = await fs.readJson(path);
      return data.menu || [];
    } catch(err) {
      console.log(chalk.red('reading menu configuration file fail'));
      return false;
    }
  } else {
    console.log(chalk.red(`${config.path} is not exist`));
    return false;
  }
} 

const genStatic = async () => {
  try{
    console.log(chalk.blue('start to create other static files...'));
    await fs.ensureDir(`${config.dist}/store`, {recursive: true});
    await fs.ensureDir(`${config.dist}/hooks`, {recursive: true});
    await fs.copy(`${templatePath}/static`, `${config.dist}/`);
    console.log(chalk.green('create other static files success'));
  } catch (err) {
    console.log(chalk.red(`create other static files error: ${JSON.stringify(err)}`))
  }
}

const genRoutes = async () => {
  console.log(chalk.blue('start to create route.js...'));
  try{
    const menuNames = [];
    menus.forEach(menu => menuNames.push(menuFileName(menu)));
    const content = await fs.readFile(`${templatePath}/routes.js`);
    const routes = handlebars.compile(content.toString())({menuNames});
    await fs.writeFile(`${config.dist}/routes.js`, routes);
    console.log(chalk.green('create route.js success'));
  }catch(err) {
    console.log(chalk.red(`create route.js error: ${JSON.stringify(err)}`))
  }
}


program
  .version(package.version, '-v,--version')
  .description('Create src folder in react hooks app quickly according to a simple menu configuration.')
  .option('-p,--path <path>', `${pathTip} ${defaultPath}`)
  .option('-d,--dist <dist>', `${distTip} ${defaultDist}`)
  .action(option => {
    const promps = [];
    const {path = '', dist = ''} = option;
    if (path === '') {
      promps.push({type: 'input', name: 'path', message: pathTip, default: defaultPath});
    }
    if (dist === '') {
      promps.push({type: 'input', name: 'dist', message: distTip, default: defaultDist});
    }

    inquirer.prompt(promps).then(async (answers) => {
      config = Object.assign({path, dist}, answers);
      menus = await getMenus(config.path);
      if (menus) {
        await genContainer();
        await genService();
        await genRoutes();
        await genStatic();
        console.log(chalk.green('react hooks src finish！enjoy your code!'));
      }
    });
  })

program.parse(process.argv);