import { formatTime } from "../../utils/util.js";
import { actTableGetAll } from "../../async/index.js";

Page({
  data: {
    currentTab: 0,
    punchList: [],
    pageNum: 0,
  },

  onLoad() {
    this.GetAll(this.data.currentTab, this.data.pageNum);
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
      punchList: [...this.data.punchList, ...addList],
      pageNum: this.data.pageNum + 9,
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

  swichNav: function (e) {
    if (this.data.currentTab === e.target.dataset.current) {
      this.setData({
        currentTab: e.detail.current,
        pageNum: 0,
        punchList: [],
      });
      this.GetAll(this.data.currentTab, this.data.pageNum);
      return false;
    } else {
      this.setData({
        currentTab: e.target.dataset.current,
        pageNum: 0,
        punchList: [],
      });
      this.GetAll(this.data.currentTab, this.data.pageNum);
    }
  },

  onPullDownRefresh() {
    this.setData({
      pageNum: 0,
      punchList: [],
    });
    this.GetAll(this.data.currentTab, this.data.pageNum);
  },
});
