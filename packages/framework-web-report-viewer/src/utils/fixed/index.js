import { getMainMergedCell } from "@utils/tool"

/**
 * 获得冻结区域行号列号
 * @param {Object} Json 表格数据 mixSheetData
 * @param {Number} rowIndex 行号
 * @param {Number} colIndex 列号
 */
export const getColandRow = (Json, rowIndex, colIndex) => {
    let resCol = null;
    let resRow = null;
    if(rowIndex) {
        resRow = getRowJson(Json, rowIndex);
    }
    if(colIndex) {
        resCol = getColJson(Json, colIndex);
    }
    return { resCol, resRow }
}

/**
 * 获得最大容错行数据
 * @param {Object} Json 表格数据 mixSheetData
 * @param {Number} rowIndex 行号
 * @description 通过行号获取行的信息 
 */
export const getRowJson = (json, rowIndex) => {
    //初始化数据
    const NUM = rowIndex;
    let defaultHeight = json.dp.report.height.defaultValue;
    let totalHeight = 0;
    json.sheet.rows.some((cur, index) => {
        if (index !== NUM) {
            if (!!cur.p.height) {
                totalHeight += cur.p.height;
            } else {
                totalHeight += defaultHeight;
            }
        }
        return index === NUM
    })

    //判断rowspan 是否溢出
    let rowspanTotal = getMaxRowspan(NUM, json.sheet.rows)

    // let newRows = json.sheet.rows.filter((item, index) => (index <= rowspanTotal))
    let newJson = JSON.parse(JSON.stringify(json))
    newJson.sheet.rows.splice(rowspanTotal + 1);
    console.log(`行冻结 => 可视区域高度: ${totalHeight}; 最大行数: ${rowspanTotal}`);
    return { newJson, totalHeight, rowspanTotal }

}

/**
 * 
 * @param {object} json 
 * @param {Number} colIndex 
 * @description 通过列排序获取列信息
 */
export const getColJson = (json, colIndex) => {
    const NUM = colIndex;
    let defaultWidth = json.dp.report.width.defaultValue;

    let totalWidth = 0;
    json.sheet.cols.some((cur, index) => {
        if (index !== NUM) {
            if (!!cur.p.width) {
                totalWidth += cur.p.width;
            } else {
                totalWidth += defaultWidth;
            }
        }
        return index === NUM
    });

    //判断colspan 是否溢出
    let colspanTotal = getMaxColspan(NUM, json.sheet.rows)

    // let newCols = json.sheet.cols.filter((item, index) => index <= colspanTotal);
    let newJson = JSON.parse(JSON.stringify(json));
    newJson.sheet.cols.splice(colspanTotal + 1);
    newJson.sheet.rows.forEach(row => {
        row.cells.splice(colspanTotal + 1);
    });
    console.log(`列冻结 => 可视区域宽度: ${totalWidth}; 最大列数: ${colspanTotal}`);
    return { newJson, totalWidth, colspanTotal }
}

/**
 * 基于行号获得最大的行区域
 * @param {Number} rowIndex 
 * @param {Object} rows 
 */
let getMaxRowspan = (rowIndex, rows) => {
    let mergedCells = [];
    rows[rowIndex].cells.forEach((cell, cellIndex) => {
        if (cell.p.rowspan > 1 || cell.p.colspan > 1) {
            mergedCells.push({
                mainRowIndex: rowIndex,
                mainColIndex: cellIndex,
                rowspan: cell.p.rowspan || 1,
                colspan: cell.p.colspan || 1,
            });
        } else if (cell.p.rowspan === 0 || cell.p.colspan === 0) {
            mergedCells.push(getMainMergedCell(rowIndex, cellIndex, rows))
        }
    });
    let maxRowIndex = mergedCells.reduce((org, cell) => {
        return Math.max(org, cell.rowspan + cell.mainRowIndex - 1);
    }, rowIndex);

    if (maxRowIndex > rowIndex) {
        return getMaxRowspan(maxRowIndex, rows);
    } else {
        return maxRowIndex;
    }
}

/**
 * 基于列号获得最大的列区域
 * @param {Number} colIndex 
 * @param {Object} rows 
 */
let getMaxColspan = (colIndex, rows) => {
    let mergedCells = [];
    rows.forEach((row, rowIndex) => {
        let cell = row.cells[colIndex];
        if (cell.p.rowspan > 1 || cell.p.colspan > 1) {
            mergedCells.push({
                mainRowIndex: rowIndex,
                mainColIndex: colIndex,
                rowspan: cell.p.rowspan || 1,
                colspan: cell.p.colspan || 1,
            });
        } else if (cell.p.rowspan === 0 || cell.p.colspan === 0) {
            mergedCells.push(getMainMergedCell(rowIndex, colIndex, rows))
        }
    });

    let maxColIndex = mergedCells.reduce((org, cell) => {
        return Math.max(org, cell.colspan + cell.mainColIndex - 1);
    }, colIndex);

    if (maxColIndex > colIndex) {
        return getMaxRowspan(maxColIndex, rows);
    } else {
        return maxColIndex;
    }
}