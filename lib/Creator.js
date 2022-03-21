const path = require('path')
const chalk = require('chalk')
const EventEmitter = require('events')
const fs = require("fs-extra");
const ora = require("ora");
const downloadGitRepo = require("download-git-repo");
const os = require('os')
const execa = require('execa')
const {execSync, exec} = require('child_process')
const {hasYarn} = require('../utils/index')
const {writeFile} = require('fs').promises;

module.exports = class Creator extends EventEmitter {
  constructor (name, context) {
    super()

    this.name = name
    this.context = context

    this.run = this.run.bind(this)
    this._hasYarn = hasYarn();
  }

  async create (cliOptions = {}, preset = null) {
    console.log(`✨`, `Creating project in ${chalk.yellow(this.context)}.`)
    await this.fetchRep();

    // 修改projectName
    await this.setProjectName();

    const downloadSpinner = ora(`开始安装依赖...`)
    downloadSpinner.start()

    let runCommand = this._hasYarn ? 'yarn serve' : 'npm run serve';
    let installCommand = this._hasYarn ? 'yarn' : 'npm i';
    await this.run(`cd ${this.name} && ${installCommand}`)
    downloadSpinner.color = 'green'
    downloadSpinner.succeed(`${chalk.white('依赖安装成功')}`);
    console.log(chalk.cyan(` \ncd ${this.name}`))
    console.log(chalk.yellow('确保配置testlocal.dmall.com的host 127.0.0.1'));
    console.log(chalk.cyan(`${runCommand} \n开始你的表演！`))
  }

  run (command) {
    return new Promise((resolve, reject)=>{
      exec(command, function(err){
        if(err){
          console.log(chalk.red(err));
          reject(err);
        }else{
          resolve(true)
        }
      })
    })
  }

  fetchRep() {
    const downloadSpinner = ora(`开始下载模板...`)
    downloadSpinner.start()

    let gitUrl = "http://gitlab.dmall.com/shrek/template.git";

    const tmpdir = path.join(os.tmpdir(), this.name);
    // 重置缓存文件夹
    if (fs.existsSync(tmpdir)) {
      console.log('删除缓存文件')
      fs.removeSync(tmpdir)
    }

    return new Promise((resolve, reject) => {
      downloadGitRepo(`direct:${gitUrl}`, tmpdir, { clone: true }, (error) => {
        if (error) {
          console.log(error)
          downloadSpinner.color = 'red'
          downloadSpinner.fail(chalk.red('基座模板下载失败'))

          fs.removeSync(tmpdir)

          return reject(false);
        } else {
          fs.moveSync(tmpdir, this.context, { overwrite: true })
          fs.removeSync(tmpdir)

          downloadSpinner.color = 'green'
          downloadSpinner.succeed(`${chalk.white('基座模板下载成功')}`)

          return resolve('')
        }
      })
    })
  }
  // 设置project名字
  async setProjectName(){
    const promise = writeFile(path.join(path.resolve(), `/${this.name}/config.js`), `module.exports.projectName = '${this.name}';`,);
    await promise;
    console.log('配置文件写入成功');
  }
}
