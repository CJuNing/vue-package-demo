<template>
  <div class="pluginA plugin">
    <input type="text" class="text" v-model="text" />
    <button @click.stop="toggle">当前状态为11 ==> {{ me_checked }}</button>
  </div>
</template>

<script>
export default {
  name: "PluginA",
  props: {
    editable: {
      type: Boolean,
      default: true,
    },
    text: {
      type: String,
      default: "我是默认值",
    },
  },
  data: function data() {
    return {
      me_checked: this.editable,
    };
  },
  watch: {
    me_checked: function me_checked(val) {
      this.$emit("submit", "".concat(this.text, " ==> ").concat(val));
    },
  },
  methods: {
    toggle: function toggle() {
      this.me_checked = !this.me_checked;
    },
  },
};
</script>

<style scoped>
.pluginA {
  width: calc(100% - 20px);
  border: 1px solid firebrick;
  border-radius: 10px;
  height: 400px;
  padding: 10px;
  margin: 10px;
  box-sizing: border-box;
}

.text {
  height: 50px;
  line-height: 50px;
  width: 100%;
  display: inline-block;
  box-sizing: border-box;
  padding: 10px;
}

button {
  margin: 30px;
  padding: 10px;
  text-align: center;
  width: 500px;
  height: 100px;
  border-radius: 15px;
  border: none;
  font-size: 20px;
  color: #fff;
  background-color: firebrick;
}

:focus {
  /* border:-webkit-focus-ring-color auto 1px */
  outline: none;
}
</style>