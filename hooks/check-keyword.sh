#!/bin/bash

red=`tput setaf 1`
green=`tput setaf 2`
reset=`tput sgr0`
# echo "${red}red text ${green}green text${reset}"

echo  "${green}pre-commit: 开始检查非法关键字${reset}"

result=0

for FILE in `git diff --name-only --cached`; do

    if [[ $FILE == *".sh"* ]] || [[ $FILE == *"vendor/*"* ]] || [[ $FILE == *"node_modules/*"* ]] || [[ $FILE == *"public/*"* ]]; then
        # echo $FILE
        continue
    fi
    # grep 'TODO:\|debugger\|console.log\|alert(' $FILE 2>&1 >/dev/null
    # grep 'debugger' $FILE 2>&1 >/dev/null
    # if [ $? -eq 0 ]; then
    #     echo "${red}"$FILE "中包含 'debugger',请删除后重试!${reset}"
    #     result=1
    # fi
    # grep 'alert(' $FILE 2>&1 >/dev/null
    # if [ $? -eq 0 ]; then
    #     echo "${red}文件" $FILE "中包含 'alert' 方法,请删除后重试!${reset}"
    #     result=1
    # fi
    # grep -n 'debugger\|alert(' $FILE rrravs
    # grep 'debugger\|alert(' $FILE 2>&1 >/dev/null
    grep -n 'debugger\|alert(' $FILE --include *.{js,vue} 2>&1 >/dev/null
    if [ $? -eq 0 ]; then
        echo "${red}pre-commit: 文件" $FILE "中包含 非法关键字 ,请删除后重试!${reset}"
        result=1
    fi
    
done
exit $result