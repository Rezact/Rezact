#!/bin/bash

echo "Copying Static Build Files"
cp package.json dist/
cp README.md dist/
cp src/lib/rezact/rezact.d.ts dist/
echo "Finished"