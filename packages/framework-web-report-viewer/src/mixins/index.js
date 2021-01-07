/**
 * @description 数据中心
 * @author kangbing
 * @time 2020-08-01
 */

/* import reqInputData from './../json/reqInputData.json'
import reqSheetData from './../json/reqSheetData.json' */

import NameIndexEx from '@/utils/nameIndexEx'

import defaultData from './default.json'
import myFloat from "./float";

import {
    reqsheetData_api,
    reqinputData_api,
    saveinputData_api
} from '@/api'
export default {
    mixins: [ myFloat],
    data() {
        return {
            reqInputData: {
                fixedFillData: [],
                floatFillData: []
            },//填报单元格是否有信息。有 append，没有新增。
            reqSheetData: defaultData,
            mixData: defaultData,
        };
    },
    methods: {

        /**
         * @description 发送请求 获取数据
         */
        async reqData() {

            try {
                let result = await reqsheetData_api(this.reportFile);
                let reqSheetData = JSON.parse(result.data[0].data);
                this.reqSheetData = JSON.parse(JSON.stringify(reqSheetData));
                this.mixData = reqSheetData;
                console.log('内存对象',this.mixData.sheet.rows)
                //初始化表式数据时，先把floatFillData的结构初始化出来
                this.createfloatData();

                
            } catch (error) {
                this.$message({
                    showClose: true,
                    type: "error",
                    message: "请求错误，请检查网络"
                })
            }

        },

        /**
         * @description 加载填报数据,生成mixdata  
         * @return null
         */
        createMix() {
            this.$confirm('此操作将覆盖已有的填报信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                //加载inputdATA
                try {
                    let result = await reqinputData_api(this.reportFile);
                    let fixedFillData = JSON.parse(result.data[0].data.fixedFillData);
                    let floatFillData = JSON.parse(result.data[0].data.floatFillData)
                    this.reqInputData = {
                        fixedFillData,
                        floatFillData
                    }
                    console.log(this.reqInputData, 'this.reqInputData')
                } catch (error) {
                    this.$message({
                        showClose: true,
                        type: "error",
                        message: "请求错误，请检查网络"
                    })
                    return
                }
                //填报单元格信息//只读-----------------
                const fixedFillData = this.reqInputData.fixedFillData;
                //浮动单元格信息
                const floatFillData = this.reqInputData.floatFillData;
                
                //浮动处理// 必須是先浮動後填報 由於數據的煙癮
                this.addfloat(floatFillData)
                //填报处理
                this.addInput(fixedFillData)

                //返回处理好的mixdata
                console.log(this.mixData, 'my mixData')
                
                if(this.Fixed.isFixed){
                    this.fixed({ci:this.Fixed.ci,ri:this.Fixed.ri});
                }
            }).catch((error) => {
                this.$message({
                    showClose: true,
                    type: 'info',
                    message: '已取消'
                });
                console.log(error,'加载填报数据')
            });

        },

        /**
         * @description updatedInputData,生成新的mixdata
         */
        updatedInputData(info) {
            let value = info.data;
            let ci = info.cell.ci;
            let ri = info.cell.ri;
            this.mixData.sheet.rows[ri].cells[ci].p.cellValue = value;
            console.log('实时内存对象', this.mixData.sheet.rows)
        },

        /**
         * @description 生成inutDATA.floatData
         */
        createfloatData() {
            this.reqInputData.floatFillData = [];
            let rows = this.mixData.sheet.rows;
            for (let i = 0; i < rows.length; i++) {
                const cols = rows[i].cells;
                for (let j = 0; j < cols.length;) {
                    const childItem = cols[j];
                    if (childItem.p.float_uuid) {
                        let columns = [],
                            dataType = [],
                            floatColspan = childItem.p.float_colspan,
                            floatRowspan = childItem.p.float_rowspan;
                        let columnIndex = NameIndexEx.nameToIndex(childItem.p.name.replace(/[0-9]/g, '')),
                            rowIndex = childItem.p.name.replace(/[A-Z]/g, '');
                        for (let n = 0; n < floatColspan; n++) {
                            columns.push(`${NameIndexEx.indexToName(columnIndex)}${rowIndex}`);
                            dataType.push(null);
                            columnIndex++;
                            j++;
                        }
                        this.reqInputData.floatFillData.push({
                            meta: {
                                uuid: childItem.p.float_uuid,
                                columns,
                                dataType
                            },
                            data: []
                        });
                    }else {
                        j++;
                    }
                }
            }
        },

        /**
         * @description 更新mixdata
         * @return null
         */
        updateMix() {

        },

        /**
         * @description 解析mixdata 保存填报数据
         * @return {object} reqInputData
         * @return {object} reqSheetData
         * @param {object} mixData
         */
        resolveMix(mixData) {
            //1、拿到所有浮动格
            let floatFillData = JSON.parse(JSON.stringify(this.reqInputData.floatFillData));
            //先清空之前的数据
            floatFillData.forEach(item => {
                item.data = [];
            });

            let fixedFillData = [],
                floatCell = [];
            let arr = [];
            mixData.sheet.rows.forEach((item, index) => {
                let isNewRow = true;
                item.cells.forEach((childItem, childrenIndex) => {
                    let cellName = childItem.p.name;
                    floatCell = floatFillData.filter(element => element.meta.columns.includes(cellName));
                    if (floatCell.length === 1 && childItem.p.fill_canFill === 1) {//可填报的浮动单元格
                        // console.log(childItem.p.rowspan )
                        if(isNewRow) {//没一个新行，push一个空数组。这个方式是基于每行只能有一个浮动块的情况
                            floatCell[0].data.push([]);
                            isNewRow = false;   
                        }
                        // console.log('debug', childItem.p.rowspan, childItem.p.cellValue, arr, childrenIndex)
                        if(childItem.p.rowspan >= 1 || childItem.p.rowspan === undefined){
                            arr[childrenIndex] = childItem.p.cellValue
                        }
                        floatCell[0].data[floatCell[0].data.length-1].push(arr[childrenIndex]);

                        
                        // floatCell[0].data[floatCell[0].data.length-1].push(childItem.p.cellValue);
                    } else if (floatCell.length === 0 && childItem.p.fill_canFill === 1) {//拿到可填报的非浮动单元格
                        let newCellName = `${NameIndexEx.indexToName(childrenIndex+1)}${index+1}`;
                        fixedFillData.push([newCellName, childItem.p.cellValue ? childItem.p.cellValue : null, 1]);
                    }
                });
            });
            return {
                fixedFillData,
                floatFillData
            }
        },

        /**
         * @description 保存填报的数据
         * @param {object} inputdata 填报的数据
         */
        saveinputData(inputdata) {
            console.log("存储对象",inputdata)
            saveinputData_api(inputdata,this.reportFile)
                .then(res => {
                    this.$message({
                        showClose: true,
                        message: '保存成功！',
                        type: 'success'
                    });
                    console.log(res)
                }).catch(err => {
                    this.$message.error('保存失败，请在调试模式下，查看失败原因！');
                    console.log(err);
                });
        },

        /**
         * @description 工具类 为了找跨行的元素
         * @param {Number} rowIndex 行号
         * @param {Number} colIndex 列号
         * @return {Number} index 行号 rowspan>= 1 的元素 
         * @error 什么都不会返回
         */
        findRowspan(rowIndex, colIndex) {
            const rows = this.mixData.sheet.rows;
            const oneRows = rows.slice(0, rowIndex);
            const twoRows = oneRows.reverse();
            const index = twoRows.findIndex((twoRowsItem) => twoRowsItem.cells[colIndex].p.rowspan !== 0);
            if (index !== -1) {
                return twoRows.length - 1 - index
            }
        },

        /**
         * @description 工具类 新增浮动元素，rowspan增加，增加空行
         * @param {Object} floatFillData 浮动的数据 
         */
         addfloat(floatFillData) {
            //reset mixdata ,because inputdata is changed, will update;
            this.mixData = JSON.parse(JSON.stringify(this.reqSheetData));
            const rows = this.mixData.sheet.rows;
            floatFillData.forEach(element => {
                //inset row index
                let hangIndex = rows.findIndex((item) => item.p.name === element.meta.columns[0].replace(/[a-zA-Z]/g, ''))
                //inset row num
                let addHangNum = element.data.length;
                // if data is only one,mixdata not need push;
                if (addHangNum===1) {
                    rows[hangIndex].cells.forEach((rowcell) => {
                        let FloatIndex = element.meta.columns.findIndex((item) => item === rowcell.p.name);
                        if (FloatIndex !== -1) {
                            rowcell.p.cellValue = element.data[0][FloatIndex]
                        }
                    })
                }
                //data is > 1
                let colIndex = 0;//主格列号
                let rowIndex = hangIndex;//主格行号
                for (let index = 0; index < addHangNum; index++) {
                    //index data中index
                    if(index===0){
                        rows[hangIndex].cells.forEach((rowcell) => {
                            let FloatIndex = element.meta.columns.findIndex((item) => item === rowcell.p.name);
                            if (FloatIndex !== -1) {
                                rowcell.p.cellValue = element.data[0][FloatIndex]
                            }
                        })
                    }else{
                        for (let j = 0; j < element.data[index-1].length; j++) {
                            let element1 = element.data[index-1][j];
                            let element2  = element.data[index][j];
                            if( element1!==element2 || j===element.data[index-1].length-1 ){
                                if(colIndex !== j){
                                    colIndex = j;
                                    rowIndex = hangIndex+index-1;
                                }else{
                                    rowIndex = hangIndex+index-1;
                                }
                                break;
                            }
                        }
                        let appendData = {index:element.meta.columns,value:element.data[index]};
                        console.log(rowIndex, colIndex, 'after',appendData);
                         this.addFloatRowWidthData(rowIndex, colIndex, 'after',appendData )
                    }
                    
                }
            });

            console.log('加载完成填报数据后的内存数据', this.mixData)
        },
        /**
         * @description 工具类 新增填报元素
         * @param {Object} fixedFillData 填报的数据
         */
        addInput(fixedFillData) {
            fixedFillData.forEach((element) => {
                //row
                let hangIndex = Number(element[0].replace(/[a-zA-Z]/g, '')) - 1;
                //col
                let lieIndex = NameIndexEx.nameToIndex(element[0].replace(/[0-9]/g, '')) - 1;
                
                //the value is not null
                if (element[1]) {
                    //the inputdata is depends on the floatData,so this is use mixdata;
                    this.mixData.sheet.rows[hangIndex].cells[lieIndex].p.cellValue = element[1];
                }
            })
            console.log('实时内存对象', this.mixData.sheet.rows)
        }

    }


}