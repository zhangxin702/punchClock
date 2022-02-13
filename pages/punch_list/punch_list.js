import { formatTime } from '../../utils/util.js';
import { actTableGetAll, actTableGetLabel } from '../../async/index.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    actList: [],
    pageNum: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let label = options.label
    if(label != "全部"){
      this.GetAllLabel(this.data.currentTab, this.data.pageNum ,label);
    }else{
      this.GetAll(this.data.currentTab, this.data.pageNum);
    }
    
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
  async GetAll(order, skip) {
    var res = await actTableGetAll({
      order: order,
      skip: skip,
      limit: 9,
    });
    var addList = res.data.map((v) => ({
      ...v,
      createTime: formatTime({ date: v.createTime }),
    }));
    this.setData({
      actList: [...this.data.actList, ...addList],
      pageNum: this.data.pageNum + 9,
    });
    wx.stopPullDownRefresh();
  },
  async GetAllLabel(order, skip,label) {
    var res = await actTableGetLabel({
      order: order,
      skip: skip,
      limit: 3,
      label:label
    });
    var addList = res.data.map((v) => ({
      ...v,
      createTime: formatTime({ date: v.createTime }),
    }));
    this.setData({
      actList: [...this.data.actList, ...addList],
      pageNum: this.data.pageNum + 3,
    });
    wx.stopPullDownRefresh();
  },

  onReachBottom: function (e) {
    this.GetAll(this.data.currentTab, this.data.pageNum);
  },
  bindChange: function (e) {
    this.setData({
      currentTab: e.detail.current,
    });
  },

  // tab顶部
  swichNav: function (e) {
    if (this.data.currentTab === e.target.dataset.current) {
      this.setData({
        currentTab: e.detail.current,
        pageNum: 0,
        actList: [],
      });
      this.GetAll(this.data.currentTab, this.data.pageNum);
      return false;
    } else {
      this.setData({
        currentTab: e.target.dataset.current,
        pageNum: 0,
        actList: [],
      });
      this.GetAll(this.data.currentTab, this.data.pageNum);
    }
  },
  //下拉刷新事件，存放在页面生命周期中
  onPullDownRefresh() {
    this.setData({
      pageNum: 0,
      actList: [],
    });
    this.GetAll(this.data.currentTab, this.data.pageNum);
  },
});
