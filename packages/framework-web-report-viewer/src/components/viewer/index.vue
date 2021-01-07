<template>
  <div class="MsiteReport" :style="{width: boxSize.width+'px',height: boxSize.height+'px',}">
    <!-- 这里可能不止一个report组件 absolute 0 0方式放置   2.行表固定 3.列表固定  4. 固定不动-->
    <report
      @floatRow="floatRow"
      :reportJson="json"
      @selectAreaRange="selectAreaRange"
      @scrollTopRange="scrollTopRange"
      :isShowScroll="true"
      :reportIsSubmit="reportIsSubmit"
      :isFixed="Fixed.isFixed"
      :isRulerHidden="isRulerHidden"
      :isRulerActive="isRulerActive"
      :reportIsCenter="reportIsCenter"
      @editDataChanging="updatedInputData"
      :minScroll="{scrollTop:Fixed.scrollTop,scrollLeft:Fixed.scrollLeft}"
      :boxSize="boxSize"
    ></report>

    <report
      v-if="Fixed.isFixed  && !!Fixed.RowJson "
      :reportJson="Fixed.RowJson"
      :isShowScroll="false"
      :reportPosition="'row'"
      :reportIsCenter="reportIsCenter"
      :isFixed="Fixed.isFixed"
      :isRulerHidden="isRulerHidden"
      :isRulerActive="isRulerActive"
      class="row"
      :boxSize="{width:boxSize.width,height:Fixed.height- Fixed.scrollTop}"
      :style="{height:Fixed.height- Fixed.scrollTop +'px',zIndex:200,}"
    ></report>

    <report
      v-if="Fixed.isFixed  && !!Fixed.ColJson && IsShow"
      :reportJson="Fixed.ColJson"
      :isFixed="Fixed.isFixed"
      :isRulerActive="isRulerActive"
      :isShowScroll="false"
      :reportPosition="'col'"
      :isRulerHidden="isRulerHidden"
      class="col"
      :boxSize="{width:Fixed.width-Fixed.scrollLeft,height:boxSize.height}"
      :style="{width:Fixed.width-Fixed.scrollLeft+'px',zIndex:200,}"
    ></report>
    <report
      v-if="Fixed.isFixed  && !!Fixed.TheFixRes && IsShow"
      :reportJson="Fixed.TheFixRes"
      :isRulerActive="isRulerActive"
      :isFixed="Fixed.isFixed"
      :isShowScroll="false"
      :reportPosition="'rowcol'"
      :isRulerHidden="isRulerHidden"
      class="rowcol"
      :boxSize="{width:Fixed.width-Fixed.scrollLeft,height:Fixed.height -Fixed.scrollTop}"
      :style="{height:Fixed.height -Fixed.scrollTop +'px',width:Fixed.width -  Fixed.scrollLeft+'px',zIndex:200,}"
    ></report>
  </div>
</template>

<script>
import Vue from "vue";

/* 
  element start
  */
import { Container, Header, Aside, Main, Footer } from "element-ui";
Vue.use(Footer).use(Header).use(Container).use(Aside).use(Main);
/* *********end******** */

/* 
  子组件 start 
  */
import Report from "@/components/report";
/* *********end********* */

//继承
import myDataCenter from "@/mixins/index";
import { getColandRow } from "@/utils/fixed";
import reportWidth from "@utils/reportWidth.js";

let reportDom = { left: [], top: [], isfirst: true };

