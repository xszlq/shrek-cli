const {execSync, exec} = require('child_process')
const {path} = require('path')
/**
 * 判断用户是否用 SSH 方式登录 git.dmall.com
 *
 * @export
 * @return {boolean}
 */
module.exports.shouldUseSSH = function(){
    try {
        execSync('ssh -T git@gitlab.dmall.com')
        return true
    } catch (e) {
        return false
    }
};

/**
 * 解析 git repo clone 路径中的项目信息，并生成对应 ssh 和 http 链接
 *
 * @export
 * @param {string} url git@gitlab.dmall.com:dorax/template-o2o.git or http://gitlab.dmall.com/dorax/template-o2o.git
 * @return git repo 信息
 */
module.exports.parseGitRepoUrl = function(url) {
    const gitlabName = 'gitlab.dmall.com'

    const urlArray = url.split(gitlabName)
    const projectUrl = urlArray[1].slice(1)

    return {
        name: path.basename(projectUrl, '.git'),
        ssh: `git@${gitlabName}:${projectUrl}`,
        http: `http://${gitlabName}/${projectUrl}`,
    }
}

module.exports.hasYarn = function(){
    try {
        execSync('yarn --version', { stdio: 'ignore' })
        return true
    } catch (e) {
        return false
    }
}
