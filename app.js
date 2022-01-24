// app.js
App({
  onLaunch() {
    wx.cloud.init({
      // env: "zhangxinying-1g0quq2g2d68268c",
      env: wx.cloud.DYNAMIC_CURRENT_ENV,
    });

    wx.login({
      success: (res) => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.globalData.userInfo = res.result.userInfo;
      },
    });
  },

  globalData: {
    userInfo: null,
  },
});
