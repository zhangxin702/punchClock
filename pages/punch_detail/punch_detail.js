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
    punch_num:1,
    endTime: '',
    // 上传图片设置
 
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

  
});
