// 个人页
import { getOpenId, getUserInfo, getParticipateNum, getOrganizeNum } from "../../async/async.js";
const app = getApp();

Page({
  data: {
    userInfo: null,
    actInfo: {
      participate: 0,
      organize: 0,
    },
  },

  async onShow() {
    // 老用户
    if (app.globalData.userInfo) {
      await this.setData({
        userInfo: app.globalData.userInfo,
      });

      let actInfo = wx.getStorageSync("actInfo");
      // actInfo无本地缓存
      if (!actInfo) {
        let db = wx.cloud.database();
        const participate = await getParticipateNum(db, this.data.userInfo._id); // 获取用户已参与的活动数量
        // console.log("participate: ", participate);
        const organize = await getOrganizeNum(db, this.data.userInfo._id); // 获取用户已组织的活动数量
        // console.log("organize: ", organize);
        actInfo = {
          participate: participate,
          organize: organize,
        };
        
        wx.setStorageSync("actInfo", actInfo); // 写本地缓存
      }

      this.setData({
        actInfo: actInfo,
      });
    }
  },

  async onPullDownRefresh() {
    const db = wx.cloud.database();
    // const openId = await getOpenId(); // 重新获取用户的openId
    // console.log("openId: ", openId);
    const openId = "user-1";
    // const openId = app.globalData.userInfo._id;
    const userInfo = await getUserInfo(openId); // 获取新的用户信息
    console.log("userInfo: ", userInfo);
    const participate = await getParticipateNum(db, this.data.userInfo._id); // 获取用户已参与的活动数量
    const organize = await getOrganizeNum(db, this.data.userInfo._id); // 获取用户已组织的活动数量
    this.setData({
      userInfo: userInfo,
      actInfo: {
        participate: participate,
        organize: organize,
      },
    });

    // 写本地缓存
    const actInfo = {
      participate: participate,
      organize: organize + 1,
    };
    wx.setStorageSync("userInfo", userInfo);
    wx.setStorageSync("actInfo", actInfo);
  },
});
