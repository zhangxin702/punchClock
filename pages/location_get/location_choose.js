Page({
  data: {
    address: "点击选择定位",
    latestTime: null,
  },

  handleGetLocation() {
    /**
     * 获取用户当前的定位，并避频繁获取
     */
    wx.getLocation({
      type: "wgs84",
      altitude: true,
      success: (res) => {
        console.log("获取定位成功√\n", res);
        const latestTime = new Date().getTime(); // 获取当前时间，单位s
        const { latitude, longitude } = res;
        this.setData({
          address: {
            latitude,
            longitude,
          },
          latestTime: latestTime,
        });
      },
      fail: (err) => {
        console.log("获取定位失败×\n", err);
        const currentTime = new Date().getTime(); // 获取时间，单位ms
        const interval = (currentTime - this.data.latestTime) / 1000; // 计算距离上次获取定位的时间间隔，单位s
        const title = "您的定位获取过于频繁，请在" + (30 - interval).toFixed(0).toString() + "s后再尝试";
        wx.showToast({
          title: title,
          icon: "none",
          duration: 1500,
        });
      },
    });
  },
});
