#!/bin/bash
DATE=$(date +"%Y-%m-%d_%H%M")
raspistill -t 1 -o ./public/snapshots/$DATE.jpg cfx 128: 128
