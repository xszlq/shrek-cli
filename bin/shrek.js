#!/usr/bin/env node
const { program } = require('commander')
const config = require('../package.json')
const semver = require('semver')
const figlet = require('figlet')

function checkNodeVersion (wanted) {
    if (!semver.satisfies(process.version, wanted)) {
        console.log(chalk.red(
            'You are using Node ' + process.version + ', but this version of shrek'  +
            ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'
        ))
        process.exit(1)
    }
}

checkNodeVersion(config.engines.node)

console.log('\n' + figlet.textSync('Shrek', {
    // font: 'Ghost',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true
}));

program.version(config.version)
    .usage('<command> [options]');

program
    .command('create <project-name>')
    .description('创建 shrek 项目')
    .option('-M, --manualInstall', '手动安装依赖')
    .action((projectName, options) => {
        require('../lib/create')(projectName, options)
    })

program.parse(process.argv);