export default {
  name: "reportViewer",
  components: { Report },
  props: {
    reportFile: {
      type: String,
      required: true,
    },
    reportIsSubmit: {
      //报表类型，包括dispaly和submit
      type: Boolean,
      default: true,
    },
    reportIsCenter: {
      //是否居中
      type: Boolean,
      default: false,
    },
    isRulerHidden: {
      //标尺是否显示
      type: Boolean,
      default: false,
    },
    isRulerActive: {
      //是否高亮浮动标尺
      type: Boolean,
      default: true,
    },
    boxSize: {
      type: Object,
      default: () => {
        return {
          width: 1480,
          height: 700,
        };
      },
    },
  },
  mixins: [myDataCenter],
  data() {
    return {
      currentName: ["B"],
      scrollTop: 0,
      scrollLeft: 0,
      IsShow:true,
      Fixed: {
        //冻结信息模块
        isFixed: false,
        ColJson: null, //列
        RowJson: null, //行
        TheFixRes: null,
        width: 0,
        height: 0,
        scrollTop: 0,
        scrollLeft: 0,
        ci:0,
        ri:0,
      },
    };
  },
  computed: {
    json() {
      return this.mixData;
    },
  },
  watch: {
    "Fixed.isFixed"(newV) {
      if (!newV) {
        reportDom = { left: [], top: [], isfirst: true };
      }
    },
    isRulerHidden(){
      if(this.Fixed.isFixed){
        this.fixed({ci:this.Fixed.ci,ri:this.Fixed.ri});
      }
    },
    reportIsCenter(newV){
        let totalWidth = 0;
        let defaultWidth = this.mixData.dp.report.width.defaultValue;
        this.mixData.sheet.cols.forEach((cur) => {
                if (cur.p.width) {
                    totalWidth += cur.p.width;
                } else {
                    totalWidth += defaultWidth;
                }
        });
        if(totalWidth>this.boxSize.width){
        console.log('显示三个表')
          this.IsShow = true;
        }else{
          this.IsShow = !newV; 
        }
      
      if(this.Fixed.isFixed){
        this.Fixed.isFixed = false;
      }
    },
  },
  async created() {
    //获取数据
    await this.reqData();
    //计算宽度判断是否居中显示；
    let width = reportWidth(this.mixData);
    if (!this.isRulerHidden) {
      width += 46;
    }
  },
  mounted() {
    window.onresize = () => {
      this.Fixed.isFixed = false;
    };
  },
  updated() {},
  beforeDestroy() {},
  methods: {
    /**
     * @description 报表模块修改当前选中项
     */
    selectAreaRange(name) {
      this.currentName = name;
    },
    /**
     * @description 主表滚动距离
     */
    scrollTopRange({ scrollTop, scrollLeft }) {
      console.log(scrollTop, scrollLeft);
      this.scrollTop = scrollTop;
      this.scrollLeft = scrollLeft;
      this.Fixed.isFixed && this.scrollReport();
    },
    /**
     * @description 数据变动触发的方法，包括：导入、导出、填报数据
     */
    changeData() {
      this.saveinputData(this.resolveMix(this.mixData));
      this.saveinputData(this.resolveMix(this.mixData));
      this.saveinputData(this.resolveMix(this.mixData));
      this.saveinputData(this.resolveMix(this.mixData));
      this.saveinputData(this.resolveMix(this.mixData));
    },
    /**
     * @description 冻结模式
     */
    fixed(ischangeData) {
      let { ri, ci } = this.currentName[0]; 
      if(ischangeData){
        this.Fixed.isFixed = true;
        ri = ischangeData.ri;
        ci = ischangeData.ci;
      }else{
        this.Fixed.isFixed = !this.Fixed.isFixed;
        this.Fixed.ci = ci;
        this.Fixed.ri = ri;
      }
      if (this.Fixed.isFixed) {
        // if(this.reportIsCenter){
        //   this.$message('居中模式下，暂不支持冻结功能');
        //   return
        // }
        this.Fixed.scrollTop = this.scrollTop;
        this.Fixed.scrollLeft = this.scrollLeft;
        console.log(
          "this.Fixed.scrollTop",
          this.Fixed.scrollTop,
          "this.scrollTOP",
          this.scrollTop
        );
        
        let { resCol, resRow } = getColandRow(
          this.json,
          parseInt(ri),
          parseInt(ci)
        );
        if (resCol) {
          this.Fixed.ColJson = resCol.newJson;
          this.Fixed.width = this.isRulerHidden
            ? resCol.totalWidth
            : resCol.totalWidth + 46;
        }
        if (resRow) {
          this.Fixed.RowJson = resRow.newJson;
          this.Fixed.height = this.isRulerHidden
            ? resRow.totalHeight
            : resRow.totalHeight + 24;
        }
        if (resRow && resCol) {
          // 最后的赋值操作
          this.Fixed.TheFixRes = JSON.parse(JSON.stringify(this.json));
          this.Fixed.TheFixRes.sheet.cols = resCol.newJson.sheet.cols;
          this.Fixed.TheFixRes.sheet.rows = resRow.newJson.sheet.rows;
        }
        this.$nextTick(() => {
          this.scrollReport();
        });
      } else {
        this.Fixed = {
          //冻结信息模块
          isFixed: false,
          ColJson: null, //列
          RowJson: null, //行
          TheFixRes: null,
          width: 0,
          height: 0,
          ci:0,
        ri:0,
        };
      }
    },
    scrollReport() {
      console.log("开始控制元素的滚动");
      let scrollTopOnly = this.Fixed.scrollTop;
      let scrollLeftOnly = this.Fixed.scrollLeft;
      //只操作一次的dom
      if (reportDom.isfirst) {
        reportDom.isfirst = false;

        if (this.$el.querySelector(".rowcol")) {
          let reportSheet = this.$el.querySelector(".rowcol .report-sheet");
          reportSheet.scrollTop = scrollTopOnly;
          reportSheet.scrollLeft = scrollLeftOnly;

          this.$el.querySelector(
            ".rowcol .report-column"
          ).scrollLeft = scrollLeftOnly;
          this.$el.querySelector(
            ".rowcol .report-row"
          ).scrollTop = scrollTopOnly;
        }
        if (this.$el.querySelector(".row")) {
          this.$el.querySelector(
            ".row .report-sheet"
          ).scrollTop = scrollTopOnly;
          this.$el.querySelector(".row .report-row").scrollTop = scrollTopOnly;
        }
        if (this.$el.querySelector(".col")) {
          this.$el.querySelector(
            ".col .report-sheet"
          ).scrollLeft = scrollLeftOnly;
          this.$el.querySelector(
            ".col .report-column"
          ).scrollLeft = scrollLeftOnly;
        }
      }
      if (reportDom.left.length === 0) {
        //row 左右移动 表式+表头abcd
        let dom1 = this.$el.querySelector(".row .report-sheet");
        let dom2 = this.$el.querySelector(".row .report-column");
        dom1 && reportDom.left.push(dom1);
        dom2 && reportDom.left.push(dom2);
      }
      if (reportDom.top.length === 0) {
        //col 上下移动 表式+表头1234
        let dom1 = this.$el.querySelector(".col .report-sheet");
        let dom2 = this.$el.querySelector(".col .report-row");
        dom1 && reportDom.top.push(dom1);
        dom2 && reportDom.top.push(dom2);
      }
      reportDom.top.forEach((dom) => {
        dom.scrollTop = this.scrollTop;
      });
      reportDom.left.forEach((dom) => {
        dom.scrollLeft = this.scrollLeft;
      });
    },
  },
};
</script>

<style lang="less" scoped>
@borderWidth: 3px;

.MsiteReport {
  position: relative;
}
.rowcol {
  overflow: hidden;
  border-right: @borderWidth solid #666;
  border-bottom: @borderWidth solid #666;
}
.col {
  overflow: hidden;
  border-right: @borderWidth solid #666;
}
.row {
  overflow: hidden;
  width: calc(100% - 7px) !important;
  border-bottom: @borderWidth solid #666;
}

.row::before,
.col::before,
.rowcol::before {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  z-index: 88;
}
</style>