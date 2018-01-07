module.exports = () => {
  const execa = require('execa')
  const path = require('path')
  const cwd = process.cwd()
  process.chdir(path.join(__dirname, '../../plugins/heroku-cli-status'))
  execa.sync('yarn')
  process.chdir(cwd)
}
