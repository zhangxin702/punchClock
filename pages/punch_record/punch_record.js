import { formatTime } from "../../utils/util.js";
import { getPunchAll, getActTheme, getPunchDataExcel } from "../../async/async.js";
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
    var res = await getPunchAll(order, skip, 9, app.globalData.userInfo._id);
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

  async handleMyOwnPunchData() {
    /**
     * 下载我的打卡记录到本地
     */

    const openId = app.globalData.userInfo._id;
    await getPunchDataExcel(openId, 1)
      .then((res) => {
        console.log("res: ", res);
      })
      .catch((err) => {
        console.log("err: ", err);
      });
  },

  async handleMyActPunchData() {
    /**
     * 下载我举办的活动的打卡记录到本地
     */

    const openId = app.globalData.userInfo._id;
    await getPunchDataExcel(openId, 2)
      .then((res) => {
        console.log("res: ", res);
      })
      .catch((err) => {
        console.log("err: ", err);
      });
  },
});
