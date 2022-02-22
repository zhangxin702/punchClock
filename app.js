import { getUserInfo, getOpenId } from "./async/async.js";

let userInfo = "";
App({
  async onLaunch() {
    wx.cloud.init({
      env: "zhangxinying-1g0quq2g2d68268c",
      // env: wx.cloud.DYNAMIC_CURRENT_ENV,
    });

    const openId = "user-1";
    // const openId = await getOpenId(); //获取用户openID
    console.log("app.js openId: ", openId);

    userInfo = await wx.getStorageSync("userInfo"); // 先查本地缓存

    // 本地缓存查不到
    if (!userInfo) {
      userInfo = await getUserInfo(openId); // 再查云数据库
      if (!userInfo) {
        return;
      }
      await wx.setStorageSync("userInfo", userInfo); // 写本地缓存
    }
    // 当前用户和本地缓存的不是同一个人
    else if (userInfo._id != openId) {
      wx.clearStorage(); // 清除本地所有缓存
      userInfo = await getUserInfo(openId); // 再查云数据库
      if (!userInfo) {
        return;
      }
      await wx.setStorageSync("userInfo", userInfo); // 写本地缓存
    }
    this.globalData.userInfo = userInfo;
    console.log("app.js userInfo: ", userInfo);
  },

  globalData: {
    userInfo: userInfo,
  },
});
