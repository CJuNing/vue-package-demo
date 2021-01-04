#!/bin/bash

red=`tput setaf 1`
green=`tput setaf 2`
green=`tput setaf 2`
cyan=`tput setaf 6`
reset=`tput sgr0`
yellow=`tput setaf 3`

echo  "${green}pre-commit: 开始检查非法关键字${reset}"

result=0

for FILE in `git diff --name-only --cached`; do

    # if [[ $FILE == *".sh"* ]] || [[ $FILE == *"vendor/*"* ]] || [[ $FILE == *"node_modules/*"* ]] || [[ $FILE == *"public/*"* ]]; then
    #     # echo $FILE
    #     continue
    # fi
    # grep 'debugger\|alert(' $FILE  2>&1 >/dev/null
    if [[ $FILE != *".js"* &&  $FILE != *".vue"* ]];then
        continue
    fi
    a=`grep -c 'debugger\|alert(' $FILE`
    if [ $? -eq 0 ]; then
        echo "${red}pre-commit: 错误!文件${yellow}" $FILE "${red}中包含${yellow} ${a} ${red}处非法字符,请删除后重试!${reset}"
        # grep -n 'debugger\|alert(' $FILE 
        result=1
    fi
    
done
exit ${result}