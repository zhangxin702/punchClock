// pages/personal/personal.js
import { getUserInfo, getParticipateNum, getOrganizeNum } from "../../utils/asyncFunc.js";

Page({
  data: {
    openId: null,
    userInfo: {},
    actInfo: {
      participate: 0,
      organize: 0,
    },
  },

  async onShow() {
    // 先查本地缓存有没有数据，有的话说明是老用户，直接用来初始化userInfo和actInfo
    let userInfo = wx.getStorageSync("userInfo");
    let actInfo = wx.getStorageSync("actInfo");
    this.setData({
      userInfo: userInfo,
      actInfo: actInfo,
    });

    // 本地缓存啥都没有，可能是清缓存或者是新用户，就先去数据库查，查到了就拿来初始化userInfo和actInfo
    if (!userInfo) {
      // 本地缓存为空
      // wx.cloud
      //   .callFunction({
      //     name: "getOpenId",
      //   })
      //   .then((res) => {
      //     console.log("openId: ", res.result);
      //     this.setData({
      //       openId: res.result
      //     })
      //   });

      this.setData({
        openId: "user-1",
      });

      let db = wx.cloud.database();
      if (this.data.openId) {
        userInfo = await getUserInfo(db, this.data.openId);
        console.log("userInfo: ", userInfo);

        let participate = await getParticipateNum(db);
        console.log("participate: ", participate);

        let organize = await getOrganizeNum(db, this.data.openId);
        console.log("organize: ", organize);
        this.setData({
          userInfo: userInfo,
          actInfo: {
            participate: participate,
            organize: organize,
          },
        });
        wx.setStorageSync("userInfo", this.data.userInfo);
        wx.setStorageSync("actInfo", this.data.actInfo);
      }
    }
  },
});
