<template>
  <div class="container">
    <p class="title">
      <span class="icon iconfont">&#xe636;</span>
      {{$t('product.title')}}
    </p>

    <div class="form">
      <Form :model="formItem" :label-width="100" inline>
        <FormItem :label="$t('product.input1')">
          <Input v-model="formItem.input1"></Input>
        </FormItem>
        <FormItem :label="$t('product.input2')">
          <Input v-model="formItem.input12"></Input>
        </FormItem>

        <Button type="primary">{{$t('common.search')}}</Button>
        <Button type="dashed">{{$t('common.reset')}}</Button>
      </Form>
    </div>

    <div>
      <Table :columns="table.col" :data="table.data"></Table>
    </div>

    <div class="page">
      <Page :total="100" show-sizer />
    </div>
  </div>
</template>

<script>
import { getUrlParams } from "../../utils/global.js";
export default {
  name: "Product",

  data() {
    return {
      searchParams: "",
      formItem: {
        input1: "",
        input2: ""
      },

      table: {
        col: [
          {
            title: "Name",
            key: "name",
            renderHeader: (h, params) => {
              return h("div", this.$t("product.name"));
            }
          },
          {
            title: "Age",
            key: "age",
             renderHeader: (h, params) => {
              return h("div", this.$t("product.age"));
            }
          },
          {
            title: "Address",
            key: "address",
             renderHeader: (h, params) => {
              return h("div", this.$t("product.address"));
            }
          }
        ],
        data: [
          {
            name: "John Brown",
            age: 18,
            address: "New York No. 1 Lake Park",
            date: "2016-10-03"
          },
          {
            name: "Jim Green",
            age: 24,
            address: "London No. 1 Lake Park",
            date: "2016-10-01"
          },
          {
            name: "Joe Black",
            age: 30,
            address: "Sydney No. 1 Lake Park",
            date: "2016-10-02"
          },
          {
            name: "Jon Snow",
            age: 26,
            address: "Ottawa No. 2 Lake Park",
            date: "2016-10-04"
          }
        ]
      }
    };
  },

  created() {
    this.searchParams = getUrlParams(window.location.href);
    console.log(this.searchParams);
  }
};
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  .title {
    padding: 10px 20px;
    background: #e2e2e2;
    color: #000000;
    font-size: 14px;
    border-radius: 5px;
  }
  .form {
    padding: 20px;
  }

  .page {
    padding: 10px;
    text-align: right;
  }
}
</style>