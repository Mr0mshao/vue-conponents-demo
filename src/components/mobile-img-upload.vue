<template>
  <div>
    <div class="upload-list upload-list-card">
      <transition-group name="list">
        <div class="upload-list-item" v-for="(item, index) in list" :key="index">
          <div class="upload-list-item-info">
            <span>
              <a class="upload-list-item-thumbnail">
                <img :src="item.src"/>
              </a>
              <a class="upload-list-item-name">ss</a>
            </span>
          </div>
          <div class="upload-list-item-actions" @click="deletePreviewImgList(index)">
            <i class="upload-icon icon-delete"></i>
          </div>
        </div>
      </transition-group>
    </div>
    <div class="upload-box upload-select upload-select-card">
      <div class="upload-add" @touchend="toggleUpoloadWindow" role="button">
        <input type="file" @change="uploadBefore" multiple accept="image/gif,image/jpeg,image/jpg,image/png" style="display:none" ref="upload"/>
        <div>
          <i class="upload-icon icon-plus"></i>
          <div class="upload-txt">上传图片</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Exif from 'exif-js'
export default {
  data () {
    return {
      list: []
    }
  },
  methods: {
    toggleUpoloadWindow () { // 出发文件选择窗口
      this.$refs.upload.value = null
      this.$refs.upload.click()
    },
    uploadBefore (e) {
      if (this.list.length >= 5) {
        alert('xxx')
        return
      }
      let files = e.target.files
      if (files.length === 0) { return false } else if (files.length >= 5) { return }
      let imgList = Array.prototype.slice.call(files)
      imgList.forEach((file, index, files) => {
        let Orientation
        // 去获取拍照时的信息，解决拍出来的照片旋转问题
        Exif.getData(file, function () {
          Orientation = Exif.getTag(this, 'Orientation')
        })
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = (e) => {
          let img = new Image()
          img.src = e.target.result
          img.onload = () => {
            // impress images
            this.impress(img, Orientation)
          }
        }
      })
    },
    impress (img, Orientation) {
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      let tCanvas = document.createElement('canvas')   // 瓦片canvas
      let tctx = tCanvas.getContext('2d')
      let initSize = img.src.length
      let width = img.width
      let height = img.height
      let ratio  // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      if ((ratio = width * height / 4000000) > 1) {
        // console.log("大于400万像素")
        ratio = Math.sqrt(ratio)
        width /= ratio
        height /= ratio
      } else {
        ratio = 1
      }
      canvas.width = width
      canvas.height = height
      ctx.fillStyle = '#fff'  // 铺底色
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      let count  // 如果图片像素大于100万则使用瓦片绘制
      if ((count = width * height / 1000000) > 1) {
        // console.log("超过100W像素");
        count = ~~(Math.sqrt(count) + 1) // 计算要分成多少块瓦片
        let nw = ~~(width / count)  // 计算每块瓦片的宽和高
        let nh = ~~(height / count)
        tCanvas.width = nw
        tCanvas.height = nh
        for (let i = 0; i < count; i++) {
          for (let j = 0; j < count; j++) {
            tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh)
            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
          }
        }
      } else {
        ctx.drawImage(img, 0, 0, width, height)
      }
      // 修复ios上传图片的时候 被旋转的问题
      if (Orientation !== '' && Orientation !== 1) {
        // console.log('旋转')
        switch (Orientation) {
          case 6: // 需要顺时针（向左）90度旋转
            this.rotateImg(img, 'left', canvas)
            break
          case 8:// 需要逆时针（向右）90度旋转
            this.rotateImg(img, 'right', canvas)
            break
          case 3:// 需要180度旋转
            this.rotateImg(img, 'right', canvas) // 转两次
            this.rotateImg(img, 'right', canvas)
            break
        }
      }
      // 进行最小压缩
      let ndata = canvas.toDataURL('image/jpeg', 0.1)
      console.log('压缩前：' + initSize)
      console.log('压缩后：' + ndata.length)
      console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + '%')
      // 销毁dom内存中的dom元素
      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0
      tCanvas = null
      canvas = null
      this.preview(ndata)
      return this.dataURLtoBlob(ndata)
    },
    preview (file) {
      // console.log(file)
      this.list.push({
        src: file
      })
    },
    rotateImg (img, direction, canvas) {
      if (img == null) return
      // 最小与最大旋转方向，图片旋转4次后回到原方向
      const minStep = 0
      const maxStep = 3
      // img的高度和宽度不能在img元素隐藏后获取，否则会出错
      let height = img.height
      let width = img.width
      let step = 2
      if (direction === 'right') {
        step++
        // 旋转到原位置，即超过最大值
        step > maxStep && (step = minStep)
      } else {
        step--
        step < minStep && (step = maxStep)
      }
      // 旋转角度以弧度值为参数
      let degree = step * 90 * Math.PI / 180
      let ctx = canvas.getContext('2d')
      switch (step) {
        case 0:
          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0)
          break
        case 1:
          canvas.width = height
          canvas.height = width
          ctx.rotate(degree)
          ctx.drawImage(img, 0, -height)
          break
        case 2:
          canvas.width = width
          canvas.height = height
          ctx.rotate(degree)
          ctx.drawImage(img, -width, -height)
          break
        case 3:
          canvas.width = height
          canvas.height = width
          ctx.rotate(degree)
          ctx.drawImage(img, -width, 0)
          break
      }
    },
    dataURLtoBlob (dataurl) {
      let arr = dataurl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    },
    deletePreviewImgList (index) { // 删除准备上传的图片
      this.list.splice(index, 1)
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
  .upload-box {
    font-size: 12px;
    outline: 0;
  }

  .upload-select-card {
    position: relative;
    display: inline-block;
    border: 1px dashed #9d9d9d;
    height: 1.92rem;
    width: 1.92rem;
    border-radius: .08rem;
    cursor: pointer;
    background-color: #fbfbfb;
    text-align: center;
    vertical-align: top;
    margin: 0 .2rem .2rem 0;
  }
  .upload-add {
    position: absolute;
    top: 0;left: 0;bottom: 0;right: 0;
    margin: auto;
    padding: .4rem;
  }
  /* icon */
  .upload-icon {
    display: inline;
    width: .56rem;
    height: .56rem;
    font-style: normal;
    vertical-align: baseline;
    text-align: center;
    text-transform: none;
    line-height: 1;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #999;
  }
  .upload-icon::before {
    display: block;
    font-size: 28px;
  }
  .icon-plus::before {
    content: '+';
  }
  .icon-delete::before {
    content: 'x';
    color: red;
  }
  /* test */
  .upload-txt {
    height: .36rem;
    margin-top: .16rem;
    font-size: .24rem;
    color: #666;
  }
  /* upoad - list */
  .upload-list {
    overflow: hidden;
  }
  .upload-list-card {
    display: inline;
  }
  .upload-list-card .upload-list-item-thumbnail img{
    display: block;
    width: 100%;
    height: 100%;
    position: static;
    border-radius: .08rem;
  }
  .upload-list-item {
    float: left;
    width: 1.92rem;
    height: 1.92rem;
    margin: 0 .2rem .2rem 0;
  }
  .upload-list-card .upload-list-item {
    position: relative;
    padding: .16rem;
    border-radius: .08rem;
    border: 1px solid #9d9d9d;
  }
  .upload-list-card .upload-list-item-info {
    height: 100%;
    padding: 0;
    position: relative;
    overflow: hidden;
  }
  .upload-list-card .upload-list-item-actions {
    position: absolute;
    top: 0;
    right: 0;
    width: .56rem;
    height: .56rem;
    white-space: nowrap;
    z-index: 10;
  }
  
</style>
