import { getUserInfo } from "./async/async.js";

App({
  async onLaunch() {
    wx.cloud.init({
      env: "zhangxinying-1g0quq2g2d68268c",
      // env: wx.cloud.DYNAMIC_CURRENT_ENV,
    });
    // let openId;
    // wx.cloud // 先获取该用户的openId
    //   .callFunction({
    //     name: 'getOpenId',
    //   })
    //   .then((res) => {
    //     console.log('openId: ', res.result);
    //     console.log(res);
    //     openId = res.result;
    //   });
    const openId = "user-12";

    let userInfo = await wx.getStorageSync("userInfo"); // 先查本地缓存
    // 本地缓存查不到
    if (!userInfo) {
      userInfo = await getUserInfo(openId); // 再查云数据库
      if (!userInfo) {
        return;
      }
      await wx.setStorageSync("userInfo", userInfo); // 写本地缓存
    }
    this.globalData.userInfo = userInfo;
  },

  globalData: {
    userInfo: null,
  },
});
