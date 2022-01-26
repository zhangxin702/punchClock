Page({
  date: {
    address,
    latitude,
    longitude,
  },

  async handleChooseLocation() {
    const { address, latitude, longitude } = await chooseLocation();
    this.setData({
      address,
      latitude,
      longitude,
    });
  },
});
