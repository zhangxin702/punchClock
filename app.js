// app.js
App({
  onLaunch() {
    wx.cloud.init({
      // env: "zhangxinying-1g0quq2g2d68268c",
      env: wx.cloud.DYNAMIC_CURRENT_ENV,
    });
  },

  globalData: {
    userInfo: null,
  },
});
