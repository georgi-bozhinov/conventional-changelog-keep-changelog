'use strict'
var conventionalChangelogCore = require('conventional-changelog-core')
var preset = require('../')
var expect = require('chai').expect
var mocha = require('mocha')
var describe = mocha.describe
var it = mocha.it
var gitDummyCommit = require('git-dummy-commit')
var shell = require('shelljs')
var through = require('through2')
var path = require('path')
var betterThanBefore = require('better-than-before')()
var preparing = betterThanBefore.preparing

betterThanBefore.setups([
  function () {
    shell.config.silent = true
    shell.rm('-rf', 'tmp')
    shell.mkdir('tmp')
    shell.cd('tmp')
    shell.mkdir('git-templates')
    shell.exec('git init --template=./git-templates')

    gitDummyCommit(['add: amazing new module', 'BREAKING CHANGE: Not backward compatible.'])
    gitDummyCommit(['fix: avoid a bug', 'BREAKING CHANGE: The Change is huge.'])
    gitDummyCommit('fix: oops')
  },
  function () {
    gitDummyCommit(['add: addresses the issue brought up in #133'])
  },
  function () {
    gitDummyCommit(['add: fix #88'])
  },
  function () {
    gitDummyCommit(['fix: issue brought up by @bcoe! on Friday'])
  },
  function () {
    shell.exec('git tag v1.0.0')
    gitDummyCommit('add: some more features')
  },
  function () {
    gitDummyCommit(['add: implementing #5 by @dlmr', ' closes #10'])
  },
  function () {
    gitDummyCommit(['add: use npm@5 (@username)'])
  }
])

describe('keep a changelog preset', function () {
  it('should work if there is no semver tag', function (done) {
    preparing(1)

    conventionalChangelogCore({
      config: preset
    })
      .on('error', function (err) {
        done(err)
      })
      .pipe(through(function (chunk) {
        chunk = chunk.toString()

        expect(chunk).to.include('amazing new module')
        expect(chunk).to.include('Not backward compatible.')
        expect(chunk).to.include('The Change is huge.')
        expect(chunk).to.include('Added')
        expect(chunk).to.include('Fixed')
        expect(chunk).to.include('BREAKING CHANGE')

        done()
      }))
  })

  it('should replace #[0-9]+ with GitHub issue URL', function (done) {
    preparing(2)

    conventionalChangelogCore({
      config: preset
    })
      .on('error', function (err) {
        done(err)
      })
      .pipe(through(function (chunk) {
        chunk = chunk.toString()
        expect(chunk).to.include('[#133](https://github.com/conventional-changelog/conventional-changelog/issues/133)')
        done()
      }))
  })

  it('should remove the issues that already appear in the subject', function (done) {
    preparing(3)

    conventionalChangelogCore({
      config: preset
    })
      .on('error', function (err) {
        done(err)
      })
      .pipe(through(function (chunk) {
        chunk = chunk.toString()
        expect(chunk).to.include('[#88](https://github.com/conventional-changelog/conventional-changelog/issues/88)')
        expect(chunk).to.not.include('closes [#88](https://github.com/conventional-changelog/conventional-changelog/issues/88)')
        done()
      }))
  })

  it('should replace @username with GitHub user URL', function (done) {
    preparing(4)

    conventionalChangelogCore({
      config: preset
    })
      .on('error', function (err) {
        done(err)
      })
      .pipe(through(function (chunk) {
        chunk = chunk.toString()
        expect(chunk).to.include('[@bcoe](https://github.com/bcoe)')
        done()
      }))
  })

  it('should work if there is a semver tag', function (done) {
    preparing(6)
    var i = 0

    conventionalChangelogCore({
      config: preset,
      outputUnreleased: true
    })
      .on('error', function (err) {
        done(err)
      })
      .pipe(through(function (chunk, enc, cb) {
        chunk = chunk.toString()

        expect(chunk).to.include('some more features')
        expect(chunk).to.not.include('BREAKING')

        i++
        cb()
      }, function () {
        expect(i).to.equal(1)
        done()
      }))
  })

  it('should work with unknown host', function (done) {
    preparing(6)
    var i = 0

    conventionalChangelogCore({
      config: preset,
      pkg: {
        path: path.join(__dirname, 'fixtures/_unknown-host.json')
      }
    })
      .on('error', function (err) {
        done(err)
      })
      .pipe(through(function (chunk, enc, cb) {
        chunk = chunk.toString()

        expect(chunk).to.include('(http://unknown/compare')
        expect(chunk).to.include('](http://unknown/commits/')

        i++
        cb()
      }, function () {
        expect(i).to.equal(1)
        done()
      }))
  })

  it('should work specifying where to find a package.json using conventional-changelog-core', function (done) {
    preparing(7)
    var i = 0

    conventionalChangelogCore({
      config: preset,
      pkg: {
        path: path.join(__dirname, 'fixtures/_known-host.json')
      }
    })
      .on('error', function (err) {
        done(err)
      })
      .pipe(through(function (chunk, enc, cb) {
        chunk = chunk.toString()

        expect(chunk).to.include('(https://github.com/conventional-changelog/example/compare')
        expect(chunk).to.include('](https://github.com/conventional-changelog/example/commit/')
        expect(chunk).to.include('](https://github.com/conventional-changelog/example/issues/')

        i++
        cb()
      }, function () {
        expect(i).to.equal(1)
        done()
      }))
  })

  it('should fallback to the closest package.json when not providing a location for a package.json', function (done) {
    preparing(7)
    var i = 0

    conventionalChangelogCore({
      config: preset,
      outputUnreleased: true
    })
      .on('error', function (err) {
        done(err)
      })
      .pipe(through(function (chunk, enc, cb) {
        chunk = chunk.toString()

        expect(chunk).to.include('(https://github.com/conventional-changelog/conventional-changelog/compare')
        expect(chunk).to.include('](https://github.com/conventional-changelog/conventional-changelog/commit/')
        expect(chunk).to.include('](https://github.com/conventional-changelog/conventional-changelog/issues/')

        i++
        cb()
      }, function () {
        expect(i).to.equal(1)
        done()
      }))
  })

  it('should support non public GitHub repository locations', function (done) {
    preparing(7)

    conventionalChangelogCore({
      config: preset,
      pkg: {
        path: path.join(__dirname, 'fixtures/_ghe-host.json')
      }
    })
      .on('error', function (err) {
        done(err)
      })
      .pipe(through(function (chunk) {
        chunk = chunk.toString()

        expect(chunk).to.include('(https://github.internal.example.com/dlmr')
        expect(chunk).to.include('(https://github.internal.example.com/conventional-changelog/internal/compare')
        expect(chunk).to.include('](https://github.internal.example.com/conventional-changelog/internal/commit/')
        expect(chunk).to.include('5](https://github.internal.example.com/conventional-changelog/internal/issues/5')
        expect(chunk).to.include(' closes [#10](https://github.internal.example.com/conventional-changelog/internal/issues/10)')

        done()
      }))
  })

  it('should only replace with link to user if it is an username', function (done) {
    preparing(8)

    conventionalChangelogCore({
      config: preset,
      outputUnreleased: true
    })
      .on('error', function (err) {
        done(err)
      })
      .pipe(through(function (chunk) {
        chunk = chunk.toString()

        expect(chunk).to.not.include('(https://github.com/5')
        expect(chunk).to.include('(https://github.com/username')

        done()
      }))
  })
})
