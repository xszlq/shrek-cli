const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const inquirer = require('inquirer')
const Creator = require('./Creator')

async function create(projectName, options){
    const cwd = options.cwd || process.cwd()

    const targetDir = path.resolve(cwd, projectName || '.')

    const name = projectName;
    // console.log(cwd, targetDir)

    // 当前路径存在
    if (fs.existsSync(targetDir)) {
        const { action } = await inquirer.prompt([
            {
                name: 'action',
                type: 'list',
                message: `Target directory ${chalk.cyan(targetDir)} already exists. Pick an action:`,
                choices: [
                    { name: 'Overwrite', value: 'overwrite' },
                    { name: 'Merge', value: 'merge' },
                    { name: 'Cancel', value: false }
                ]
            }
        ])
        if (!action) {
            return
        } else if (action === 'overwrite') {
            console.log(`\nRemoving ${chalk.cyan(targetDir)}...`)
            await fs.remove(targetDir)
        }
    }

    const creator = new Creator(name, targetDir,)
    await creator.create(options)
}

module.exports = (...args) => {
    return create(...args).catch(err => {
       console.log(chalk.red(err));
    })
}
