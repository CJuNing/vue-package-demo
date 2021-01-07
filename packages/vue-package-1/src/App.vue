<template>
  <div class="map">
    <PluginB :editable="false" :text="initData" @submit="submit" />
    <PluginA :editable="false" :text="initData" @submit="submit" />
    <p>pluginText:{{ pluginText }}</p>
    <ReportViewer
      ref="msite_report"
      :isRulerHidden="isRulerHidden"
      :reportIsCenter="reportIsCenter"
      :boxSize="boxSize"
      :isRulerActive="isRulerActive"
      :reportIsSubmit="reportIsSubmit"
      :reportFile="reportFile"
    ></ReportViewer>
  </div>
</template>

<script>
import vuePackageDemo from "vue-package-demo";
import "vue-package-demo/lib/plugin.css";
import FusionReporter from "fusion-web-report-viewer";
import Vue from "vue";
// Vue.component("PluginAA", vuePackageDemo);
console.log(vuePackageDemo);
// import PluginA from "vue-package-demo";
const { PluginA, PluginB } = vuePackageDemo;
const { ReportViewer } = FusionReporter;
// console.log(PluginA);
export default {
  data() {
    return {
      initData: "hello 你好",
      pluginText: "",
      reportFile: "%2F20200811_bing.report",
      isRulerActive: true,
      reportIsCenter: false,
      isRulerHidden: false,
      boxSize: {
        width: 1000,
        height: 800,
      },
      reportIsSubmit: false,
    };
  },
  components: {
    // Main,
    PluginA,
    PluginB,
    ReportViewer,
  },
  methods: {
    submit(val) {
      this.pluginText = val;
    },
  },
};
</script>

<style>
.map {
  margin: 20px;
  border: 1px solid #000;
  border-radius: 5px;
}
</style>