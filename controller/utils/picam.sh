#!/bin/bash
DATE=$(date +"%Y-%m-%d_%H%M")
sudo raspistill -t 1 -o ./public/snapshots/$DATE.jpg
echo $DATE
