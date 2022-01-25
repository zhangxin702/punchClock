Page({
  date: {
    location: {
      address,
      latitude,
      longitude,
    },
  },

  handleChooseLocation() {
    wx.chooseLocation({
      success: (res) => {
        console.log(res);
        const { latitude, longitude, address } = res;
        this.setData({
          location: {
            address: address,
            latitude: latitude,
            longitude: longitude,
          },
        });
      },
      fail: (err) => {
        console.log(err);
      },
    });
  },
});
