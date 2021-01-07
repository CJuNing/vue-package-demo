
/**
 * @description 计算表的宽度，目前用于是否居中显示
 * @param {} mixdata 单元格信息（——只读）
 */
export default function(mixdata){
    console.log(mixdata)

    let defaultWidth = mixdata.dp.report.width.defaultValue;
    let totalWidth = 0;
    mixdata.sheet.cols.forEach(cur => {
        if (!!cur.p.width) {
            totalWidth += cur.p.width;
        } else {
            totalWidth += defaultWidth;
        }
    });

    return totalWidth
}