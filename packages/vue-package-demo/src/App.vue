<template>
  <div class="map">
    <PluginA :editable="false" :text="initData" @submit="submit"/>
    <PluginB :editable="false" :text="initData" @submit="submit"/>
    <p>pluginText:{{ pluginText }}</p>
  </div>
</template>

<script>
// import Main from "./components/Main";
import PluginA from "./components/PluginA";
import PluginB from "./components/PluginB";
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
  methods:{
    submit(val) {
      this.pluginText = val;
    }
  }
};
</script>

<style>
.map {
  margin: 30px;
  border: 1px solid #000;
  border-radius: 5px;
}
</style>