<template>
<div>
    <div name="reportEdit" class="report-sheet-selector" tabindex="0" 
    :style="{
        height: (selectAreaStyle.height)+'px',
        width: (selectAreaStyle.width-1)+'px',
        left: (selectAreaStyle.left)+'px',
        top: selectAreaStyle.top+'px',
        'pointer-events': disabled
    }"> 
        <div v-if='!editFillType'></div>
        <el-input v-if='editFillType==0' placeholder="请选择文本" class="input edit-text-dom" ref='input' @focus='getFocus'
            type="textarea"
            v-model='editDataSelf'
            :rows="Math.round(editStyle.height/(14*1.5))"
            :style="{
                width: (editStyle.width-1)+'px',
                left:(editStyle.left?editStyle.left:0)+'px',
                top:(editStyle.top?editStyle.top:0)+'px'
            }">
        </el-input>
        <el-select  v-if='editFillType==2' v-model='editDataSelf' :visible-change='getSelectOptionData' class='select' placeholder="请选择" ref="select" @focus='getFocus'
            :style="{
                height: (editStyle.height-1)+'px',
                width: (editStyle.width-1)+'px',
                left:(editStyle.left?editStyle.left:0)+'px',
                top:(editStyle.top?editStyle.top:0)+'px'
            }">
            <el-option class='selectOption'
                v-for="item in selectOptionData"
                :key="item.value"
                :label="item.value"
                :value="item.label"
                >
            </el-option>
        </el-select>
        <el-date-picker v-if='editFillType==4' placeholder="请选择日期" class='dataPicker' ref='datapicker' @focus='getFocus'
            :style="{
                height: (editStyle.height-1)+'px',
                width: (editStyle.width-1)+'px',
                left:(editStyle.left?editStyle.left:0)+'px',
                top:(editStyle.top?editStyle.top:-25)+'px'
            }"
            value-format="yyyy-MM-dd"
            v-model="editDataSelf"
            type="date">
        </el-date-picker>
        <el-select  v-if='editFillType==5' v-model='editDataSelf' class='tree' :visible-change='getSelectOptionData' placeholder="请选择" ref="tree" @focus='getFocus'
            :style="{
                height: (editStyle.height-1)+'px',
                width: (editStyle.width-1)+'px',
                left:(editStyle.left?editStyle.left:0)+'px',
                top:(editStyle.top?editStyle.top:0)+'px'
            }">
            <el-option class='treeOption' :value="editDataSelf">
                <el-tree
                :data="treeOptionData"
                node-key="value"
                default-expand-all
                @node-click="handleNodeClick"
                ></el-tree>
            </el-option>
        </el-select>
        <!-- <input type="text" class="edit-date-dom edit-input-dom-blur hasDatepicker" id="dp1596434221179">
        <div class="edit-combox-dom edit-div-dom-blur jazz-field-comp jazz-comboxfield-comp" vtype="comboxfield" name="comp_j_03929114_1002" style="width: 0px; height: 0px;"></div>
        <div class="edit-tree-dom edit-div-dom-blur jazz-field-comp jazz-comboxtreefield-comp" vtype="comboxtreefield" name="comp_j_27741431_1004" style="width: 0px; height: 0px;"></div> -->
    </div>
