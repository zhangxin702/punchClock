//获取应用实例
const app = getApp();
Page({
  data: {
    src: null,
    width: 250, //宽度
    height: 250, //高度
    max_width: 300,
    max_height: 300,
    disable_rotate: true, //是否禁用旋转
    disable_ratio: true, //锁定比例
    limit_move: true, //是否限制移动
  },

  onLoad: function (options) {
    this.cropper = this.selectComponent("#image-cropper");
    console.log(options.imgSrc);
    this.setData({
      src: options.imgSrc,
    });
    if (!options.imgSrc) {
      this.cropper.upload(); //上传图片
    }
  },

  cropperload(e) {
    console.log("cropper加载完成");
  },

  loadimage(e) {
    wx.hideLoading();
    console.log("图片");
    this.cropper.imgReset();
  },

  clickcut(e) {
    console.log(e.detail);
    //图片预览
    wx.previewImage({
      current: e.detail.url, // 当前显示图片的http链接
      urls: [e.detail.url], // 需要预览的图片http链接列表
    });
  },

  upload() {
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success(res) {
        wx.showLoading({
          title: "加载中",
        });
        const tempFilePaths = res.tempFilePaths[0];
        //重置图片角度、缩放、位置
        that.cropper.imgReset();
        that.setData({
          src: tempFilePaths,
        });
      },
    });
  },

  setWidth(e) {
    this.setData({
      width: e.detail.value < 10 ? 10 : e.detail.value,
    });
    this.setData({
      cut_left: this.cropper.data.cut_left,
    });
  },

  setHeight(e) {
    this.setData({
      height: e.detail.value < 10 ? 10 : e.detail.value,
    });
    this.setData({
      cut_top: this.cropper.data.cut_top,
    });
  },

  switchChangeDisableRatio(e) {
    //设置宽度之后使剪裁框居中
    this.setData({
      disable_ratio: e.detail.value,
    });
  },

  setCutTop(e) {
    this.setData({
      cut_top: e.detail.value,
    });
    this.setData({
      cut_top: this.cropper.data.cut_top,
    });
  },

  setCutLeft(e) {
    this.setData({
      cut_left: e.detail.value,
    });
    this.setData({
      cut_left: this.cropper.data.cut_left,
    });
  },

  submit() {
    this.cropper.getImg((obj) => {
      let pages = getCurrentPages(); // 获取页面栈
      let prevPage = pages[pages.length - 2]; // 获取上一个页面
      if (prevPage) {
        prevPage.setData({
          avatarPath: obj.url,
        });
        wx.navigateBack();
      } else {
        console.log("上一页已被清除");
      }
    });
  },
  end(e) {
    clearInterval(this.data[e.currentTarget.dataset.type]);
  },
});
