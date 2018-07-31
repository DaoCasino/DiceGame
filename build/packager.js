const path = require('path')
const packager = require('electron-packager')

const platform = process.env.PLATFORM

function join(inpPath) {
  return path.join(__dirname, inpPath)
}

console.log('')
console.log('-----------------------------------')
console.log(`Create app for ${platform} platform`)
console.log('-----------------------------------')
console.log('')

packager({
  dir: join('../'),
  out: join('../build_release'),
  platform: platform,
  arch: 'x64',
  ignore: [
    '.babelrc',
    '.editorconfig',
    '.eslintignore',
    '.eslintrc.js',
    '.gitignore',
    '.postcssrc.js',
    'README.md',
    'TODOO.md'
  ]
}, (err, appPath) => {
  if (err) {
    throw new Error(err)
  }

  if (appPath.length > 1) {
    console.log(`build compleate check your apps ${appPath}`)
  } else {
    console.log(`build compleate check your app ${appPath[0]}`)
  }
})