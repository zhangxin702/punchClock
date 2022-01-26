import { chooseLocation } from "../../async/async.js";

Page({
  data: {
    latitude,
    longitude,
    latestTime,
    latestTime: null,
  },

  async handleGetLocation() {
    /**
     * 获取用户当前的定位，并避频繁获取
     */

    const { latitude, longitude, latestTime } = await getLocation();
    this.setData({
      latitude,
      longitude,
      latestTime,
    });
  },
});
