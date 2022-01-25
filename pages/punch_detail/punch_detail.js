// pages/punch_detail/punch_detail.js
import { actTableById } from "../../utils/asyncFunc.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //商品
    activity: "",
    startTime: "",
    endTime: "",
    // 上传图片设置
    images: [],
    count: 3,
    addedCount: 0,
    // 定位
    latitude: 0,
    longitude: 0,
    latestTime: 0,
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
      sizeType: ["compressed"], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
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

  getLocation() {
    /**
     * 获取用户当前的定位，并避免频繁获取
     */

    wx.getLocation({
      type: "wgs84",
      altitude: true,
      success: (res) => {
        console.log("获取定位成功√\n", res);
        const latestTime = new Date().getTime(); // 获取当前时间，单位s
        const { latitude, longitude } = res;
        this.setData({
          latitude: latitude,
          longitude: longitude,
          latestTime: latestTime,
        });
      },
      fail: (err) => {
        console.log("获取定位失败×\n", err);
        const currentTime = new Date().getTime(); // 获取时间，单位ms
        const interval = (currentTime - this.data.latestTime) / 1000; // 计算距离上次获取定位的时间间隔，单位s
        const title = "您的定位获取过于频繁，请在" + (30 - interval).toFixed(0).toString() + "s后再尝试";
        wx.showToast({
          title: title,
          icon: "none",
          duration: 1500,
        });
      },
    });
  },

  isLocationLegal() {
    /**
     * 判断定位是否符合要求
     */

    const { latitude, longitude } = activity.location;
    distance = (latitude - this.data.latitude) * (latitude - this.data.latitude) + (longitude - this.data.longitude) * (longitude - this.data.longitude);
    // 半径有待确定
    if (distance > 10) {
      return false;
    } else {
      return true;
    }
  },
});
