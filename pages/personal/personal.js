// 个人页
import { getParticipateNum, getOrganizeNum } from "../../async/async.js";
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
    // 这里是为了让用户信息能够更早的显示出来
    await this.setData({
      userInfo: app.globalData.userInfo,
    });

    let actInfo = wx.getStorageSync("actInfo");
    // actInfo无本地缓存
    if (!actInfo) {
      let db = wx.cloud.database();
      const participate = await getParticipateNum(db, this.data.userInfo.openId); // 获取用户已参与的活动数量
      // console.log("participate: ", participate);
      const organize = await getOrganizeNum(db, this.data.userInfo.openId); // 获取用户已组织的活动数量
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
  },
});
