<template>
<div class='noselect' style="width:100%;height:100%;position:absolute;left:0px;top:0px;">
    <div region="center" class="jazz-row-element">
        <div class="report-wrapper">
            <div  class="report-scroll" ref='scrollBox' v-on='{scroll:isShowScroll?handleScroll:emptyFun}' :style="{width: size.scrollBoxSize.width+'px', height: size.scrollBoxSize.height+'px', top: rulerSize.colHeight+'px', left: rulerSize.rowWidth+'px', visibility: isShowScroll? 'visible':'hidden'}">
                <div  :style="{width:size.scrollSize.width+'px',height:size.scrollSize.height+'px'}" ref='scroll'></div>
            </div>
            <div class='report-div' :style="{width: size.reportDivSize.width+'px', height: size.reportDivSize.height+'px'}">
                <div class="report-head" 
                :style="{
                    width: (boxSize.width- scrollBar.width) +'px', 
                    height: isRulerHidden?'0px':rulerSize.colHeight+'px'
                }">
                    <div class="report-corner" 
                    :style="{
                        width: isRulerHidden?'0px':rulerSize.rowWidth+'px',
                        height: isRulerHidden?'0px':rulerSize.colHeight+'px',
                        left:reportLeft.reportCorner+'px'
                    }"
                    ref='report-corner'
                    v-on='{click:reportIsSubmit?selectAreaAll:emptyFun}'
                    ></div>
                    <div class="report-column" 
                    :style="{
                        width: (boxSize.width-rulerSize.rowWidth-scrollBar.width)+'px', 
                        height: isRulerHidden?'0px':rulerSize.colHeight+'px',
                        left:reportLeft.reportColumn+'px'
                    }"
                    v-on='{mousedown:reportIsSubmit?selectAreaCol:emptyFun}'
                    ref='reportColumn'>
                        <div class="report-column-selector" ref='report-column-selector' :style="{width: ruler.col.width+'px',left:ruler.col.left+'px'}"></div>
                        <table class="report-column-table" cellspacing="0" cellpadding="0" border="0">
                            <thead>
                                <tr>
                                    <th style='width:0px;'></th>
                                    <th v-for='(item,index) in reportJson.sheet.cols'
                                    :key='index'
                                    :style="{
                                        width:(!item.p.width?reportJson.dp.report.width.defaultValue:item.p.width)+'px'
                                    }"
                                    ></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr :style='{height:rulerSize.colHeight+"px"}'>
                                    <td style='line-height:1;'>@</td>
                                    <template v-for='(item,index) in reportJson.sheet.cols'>
                                        <td v-if='index>=reportBoundary.start[0]&&index<=reportBoundary.end[0]'
                                            :key='index'
                                            style='line-height:1;'
                                            :name='item.p.name'
                                            :ci='index'
                                            :ref="`${index}_`"
                                            >{{indexToName(index)}}</td>
                                    </template>
                                    
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="div-container-top-cell freezediv" :style="{display: 'none', height: rulerSize.colHeight+'px', width: '252px'}">
                        <table class="report-container-freeze-top-cell freezetop" cellspacing="0" cellpadding="0" border="0"></table>
                    </div>
                </div>
                <div class="report-body" :style="{width: boxSize.width+'px'}">
                    <div class="report-row"
                    :style="{
                        width: isRulerHidden?'0px':rulerSize.rowWidth+'px',
                        height:(boxSize.height-rulerSize.colHeight - scrollBar.height)+'px',
                        left:reportLeft.reportRow+'px'
                    }"
                    v-on='{mousedown:reportIsSubmit?selectAreaRow:emptyFun}'
                    ref='reportRow'>
                        <div class="report-row-selector" ref='report-row-selector' :style="{height: ruler.row.height+'px',top:ruler.row.top+'px'}"></div>
                        <table class="report-row-table" cellspacing="0" cellpadding="0" border="0">
                            <thead>
                                <tr>
                                    <th style="width:0;height:0;"></th>
                                    <th :style="{width:rulerSize.rowWidth+'px',borderWidth:'1px 0 0 1px'}"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-for='(item,index) in reportJson.sheet.rows'>
                                    <tr v-if='index>=reportBoundary.start[1]&&index<=reportBoundary.end[1]'
                                        :key='index'>
                                        <th 
                                        :style='{height:reportJson.dp.report.height.defaultValue+"px"}'
                                        ></th>
                                        <td
                                        :style="{
                                            lineHeight:!item.p.height?(reportJson.dp.report.height.defaultValue-1)+'px':(item.p.height-1)+'px'
                                        }"
                                        :ri='index'
                                        :ref="`_${index}`"
                                        :name='item.p.name'
                                        :class='colHighlight(item.cells)'
                                        >{{index+1}}</td>
                                    </tr>
                                </template>
                                
                            </tbody>
                        </table>
                    </div>
                    <div class="report-sheet" 
                    :style="{
                        top: isRulerHidden?'0px':rulerSize.colHeight+'px',
                        left:  reportLeft.reportSheet+'px',
                        width: (boxSize.width-rulerSize.rowWidth - scrollBar.width)+'px',
                        height:(boxSize.height-rulerSize.colHeight - scrollBar.height)+'px'
                    }"
                    ref='reportSheet'
                    v-on='{mousedown:reportIsSubmit?selectAreaCell:emptyFun}'
                    @mousewheel="mouseWheel"
                    >
                        <!-- TODO -->
                        <!-- <div name="reportEdit" class="report-sheet-selector" tabindex="0" 
                        :style="{
                            width:selectAreaStyle.width+'px',
                            height:selectAreaStyle.height+'px',
                            left:selectAreaStyle.left+'px',
                            top:selectAreaStyle.top+'px'
                        }"
                        ></div> -->
                        <FloatOperate @setOperateType='setOperateType' :floatPosition='floatPosition'></FloatOperate>
                        <ReportEdit @textChange='textChange' @editFlagChange='editFlagChange' :editData='editData' :disabled='disabled' :editFillType='editFillType' :dataUrl='dataUrl' :selectAreaStyle='selectAreaStyle'></ReportEdit>
                        <div class="report-sheet-selected-highlight"></div>
                        <table v-on="{click:reportIsSubmit?editTd:emptyFun, mousemove:reportIsSubmit?tdMouseEnter:emptyFun}" class="report-sheet-table" ref='reportSheetTable' :style='{width:size.reportSheetTableSize.width+"px",height:size.reportSheetTableSize.height+"px"}' cellspacing="0" cellpadding="0" border="0">
                            <thead>
                                <tr>
                                    <th style='width:0px;'></th>
                                    <template v-for='(item,index) in reportJson.sheet.cols'>
                                        <th v-if='index>=reportBoundary.start[0]&&index<=reportBoundary.end[0]'
                                        :key='index'
                                        :style='getAllCss(item.p)'
                                        ></th>
                                    </template>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-for='(itemtr,indextr) in reportJson.sheet.rows'>
                                    <tr v-if='indextr>=reportBoundary.start[1]&&indextr<=reportBoundary.end[1]'
                                        :key='indextr' >
                                        <th :style='getAllCss(itemtr.p)' ></th>
                                        <template v-for='(itemtd,indextd) in itemtr.cells'>
                                            <td v-if='itemtd.p.colspan==0&&itemtd.p.rowspan==0&&indextd>=reportBoundary.start[0]&&indextd<=reportBoundary.end[0]'
                                                :key='indextd'
                                                style='display:none'
                                                :colspan='itemtd.p.colspan'
                                                :rowspan='itemtd.p.rowspan'
                                                :ci='indextd'
                                                :ri='indextr'
                                                :editFillType='itemtd.p.fill_fillType?itemtd.p.fill_fillType:0'
                                                :dataUrl='itemtd.p.fill_urlValue?itemtd.p.fill_urlValue:""'
                                                :ref="`${indextd}_${indextr}`"
                                                :name='itemtd.p.name'
                                                :fill_canFill='itemtd.p.fill_canFill'
                                                :cellValue='itemtd.p.cellValue'
                                            >{{itemtd.p.cellDisplayValue||itemtd.p.cellValue}}</td>   
                                            <td v-else-if='(itemtd.p.colspan!=0||itemtd.p.rowspan!=0)&&indextd>=reportBoundary.start[0]&&indextd<=reportBoundary.end[0]'
                                                :key='indextd'
                                                :style='getAllCss(itemtd.p)'
                                                :colspan='itemtd.p.colspan'
                                                :rowspan='itemtd.p.rowspan'
                                                :ci='indextd'
                                                :ri='indextr'
                                                :editFillType='itemtd.p.fill_fillType?itemtd.p.fill_fillType:0'
                                                :dataUrl='itemtd.p.fill_urlValue?itemtd.p.fill_urlValue:""'
                                                :ref="`${indextd}_${indextr}`"
                                                :name='itemtd.p.name'
                                                :fill_canFill='itemtd.p.fill_canFill'
                                                :cellValue='itemtd.p.cellValue'
                                                v-html="itemtd.p.cellDisplayValue?itemtd.p.cellDisplayValue.replace(/\n/g,'<br>').replace(/\s/g,'&nbsp;'):(itemtd.p.cellValue?itemtd.p.cellValue.replace(/\n/g,'<br>'):'').replace(/\s/g,'&nbsp;')"
                                            ></td>                                 
                                        </template>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        
    </div> 

    </div>
