import { getSelfPunchedTimes, getSelfPunchedRank, getSeflMaxLabels, getActPunchedTimes, getActUserGender, countActHeldDays, countActHeldNum, getActHotRankvsSelf } from "../../async/async.js";
const app = getApp();

Page({
  data: {
    maxLabels: [],
  },

  async onShow() {
    // const openId = app.globalData.userInfo.openId,
    const openId = "user-1",
      actId = "1ef3c51361ed7d0c04d6b15c7b9b82b8";
    const db = wx.cloud.database();

    // const { isFinish, punchedTimes } = await getSelfPunchedTimes(db, openId, actId);
    // console.log("是否已完成打卡要求：", isFinish);
    // console.log("已打卡次数：", punchedTimes);

    // const rank = await getSelfPunchedRank(openId, actId);
    // console.log("用户的打卡次数超过了: ", rank * 100, "%");

    // const maxLabels = await getSeflMaxLabels(openId);
    // console.log("最多的标签：", maxLabels);
    // this.setData({
    //   maxLabels,
    // });

    // const { isFinish, punchedTimes } = await getActPunchedTimes(db, actId);
    // console.log("是否已完成打卡要求：\n", isFinish);
    // console.log("打卡次数：\n", punchedTimes);

    // const gender = await getActUserGender(db, openId, actId);
    // console.log("男性：", gender[0], "人\n女性：", gender[1]);

    // const { isStart, dayNum } = await countActHeldDays(db, actId);
    // console.log("活动是否已开始：", isStart);
    // if (isStart) {
    //   console.log("活动举办的天数：", dayNum);
    // }

    // const actNum = await countActHeldNum(db, openId);
    // console.log("活动举办数量：", actNum);

    const { actThemes, actUserRank, actPunchRank } = await getActHotRankvsSelf(db, openId);
    console.log(actThemes, actUserRank, actPunchRank);
  },
});
