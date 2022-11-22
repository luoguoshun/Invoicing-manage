<template>
  <div class="mySlide">
    <el-menu default-active="this.$route.name" :router="true" background-color="#324157" text-color="#bfcbd9" active-text-color="#049eff">
      <template v-for="item in getDynamicRouters[0].children">
        <el-menu-item v-if="item.children.length == 0" :key="item.routerId" :index="item.menuIndex">
          <i :class="item.meta['icon']"></i>
          <span slot="title">{{ item.meta['title'] }}</span>
        </el-menu-item>
        <el-submenu v-else :key="item.routerId + 1" :index="item.menuIndex">
          <template slot="title">
            <i :class="item.meta['icon']"></i>
            <span slot="title">{{ item.meta['title'] }}</span>
          </template>
          <el-menu-item
            v-for="children in item.children"
            :key="children.routerId"
            :index="children.menuIndex"
            @click.native="createTab({ tabName: children.meta['title'], routeName: children.routerId })"
          >
            <span slot="title">{{ children.meta['title'] }}</span>
          </el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
  computed: {
    //将this.getDynamicTags 映射为 this.$store.getters.getDynamicTags
    ...mapGetters({ getDynamicRouters: 'routers/getDynamicRouters' }),
  },
  methods: {
    //   映射添加标签页函数
    //  载荷应该是一个对象，这样可以包含多个字段并且记录的 mutation 会更易读：
    ...mapMutations({ createTab: 'tagsView/createTab' }),
  },
  created() {
    let dynamicRouters = JSON.parse(JSON.stringify(this.getDynamicRouters[0].children));
  },
};
</script>
<style lang="less" scoped>
.mySlide {
  height: 100%;
  width: 100%;
  .el-menu {
    min-height: 100%;
    background-color: #324157;
    color: #bfcbd9;
  }
}
</style>
