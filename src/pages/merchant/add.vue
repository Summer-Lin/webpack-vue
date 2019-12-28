<template>
  <div class="add">
    <p class="title">
      <span class="icon iconfont">&#xe6bd;</span>
      {{$t('merchantAdd.title')}}
    </p>

    <div class="form">
      <Form :model="formItem" :label-width="100" inline>
        <FormItem :label="$t('merchantAdd.input1')">
          <Input v-model="formItem.input1"></Input>
        </FormItem>
        <FormItem :label="$t('merchantAdd.input2')">
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

    <div class="img">
      <img src="../../images/1.png" alt />
    </div>
  </div>
</template>

<script>
import { getUrlParams } from "../../utils/global.js";
export default {
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
              return h("div", this.$t("merchantAdd.name"));
            }
          },
          {
            title: "Age",
            key: "age",
            renderHeader: (h, params) => {
              return h("div", this.$t("merchantAdd.age"));
            }
          },
          {
            title: "Address",
            key: "address",
            renderHeader: (h, params) => {
              return h("div", this.$t("merchantAdd.address"));
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

<style lang="less">
.add {
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

  img {
    width: 50px;
    height: 50px;
  }
}
</style>
