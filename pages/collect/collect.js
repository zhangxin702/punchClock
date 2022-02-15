import { formatTime } from "../../utils/util.js";
import { getCollect, getActTheme } from "../../async/async.js";
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    collect: [],
    actList: [],
    pageNum: 0,
    // openId: "user-1",
    // openId: app.globalData.userInfo.openId,  // 错误写法
    openId: null,
    limit: 9,
    isSearch: false, //看当前是否是搜索状态
    dict: {}, //为了方便搜索，创立一个字典
  },

  async onLoad() {
    if (this.data.openId == null) {
      this.setData({
        openId: app.globalData.userInfo._id,
      });
    }

    const collect = await getCollect(this.data.openId);
    const dict = await getActTheme();
    this.setData({
      collect,
      dict,
    });
    await this.GetAll(this.data.pageNum, this.data.collect, this.data.limit);
  },

  async GetAll(skip, collect, limit) {
    wx.showLoading({
      title: "加载中",
      mask: true,
    });
    var db = wx.cloud.database().collection("ActTable");
    var addList = [];
    if (skip >= collect.length) {
      wx.showToast({ title: "没有更多数据啦" });
    } else {
      let max = skip + limit; //for循环的最大值
      if (max > collect.length) {
        max = collect.length;
      }
      for (let i = skip; i < max; i++) {
        let actId = collect[i];
        await db
          .doc(actId)
          .get()
          .then((res) => {
            addList = addList.concat(res.data);
            console.log(addList);
            console.log("获取用户的收藏成功√\n", res);
          })
          .catch((err) => {
            wx.hideLoading();
            console.log("获取用户的收藏失败×\n", err);
          });
      }
      addList = addList.map((v) => ({
        ...v,
        createTime: formatTime({ date: v.createTime }),
      }));
    }
    this.setData({
      actList: [...this.data.actList, ...addList],
      pageNum: this.data.pageNum + 9,
    });
    console.log(this.data.pageNum);
    wx.hideLoading();
    wx.stopPullDownRefresh();
  },

  async GetAllSearch(collect, dict, input) {
    wx.showLoading({
      title: "加载中",
      mask: true,
    });
    var db = wx.cloud.database().collection("ActTable");
    var addList = [];
    for (let i = 0; i < collect.length; i++) {
      let actId = collect[i];
      if (dict[actId].match(input)) {
        await db
          .doc(actId)
          .get()
          .then((res) => {
            addList = addList.concat(res.data);
            console.log(addList);
            console.log("获取用户的收藏成功√\n", res);
          })
          .catch((err) => {
            wx.hideLoading();
            console.log("获取用户的收藏失败×\n", err);
          });
      }
    }
    addList = addList.map((v) => ({
      ...v,
      createTime: formatTime({ date: v.createTime }),
    }));
    this.setData({
      actList: [...this.data.actList, ...addList],
    });
    console.log(this.data.pageNum);
    wx.showToast({
      title: "搜索完成",
    });
    wx.stopPullDownRefresh();
  },

  onReachBottom: function (e) {
    if (this.data.isSearch) {
      wx.showToast({
        title: "已经搜索完了",
      });
    } else {
      this.setData({
        pageNum: 0,
        actList: [],
        //刷新时应该是重新回到开始状态
      });
      this.GetAll(this.data.pageNum, this.data.collect, this.data.limit);
    }
  },

  //下拉刷新事件，存放在页面生命周期中，
  //而且也会让当前状态重新变回未搜索的时候
  onPullDownRefresh() {
    this.setData({
      pageNum: 0,
      actList: [],
      isSearch: false,
    });
    this.GetAll(this.data.pageNum, this.data.collect, this.data.limit);
  },

  //搜索，因为搜索如果按步数写太奇怪，所以直接全部搜
  async inputBind(e) {
    console.log("打印", e);
    if (e.detail.value == "") {
      this.setData({
        pageNum: 0,
        isSearch: false,
        actList: [],
      });
      await this.GetAll(this.data.pageNum, this.data.collect, this.data.limit);
    } else {
      this.setData({
        pageNum: 0,
        isSearch: true,
        actList: [],
      });
      await this.GetAllSearch(this.data.collect, this.data.dict, e.detail.value);
    }
  },
});
