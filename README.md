# puree

Bundler for .js files produced by PureScript.  It's main goal is producing the smallest
bundle possible.  It accomplishes this goal by:
- converting the input .js files to ES6 modules
- bundling them using rollup which eliminates a large amount of dead code
- running PureScript specific dead-code elimination on the resulting bundle

The result is an ES6 bundle containing only the code necessary for the app to run.
`puree` also converts any common js dependencies to ES6 modules so that the bundle
can import its dependencies without additional work.

# Quick Start

- check out this repo
- yarn
- yarn link
- (in your own repo) yarn link puree
- (in your onw repo) puree --help
