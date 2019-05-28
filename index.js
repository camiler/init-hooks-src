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
const distTip = '生成路径，默认为';
const defaultPath = './menu.json';
const defaultDist = './src';

const templatePath = path.resolve(process.cwd(), 'node_modules', package.name, 'template');
let config = {};
let menus = [];

const genContainer = async () => {
  console.log(chalk.blue('开始生成container...'));
  try{
    await fs.ensureDir(`${config.dist}/container`, {recursive: true});
    menus.forEach(async menu => {
      const name = menuFileName(menu);
      await fs.ensureDir(`${config.dist}/container/${name}`);
      await fs.copy(`${templatePath}/page`, `${config.dist}/container/${name}`);
    })
    console.log(chalk.green('生成container成功'));
  } catch(err) {
    console.log(chalk.red(`生成container错误：${JSON.stringify(err)}`));
  }
}

const genService = async () => {
  console.log(chalk.blue('开始生成Service...'));
  try{
    await fs.ensureDir(`${config.dist}/service`, {recursive: true});
    await fs.copy(`${templatePath}/service/api.js`, `${config.dist}/service/api.js`);
    menus.forEach(async menu =>  {
      const serviceContent = await fs.readFile(`${templatePath}/service/temp.js`);
      const temp = handlebars.compile(serviceContent.toString())({serviceName: `${menuFileName(menu)}Service`});
      await fs.writeFile(`${config.dist}/service/${menu}.js`, temp);
    })
    console.log(chalk.green('生成Service完成'));
  } catch (err) {
    console.log(chalk.red(`生成Service失败: ${JSON.stringify(err)}`))
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
      return false;
    }
  } else {
    console.log(chalk.red(`${config.path} 不存在`));
    return false;
  }
} 

const genStatic = async () => {
  try{
    console.log(chalk.blue('开始生成其他静态文件...'));
    await fs.ensureDir(`${config.dist}/store`, {recursive: true});
    await fs.ensureDir(`${config.dist}/hooks`, {recursive: true});
    await fs.copy(`${templatePath}/static`, `${config.dist}/`);
    console.log(chalk.green('生成其他静态文件成功'));
  } catch (err) {
    console.log(chalk.red(`生成其他静态文件失败: ${JSON.stringify(err)}`))
  }
}

const genRoutes = async () => {
  console.log(chalk.blue('生成路由文件...'));
  try{
    const menuNames = [];
    menus.forEach(menu => menuNames.push(menuFileName(menu)));
    const content = await fs.readFile(`${templatePath}/routes.js`);
    const routes = handlebars.compile(content.toString())({menuNames});
    await fs.writeFile(`${config.dist}/routes.js`, routes);
    console.log(chalk.green('生成路由文件完成'));
  }catch(err) {
    console.log(chalk.red(`生成路由文件失败: ${JSON.stringify(err)}`))
  }
}


program
  .version(package.version, '-v,--version')
  .description('根据菜单配置快速创建react hooks版本的src文件')
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
        console.log(chalk.green('react hooks src 完成！enjoy your code!'));
      }
    });
  })

program.parse(process.argv);