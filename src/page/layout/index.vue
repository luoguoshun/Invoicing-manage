<template>
  <div class="container">
    <!-- 导航栏 -->
    <header>
      <Header />
    </header>
    <!-- 主内容区 -->
    <main>
      <!-- 头部 -->
      <Slider class="slider" />
      <!-- 动态组件内容区 -->
      <Content class="myContent" />
    </main>
  </div>
</template>

<script>
import Header from './header.vue';
import Slider from './slider.vue';
import Content from './content.vue';
export default {
  components: {
    Header,
    Slider,
    Content,
  },
  data() {
    return {
      dynamicTags: [],
      thisRouterName: '',
    };
  },
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  overflow: auto;
  header {
    height: 60px;
    width: 100%;
  }
  main {
    width: 100%;
    height: 96%;
    display: grid;
    grid-template-columns: 205px 1fr;
    .myContent {
      border: 1px solid whitesmoke;
      border-radius: 5px;
      padding: 5px 5px;
      margin-bottom: 0px;
    }
  }
}
</style>
