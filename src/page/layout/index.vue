<template>
  <div class="container">
    <!-- 导航栏 -->
    <div class="slider">
      <Slider />
    </div>
    <!-- 主内容区 -->
    <div class="main">
      <!-- 头部 -->
      <div class=" header">
        <Header />
      </div>
      <!-- 动态组件内容区 -->
      <div class="content">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script>
import Header from './header.vue';
import Slider from './slider.vue';
import Footer from './footer.vue';
export default {
  components: {
    Header,
    Slider,
    Footer,
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
  display: grid;
  grid-template-columns: 200px 1fr;
  .main {
    width: 100%;
    height: 100%;
    .header {
      height: 140px;
    }
    .content {
      border: 1px solid whitesmoke;
      border-radius: 5px;
    }
  }
}
</style>
