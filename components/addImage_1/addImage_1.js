Component({
  // 组件对外属性
  properties: {
    // 图片总数量
    count: {
      type: Number,
      value: 3,
      observers: function (newVal, oldVal) {}
    },
    // 图片临时访问路径集合
    images: {
      type: Array,
      value: []
    },
    // 已经添加的图片数量
    addedCount: {
      type: Number,
      value: 0,
      observers: function (newVal, oldVal) {
        console.log('--new--'.newVal, '--old--', oldVal)
      }
    },
    // 当前图片的位置下标
    currentIndex: {
      type: Number,
      value: 0,
    }
  },
  // 组件内部属性
  data: {
  },
  // 方法
  methods: {
    // 选择图片
    chooseImage() {
      this.triggerEvent('chooseImage')
    },
    // 预览图片
    previewImage(e) {
      wx.previewImage({
        urls: this.data.images,
        current: this.data.images[e.currentTarget.dataset.index]
      })
    },
    // 删除图片
    deleteImage(e){
      this.triggerEvent('deleteImage',e.currentTarget.dataset.index)
    }
  }
})