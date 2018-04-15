#!/bin/sh
set -e

BUILD_DIR=./build

if test -s $KEYSTORE; then
    echo "$KEYSTORE exists"
  else
    exec keystore.js
fi

if [ ! -d "$BUILD_DIR" ]; then
  exec createAdmin.js
fi

exec "$@"