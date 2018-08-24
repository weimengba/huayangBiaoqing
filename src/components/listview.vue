<template>
  <div class="listview">
    <div class="preview-wrap" v-if="isPreview">
      <div class="preview-box">
        <div class="image-box" @click="previewImage">
          <img :src="imageSrc" mode="aspectFit" alt="">
        </div>
        <div class="btn-group">
          <div class="btn-box" @click="sendFriend">
            <img src="./share-icon.png" alt="" class="icon">
            <text class="text">发给好友</text>
          </div>
          <div class="btn-box" @click="download">
            <img src="./download-icon.png" alt="" class="icon">
            <text class="text">下载</text>
          </div>
          <div class="btn-box" @click="collect">
            <img :src="favorite != 1 ? '/static/images/collect-icon.png':'/static/images/collected.png'" alt="" class="icon">
            <text class="text">{{collectTxt}}</text>
          </div>
        </div>
      </div>
    </div>
    <ul class="list-ul">
      <li class="title" v-show="titleShow">相关推荐</li>
      <li class="item" 
          @click="selectItem(item, index)" 
          v-for="(item, index) of list" 
          :key="index"
          :style="{backgroundImage: 'url('+ item.thumb +')'}"></li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    // 数据
    list: {
      type: Array,
      default: () => []
    },
    // 是否预览
    isPreview: {
      type: Boolean,
      default: false
    },
    // 预览图
    imageSrc: {
      type: String,
      default: null
    },
    titleShow: {
      type: Boolean,
      default: false
    },
    favorite: {
      type: String,
      default: -1
    }
  },
  computed: {
    collectTxt() {
      return this.favorite != 1 ? '收藏' : '已收藏'
    }
  },
  methods: {
    selectItem(item, index) {
      this.$emit('selectItem', item, index)
    },
    sendFriend() {
      if(this.isPreview) {
        this.$emit('sendFriend')
      }
    },
    download() {
      if(this.isPreview) {
        this.$emit('download')
      }
    },
    collect() {
      if(this.isPreview) {
        this.$emit('collect')
      }
    },
    previewImage() {
      this.$emit('previewImage')
    }
  }
}
</script>

<style lang="less" scoped>
  .preview-wrap {
    padding-bottom: 10px;
    background-color: #f5f5f5;
    .preview-box {
      width: 100%;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-bottom: 25px;
      padding-top: 15px;
      .image-box {
        width: 235px;
        height: 235px;
        // background-color: #f5f5f5;
        margin-right: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .btn-group {
        display: inline-flex;
        flex-direction: column;
        .btn-box {
          display: inline-flex;
          align-items: center;
          flex-direction: column;
          &+.btn-box {
            margin-top: 20px;
          }
          .icon {
            width: 50px;
            height: 50px;
            display: block;
            margin-bottom: 7px;
          }
          .text {
            line-height: 1;
            font-size: 16px;
            color: #838383;
            display: block;
          }
        }
      }
    }
  }
  .list-ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 15px 15px 0;
    box-sizing: border-box;
    .title {
      width: 100%;
      font-size: 16px;
      color: #838383;
      margin-left: 15px;
      margin-top: 15px;
    }
    .item {
      width: 105px;
      height: 105px;
      background-color: #f5f5f5;
      margin: 15px 0 0 15px;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: 50%;
    }
  }
</style>
