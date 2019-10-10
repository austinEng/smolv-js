# smolv.js

## Overview

smolv.js is a JavaScript port of [SMOL-V](https://github.com/aras-p/smol-v) which transforms [SPIR-V](https://www.khronos.org/registry/spir-v/) into a smaller form that is more compressible.

This project aims to make a Web version of SMOL-V that also has a tiny binary size. The smolv.js decoder is a single 2.4 kB (compressed) JavaScript file.

SMOL-V relies on some static data which defines how to compress some of the most common ops. The data is mostly boolean information so in smolv.js, it's packed and compressed so it can be represented with one or two characters in the minified JavaScript file. The most common values are also completely ommitted and inferred at runtime with a default.
