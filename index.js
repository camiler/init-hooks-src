#!/usr/bin/env node
const fs = require('fs-extra'); //文件系统
const path = require('path');
const program = require('commander'); //终端输入处理框架
const package = require('./package.json'); //获取版本信息
const chalk = require('chalk');
const inquirer = require('inquirer');
const {menuFileName} = require('./util');
const handlebars = require('handlebars');

const pathTip = '菜单配置文件路径，默认为';
const baseTip = '一级路由路径，默认为';
const distTip = '生成路径，默认为';
const defaultPath = './menu.json';
const defaultBase = '/';
const defaultDist = './src';

const templatePath = path.resolve(process.cwd(), 'node_modules', package.name, 'template');
let config = {};
let menus = [];

const genContainer = async () => {
  console.log(chalk.blue('开始生成container...'));
  try{
    await fs.ensureDir(`${config.dist}/container`, {recursive: true});
    menus.forEach(async menu => {
      const fileName = menuFileName(menu.code);
      await fs.ensureDir(`${config.dist}/container/${fileName}`);
      await fs.copy(`${templatePath}/page`, `${config.dist}/container/${fileName}`);
    })
    console.log(chalk.green('生成container成功'));
  } catch(err) {
    console.log(chalk.red(`生成container错误：${JSON.stringify(err)}`));
  }
}

const genHooks = async () => {
  console.log(chalk.blue('开始生成hooks...'));
  try{
    await fs.ensureDir(`${config.dist}/hooks`, {recursive: true});
    await fs.copy(`${templatePath}/hooks`, `${config.dist}/hooks`);
    console.log(chalk.green('生成hooks文件夹成功'));
  } catch (err) {
    console.log(chalk.red(`生成hooks文件夹失败: ${JSON.stringify(err)}`))
  }
}

const genService = async () => {
  console.log(chalk.blue('开始生成Service...'));
  try{
    await fs.ensureDir(`${config.dist}/service`, {recursive: true});
    await fs.copy(`${templatePath}/service/api.js`, `${config.dist}/service/api.js`);
    menus.forEach(async menu =>  {
      const name = menuFileName(menu.code);
      const serviceContent = await fs.readFile(`${templatePath}/service/temp.js`);
      const temp = handlebars.compile(serviceContent.toString())({serviceName: `${name}Service`});
      await fs.writeFile(`${config.dist}/service/${menu.code}.js`, temp);
    })
    console.log(chalk.green('生成Service完成'));
  } catch (err) {
    console.log(chalk.red(`生成Service失败: ${JSON.stringify(err)}`))
  }
}

const genStore = async () => {
  console.log(chalk.blue('开始生成store...'));
  try{
    await fs.ensureDir(`${config.dist}/store`, {recursive: true});
    await fs.copy(`${templatePath}/store`, `${config.dist}/store`);
    console.log(chalk.green('生成store文件夹成功'));
  } catch (err) {
    console.log(chalk.red(`生成store文件夹失败: ${JSON.stringify(err)}`))
  }
}

const getMenus = async (path) => {
  console.log(chalk.blue('读取菜单配置文件...'));
  const exist = await fs.pathExists(path);
  if (exist) {
    try {
      const data = await fs.readJson(path);
      return data.menu || [];
    } catch(err) {
      console.log(chalk.red('读取菜单配置文件失败'));
    }
  } else {
    console.log(chalk.red(`${config.path} 不存在}`));
  }
} 


program
  .version(package.version, '-v,--version')
  .description('根据菜单配置快速创建react hooks版本的src文件')
  .option('-p, --path <path>', `${pathTip} ${defaultPath}`)
  .option('-b, --base <base>', `${baseTip} ${defaultBase}`)
  .option('-d, --dist <dist>', `${distTip} ${defaultDist}`)
  .action(option => {
    const promps = [];
    const {path = '', base = '', dist = ''} = option;
    if (path === '') {
      promps.push({type: 'input', name: 'path', message: pathTip, default: defaultPath});
    }
    if (base === '') {
      promps.push({type: 'input', name: 'base', message: baseTip, default: defaultBase});
    }
    if (dist === '') {
      promps.push({type: 'input', name: 'dist', message: baseTip, default: defaultDist});
    }

    inquirer.prompt(promps).then(async (answers) => {
      config = Object.assign({base, path}, answers);
      menus = await getMenus(config.path);
      await genHooks();
      await genStore();
      await genService();
      await genContainer();
    });
  })

program.parse(process.argv);