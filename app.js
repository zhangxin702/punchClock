import { getUserInfo } from "./async/async.js";
App({
  async onLaunch() {
    wx.cloud.init({
      env: "zhangxinying-1g0quq2g2d68268c",
      // env: wx.cloud.DYNAMIC_CURRENT_ENV,
    });
    // wx.cloud  // 先获取该用户的openId
    //   .callFunction({
    //     name: "getOpenId",
    //   })
    //   .then((res) => {
    //     console.log("openId: ", res.result);
    //     this.setData({
    //       openId: res.result
    //     })
    //   });
    const openId = "user-1";
    const userInfo = await getUserInfo(openId);
    this.globalData.userInfo = userInfo;
  },

  globalData: {
    userInfo: null,
    imgSrc:null
  },
});
