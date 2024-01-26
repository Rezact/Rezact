#!/bin/bash

echo "Copying Static Build Files"
cp package.json dist/
cp README.md dist/
cp src/lib/rezact/rezact.d.ts dist/
cp src/lib/rezact/vite-build-plugin.js dist/
cp src/lib/rezact/config.js dist/
cp src/lib/rezact/config.d.ts dist/
echo "Finished"