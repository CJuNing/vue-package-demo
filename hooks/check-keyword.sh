#!/bin/bash

red=`tput setaf 1`
green=`tput setaf 2`
reset=`tput sgr0`
# echo "${red}red text ${green}green text${reset}"

echo  "${green}start checking keyword${reset}"

variable=0

for FILE in `git diff --name-only --cached`; do

    # if [[ $FILE == *".sh"* ]] || [[ $FILE == *"vendor/*"* ]] ||[[$FILE == *"node_modules/*"*]]||[[$FILE == *"public/*"*]]; then
    #     # echo $FILE
    #     continue
    # fi
    # grep 'TODO:\|debugger\|console.log\|alert(' $FILE 2>&1 >/dev/null
    grep 'debugger' $FILE 2>&1 >/dev/null
    if [ $? -eq 0 ]; then
        echo $FILE '中包含"debugger",请删除后重试!'
        variable=1
    fi
    
done
exit