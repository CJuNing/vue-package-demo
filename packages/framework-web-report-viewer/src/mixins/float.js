/**
 * @description 浮动相关方法
 * @author kangbing
 * @time 2020-08-06
 */

import {
  getMainMergedCell
} from "@utils/tool"
export default {
  data(){
    return {
      floatMes:{}
    }
  },
  methods: {

    /**
     * @description 浮动行方法，包括向前浮动、向后浮动、删除浮动
     * @param {String} floatType 浮动方式，取值：before/after/delete
     * @param {Object} currentName {行号，列号}
     */
    floatRow(floatType,currentName) {
      let {
        ri,
        ci
      } = currentName;
      ri = Number(ri);
      ci = Number(ci);
      //find uuid 
      const uuid = this.finduuid(ri, ci);
      //this cell is not float;
      if (!uuid) {
        this.$message({
          showClose: true,
          type: 'error',
          message: '操作失误，请确认操作是否正确。'
        })
        return
      }
      if (floatType === "before" || floatType === "after") {
        this.addFloatRowWidthData(ri, ci, floatType);
      } else {
        this.deleteFloatRowWidthData(ri, ci);
      }
      if(this.Fixed.isFixed){
        this.fixed({ci:this.Fixed.ci,ri:this.Fixed.ri});
      }
    },

    /**
     * 插入浮动数据（可传入value） 每次插入一行
     * 
     * @public
     * @function
     * @param {Number} rowIndex [行号]
     * @param {Number} colIndex [列号]
     * @param {String} type [插入浮动行方向before/after]
     * @param {Object} data [待插入的浮动单元格的数据 只单行] 
     * {index:[a2,a3,a4],value:[]}
     * @example
     * addFloatRowWidthData(1, 2, "after",{index:[a2,a3,a4],value:[]});
     */
    addFloatRowWidthData: function (rowIndex, colIndex, type, data) {
      //生成floatMes
      this.createFloatMes(rowIndex);
      console.log(this.floatMes,'浮动的默认值信息')
      //before + after 处理
      let isappendBefore = false;
      if (type == 'before') {
        //find uuid 1
        const uuid1 = this.finduuid(rowIndex, colIndex);
        rowIndex = rowIndex - 1;
        //find uuid 2
        const uuid2 = this.finduuid(rowIndex, colIndex);
        if (!uuid2 || uuid1.p.float_uuid !== uuid2.p.float_uuid) {
          rowIndex = rowIndex + 1;
          isappendBefore = true;
        }
      }


      const rows = this.mixData.sheet.rows;

      let level = 0;
      let cellsItem = this.finduuid(rowIndex, colIndex);
      if (cellsItem) {
        level = cellsItem.p.float_level;
      }
      let mianArr = []; //临时变量

      let newRow = JSON.parse(JSON.stringify(rows[rowIndex]));

      //暂时的变量
      let isfooterLevel = 0;
      let expendIndexstart = -1;
      let expendIndexend = -1;
      rows[rowIndex].cells.forEach((rowcell, i) => {

        //判断level值
        if (rowcell.p.float_level) {
          isfooterLevel = rowcell.p.float_level;
          expendIndexstart = i;
          expendIndexend = i - 1 + rowcell.p.float_colspan;
        } else if (rowcell.p.float_level === undefined) {
          if (i < expendIndexstart || i > expendIndexend) {
            isfooterLevel = 0;
          }
        }
        //主要逻辑

        if (isfooterLevel < level) {
          //level 小的单元格
          if (rowcell.p.rowspan === undefined) {
            rowcell.p.rowspan = 2;
          } else if (rowcell.p.rowspan === 0) {
            const {
              mainRowIndex,
              mainColIndex
            } = getMainMergedCell(rowIndex, i, rows);
            if (!mianArr.find((item) => item.mainRowIndex === mainRowIndex && item.mainColIndex === mainColIndex)) {
              rows[mainRowIndex].cells[mainColIndex].p.rowspan += 1;
              mianArr.push({
                mainRowIndex,
                mainColIndex
              });
            }
          } else {
            rowcell.p.rowspan += 1;
          }
          newRow.cells[i].p.rowspan = 0;
          newRow.cells[i].p.colspan = 0;

          //===========关于数据的处理============

          if (data === undefined) {
            //值 置为空
            if (newRow.cells[i].p.cellValue) {
              newRow.cells[i].p.cellValue = null;
              if(newRow.cells[i].p.name){
                newRow.cells[i].p.cellValue = this.floatMes[newRow.cells[i].p.name];
              }
              
            }

          }else{
            //数据不为空，且向下浮动， 向上浮动时不支持数据的写入；
            const cellsIndex = data.index.findIndex((item)=>newRow.cells[i].p.name && item===newRow.cells[i].p.name)
            if(cellsIndex!== -1){
              newRow.cells[i].p.cellValue=data.value[cellsIndex];
            }
          }


        } else {



          //level 比较大的单元格
          if (isappendBefore) {
            //before =====
            rowcell.p.rowspan = 1;
            rowcell.p.colspan = 1;

            //===========关于数据的处理============
            //此时向第一行之前添加空行，s level比较高的数据应该进行赋值操作给newrow ， 当前行的值清空；
            newRow.cells[i].p.cellValue = rowcell.p.cellValue;
            rowcell.p.cellValue = null;
          } else {
            //after =====
            newRow.cells[i].p.rowspan = 1;
            newRow.cells[i].p.colspan = 1;

            //===========关于数据的处理============level 不同必须分开处理数据，不然就会有问题==========
            if (data === undefined) {
              //值 置为空
              newRow.cells[i].p.cellValue = null;

              if(newRow.cells[i].p.name){
                newRow.cells[i].p.cellValue = this.floatMes[newRow.cells[i].p.name];
              }
            }else{
              //数据不为空，且向下浮动， 向上浮动时不支持数据的写入；
              const cellsIndex = data.index.findIndex((item)=>newRow.cells[i].p.name && item===newRow.cells[i].p.name)
              if(cellsIndex!== -1){
                newRow.cells[i].p.cellValue=data.value[cellsIndex];
              }
            }
          }


        }

      })
      newRow.p = {};
      //add rows
      console.log(newRow)
      if (rows[rowIndex].cells[colIndex].p.rowspan) {
        rows.splice(rowIndex + rows[rowIndex].cells[colIndex].p.rowspan, 0, newRow);
      } else {
        rows.splice(rowIndex + 1, 0, newRow);
      }

      console.log('实时内存对象', this.mixData.sheet.rows)
    },

    /**
     * 
     * @param {Number} ri  行号
     * @param {Number} ci  列号
     */
    deleteFloatRowWidthData(ri, ci) {
      //判断是否是一行
      const NUM  = this.mixData.sheet.rows[ri].cells[ci].p.rowspan || 1;
      const uuid1 = this.finduuid(ri - 1, ci);
      const uuid3 = this.finduuid(ri + NUM, ci);
      const uuid2 = this.finduuid(ri, ci);

      if (
        (!uuid1 && !uuid3) ||
        (!uuid3 && (uuid1 && uuid1.p.float_uuid !== uuid2.p.float_uuid)) ||
        (!uuid1 && (uuid3 && uuid3.p.float_uuid !== uuid2.p.float_uuid)) ||
        ((uuid1 && uuid1.p.float_uuid !== uuid2.p.float_uuid) && (uuid3 && uuid3.p.float_uuid !== uuid2.p.float_uuid))
      ) {
        this.$message({
          showClose: true,
          type: 'error',
          message: '仅有一行浮动时，不能被删除！'
        })
        return
      }

      //判断需要删除几行
      const DELETE_NUM  = this.mixData.sheet.rows[ri].cells[ci].p.rowspan || 1 ;
      for (let index = 0; index < DELETE_NUM; index++) {
        this.deleteFloat(ri,ci);
      }
     
    
    },
    /**
     * 
     * @param {*} ri 
     * @param {*} ci 
     */
    deleteFloat(ri,ci){
      //主要删除的逻辑
      const rows = this.mixData.sheet.rows;
      let mianArr = []; //临时变量 合并单元格可能已经进行过一次删减
      rows[ri].cells.forEach((element, i) => {
        if (element.p.rowspan === 0) {
          const {
            mainRowIndex,
            mainColIndex
          } = getMainMergedCell(ri, i, rows);
          if (!mianArr.find((item) => item.mainRowIndex === mainRowIndex && item.mainColIndex === mainColIndex)) {
            rows[mainRowIndex].cells[mainColIndex].p.rowspan -= 1;
            mianArr.push({
              mainRowIndex,
              mainColIndex
            });
          }
        } else if (element.p.rowspan > 1) {
          rows[ri + 1].cells[i] = element;
          rows[ri + 1].cells[i].p.rowspan = element.p.rowspan - 1;

        }
      });
      rows.splice(ri, 1);
    },

    /**
     * @description 生成当前浮动格子 表式的内容信息
     * @param {*} rowIndex 
     */
    createFloatMes(rowIndex){
      const index = this.mixData.sheet.rows[rowIndex].cells.findIndex((cellsItem,index)=>cellsItem.p.float_uuid&&cellsItem.p.float_level===1);
      const currentName = this.mixData.sheet.rows[rowIndex].cells[index].p.name;
      const float_colspan = this.mixData.sheet.rows[rowIndex].cells[index].p.float_colspan;
      if(!this.floatMes[currentName]){
        for (let j = index; j < float_colspan; j++) {
          const name = this.mixData.sheet.rows[rowIndex].cells[j].p.name;
          const value = this.mixData.sheet.rows[rowIndex].cells[j].p.cellValue;
          this.$set(this.floatMes,name , value);
        }
      }
    },

    /**
     * @description 找单行数据中的uuid
     * @return {object} 有uuid 项的单元格信息 
     */
    finduuid(ri, ci) {
      let uuid = false;
      if (this.mixData.sheet.rows[ri].cells[ci].p.float_uuid) {
        uuid = this.mixData.sheet.rows[ri].cells[ci].p.float_uuid;
        return this.mixData.sheet.rows[ri].cells[ci];
      } else {
        for (let index = ci - 1; index >= 0; index--) {
          const eluuid = this.mixData.sheet.rows[ri].cells[index].p.float_uuid;
          if (eluuid) {
            uuid = eluuid;
            return this.mixData.sheet.rows[ri].cells[index];
          }

        }
      }
      return uuid
    },

    


  }
};