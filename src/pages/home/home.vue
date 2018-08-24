<template>
  <scroll-view class="home" scroll-y @scrolltolower="loadMore">
    <a class="search-wrap"
       href="/pages/search/main" 
       hover-class="none">
      <search-box></search-box>
    </a>
    <div class="tag-list" v-show="category.length">
      <div class="tag" @click="selectTag(-1)" :class="current == -1 ? 'active':''">最热</div>
      <div class="tag" 
           @click="selectTag(index)"
           v-for="(item, index) of category"
           :key="index"
           :class="current == index ? 'active':''">{{item.name}}</div>
    </div>
    <div class="list-wrap">
      <listview @selectItem="selectItem" :list="list"></listview>
    </div>
  </scroll-view>
</template>

<script>
import Listview from 'components/listview'
import SearchBox from 'components/search-box'
import {getList} from 'api/api'
import {mapGetters, mapActions} from 'vuex'
export default {
  components: {
    Listview,
    SearchBox
  },
  data () {
    return {
      // 分页
      page: 0,
      // 标签id
      cid: null,
      // 标签选中 -1最热
      current: -1,
      data: {},
      hasMore: true
    }
  },
  computed: {
    category() {
      return this.data.category || []
    },
    list() {
      return this.data.data || []
    },
    ...mapGetters([
      'auth'
    ])
  },
  methods: {
    // 选择标签
    selectTag(index) {
      if(this.current == index) {
        return
      }
      index < 0 ? this.cid = null : this.cid = this.category[index].id
      this.current = index
      this.page = 0
      this._getList()
    },
    selectItem(item) {
      wx.navigateTo({
        url: `/pages/preview/main`
      })
      this.setItem(item)
      // console.log(item)
    },
    loadMore() {
      if(!this.hasMore) {
        wx.showToast({
          icon: 'none',
          title: '别拉了，到底了~'
        })
        return
      }
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      this.page ++
      getList(this.page, this.cid, this.auth).then((res) => {
        console.log(res)
        if(res.result === 1) {
          this.data.data = this.data.data.concat(res.data)
          this._checkMore(res.data)
        }
        wx.hideLoading()
      })
    },
    _getList() {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      this.hasMore = true
      getList(this.page, this.cid, this.auth).then((res) => {
        if(res.result === 1) {
          this.data = res
        }
        wx.hideLoading()
      })
    },
    _checkMore(data) {
      if(!data.length) {
        this.hasMore = false
      }
    },
    ...mapActions([
      'setItem'
    ])
  },
  watch: {
    auth() {
      this._getList()
    }
  },
  onShareAppMessage() {
    return {
      title: '聊天缺表情？快到这里来找！',
      path: '/pages/home/main',
      imageUrl: '/static/images/shareImage.png'
    }
  }
}
</script>

<style scoped lang="less">
  .home {
    height: 100%;
    background-color: #fff;
    .search-wrap {
      width: 100%;
      padding: 15px;
      box-sizing: border-box;
    }
    .tag-list {
      padding-right: 15px;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      .tag {
        width: 75px;
        height: 36px;
        margin: 15px 0 0 15px;
        background-color: #fff;
        box-sizing: border-box;
        border: 1rpx solid #666;
        color: #333;
        font-size: 16px;
        text-align: center;
        line-height: 34px;
        border-radius: 2px;
        &.active {
          background-color: #ec4318;
          color: #fff;
          border: 1rpx solid #ec4318;
        }
      }
    }
    .list-wrap {
      margin-top: 5px;
    }
  }
</style>
