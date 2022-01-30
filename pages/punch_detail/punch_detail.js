// pages/punch_detail/punch_detail.js
import { actTableById } from '../../async/index.js';
import { formatTime } from '../../utils/util.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //商品
    activity: '',
    startTime: '',
    punch_num: 1,
    endTime: '',
    // 上传图片设置

    // 活动主题
   
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
    var start = formatTime({ date: res.data.startTime });
    var end = formatTime({ date: res.data.endTime });
 

    this.setData({
      activity: res.data,
      startTime: start,
      endTime: end,
    });
  },
});
