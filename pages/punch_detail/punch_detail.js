// pages/punch_detail/punch_detail.js
import { actTableById } from "../../async/index.js";
//获取收藏的函数
import { getCollect } from "../../async/async";
import { formatTime } from "../../utils/util.js";

const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //商品
    activity: "",
    startTime: "",
    punch_num: 1,
    endTime: "",
    requires: [],
    bool: [""],

    //用户是否收藏
    isCollect: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getById(options.actId);
    this.getIsCollect(options.actId);
  },

  async getById(actId) {
    var res = await actTableById({
      id: actId,
    });
    console.log(res);
    var start = formatTime({ date: res.data.startTime });
    var end = formatTime({ date: res.data.endTime });

    this.setData({
      activity: res.data,
      startTime: start,
      endTime: end,
      requires: res.data.requires,
    });
    let word, picture, location, file;
    let bool = [];
    location = this.data.requires.includes("map");
    if (location) {
      bool.push("⛳");
    }
    word = this.data.requires.includes("word");
    if (word) {
      bool.push("🖊");
    }
    picture = this.data.requires.includes("picture");
    if (picture) {
      bool.push("📸");
    }

    file = this.data.requires.includes("file");
    if (file) {
      bool.push("📁");
    }
    console.log(bool);
    console.log(this.data.requires);
    this.setData({
      bool: bool,
    });
  },

  //获取是否收藏的函数
  async getIsCollect(actId) {
    //防止加载过程用户误触
    wx.showLoading({
      title: "加载中",
    });
    //获取收藏的全部
    const openId = app.globalData.userInfo._id;
    //获取该openID的全部收藏对象
    const collect = await getCollect(openId);
    for (let i = 0; i < collect.length; i++) {
      if (collect[i] == actId) {
        this.setData({
          isCollect: true,
        });
      }
    }
    wx.hideLoading();
  },

  async handleCollect() {
    wx.showLoading({
      title: "收藏中",
      mask: true,
    });

    const { isCollect } = this.data;
    const actId = this.data.activity._id;
    const openId = app.globalData.userInfo._id;
    let newCollect = await getCollect(openId); // 获取该openID的全部收藏对象
    var db = wx.cloud.database().collection("UserTable");

    if (isCollect) {
      newCollect.slice(newCollect.indexOf(actId) + 1, 1);
    } else {
      newCollect.push(actId);
    }
    console.log(openId);
    await db.doc(openId).update({
      data: {
        collect: newCollect,
      },
      success: (res) => {
        console.log("插入成功", res);
      },
      fail: (err) => {
        wx.hideLoading();
        console.log("插入失败", err);
      },
    });
    this.setData({
      isCollect: !isCollect,
    });
    wx.hideLoading();
  },
});