</template>

<script>
import FloatOperate from "@/components/report/components/floatOperate";
import ReportEdit from "@/components/report/components/reportEdit";
import NameIndexEx from '@/utils/nameIndexEx'
export default {
        name: "report",
        components: {ReportEdit,FloatOperate},
        props: {
            reportIsSubmit:{//报表类型，包括dispaly和submit
                type:Boolean,
                default:false
            },
            reportIsCenter:{//是否居中
                type:Boolean,
                default:false
            },
            reportJson:{
                type:Object,
                default:()=>{}
            },
            isShowScroll:{
                type:Boolean,
                default:true
            },
            reportPosition:{
                type:String,
                default:""
            },
            boxSize:{
                type:Object,
                default:()=>{
                    return {
                        width:1480,
                        height:700
                    }
                }
            },
            minScroll:{
                type:Object,
                default:()=>{
                    return {
                        scrollTop:0,
                        scrollLeft:0
                    }
                }
            },
            isRulerHidden:{
                type:Boolean,
                default:false
            },
            isRulerActive:{
                type:Boolean,
                default:true
            }
        },
        // ["reportJson",'isShowScroll','defaultScrollInfo','isRulerHidden','isRulerActive'],
        data() {
            return {
                reportBoundary:{
                    start:[0,0],
                    end:[Infinity,Infinity]
                },//报表显示的下边范围，后期需要props接收
                selectAreaVersion:"1.0",//第一个版本只选中单个单元格
                selectArea:[],//选中区域
                //isRulerHidden:false,//标尺是否隐藏 props
                screenSize:{//浏览器尺寸
                    screenWidth:0,
                    screenHeight:0
                },
                selectAreaStyle:{//选中区域的样式信息
                    width:0,
                    height:0,
                    top:0,
                    left:0
                },
                disabled:'none',//reportEdit组件是否响应点击事件
                editCell:"",//编辑区域下标
                editData:"",//编辑区域内容
                eidtFlag:0,//编辑区状态，1：选中，2:编辑
                editFillType:0,//输入框类型，默认为0:文本框//0:文本框，2:下拉框，4:日期框，5:下拉树
                dataUrl:"",//输入框为下拉框，下拉树时，内容是从url里读取的
                ruler:{//标尺选中区域信息
                    col:{
                        width:0,
                        left:0
                    },
                    row:{
                        height:0,
                        top:0
                    }
                },
                allStyle:[
                    {name:"borderRightStyle",unit:"",value:{"2":"solid","3":"dashed","7":"dotted"}},
                    {name:"borderTopColor",unit:""},
                    {name:"borderTopStyle",unit:"",value:{"2":"solid","3":"dashed","7":"dotted"}},
                    {name:"fontFamily",unit:""},
                    {name:"borderLeftWidth",unit:"px"},
                    {name:"borderRightColor",unit:""},
                    {name:"borderBottomStyle",unit:"",value:{"2":"solid","3":"dashed","7":"dotted"}},
                    {name:"borderBottomWidth",unit:"px"},
                    {name:"height",unit:"px"},
                    {name:"verticalAlign",unit:"",value:{"0":"top","1":"middle","2":"bottom"}},
                    {name:"fontBold",cssName:"fontWeight",unit:"",value:{"0":"normal","1":"bold"}},
                    {name:"fontSize",unit:"px"},
                    {name:"backgroundRepeat",unit:""},
                    {name:"fontUnderline",cssName:"text-decoration",unit:"",value:{"0":"none","1":"underline"}},
                    {name:"backgroundImage",unit:""},
                    {name:"borderBottomColor",unit:""},
                    {name:"borderRightWidth",unit:"px"},
                    {name:"borderTopWidth",unit:"px"},
                    {name:"backgroundPosition",unit:""},
                    {name:"borderLeftColor",unit:""},
                    {name:"backgroundColor",unit:""},
                    {name:"borderLeftStyle",unit:"",value:{"2":"solid","3":"dashed","7":"dotted"}},
                    {name:"width",unit:"px"},
                    {name:"fontItalic",cssName:"fontStyle",unit:"",value:{"0":"normal","1":"italic"}},
                    {name:"fontColor",cssName:"color",unit:""},
                    {name:"align",cssName:"text-align",unit:"",value:{"1":"left","2":"center","3":"right"}},
                    {name:"textControl",cssName:"white-space",unit:"",value:{"1":"unset","2":"normal"}},
                    {name:"textIndent",unit:"px"}
                ],
                //浮动操作相关
                floatPosition:{
                    left:-100,
                    right:-100
                },
                //当前浮动主格
                floatCell:""
            };
        },
        computed: {
            //标尺尺寸，如果不显示标尺，则均为0
            rulerSize(){
                if(!this.isRulerHidden){
                    return {colHeight:24,rowWidth:46}
                }else{
                    return {colHeight:0,rowWidth:0}
                }
            },
            size(){
                let size={};
                let width=0;
                let height=0;
                //reportSheetTableSize
                let reportSheetTableSize={};
                this.reportJson.sheet.cols.forEach((item,index)=>{
                    if(index>=this.reportBoundary.start[0]&&index<=this.reportBoundary.end[0])
                        width+=item.p.width?item.p.width:this.reportJson.dp.report.width.defaultValue;
                })
                reportSheetTableSize.width=width;
                
                this.reportJson.sheet.rows.forEach((item,index)=>{
                    if(index>=this.reportBoundary.start[1]&&index<=this.reportBoundary.end[1])
                        height+=item.p.height?item.p.height:this.reportJson.dp.report.height.defaultValue;
                })
                reportSheetTableSize.height=height;
                size.reportSheetTableSize=reportSheetTableSize;
                //reportDivSize
                let reportDivSize={};
                reportDivSize.width=this.boxSize.width;
                reportDivSize.height=this.boxSize.height;
                if(this.reportPosition==="row"||this.reportPosition===""){
                    if(reportSheetTableSize.height>reportDivSize.height-this.rulerSize.colHeight)
                        reportDivSize.width=reportDivSize.width-7;
                }
                if(this.reportPosition==="col"||this.reportPosition===""){
                    //纵向出现滚动条
                    if(reportSheetTableSize.width>reportDivSize.width-this.rulerSize.rowWidth)
                        reportDivSize.height=reportDivSize.height-7;
                }
                size.reportDivSize=reportDivSize;
                console.log('reportDivSize',reportDivSize, 'reportSheetTableSize', reportSheetTableSize);
                //scrollBoxSize
                let scrollBoxSize={};
                scrollBoxSize.width=this.boxSize.width-this.rulerSize.rowWidth;
                scrollBoxSize.height=this.boxSize.height-this.rulerSize.colHeight;
                size.scrollBoxSize=scrollBoxSize;
                //scrollSize
                let scrollSize={};
                if(reportSheetTableSize.width>reportDivSize.width-this.rulerSize.rowWidth&&reportSheetTableSize.height>reportDivSize.height-this.rulerSize.colHeight){
                    scrollSize.width=reportSheetTableSize.width
                    scrollSize.height=reportSheetTableSize.height
                }
                else if(reportSheetTableSize.width>reportDivSize.width-this.rulerSize.rowWidth){
                    scrollSize.height=1;
                    scrollSize.width=reportSheetTableSize.width
                }   
                //纵向出现滚动条
                else if(reportSheetTableSize.height>reportDivSize.height-this.rulerSize.colHeight){
                    scrollSize.width=1;
                    scrollSize.height=reportSheetTableSize.height
                }else{
                   scrollSize.width=1; 
                   scrollSize.height=1;
                }
                size.scrollSize=scrollSize;
                console.log('scrollSize',scrollSize)
                return size;
            },
            scrollBar(){
                let width=0;
                let height=0;
                //reportSheetTableSize
                let reportSheetTableSize={};
                this.reportJson.sheet.cols.forEach((item,index)=>{
                    if(index>=this.reportBoundary.start[0]&&index<=this.reportBoundary.end[0])
                        width+=item.p.width?item.p.width:this.reportJson.dp.report.width.defaultValue;
                })
                reportSheetTableSize.width=width;
                
                this.reportJson.sheet.rows.forEach((item,index)=>{
                    if(index>=this.reportBoundary.start[1]&&index<=this.reportBoundary.end[1])
                        height+=item.p.height?item.p.height:this.reportJson.dp.report.height.defaultValue;
                })
                reportSheetTableSize.height=height;
                let reportDivSize={};
                reportDivSize.width=this.boxSize.width;
                reportDivSize.height=this.boxSize.height;
                const scrollBar = {width: 0, height: 0};
                if(this.reportPosition==="rowcol")
                    return scrollBar;
                if(this.reportPosition==="row"||this.reportPosition===""){
                    //纵向出现滚动条
                    if(reportSheetTableSize.height>reportDivSize.height-this.rulerSize.colHeight)
                        scrollBar.width = 7
                }
                if(this.reportPosition==="col"||this.reportPosition===""){
                    if(reportSheetTableSize.width>reportDivSize.width-this.rulerSize.rowWidth)
                        scrollBar.height = 7
                }
                
                console.log(scrollBar)
                return scrollBar
            },
            //居中操作，获取各元素的left
            reportLeft(){
                let reportLeft={
                    reportCorner:0,
                    reportColumn:0,
                    reportRow:0,
                    reportSheet:this.isRulerHidden?0:this.rulerSize.rowWidth
                };
                if(this.reportIsCenter){
                    //获取左右空白尺寸
                    let remain=this.boxSize.width-(this.isRulerHidden?0:this.rulerSize.rowWidth)-this.size.reportSheetTableSize.width;
                    if(remain>0){
                        let left=remain/2;
                        reportLeft.reportCorner=reportLeft.reportCorner+left;
                        reportLeft.reportRow=reportLeft.reportRow+left;
                        reportLeft.reportColumn=reportLeft.reportColumn+left;
                        reportLeft.reportSheet=reportLeft.reportSheet+left;
                    }
                }
                return reportLeft;
            }
        },
        watch: {
        },
        beforeCreate() {
        },
        created() {
        },
        beforeMount() {
        },
        mounted() {
            //1、添加滚动条滚动事件
            // window.addEventListener('scroll', this.handleScroll, true);

            //2、添加浏览器缩放监听事件
            // this.screenSize.screenWidth = document.body.clientWidth;
            // this.screenSize.screenHeight = document.body.clientHeight;
            // window.onresize = () => {
            //     return (() => {
            //     this.screenSize.screenWidth = document.body.clientWidth;
            //     this.screenSize.screenHeight = document.body.clientHeight;
            //     })();
            // };
        },
        beforeUpdate() {
        },
        updated() {
        },
        beforeDestroy() {
        },
        destroyed() {
            window.removeEventListener('scroll', this.handleScroll);
            window.onresize ='';
        },
        methods: {
            emptyFun(){},
            indexToName(index) {
                return NameIndexEx.indexToName(index+1)
            },
            /**
             *  @description 渲染dom--拼接所有的css样式
             */
            getAllCss(item){
                let allCss={};
                this.allStyle.forEach(it=>{
                    if(item[it.name]){
                        let value=item[it.name];
                        if(it.value&&it.value[item[it.name]])
                            value=it.value[item[it.name]];
                        value+=it.unit;
                        allCss[it.cssName||it.name]=value;
                    }
                });
                // console.log(allCss);
                return allCss;
            },
            /**
             *  @description 渲染dom--col标尺是否高亮，高亮返回一个class名称 否则返回“”
             */
            colHighlight(cells){
                if(this.isRulerActive){
                    for(let i=0;i<cells.length;i++){
                        if(cells[i].p.float_level)
                            return "floatHighlight";
                    }
                }
                return "";
            },
            /**
                * @description 传入css,将像素值（带‘px’）减相应的数值
            */
            pxSub(originalPx,sub){
                let originalPxArr=originalPx.split(":");
                originalPx=originalPxArr.length>0?originalPxArr[1]:"0px";
                return (Number(originalPx.replace("px","").replace(";",""))-sub)+'px';
            },
            /**
                *@description 区域选中事件--全选 
             */
            selectAreaAll(e){
                // if(this.selectAreaVersion!="1.0"){
                    //获取填报信息
                    this.getEditData();
                    //获取选中区域信息
                    this.selectArea=[];
                    let rows=this.reportJson.sheet.rows
                    let cols=this.reportJson.sheet.cols
                    if(rows.length>0){
                        this.selectArea.push({ci:0,ri:0});
                        this.selectArea.push({ci:cols.length-1,ri:rows.length-1});
                    }
                    //选中区域排序 TODO
                    let sa=this.selectAreaSort(this.selectArea);

                    //设置选中样式
                    if(this.selectArea.length>1)
                        this.getSizeAndPosition(sa[0],sa[1]);

                    this.$emit('selectAreaRange',sa);
                    console.log("全选:",sa);
                // }
            },
            /**
                *@description 区域选中事件--选中列
             */
            selectAreaCol(e){
                
                    //获取填报信息
                    this.getEditData();
                    //获取选中区域信息
                    let sci=e.target.getAttribute("ci");
                    this.selectArea=[];
                    this.selectArea.push({ci:sci});
                    //设置选中样式
                    // this.getSizeAndPosition({ci:sci,ri:0},{ci:sci,ri:this.reportJson.sheet.rows.length-1});
                    //设置选中样式，暂时不实现拖动
                    this.getSizeAndPositionRowCol({ci:sci});
                    this.$emit('selectAreaRange',this.selectArea);
                    console.log("选中列:",this.selectArea);
                if(this.selectAreaVersion!="1.0"){    
                    let that=this;
                    // this.isMouseDown = true;
                    document.onmousemove =(ev) => {
                        if(ev.target.tagName==="TD"){
                            that.selectArea=[];
                            let eci=ev.target.getAttribute("ci");
                            that.selectArea.push({ci:sci});
                            that.selectArea.push({ci:eci});

                            //设置选中样式
                            if(that.selectArea.length>1)
                                that.getSizeAndPosition({ci:sci,ri:0},{ci:eci,ri:that.reportJson.sheet.rows.length-1});
                        
                        }
                    };
                    document.onmouseup= (ev) =>{
                        //选中区域排序 TODO
                        let sa=that.selectAreaSort(that.selectArea);
                        that.$emit('selectAreaRange',sa);
                        console.log("选中列onmouseup:",sa);
                        //解绑mousemove事件和mouseup事件
                        document.onmousemove ='';
                        document.mouseup='';
                    }
                }
            },
            /**
                *@description 区域选中事件--选中行
             */
            selectAreaRow(e){
                
                    //获取填报信息
                    this.getEditData();
                    //获取选中区域信息
                    let sri=e.target.getAttribute("ri")
                    this.selectArea=[];
                    this.selectArea.push({ri:sri});
                    //设置选中样式
                    // this.getSizeAndPosition({ci:0,ri:sri},{ci:this.reportJson.sheet.cols.length-1,ri:sri});
                    //设置选中样式，暂时不实现拖动
                    this.getSizeAndPositionRowCol({ri:sri});
                    this.$emit('selectAreaRange',this.selectArea);
                    console.log("选中行:",this.selectArea);
                if(this.selectAreaVersion!="1.0"){    
                    let that=this;
                    document.onmousemove = (ev) => {
                        if(ev.target.tagName==="TD"){
                            that.selectArea=[];
                            let eri=ev.target.getAttribute("ri")
                            that.selectArea.push({ri:sri});
                            that.selectArea.push({ri:eri});

                            //设置选中样式
                            if(that.selectArea.length>1)
                                that.getSizeAndPosition({ci:0,ri:sri},{ci:that.reportJson.sheet.cols.length-1,ri:eri});
                        
                        }
                    };
                    document.onmouseup= (ev) =>{
                        //选中区域排序 TODO
                        let sa=that.selectAreaSort(that.selectArea);
                        that.$emit('selectAreaRange',sa);
                        console.log("选中行onmouseup:",sa);
                        document.onmousemove ='';
                        document.mouseup='';
                    }
                }
            },
            /**
                *@description 区域选中事件--选中单元格
             */
            selectAreaCell(e){
                if(e.target.tagName=='TD'){
                    //获取填报信息
                    this.getEditData();
                    //获取选中区域信息
                    let sci=e.target.getAttribute("ci")
                    let sri=e.target.getAttribute("ri")
                    this.selectArea=[];
                    this.selectArea.push({ci:sci,ri:sri});
                    //设置选中样式
                    this.getSizeAndPosition({ci:sci,ri:sri},{ci:sci,ri:sri});

                    if(this.selectAreaVersion=="1.0"){
                        this.$emit('selectAreaRange',this.selectArea);
                        console.log("选中单元格:",this.selectArea);
                    }

                    if(this.selectAreaVersion!="1.0"){
                        let that=this;
                        document.onmousemove = (ev) => {
                            if(ev.target.tagName==="TD"){
                                that.selectArea=[];
                                let eci=ev.target.getAttribute("ci")
                                let eri=ev.target.getAttribute("ri")

                                that.selectArea.push({ci:sci,ri:sri});
                                that.selectArea.push({ci:eci,ri:eri});

                                //设置选中样式
                                if(that.selectArea.length>1)
                                    that.getSizeAndPosition(that.selectArea[0],that.selectArea[1]);
                            
                            }
                        };
                        document.onmouseup= (ev) =>{
                            //选中区域排序 TODO
                            let sa=that.selectAreaSort(that.selectArea);
                            that.$emit('selectAreaRange',sa);
                            console.log("选中单元格onmouseup:",sa);
                            document.onmousemove ='';
                            document.mouseup='';
                        }
                    }
                }
                
            },
            /**
                *@description 区域选中事件--获取选中行或列的尺寸和位置，来设置选中样式
             */
            getSizeAndPositionRowCol(obj){
                //先清空标尺选中
                this.clearRuler();
                if(obj.ci){//选中列
                    let ci=obj.ci;
                    let objs=this.$refs[ci+"_"];
                    if(objs.length>0){
                        let obj=objs[0];
                        let left=obj.offsetLeft;
                        let top=obj.offsetTop;
                        let width=obj.offsetWidth;
                        let height=this.$refs["reportSheetTable"].offsetHeight;
                        this.selectAreaStyle.top=top
                        this.selectAreaStyle.left=left
                        this.selectAreaStyle.width=width
                        this.selectAreaStyle.height=height
                        //设置标尺样式
                        this.ruler.col.left=left;
                        this.ruler.col.width=width;
                    }
                    

                }else if(obj.ri){//选中行
                    let ri=obj.ri;
                    let objs=this.$refs["_"+ri];
                    if(objs.length>0){
                        let obj=objs[0];
                        let left=obj.offsetLeft;
                        let top=obj.offsetTop;
                        let width=this.$refs["reportSheetTable"].offsetWidth;
                        let height=obj.offsetHeight;
                        this.selectAreaStyle.top=top
                        this.selectAreaStyle.left=left
                        this.selectAreaStyle.width=width
                        this.selectAreaStyle.height=height
                        //设置标尺样式
                        this.ruler.row.top=top;
                        this.ruler.row.height=height;
                    }
                }
            },
            /**
             *  @description 区域选中--标尺选中样式清空
             */
            clearRuler(){
                this.ruler.col.width=0;
                this.ruler.col.left=0;
                this.ruler.row.height=0;
                this.ruler.row.top=0;
            },
            /**
                *@description 区域选中事件--获取选中区域的尺寸和位置，来设置选中样式
             */
            getSizeAndPosition(start,end){
                let resetArea=this.selectAreaSort([start,end]);
                start=resetArea[0];
                end=resetArea[1];
                // console.log('start:',start,"end:",end);
                let startObj=this.$refs[start.ci+'_'+start.ri].length>0?this.$refs[start.ci+'_'+start.ri][0]:undefined;
                let endObj=this.$refs[end.ci+'_'+end.ri].length>0?this.$refs[end.ci+'_'+end.ri][0]:undefined;
                //设置左 上边距
                this.selectAreaStyle.top=startObj?startObj.offsetTop:0;
                this.selectAreaStyle.left=startObj?startObj.offsetLeft:0;

                //设置尺寸
                //获取最后一个单元格的尺寸
                let lastCellWidth=endObj?endObj.offsetWidth:0;
                let lastCellHeight=endObj?endObj.offsetHeight:0;
                let lastCellTop=endObj?endObj.offsetTop:0;
                let lastCellLeft=endObj?endObj.offsetLeft:0;
                this.selectAreaStyle.width=lastCellLeft-this.selectAreaStyle.left+lastCellWidth;
                this.selectAreaStyle.height=lastCellTop-this.selectAreaStyle.top+lastCellHeight;

                //设置标尺的样式
                //水平标尺
                let c1Obj=this.$refs[start.ci+"_"];
                let c2Obj=this.$refs[end.ci+"_"];
                c1Obj=c1Obj.length>0?c1Obj[0]:undefined;
                c2Obj=c2Obj.length>0?c2Obj[0]:undefined;
                if(c1Obj&&c2Obj){
                    let c1Left=c1Obj.offsetLeft;
                    // let c2Left=c2Obj.offsetLeft;
                    // let c2Width=c2Obj.offsetWidth;
                    this.ruler.col.left=c1Left;
                    this.ruler.col.width=this.selectAreaStyle.width;
                }
                //垂直标尺
                let r1Obj=this.$refs["_"+start.ri];
                let r2Obj=this.$refs["_"+end.ri];
                r1Obj=r1Obj.length>0?r1Obj[0]:undefined;
                r2Obj=r2Obj.length>0?r2Obj[0]:undefined;
                if(r1Obj&&r2Obj){
                    let r1Top=r1Obj.offsetTop;
                    // let r2Top=r2Obj.offsetTop;
                    // let r2Height=r2Obj.offsetHeight;
                    this.ruler.row.top=r1Top;
                    this.ruler.row.height=this.selectAreaStyle.height
                }
            },
            /**
                * @description 区域选中事件--选中区域排序 
             */
            selectAreaSort(object){
                let obj=JSON.parse(JSON.stringify(object));
                if(obj.length>1){
                    //如果两个点无法确定选中区域，即两个点为右上和左下，则无法确定选中区域，需要调换位置
                    let obj1=obj[0];
                    let obj2=obj[1];
                    if(obj1&&obj2){
                        this.selectAreaReset(obj1,obj2);
                        if(parseInt(obj1.ci)>=parseInt(obj2.ci)&&parseInt(obj1.ri)>=parseInt(obj2.ri)){
                            let cit=obj1.ci;
                            let rit=obj1.ri;
                            obj1.ci=obj2.ci;
                            obj1.ri=obj2.ri;
                            obj2.ci=cit;
                            obj2.ri=rit;
                        }
                    }
                    
                }
                return obj;
            },
            /**
                * @description 区域选中事件--节点调整,选中的时候其实节点可能不是真的起始节点
             */
            selectAreaReset(obj1,obj2){
                if(obj1&&obj2){
                    //如果两个点无法确定选中区域，即两个点为右上和左下，则无法确定选中区域，需要调换位置
                    let ci1=parseInt(obj1.ci),ri1=parseInt(obj1.ri),ci2=parseInt(obj2.ci),ri2=parseInt(obj2.ri);
                    if(ci1>ci2&&ri1<ri2||ci1<ci2&&ri1>ri2){
                        obj1.ci=ci2;
                        obj2.ci=ci1;
                    }
                }
            },
            /**
                * @description 滚动条实现--鼠标滚动事件
             */
            handleScroll(e){
                let {reportSheet,reportRow,reportColumn,scrollBox}=this.$refs;
                console.log("ssssssss",this.$refs);
                let scrollTop=scrollBox.scrollTop;
                let scrollLeft=scrollBox.scrollLeft;
                let minScrollTop=this.minScroll.scrollTop;
                let minScrollLeft=this.minScroll.scrollLeft;
                this.$nextTick(()=>{
                    // if(scrollTop>=minScrollTop){
                        scrollTop=scrollTop<minScrollTop?minScrollTop:scrollTop;
                        reportSheet.scrollTop=scrollTop;
                        reportRow.scrollTop=scrollTop;
                        scrollBox.scrollTop=scrollTop;
                        // this.$emit('scrollTopRange',{scrollTop,scrollLeft});
                    // }
                    // if(scrollLeft>=minScrollLeft){
                        scrollLeft=scrollLeft<minScrollLeft?minScrollLeft:scrollLeft;
                        reportSheet.scrollLeft=scrollLeft;
                        reportColumn.scrollLeft=scrollLeft;
                        scrollBox.scrollLeft=scrollLeft;
                        this.$emit('scrollTopRange',{scrollTop,scrollLeft});
                    // }
                    
                })
                
            },
            /**
                * @description 滚动条实现--report-sheet滚动带动滚动条
             */
            mouseWheel(event){
                let { scrollBox, scroll } = this.$refs;
                var top = scroll.scrollTop - event.deltaY * (-1);
                let minScrollTop=this.minScroll.scrollTop;
                // if(scrollBox.scrollTop+top>=minScrollTop){
                    this.$nextTick(()=>{
                        scrollBox.scrollTop=scrollBox.scrollTop+top<minScrollTop?minScrollTop:scrollBox.scrollTop+top;
                        this.$emit('scrollTopRange',{scrollTop:scrollBox.scrollTop,scrollLeft:scrollBox.scrollLeft});
                    })
                // }
                
                
            },
             /**
                * @description 区域填报--双击单元格事件
             */
            editTd(event){
                let target=event.target;
                if(target.getAttribute("fill_canfill")=="1"&&target.tagName=="TD"){
                    this.selectArea=[];
                    let ci=target.getAttribute("ci");
                    let ri=target.getAttribute("ri");
                    this.selectArea.push({ci:ci,ri:ri});
                    this.selectArea.push({ci:ci,ri:ri});
                    // console.log(ci,ri);
                    this.editCell={ci:ci,ri:ri};
                    //设置选中样式
                    if(this.selectArea.length>1){
                        this.getSizeAndPosition(this.selectArea[0],this.selectArea[0]);
                        this.disabled='auto';
                        this.eidtFlag=1;//状态设置为选中
                        //给textArea赋值
                        let tdHtml=this.$refs[ci+"_"+ri];
                        if(tdHtml.length>0){
                            let text=tdHtml[0].getAttribute("cellValue");
                            // document.querySelector("textarea").value=text;
                            this.editData=text;
                            //给输入框类型赋值
                            this.editFillType=tdHtml[0].getAttribute("editFillType");
                            this.dataUrl=tdHtml[0].getAttribute("dataUrl");
                        }         
                    }
                        
                }
                // else if(!target.getAttribute("fill_canfill")&&target.tagName=="TD"){
                //     this.editFillType=undefined;
                // }
            },
            /**
                *@description 区域填报--获取填报字段信息
             */
            getEditData(){
                // let editData=document.querySelector("textarea").value;
                if(this.eidtFlag==2){//编辑状态采取广播
                    if(this.editCell!=""){
                        let editDataInfo={
                            data:this.editData,
                            cell:this.editCell
                        }
                        console.log("填报信息为",editDataInfo);
                        this.$emit("editDataChanging",editDataInfo);
                        //设置reportEdit不可填报
                        // this.setEditReportDisabled();
                    }
                    //设置reportEdit不可填报
                    this.setEditReportDisabled();
                }
                else{
                    this.setEditReportDisabled();
                }
                
            },
            /**
            *@description 区域填报--设置reportEdit状态为不能填报
             */
            setEditReportDisabled(){
                this.disabled='none';
                this.cellName='';
                this.editData='';
                this.editCell="";
                // document.querySelector("textarea").value='';
            },
            /**
             *  @description 区域填报--获取填报内容
             */
            textChange(value){
                this.editData=value; 
            },
            editFlagChange(){
                this.eidtFlag=2;
                //如果是编辑状态，广播当前无选中区域
                this.$emit('selectAreaRange',[]);
                console.log("选中单元格:",[]);
            },
            /**
             *  @description 浮动操作相关--鼠标进入事件
             */
            tdMouseEnter(e){
                if(e.target.tagName=="TD"){
                    let td=e.target;
                    //寻找浮动主格
                    const floatTdIndex=this.finduuid(td.getAttribute("ri"),td.getAttribute("ci"),this.reportJson.sheet);
                    if(floatTdIndex){
                        let floatTd=this.$refs[floatTdIndex.cIndex+"_"+floatTdIndex.rIndex];
                        if(floatTd.length>0){
                            floatTd=floatTd[0];
                            let left=floatTd.offsetLeft;
                            let top=floatTd.offsetTop+floatTd.offsetHeight;
                            this.floatPosition={
                                left:left,
                                top:top
                            }
                            this.floatCell={ci:floatTdIndex.cIndex,ri:floatTdIndex.rIndex};
                        }else{
                            this.floatPosition={
                                left:-100,
                                top:-100
                            }
                        }
                    }else{
                        this.floatPosition={
                            left:-100,
                            top:-100
                        }
                    }  
                    
                }else{
                    this.floatPosition={
                        left:-100,
                        top:-100
                    }
                }
            },
            /**
             * @description 找单行数据中的uuid
             * @return {object} 有uuid 项的单元格信息 
             */
            finduuid(ri, ci,sheet) {
                let uuid = false;
                if (sheet.rows[ri].cells[ci].p.float_uuid) {
                    uuid = sheet.rows[ri].cells[ci].p.float_uuid;
                    return {rIndex:ri,cIndex:ci};
                } else {
                    for (let index = ci - 1; index >= 0; index--) {
                    const eluuid = sheet.rows[ri].cells[index].p.float_uuid;
                    if (eluuid) {
                        //uuid = eluuid;
                        //   return {rIndex:ri,cIndex:index};
                        if(index+sheet.rows[ri].cells[index].p.float_colspan>Number(ci)){
                            return {rIndex:ri,cIndex:index};
                        }
                    }

                    }
                }
                return uuid
            },
            /**
             * @description 监听到浮动操作，将浮动信息传递给父组件
             */
            setOperateType(value){
                switch (value){
                    case "addFloatafter":
                        this.$emit("floatRow","after",this.floatCell);
                        break;
                    case "deleteFloat":
                        this.$emit("floatRow","delete",this.floatCell);
                        break;
                    default:
                        break;
                }
                console.log("需要操作float啦",this.floatCell);
                //如果是编辑状态则广播填报信息
                this.getEditData();
                
            }
        }
    };
