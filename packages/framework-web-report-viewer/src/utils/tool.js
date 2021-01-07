/**
 * 基于行号列号 找到该td所属的合并主格
 * @param {Number} rowIndex 
 * @param {Number} colIndex 
 * @param {Object} rows 
 */
export const getMainMergedCell = (rowIndex, colIndex, rows) => {
    let mainRowIndex = rowIndex,
        mainColIndex = colIndex,
        rowspan = 1,
        colspan = 1;
    for (var ri = rowIndex; ri > 0; ri--) {
        mainRowIndex = ri;
        // 判断 cell的rowspan + cell的rowIndex - 1 是否等于 colIndex
        if (rows[ri].cells.some((cell, cellIndex) => {
            mainColIndex = cellIndex;
            colspan = cell.p.hasOwnProperty("colspan") ? cell.p.colspan : 1;
            rowspan = cell.p.hasOwnProperty("rowspan") ? cell.p.rowspan : 1;
            return colIndex >= cellIndex && colspan + mainColIndex - 1 >= colIndex;
        })) {
            break
        }
    }
    return {
        mainRowIndex,
        mainColIndex,
        colspan,
        rowspan,
    }
}