import { formatTime } from "../../utils/util.js";
import { getPunchAll, getActTheme } from "../../async/async.js";
const app = getApp();

Page({
  data: {
    currentTab: 0,
    punchList: [],
    pageNum: 0,
    dict: {}, // 将actId映射为actTheme的字典
  },

  async onLoad() {
    const dict = await getActTheme();
    this.setData({
      dict: dict,
    });
    this.GetAll(this.data.currentTab, this.data.pageNum);
  },

  async GetAll(order, skip) {
    var res = await getPunchAll(
      order,
      skip,
      9,
      "user-1"
      // app.globalData.userInfo.openId,
    );
    var addList = res.map((v) => ({
      ...v,
      punchTime: formatTime({ date: v.punchTime }),
    }));
    if (order == 0) {
      this.setData({
        punchList: [...this.data.punchList, ...addList],
        pageNum: this.data.pageNum + 9,
      });
    } else {
      this.setData({
        punchList: [...this.data.punchList, ...addList],
        pageNum: this.data.pageNum + 3,
      });
    }

    wx.stopPullDownRefresh();
  },

  onReachBottom: function (e) {
    this.GetAll(this.data.currentTab, this.data.pageNum);
    console.log(this.data.pageNum);
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