</script>
<style scoped>
.noselect {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Chrome/Safari/Opera */
    -khtml-user-select: none; /* Konqueror */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently
    not supported by any browser */
}
body {
    line-height: 1;
    font-size: 13px;
    font-family: "verdana", "SimSun", "helvetica", "arial", "sans-serif";
}
.jazz-row-element {
    width: 100%;
    height:100%;
    margin: 0;
    padding: 0;
    border: 0;
    overflow: auto;
}
.report-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.report-scroll {
    position: absolute;
    z-index: 0;
    overflow: auto;
    top: 24px;
    left: 46px;
}
.report-div {
    overflow: hidden;
    background-color: rgba(0,0,0,0);
    position: absolute;
}
.report-corner, .report-column, .report-row, .report-sheet {
    display: block;
    float: left;
    position: relative;
    overflow: hidden;
    background-color: rgba(0,0,0,0);
}
.report-corner{
    width: 46px;
    height: 24px;
    background-color: #c8c8c8;
}

.report-row-selector, .report-column-selector {
    background-color: #919191;
}
.report-row-selector, .report-column-selector {
    top: 0px;
    left: 0px;
    width: 0px;
    height: 0px;
    z-index: 100;
    position: absolute;
    background-color: #919191;
    opacity: 0.3;
    filter: Alpha(Opacity = 30);
    pointer-events: none;
}
.report-column-selector {
    height: 24px;
}
.report-row-selector {
    width: 46px;
}
.report-wrapper table {
    table-layout: fixed;
}
.report-column-table, .report-row-table, .report-sheet-table {
    width: 0;
    border-collapse: separate;
    *border-collapse: collapse;
    table-layout: fixed;
    white-space: nowrap;
    background-color:#E6E6E6
}
table {
    border-collapse: collapse;
    border-spacing: 0;
}
html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
}
html, body, div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, pre, form, fieldset, input, textarea, p, blockquote, th, td {
    margin: 0;
    padding: 0;
}
thead {
    display: table-header-group;
    vertical-align: middle;
    border-color: inherit;
}
tr {
    display: table-row;
    vertical-align: inherit;
    border-color: inherit;
}
th {
    display: table-cell;
    vertical-align: inherit;
    font-weight: bold;
    text-align: -internal-center;
}
tbody {
    display: table-row-group;
    vertical-align: middle;
    border-color: inherit;
}
.report-column-table td {
    border-left: 1px solid #cccccc;
    overflow: hidden;
    vertical-align: middle;
}
.report-column-table td, .report-row-table td {
    text-align: center;
}
.div-container-top-cell {
    position: absolute;
    top: 0px;
    left: 46px;
    overflow: hidden;
    border-right: 2px solid #000;
}
.report-container-freeze-top-cell, .report-container-freeze-left-cell, .report-table-freeze-cell, .report-table-freeze-row, .report-table-freeze-col {
    width: 0;
    border-collapse: separate;
    *border-collapse: collapse;
    table-layout: fixed;
    white-space: nowrap;
}
.report-container-freeze-top-cell, .report-container-freeze-left-cell {
    position: absolute;
}
.report-row {
    width: 46px;
}
.report-sheet {
    position: absolute !important;
    left: 46px;
    top: 24px;
}
.report-wrapper table {
    table-layout: fixed;
}
.report-sheet-table {
    background-color: #FFFFFF;
}
.report-sheet-table thead th {
    width: 100.0px;
}
div {
    display: block;
}
.report-sheet-table tbody td {
    font-family: 宋体;
    font-size: 12px;
    color: rgb(0, 0, 0);
    vertical-align: middle;
    text-indent: 0px;
    background-color: rgb(255, 255, 255);
    overflow: hidden;
}
.report-sheet-table td {
    border-width: 0;
    overflow: hidden;
    /* text-overflow: clip; */
    white-space: nowrap;
    font-family: Arial;
    font-size: 12px;
}
.report-row-table tbody th {
    overflow: hidden;
    width: 0px;
}
.report-row-table tbody td {
    border-top: 1px solid #cccccc;
    overflow: hidden;
    width: 46px;
    vertical-align: middle;
}
.report-sheet-table tbody th {
    height: 20.0px;
}

.report-scroll::-webkit-scrollbar {
    width: 8px;    
    height: 8px;
}
.floatHighlight{
    background-color: #ffffa0;
}
</style>
