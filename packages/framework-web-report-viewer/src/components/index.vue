<template>
  <div>
    <div class="MsiteHeaderOutter">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        :title="tab.text"
        @click="selectMode(tab.mode)"
        class="HeaderButton"
      >
        <span>{{ tab.text }}</span>
      </div>
      <div class="changeSize">
        宽度：<el-input-number
          size="mini"
          v-model="boxSize.width"
          controls-position="right"
          :min="200"
          label="宽度"
        ></el-input-number>
        高度：<el-input-number
          size="mini"
          v-model="boxSize.height"
          controls-position="right"
          :min="200"
        ></el-input-number>
      </div>
    </div>
    <msite
      ref="msite_report"
      :isRulerHidden="isRulerHidden"
      :reportIsCenter="reportIsCenter"
      :boxSize="boxSize"
      :isRulerActive="isRulerActive"
      :reportIsSubmit="reportIsSubmit"
      :reportFile="reportFile"
      :params="params"
    ></msite>
  </div>
</template>

<script>
import msite from "./Msite";

let urlParams = new URLSearchParams(window.location.search);
const getUrlKey = (key) => urlParams.get(key);

export default {
  name: "",
  components: { msite },
  props: [],
  data() {
    return {
      reportFile: getUrlKey("reportFile"),
      isRulerActive: getUrlKey("isRulerActive") || false,
      reportIsCenter: getUrlKey("reportIsCenter") || false,
      isRulerHidden: getUrlKey("isRulerHidden") || false,
      boxSize: {
        width: getUrlKey("width") || "100%",
        height: getUrlKey("height") || "100%",
      },
      reportIsSubmit: false,
      params: getUrlKey("params"),
      //==========
      tabs: [
        {
          text: "冻结/取消冻结",
          id: "1",
          icon: "el-icon-s-tools",
          mode: "fixed", //模式
        },
        {
          text: "显示/隐藏标尺",
          id: "8",
          icon: "el-icon-s-tools",
          mode: "showRule",
        },
        {
          text: "高亮/取消高亮标尺",
          id: "9",
          icon: "el-icon-s-tools",
          mode: "activeRule",
        },
        {
          text: "保存填报数据",
          id: "12",
          icon: "el-icon-s-tools",
          mode: "saveFillingData",
        },
        {
          text: "加载填报数据",
          id: "13",
          icon: "el-icon-s-tools",
          mode: "loadFillingData",
        },
        {
          text: "是否居中显示报表",
          id: "14",
          icon: "el-icon-s-tools",
          mode: "center",
        },
        {
          text: "是否仅展示",
          id: "15",
          icon: "el-icon-s-tools",
          mode: "display",
        },
      ],
    };
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    urlParams = new URLSearchParams(window.location.search);
  },
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    /* 选择模式 */
    selectMode(mode) {
      switch (mode) {
        case "fixed":
          this.$refs.msite_report.fixed();
          break;
        case "showRule":
          this.isRulerHidden = !this.isRulerHidden;
          break;
        case "activeRule":
          this.isRulerActive = !this.isRulerActive;
          break;
        case "saveFillingData":
          this.$refs.msite_report.changeData();
          break;
        case "loadFillingData":
          this.$refs.msite_report.createMix();
          break;
        case "center":
          this.reportIsCenter = !this.reportIsCenter;
          break;
        case "display":
          this.reportIsSubmit = !this.reportIsSubmit;
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.MsiteHeaderOutter {
  padding: 5px 20px;
  display: flex;
  color: #666666;
  flex-wrap: wrap;
  align-items: left;
  background-color: #f8f9fb;

  .HeaderButton {
    background-color: #f5f5f5;
    border: 1px solid #e1e1e1;
    border-radius: 4px;
    height: 25px;
    padding: 0 5px;
    margin: 2px 2px;
    cursor: pointer;
    i,
    span {
      line-height: 25px;
      font-size: 14px;
      font-weight: 700;
      vertical-align: middle;
    }
    i {
      font-size: 16px;
    }
    &:hover {
      background-color: rgb(253, 170, 34);

      box-shadow: 5px 2px 10px #666, 2px 2px 5px #666;
    }
  }
  .changeSize {
    margin: 2px;
    color: #666666;
    font-size: 14px;
    font-weight: 700;
  }
}
</style>