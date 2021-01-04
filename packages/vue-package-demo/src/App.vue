<template>
  <div class="map">
    <Main :propData="initData" />
  </div>
</template>

<script>
import Main from "./components/Main";
export default {
  data() {
    return {
      initData: "hello 你好",
    };
  },
  components: {
    Main,
  },
};
</script>

<style>
.map {
  margin: 100px;
  border: 1px solid #000;
  border-radius: 5px;
}
</style>