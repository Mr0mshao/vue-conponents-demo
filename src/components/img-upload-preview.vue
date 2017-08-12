<template>
<!-- 图片上传，预览 -->
  <div style="text-align:left">
    <input
      type="file"
      name="images"
      id="myImage"
      :multiple="multiple"
      @change="uploadBefor"
      style="position:absolute;left:-99999px;"
    >
    <label for="myImage" class="upload-btn upload-btn-primary">
      <span>上传照片</span>
    </label>
    <div class="upload-tips">{{tips}}</div>
    <transition-group tag="ul" class="upload-list" name="list">
      <li v-for="(item,index) in prevImgList" :key="index" class="upload-list-item">
        <div class="item-img">
          <img :src="item.base64" alt=""  class="item-img">
        </div>
        <div class="item-info">
          <div>
            {{item.name}}<br/>
            {{item.size | imgSpace}}
          </div>
          <div>
            <span class="info-btn">查看</span> | 
            <span class="info-btn" @click="deletePreviewImg(index)">删除</span>
          </div>
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'upload-preview',
  props: {
    imgtype: { // 图片类型
      type: String,
      default: 'image/gif, image/jepg, image/png'
    },
    multiple: { // 是否为多张上传
      type: Boolean,
      default: true,
      require: true
    },
    tips: {
      type: String,
      default: '只能上传jpg/png文件，且不超过500kb'
    }
  },
  data () {
    return {
      imgList: [],
      prevImgList: [],
      filetypes: ['.jpg', '.png', '.gif', '.jpeg', '.bmp']
    }
  },
  methods: {
    changeSuccess () {
      this.$emit('upload-img', this.imgList)
    },
    uploadBefor (e) {
      if (e.target.files.length === 0) return
      let imgFiles = Array.from(e.target.files)
      for (let i = 0; i < imgFiles.length; i++) {
        let filename = imgFiles[i].name.toString().toLowerCase()
        let n = filename.substring(filename.indexOf('.'))
        if (!this.filetypes.includes(n)) {
          // 提示信息
          alert('抱歉！您上传的不是图片类型文件。')
          return false
        }
        for (let j = 0; j < this.imgList.length; j++) {
          const newFile = imgFiles[i]
          const oldFile = this.imgList[j]
          console.log(oldFile)
          if (newFile.name === oldFile.name && newFile.size === oldFile.size && newFile.type === oldFile.type) {
            imgFiles.splice(i, 1)
          }
        }
      }
      this.imgList = this.imgList.concat(imgFiles)
      if (this.imgList.length >= 9) {
        this.imgList = this.imgList.splice(0, 9)
      }
      this.previewImg(imgFiles)
      this.changeSuccess()
    },
    previewImg (files) {
      for (let i = 0; i < files.length; i++) {
        let img = files[i]
        const reader = new FileReader()
        reader.readAsDataURL(img)
        reader.onload = (e) => {
          this.prevImgList.push({
            base64: e.target.result,
            name: img.name,
            size: img.size
          })
        }
      }
    },
    deletePreviewImg (index) {
      this.imgList.splice(index, 1)
      this.prevImgList.splice(index, 1)
      this.changeSuccess()
    }
  },
  filters: {
    imgSpace (size) {
      let m = (size / 1024 / 1024).toString()
      let r = m.substr(m.indexOf('.'), 3)
      let s = parseFloat(r)
      return `${s}MB`
    }
  }
}
</script>

<style scoped>
.list-enter-active, .list-leave-active {
  transition: all .5s cubic-bezier(.55,0,.1,1);
}
.list-enter, .list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.upload-btn {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #bfcbd9;
  border-color: #c4c4c4;
  color: #1f2d3d;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  padding: 10px 15px;
  font-size: 14px;
  border-radius: 4px;
}
.upload-btn-primary {
    color: #fff;
    background-color: #20a0ff;
    border-color: #20a0ff;
}
.upload-btn.is-active,
.upload-btn:active {
    background: #1d90e6;
    border-color: #1d90e6;
    color: #fff;
}
.upload-btn:active {
    outline: none;
}
.upload-btn:focus,
.upload-btn:hover {
    background: #4db3ff;
    border-color: #4db3ff;
    color: #fff;
}
.upload-tips {
  font-size: 12px;
  color: #8391a5;
  margin-top: 7px;
}
.upload-list {
  margin: 0;
  padding: 0;
  list-style: none;
}
.upload-list > li {
  display: list-item;
  text-align: -webkit-match-parent;
}
.upload-list-item {
  font-size: 14px;
  color: #48576a;
  line-height: 1.8;
  margin-top: 5px;
  box-sizing: border-box;
  border-radius: 4px;
  width: 100%;
  position: relative;
}
.upload-list .upload-list-item:hover {
  border: 1px solid #f60;
}
.upload-list .upload-list-item {
  overflow: hidden;
  background-color: #dedede;
  border: 1px solid #c0ccda;
  border-radius: 6px;
  padding: 10px;
  box-sizing: border-box;
  height: 100px;
  width: 400px;
}
.upload-list-item .item-img {
  display: inline-block;
  min-width: 150px;
  max-width: 50%;
  height: 100%;
  overflow: hidden;
  vertical-align: middle;
}
.upload-list-item .item-info {
  display: inline-block;
  margin-left: 10px;
  vertical-align: middle;
}
.item-info .info-btn {
  display: inline-block;
  width: 3em;
  height: 20px;
  line-height: 20px;
  background-color: #dedede;
  border: 1px solid #aeaeae;
  border-radius: 6px;
  text-align: center;
  font-size: 12px;
  cursor: pointer;
}
.item-info .info-btn:hover {
  border: 1px solid #f60;
}
</style>
