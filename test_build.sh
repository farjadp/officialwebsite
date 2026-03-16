#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo "Pulling latest..."
git fetch origin
git pull origin main

echo "Installing..."
npm install

echo "Building..."
npm run build
