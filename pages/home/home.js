import { getParticipatePunch, getOrganizePunch, getSelfPunchedTimes } from "../../async/async.js";

// 获取应用实例
const app = getApp();
import { formatTime } from "../../utils/util.js";
import { actTableGetAll } from "../../async/index.js";

Page({
  data: {
    actList: [],
    attendList: [],
    organizeList: [],
  },

  async onLoad() {
    //如果没看见上面的组件可以把下面的注释划掉
    //console.log(options);
    wx.showLoading({
      title: "加载中",
      mask: true,
    });

    const openId = app.globalData.userInfo._id; // app.js还未执行完就获取userInfo去了，逻辑错误，导致一直在“加载中”

    this.GetAttendAndOranizeList(openId);
    this.GetAll(0, 0);
    wx.hideLoading();
  },

  async GetAttendAndOranizeList(openId) {
    const db = wx.cloud.database();
    let res1 = await getParticipatePunch(openId);
    let res2 = await getOrganizePunch(openId);
    let attendList = res1.map((v) => ({
      ...v,
      //以下都一样。因为云函数取出的时间格式比较奇怪，需要先new date
      createTime: formatTime({ date: new Date(v.createTime) }),
      endTime: formatTime({ date: new Date(v.endTime) }),
      startTime: formatTime({ date: new Date(v.startTime) }),
    }));
    let organizeList = res2.map((v) => ({
      ...v,
      //以下都一样。因为云函数取出的时间格式比较奇怪，需要先new date
      createTime: formatTime({ date: new Date(v.createTime) }),
      endTime: formatTime({ date: new Date(v.endTime) }),
      startTime: formatTime({ date: new Date(v.startTime) }),
    }));
    console.time();

    let punchData = null;
    await wx.cloud
      .callFunction({
        name: "getPunchData",
        data: {
          openId: openId,
        },
      })
      .then((res) => {
        punchData = res.result;
        console.log("punchData: ", punchData);
      });

    for (let i = 0; i < attendList.length; i++) {
      let res = await getSelfPunchedTimes(db, openId, attendList[i]._id, punchData);
      attendList[i].isFinish = res.isFinish;
      attendList[i].punchedTimes = res.punchedTimes;
    }
    console.timeEnd();

    this.setData({
      attendList,
      organizeList,
      showActList: JSON.parse(JSON.stringify(attendList)), //深拷贝防止改变引起总的改变
      showOrganizeList: JSON.parse(JSON.stringify(organizeList)), //同上
    });
    console.log("attendList: ", this.data.attendList);
    console.log("organizeList: ", this.data.organizeList);
  },

  handleMore_0(e) {
    wx.navigateTo({
      url: "../activity_punch/activity_punch?page_id=0",
    });
  },
  handleMore_1(e) {
    wx.navigateTo({
      url: "../activity_punch/activity_punch?page_id=1",
    });
  },

  async GetAll(order, skip) {
    var res = await actTableGetAll({
      order: order,
      skip: skip,
      limit: 3,
    });

    this.setData({
      actList: res.data,
    });
    console.log("热门活动" + this.data.actList);
  },
});
