#! /usr/bin/env node
'use strict'

// Setup
const meow = require('meow')
const pkg = require('./package.json')
const fp = require('file-paths-win32')

// Main
const cli = meow(`
  Usage
    $ fp <filename>

  Options
    --full, -f  Perform recursive search over all drives
    --dirs, -d  <directories>... Directories to search

  Examples
    $ fp some-file.txt some-other-file.exe --dirs "C:\\path" "C:\\other\\path"
    "C:\\other\\path\\some-file.exe"
    "C:\\path\\subdir\\some-other-file.exe"
`, {
  alias: {
    f: 'full',
    d: 'dirs'
  },
  boolean: ['f', 'full'],
  default: {f: false, full: false}
})

;(function () {
  if (cli.flags.h) return cli.showHelp()
  if (cli.flags.v) return console.log(pkg.version)
  let opts = {}
  let dirs = cli.flags.d || cli.flags.dirs
  if (dirs) opts.hints = Array.isArray(dirs) ? dirs : [dirs]
  let full = cli.flags.f || cli.flags.full
  opts.full = !!full
  if (cli.input.length < 1) return console.log('No file names detected')
  fp(cli.input, opts)
    .then((paths) => { if (paths.length > 0) console.log(paths.join('\n')) })
    .catch(console.error)
})()
