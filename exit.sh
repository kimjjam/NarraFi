#!/bin/bash

kill -9 $(netstat -nlp | grep :3000 | awk -F/ '{print $1}' | awk '{print $7}') 2> /dev/null
kill -9 $(netstat -nlp | grep :3001 | awk -F/ '{print $1}' | awk '{print $7}') 2> /dev/null