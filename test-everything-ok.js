var fs = require('fs')
var test = require('tape')
var glob = require('glob')
var async = require('async')
var frontMatter = require('front-matter')

test('all YAML front matter is OK', function (t) {
  t.plan(1)
  glob('20[0-9][0-9]/**/*.md', function (err, files) {
    async.each(files, validateFrontMatter(readFile), function (err) {
      if (err) {
        t.fail(err)
      } else {
        t.pass('YAML front matter is fine')
      }
    })
  })
})

function readFile (file, cb) {
  fs.readFile(file, {encoding: 'utf8'}, cb)
}

function validateFrontMatter (reader) {
  return function (file, cb) {
    reader(file, function (err, result) {
      if (err) return cb(err)
      try {
        frontMatter(result)
        cb() // If didn't throw, it's valid
      } catch (err) {
        cb(new Error('Error parsing front matter in: ' + file))
      }
    })
  }
}
