// pages/punch_detail/punch_detail.js
import { actTableById } from '../../async/index.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //商品
    activity: '',
    startTime: '',
    endTime: '',
    // 上传图片设置
    images: [],
    count: 3,
    addedCount: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getById(options.actId);
  },
  async getById(actId) {
    var res = await actTableById({
      id: actId,
    });
    var start = res.data.startTime.toLocaleString();
    var end = res.data.endTime.toLocaleString();

    this.setData({
      activity: res.data,
      startTime: start,
      endTime: end,
    });
  },

  // 上传图片有关函数
  chooseImage() {
    var that = this;
    wx.chooseImage({
      count: 3 - that.data.addedCount,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          images: that.data.images.concat(res.tempFilePaths),
          addedCount: that.data.addedCount + res.tempFilePaths.length,
        });
      },
    });
  },
  // 删除图片
  deleteImage(e) {
    this.data.images.splice(e.detail, 1);
    this.setData({
      images: this.data.images,
      addedCount: this.data.addedCount - 1,
    });
  },
});
