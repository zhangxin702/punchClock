import {
  getParticipatePunch,
  getOrganizePunch,
  getOpenId,
} from '../../async/async.js';

// 获取应用实例
const app = getApp();

import { actTableGetAll, showToast } from '../../async/index.js';

Page({
  data: {
    actList: [],
    attendList: [],
    organizeList: [],
    user: '',
  },

  // async onLoad() {
  //   let userInfo = await wx.getStorageSync('userInfo'); // 先查本地缓存
  //   this.setData({
  //     user: userInfo,
  //   });
  // },
  async onShow() {
    //如果没看见上面的组件可以把下面的注释划掉
    //console.log(options);
    wx.showLoading({
      title: '加载中',
      mask: true,
    });

    const openId = await getOpenId();

    this.GetAttendAndOrganizeList(openId);
    this.GetAll(0, 0);
    wx.hideLoading();
  },

  async GetAttendAndOrganizeList(openId) {
    const db = wx.cloud.database();
    let res1 = await getParticipatePunch({ openId: openId, skip: 0, limit: 4 });
    let res2 = await getOrganizePunch({ openId: openId, skip: 0, limit: 4 });
    console.log(res1);

    this.setData({
      attendList: res1.data,
      organizeList: res2.data,
      showActList: JSON.parse(JSON.stringify(res1.data)), //深拷贝防止改变引起总的改变
      showOrganizeList: JSON.parse(JSON.stringify(res2.data)), //同上
    });
    console.log('attendList: ', this.data.attendList);
    console.log('organizeList: ', this.data.organizeList);
  },

  handleMore_0(e) {
    // if (this.data.user) {
      wx.navigateTo({
        url: '../activity_record/activity_record?page_id=0',
      });
    // } else {
    //   await showToast({ title: '您还未注册，请注册' });
    // }
  },

  handleMore_1(e) {
    // if (this.data.user) {
      wx.navigateTo({
        url: '../activity_record/activity_record?page_id=1',
      });
    // } else {
    //   await showToast({ title: '您还未注册，请注册' });
    // }
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
    console.log('热门活动' + this.data.actList);
  },
});
