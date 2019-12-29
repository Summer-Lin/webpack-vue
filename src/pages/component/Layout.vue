<template>
  <div class="layout">
    <Layout>
      <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
        <div class="logo"></div>
        <Menu
          theme="dark"
          width="auto"
          :class="menuitemClasses"
          :active-name="activeName"
          :open-names="openNames"
          @on-select="onSelectMenu"
        >
          <template v-for="(item, index) in menuArray">
            <template v-if="item.children && item.children.length > 0">
              <Submenu :name="item.path" :key="index">
                <template slot="title">
                  <Icon type="ios-stats" />
                  {{item.name}}
                </template>

                <MenuItem
                  v-for="(subItem, subIndex) in item.children"
                  :name="subItem.path"
                  :key="subIndex"
                >{{subItem.name}}</MenuItem>
              </Submenu>
            </template>

            <template v-else>
              <MenuItem :name="item.path" :key="index">
                <Icon type="ios-people" />
                {{item.name}}
              </MenuItem>
            </template>
          </template>
        </Menu>
      </Sider>

      <Layout>
        <Header :style="{ padding: 0 }" class="layout-header-bar">
          <Row>
            <Col span="20">
              <Icon
                @click.native="collapsedSider"
                :class="rotateIcon"
                :style="{ margin: '0 20px' }"
                type="md-menu"
                size="24"
              ></Icon>
            </Col>
            <Col span="4">
              <Dropdown trigger="click" @on-click="onClickLang">
                <a href="javascript:void(0)">
                  语言
                  <Icon type="ios-arrow-down"></Icon>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem name="zh">中文</DropdownItem>
                  <DropdownItem name="en">英文</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Col>
          </Row>
        </Header>

        <Content :style="{ margin: '20px', background: '#fff', minHeight: '260px' }">
          <router-view></router-view>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<script>
import { log } from "util";
import {setup} from "@/lang/index.js"
import {LOCALE_KEY} from "@/utils/config.js"
import {storage} from "@/utils/global.js"

export default {
  data() {
    return {
      isCollapsed: false,

      activeName: "",
      openNames: [],
      //菜单
      // menuArray:[],
      menuArray: [
        { name: this.$t('layout.home'), path: "/home" },
        { name: this.$t('layout.product'), path: "/product" },
        {
          name: this.$t('layout.merchant'),
          path: "/merchant",
          children: [
            { parent: "/merchant", name: this.$t('layout.merchantAdd'), path: "/merchant/add" },
            { parent: "/merchant", name: this.$t('layout.merchantDetail'), path: "/merchant/detail" }
          ]
        }
      ]
    };
  },

  created() {
    this.activeName = this.$route.path;
    let tempPath = this.$route.path.split("/");
    this.openNames = [`/${tempPath[1]}`];
  },

  computed: {
    rotateIcon() {
      return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
    },
    menuitemClasses() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    }
  },
  methods: {
    onSelectMenu(path) {
      console.log(path);
      this.$router.push({ path: path });
    },
    collapsedSider() {
      this.$refs.side1.toggleCollapse();
    },
    onClickLang(name) {
      storage.setItem(LOCALE_KEY, name)
      window.location.reload()

    }
  }
};
</script>

<style lang="less" scoped>
.logo {
  height: 40px;
  height: 38px;
  background: #736767;
  box-sizing: border-box;
  margin: 13px 40px;
}
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  height: 100%;
}
.ivu-layout {
  height: 100%;
}
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
.layout-logo-left {
  width: 90%;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
}
.menu-icon {
  transition: all 0.3s;
}
.rotate-icon {
  transform: rotate(-90deg);
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}
</style>
