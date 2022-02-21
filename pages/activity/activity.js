import { showToast } from '../../async/index.js';

// pages/index/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    user: '',
  },

  onLoad: async function () {
    let userInfo = await wx.getStorageSync('userInfo'); // 先查本地缓存
    this.setData({
      user: userInfo,
    });
  },
  onItemClick: async function () {
    if (this.data.user) {
      wx.navigateTo({ url: '../activity_collect/activity_collect' });
    } else {
      await showToast({ title: '您还未注册，请注册' });
    }
  },

  onItemClick_2: async function () {
    if (this.data.user) {
      wx.navigateTo({ url: '../activity_record/activity_record?page_id=0' });
    } else {
      await showToast({ title: '您还未注册，请注册' });
    }
  },

  // 点击跳转活动创建列表
  onItemClick_1: async function () {
    if (this.data.user) {
      wx.navigateTo({ url: '../activity_organize/activity_organize' });
    } else {
      await showToast({ title: '您还未注册，请注册' });
    }
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
