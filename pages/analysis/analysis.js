import { getRatioInPunch, countDayNum, countPunchedTimes, countMaxLabels } from "../../async/async.js";
const app = getApp();

Page({
  data: {},

  async onShow() {
    // const openId = app.globalData.userInfo.openId,
    const openId = "user-1",
      // actId = "act-1";
      actId = "1ef3c51361ed7d0c04d6b15c7b9b82b8";

    // const rank = await getRatioInPunch(openId, actId);
    // console.log("用户的打卡次数超过了: ", rank * 100, "%");

    const db = wx.cloud.database();
    // const { dayNum } = await countDayNum(db, actId);
    // console.log("活动举办天数：", dayNum);

    // const { punchedTimes } = await countPunchedTimes(db, openId, actId);
    // console.log("已打卡次数：", punchedTimes);

    const maxLabels = await countMaxLabels(db, openId);
    console.log("最多的标签：", maxLabels);
  },
});
