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

const templatePath = path.resolve(process.cwd(), 'node_modules', package.name, 'template/page');
console.log(templatePath);

const createFileByConfig = async (config) => {
  fs.pathExists(config.path, (err) => {
    if (err) {
      console.log(chalk.red(`${config.path} ${err.code === 'ENOENT' ? '不存在' : '无法访问'}`));
    } else {
      console.log(chalk.blue('读取菜单配置文件...'));
      fs.readJson(config.path, (err, data) => {
        if (err) {
          console.log(chalk.red('读取菜单配置文件失败'));
        } else {
          const menu = data.menu || []
          console.log(menu);
          makeFileByMenus(config, menu);
        }
      });
    }
  });
}

const makeFileByMenus = (config, menus = []) => {
  console.log(chalk.blue('开始生成container...'));
  fs.ensureDir(`${config.dist}/container`, {recursive: true}, (err) => {
    if (err) console.log(chalk.red(`生成发生container错误：${JSON.stringify(err)}`));
    else {
      menus.forEach(menu => {
        const fileName = menuFileName(menu.code);
        console.log(chalk.blue(`开始生成${fileName}文件夹...`));
        fs.ensureDir(`${config.dist}/container/${fileName}`, (err) => {
          if (err) console.log(chalk.red(`生成${fileName}文件夹失败`));
          else {
            fs.copy(templatePath, `${config.dist}/container/${fileName}`, err => {
              if (err) return console.log(chalk.red(`${fileName} 生成内部文件失败`));
              console.log(chalk.green(`生成${fileName}文件夹成功`));
            })
          }
        })
      })
    }
  })
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

    inquirer.prompt(promps).then((answers) => {
      const config = Object.assign({base, path}, answers);
      console.log(chalk.green(`配置：${JSON.stringify(config)}`));
      createFileByConfig(config);
    });
  })

program.parse(process.argv);