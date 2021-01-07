/**
 *  created by wangcuijuan on 2020/8/7
 */
/** 
 * @param {string} name 
 * @returns {string}
 */
export function nameToIndex(name){
    var str=name.toLowerCase().split("");
    var num=0;
    var al = str.length;
    var getCharNumber = function(charx){
        return charx.charCodeAt() -96;
    };
    var numout = 0;
    var charnum = 0;
    for(var i = 0; i < al; i++){
        charnum = getCharNumber(str[i]);
        numout += charnum * Math.pow(26, al-i-1);
    };
    return numout;
} 
/** 
 * @param {string} index 
 * @returns {string}
 */
export function indexToName(index){
    index = Number(index);
    var stringArray = [];
    var numToStringAction = function(index){
        var num = index - 1;
        var a = parseInt(num / 26);
        var b = num % 26;
        stringArray.push(String.fromCharCode(64 + parseInt(b+1)));
        if(a>0){
            numToStringAction(a);
        }
    }
    numToStringAction(index);
    return stringArray.reverse().join("");
}

export default {
    nameToIndex,
    indexToName
}