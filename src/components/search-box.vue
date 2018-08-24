<template>
  <div class="search-box">
    <div class="input-box">
      <input type="text" ref="query" class="input" :placeholder="placeholder" v-model="query">
      <div class="search" @click="searchQuery">搜索</div>
    </div>
  </div>
</template>

<script>
import {debounce} from 'common/js/util'
export default {
  props: {
    placeholder: {
      type: String,
      default: '输入关键词，自动匹配表情包'
    }
  },
  data() {
    return {
      query: ''
    }
  },
  methods: {
    searchQuery() {
      this.$emit('searchQuery')
    },
    setQuery(query) {
      this.query = query
    },
    blur() {
      this.$refs.query.blur()
    }
  },
  created() {
    this.$watch('query', debounce((newQuery) => {
      this.$emit('query', newQuery)
    }, 200))
  }
}
</script>

<style lang="less" scoped>
  .input-box {
    width: 100%;
    height: 50px;
    border-radius: 4px;
    background-color: #f5f5f5;
    display: flex;
    padding: 0 10px;
    align-items: center;
    box-sizing: border-box;
    .input {
      color: #333;
      font-size: 16px;
      flex: 1;
      margin-right: 10px;
    }
    .search {
      width: 65px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      font-size: 16px;
      color: #fff;
      border-radius: 4px;
      background-color: #ec4318;
    }
  }
</style>
