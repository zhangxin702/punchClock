// pages/index/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
  },

  // 点击跳转活动列表
  onItemClick: function () {
    wx.navigateTo({ url: '../activity_classification/activity_classification' });
  },

  // 点击跳转活动创建列表
  onItemClick_1: function () {
    wx.navigateTo({ url: '../activity_organize/activity_organize' });
  },

  onShow: function (options) {
    var that = this;
    /**
     * 获取系统信息
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
        });
      },
    });
  },
});
