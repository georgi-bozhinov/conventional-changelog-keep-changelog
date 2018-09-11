# [![NPM version][npm-image]][npm-url]

## Keep a changelog convention

Keep a changelog's [commit message guidelines](https://keepachangelog.com/en/1.0.0/).

### Examples

Appears under "Added" header, pencil subheader:

```
add: 'graphiteWidth' option
```

Appears under "Fixed" header, with a link to issue #28:

```
fix: stop graphite breaking when width < 0.1

Closes #28
```

Appears under "Added" header, and under "Breaking Changes" with the breaking change explanation:

```
add: remove graphiteWidth option

BREAKING CHANGE: The graphiteWidth option has been removed. The default graphite width of 10mm is always used for performance reason.
```

The following commit and commit `667ecc1` do not appear in the changelog if they are under the same release. If not, the revert commit appears under the "Reverts" header.

```
revert: add: 'graphiteWidth' option

This reverts commit 667ecc1654a317a13331b17617d973392f415f02.
```

### Commit Message Format

A commit message consists of a **header**, **body** and **footer**.  The header has a **type**, **scope** and **subject**:

```
<type>: <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

### Revert

If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

### Type

If the prefix is `add`, `remove`, or `change`, or `fix`, it will appear in the changelog. Also, if there is any [BREAKING CHANGE](#footer), the commit will appear in the changelog. `remove` and `change` are considered to be breaking changes as well ( the package will be bumped by a major version ).

Other prefixes are up to your discretion. Suggested prefixes are `build`, `ci`, `docs` ,`style`, `refactor`, and `test` for non-changelog related tasks.

### Subject

The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer can contain any information about **Breaking Changes** and is also the place to
reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

[npm-image]: https://badge.fury.io/js/conventional-changelog-keep-changelog.svg
[npm-url]: https://npmjs.org/package/conventional-changelog-keep-changelog
<!--[travis-image]: https://travis-ci.org/conventional-changelog/conventional-changelog-angular.svg?branch=master
[travis-url]: https://travis-ci.org/conventional-changelog/conventional-changelog-angular
[daviddm-image]: https://david-dm.org/conventional-changelog/conventional-changelog-angular.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/conventional-changelog/conventional-changelog-angular
[coveralls-image]: https://coveralls.io/repos/conventional-changelog/conventional-changelog-angular/badge.svg
[coveralls-url]: https://coveralls.io/r/conventional-changelog/conventional-changelog-angular-->
