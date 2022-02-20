import { getSelfPunchedTimes, getSelfPunchedRank, getSelfLabels, getActPunchedTimes, getActUserGender, countActHeldDays, countActHeldNum, getActHotRankvsSelf, getActHotRankvsAll } from "../../async/async.js";
const app = getApp();
var chart = require("../../utils/chart.js");
Page({
  data: {
    labels: [],
    maxLabels: [],
  },

  async onReady() {
    // const openId = app.globalData.userInfo._id,
    const openId = "user-1",
      actId = "1ef3c51361ed7d0c04d6b15c7b9b82b8";
    const db = wx.cloud.database();
    wx.showLoading({
      title: "分析中",
      mask: true,
    });
    // const { isFinish, punchedTimes } = await getSelfPunchedTimes(db, openId, actId);
    // console.log("是否已完成打卡要求：", isFinish);
    // console.log("已打卡次数：", punchedTimes);

    // const rank = await getSelfPunchedRank(openId, actId);
    // console.log("用户的打卡次数超过了: ", rank * 100, "%");

    const { maxLabels, labelNum } = await getSelfLabels(openId, -1);
    console.log("所有的标签：", maxLabels);
    this.setData({
      //分成三份
      labels: maxLabels, // 全部标签
      maxLabels: maxLabels.slice(0, 3), // 标签的前三名
    });

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

    // const { actThemes, actUserRank, actPunchRank } = await getActHotRankvsSelf(db, openId);
    // const { themesByUserNum, userNum, themesByPunchNum, punchNum } = await getActHotRankvsSelf(db, openId);
    // console.log(themesByUserNum, userNum, themesByPunchNum, punchNum);

    const { actThemes, userNum, userRank, punchNum, punchRank } = await getActHotRankvsAll(db, openId);
    console.log(actThemes, "\n", userNum, userRank, "\n", punchNum, punchRank);

    // const {actThemes,actUserNum}=await GetUserPunch(openId);
    // console.log(actUserNum,actThemes);
    if(maxLabels.length&&labelNum.length)
    {   
      chart.draw(this, "canvas1", {
        title: {
          text: "用户活动参与标签百分比图",
          color: "#333333",
        },
        xAxis: {
          data: this.data.labels,
        },
        series: [
          {
            name: this.data.labels,
            category: "pie",
            data: labelNum,
          },
        ],
      });
    }
    
    if(actThemes.length&& userNum.length&& userRank.length){
      chart.draw(this, "canvas2", {
        title: {
          text: "已组织打卡活动人数及其排名",
          color: "#333333",
        },
        xAxis: {
          data: actThemes.slice(0,6),
        },
        series: [
          {
            name: "用户数量",
            category: "bar",
            data: userNum.slice(0, 6),
            // data:actUserNum.slice(0,6)
          },
          {
            name: "用户数量总数排名",
            category: "bar",
            data: userRank.slice(0, 6),
          },
        ],
      });
    }

    if(actThemes.length&& punchNum.length&& punchRank.length){
      chart.draw(this, "canvas3", {
        title: {
          text: "已组织打卡活动打卡数及其排名",
          color: "#333333",
        },
        xAxis: {
          data: actThemes.slice(0,6),
        },
        series: [
          {
            name: "用户数量",
            category: "bar",
            data: punchNum.slice(0, 6),
            // data:actUserNum.slice(0,6)
          },
          {
            name: "用户数量总数排名",
            category: "bar",
            data: punchRank.slice(0, 6),
          },
        ],
      });
    }
    wx.hideLoading();
  },
});
