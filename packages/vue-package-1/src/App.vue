<template>
  <div class="map">
    <PluginB :editable="false" :text="initData" @submit="submit" />
    <PluginA :editable="false" :text="initData" @submit="submit" />
    <p>pluginText:{{ pluginText }}</p>
  </div>
</template>

<script>
import vuePackageDemo from "vue-package-demo";
import Vue from "vue"
// Vue.component("PluginAA", vuePackageDemo);
console.log(vuePackageDemo);
// import PluginA from "vue-package-demo";
const { PluginA, PluginB } = vuePackageDemo;
// console.log(PluginA);
export default {
  data() {
    return {
      initData: "hello 你好",
      pluginText: "",
    };
  },
  components: {
    // Main,
    PluginA,
    PluginB,
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