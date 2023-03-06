#!/bin/bash
REPOSITORY=/home/ubuntu/deploy
sudo pm2 kill
cd $REPOSITORY

sudo rm -rf server