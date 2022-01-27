// 个人页
import { getParticipateNum, getOrganizeNum } from "../../async/async.js";
const app = getApp();

Page({
  data: {
    userInfo: null,
    actInfo: {
      participate: 0,
      organize: 0,
    },
  },

  async onShow() {
    // 这里是为了让用户信息能够更早的显示出来
    this.setData({
      userInfo: app.globalData.userInfo,
    });

    let db = wx.cloud.database();
    const participate = await getParticipateNum(db); // 获取用户已参与的活动数量
    console.log("participate: ", participate);

    const organize = await getOrganizeNum(db, this.data.openId); // 获取用户已组织的活动数量
    console.log("organize: ", organize);
    this.setData({
      actInfo: {
        participate: participate,
        organize: organize,
      },
    });
  },
});
