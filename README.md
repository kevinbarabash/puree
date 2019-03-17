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

# Bundle sizes

These are from [purescript-calculator-example](https://github.com/kevinbarabash/purescript-calculator-example):

- pulp: 54 K
- purs bundle (with -m): 54 K
- rollup (using rollup-plugin-purs with uncurry:false): 16 K
- puree: 14 K

These numbers exclude node_modules dependencies.  All bundles are non-minified.
`rollup` and `puree` remove comments.  The main difference in puree's output is
that it converts function expressions to arrow expressions.

# TODO

- port arrow function code to [rollup-plugin-purs](https://github.com/Pauan/rollup-plugin-purs)
- fix bug with foreign modules that export `default` as an identifier
- inline single-use variable within functions