</div>
</template>
<script>
import {
    getDropDownData_api
} from '@/api'
    export default {
        name: "reportEdit",
        components: {},
        props: ["editData","disabled","selectAreaStyle","editFillType","dataUrl"],
        data() {
            return {
                editDataSelf:"",
                // 配置项
                defaultProps:{
                    children: 'children',
                    label: 'label'
                },
                selectOptionData:[],
                treeOptionData:[]
            };
        },
        computed: {
            editStyle(){
                if(this.disabled=="none"){
                    return {width:1,height:1};
                }else{
                    return {width:this.selectAreaStyle.width,height:this.selectAreaStyle.height,top:1,left:1};
                }
            }
            
        },
        watch: {
            'editDataSelf':{
                handler(newName,oldName){
                    this.$emit("textChange",this.editDataSelf);
                },
                deep:true
            },
            'editData':{
                handler(newName,oldName){
                    this.editDataSelf=newName;
                },
                deep:true
            },
            'disabled':{
                handler(newName,oldName){
                    if(this.disabled=="none")
                        this.editDataSelf="";
                },
                deep:true
            }
        },
        beforeCreate() {
        },
        created() {
        },
        beforeMount() {
        },
        mounted() {
            this.editDataSelf=this.editData
            this.getSelectOptionData();
            this.getTreeOptionData();
            // console.log("fffff",this.editFillType);
            // this.setValue();

            // console.log("ffffff",this.dataUrl);
        },
        beforeUpdate() {
        },
        updated() {
        },
        beforeDestroy() {
        },
        destroyed() {
        },
        methods: {
            getFocus(){
                this.$emit("editFlagChange",2);
            },
            handleNodeClick(data){
                let label=data.label;
                this.editDataSelf=label;
            },
            getSelectOptionData(){
                // TODO
                // console.log("dataurlwai:",this.dataUrl);
                // if(this.dataUrl){
                // if(this.dataUrl){
                //      try {
                //         let result = await getDropDownData_api();
                //         this.selectOptionData = JSON.parse(result.data[0].data);
                //     } catch (error) {
                //         console.log("请求下拉框数据报错")
                //     }
                // }
                
                this.selectOptionData=[{
                            label:"男",
                            value:"1",
                        },{
                            label:"女",
                            value:"2"
                        }];
            },
            getTreeOptionData(){
                // TODO
                // console.log("dataurlwai:",this.dataUrl);
                // if(this.dataUrl){
                // if(this.dataUrl){
                //      try {
                //         let result = await getDropDownData_api();
                //         this.treeOptionData = JSON.parse(result.data[0].data);
                //     } catch (error) {
                //         console.log("请求下拉框数据报错")
                //     }
                // }
                this.treeOptionData=[{
                            label:"父节点",
                            value:"00001",
                            level:"1",
                            children:[{
                                label:"子节点",
                                value:"00002",
                                level:"2",
                                children:[]
                            }]
                        }]
            }
        }
    };
</script>

<style lang="less" scoped>
// 输入框样式
.report-sheet-selector /deep/ .input .el-textarea__inner{
    padding:0px;
    border:0px;
}
//下拉框样式
.select{
    height: 100%;
}
.select /deep/ .el-input{
    height:100%
}
.select /deep/ .el-input__inner {
    background-color:none;
    background-image: none;
    color:unset;
    font-size: unset;
    height: 100%;
    line-height: unset;
    padding: 0px;
    width: 100%;
    border-radius: unset;
    border:0px;
}

//下拉树样式
.treeOption{
    height:100px;
    overflow: auto;
    padding:0px;
}
.tree /deep/ .el-input__inner {
    background-color:none;
    background-image: none;
    color:unset;
    font-size: unset;
    height: 100%;
    line-height: unset;
    padding: 0px;
    width: 100%;
    border-radius: unset;
    border:0px;
}
.tree /deep/ .el-input{
    height:100%;
}

// 日期框样式
.report-sheet-selector /deep/ .dataPicker .el-textarea{
    width:100% !important;
    height:100% !important;
    font-size: unset;
}
.report-sheet-selector /deep/ .dataPicker .el-textarea__inner{
    min-height: unset !important;
    height:100%;
    background-color: none;
    background-image: none;
    font-size: unset;
}
.report-sheet-selector /deep/ .el-input__prefix{
    left:0px;
    // right:0px;
}
.report-sheet-selector /deep/ .dataPicker .el-date-editor.el-input{
    width:100%;
    height:100%;
}
.report-sheet-selector /deep/ .dataPicker .el-input--prefix .el-input__inner{
    padding-left:0px;
}
.report-sheet-selector /deep/ .dataPicker .el-input--suffix .el-input__inner {
    padding-right: 0px; 
}
.report-sheet-selector /deep/ .dataPicker .el-input__inner {
    padding-left: 16px;
    padding-right: 20px;
    height:100%;
    line-height: unset;
    border:0px;
    border-radius: unset;
    font-size:12px;
}
.report-sheet-selector /deep/ .dataPicker .el-input__icon {
    line-height: unset;
    width:20px;
}
</style>
<style>
.report-sheet-selector {
    top: -20px;
    left: -20px;
    width: 0px;
    height: 0px;
    z-index: 100;
    position: absolute;
    overflow: hidden;
    background-color:rgba(223,247,248,0.6);
    border:0px;
    pointer-events: none;
}
.edit-text-dom {
    border: none;
    padding: 0px;
    margin: 0px;
    resize: none;
    position: absolute;
    top: -25px;
    width: 1px;
    height: 1px;
}
textarea:focus {
    outline-offset: 0px;
}
:focus {
    outline: -webkit-focus-ring-color auto 1px;
}
.report-sheet-selector /deep/ textarea{
    resize: none;
}
</style>