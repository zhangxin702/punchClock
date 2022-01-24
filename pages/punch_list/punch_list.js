// pages/punch_list/punch_list.js
import { actTableGetAll } from '../../async/index.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    actList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    /**
     * 获取系统信息
     */
    this.GetAll(this.data.currentTab);
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
        });
      },
    });
  },
  async GetAll(order) {
    var res = await actTableGetAll({
      order: order,
    });
    this.setData({
      actList: res.data.map((v) => ({
        ...v,
        startTime: v.startTime.toLocaleString(),
      })),
    });
  },

  // 根据上面选择决定下面内容
  bindChange: function (e) {
    this.setData({ currentTab: e.detail.current });
    this.GetAll(e.detail.current);
  },

  // tab顶部
  swichNav: function (e) {
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.target.dataset.current,
      });
    }
  },
});
