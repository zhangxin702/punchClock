import {
  getParticipatePunch,
  getOrganizePunch,
 
  getOpenId,
} from '../../async/async.js';

// 获取应用实例
const app = getApp();

import { actTableGetAll } from '../../async/index.js';

Page({
  data: {
    actList: [],
    attendList: [],
    organizeList: [],
  },

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
    let res1 = await getParticipatePunch(openId);
    let res2 = await getOrganizePunch(openId);
    console.log('res1'+res1);
    
    this.setData({
      attendList:res1,
      organizeList:res2,
      showActList: JSON.parse(JSON.stringify(res1)), //深拷贝防止改变引起总的改变
      showOrganizeList: JSON.parse(JSON.stringify(res2)), //同上
    });
    console.log('attendList: ', this.data.attendList);
    console.log('organizeList: ', this.data.organizeList);
  },

  handleMore_0(e) {
    wx.navigateTo({
      url: '../activity_record/activity_record?page_id=0',
    });
  },

  handleMore_1(e) {
    wx.navigateTo({
      url: '../activity_record/activity_record?page_id=1',
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
    console.log('热门活动' + this.data.actList);
  },
});
