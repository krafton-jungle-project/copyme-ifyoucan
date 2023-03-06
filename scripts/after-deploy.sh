#!/bin/bash
REPOSITORY=/home/ubuntu/deploy
sudo pm2 kill
cd $REPOSITORY

cd server
sudo rm -rf node_modules
sudo yarn install
sudo pm2 kill
sudo pm2 start pm2 start yarn --name dist/main.js -- start:prod