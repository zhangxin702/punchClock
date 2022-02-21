import {
  getParticipatePunch,
  getOrganizePunch,
  getSelfPunchedTimes,
  getSearch,
  getOpenId,
} from '../../async/async.js';
import { formatTime } from '../../utils/util.js';
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        tab_id: 0,
        name: '已参与活动',
        isActive: true,
      },
      {
        tab_id: 1,
        name: '已组织活动',
        isActive: false,
      },
    ],
    actList: [],
    pageNum: 0,
    openId: '',
  },

  //标题点击事件，从组件中传过来
  handleTabsItemChange(e) {
    //对tabs进行一次生拷贝，以防影响到原来数据
    //let index=JSON.parse(JSON.stringify(e.detail));
    let { index } = e.detail;
    let { tabs } = this.data;
    //找哪个是index，是的改成isActive为true，否则为false
    tabs.forEach((v, i) =>
      i === index ? (v.isActive = true) : (v.isActive = false)
    );
    this.setData({
      tabs,
      actList: [],
      pageNum: 0,
    });
    //代表在已参与页面
    if (this.data.tabs[0].isActive) {
      this.getAll(1, this.data.pageNum, this.data.openId);
    } else {
      this.getAll(0, this.data.pageNum, this.data.openId);
    }
  },

  //加载时获取page_id以此确保能够从按钮中走向正确样式
  async onLoad(options) {
    //如果没看见上面的组件可以把下面的注释划掉
    //console.log(options);
    wx.showLoading({
      title: '加载中',
      mask: true,
    });

    const { page_id } = options;
    let { tabs } = this.data;
    //因为传过来的是string应该转为Number
    const index = Number(page_id);
    //找哪个是page_id，是的改成isActive为true，否则为false
    tabs.forEach((v, i) =>
      i === index ? (v.isActive = true) : (v.isActive = false)
    );
    // const openId = app.globalData.userInfo._id;
    // const openId = "user-1";
    const openId = await getOpenId();
    this.setData({
      tabs,
      openId: openId,
      pageNum: 0,
      actList: [],
    });
    //代表在已参与页面
    if (this.data.tabs[0].isActive) {
      this.getAll(1, this.data.pageNum, this.data.openId);
    } else {
      this.getAll(0, this.data.pageNum, this.data.openId);
    }
  },

  // onShow() {
  //   this.setData({});
  //   //代表在已参与页面
  //   if (this.data.tabs[0].isActive) {
  //     this.getAll(1, this.data.pageNum, this.data.openId);
  //   } else {
  //     this.getAll(0, this.data.pageNum, this.data.openId);
  //   }
  // },

  async getAll(order, skip, openId) {
    //order==1表示在第一个已参与里面
    //order==0表示在已组织页面里面
    wx.showLoading({
      title: '加载中',
      mask: true,
    });
    let addList = [];
    if (order) {
      var res = await getParticipatePunch({
        openId: openId,
        skip: skip,
        limit: 9,
      });
      console.log(res);
      let punchData = null;
      addList = res.data;
      const db = wx.cloud.database();
      await wx.cloud
        .callFunction({
          name: 'getPunchData',
          data: {
            openId: openId,
          },
        })
        .then((res) => {
          punchData = res.result;
          console.log('punchData: ', punchData);
        });
      for (let i = 0; i < addList.length; i++) {
        let res = await getSelfPunchedTimes(
          db,
          openId,
          addList[i]._id,
          punchData
        );
        addList[i].isFinish = res.isFinish;
        addList[i].punchedTimes = res.punchedTimes;
      }
    } else {
      var res = await getOrganizePunch({
        openId: openId,
        skip: skip,
        limit: 9,
      });
      addList = res.data;
    }
    addList = res.data.map((v) => ({
      ...v,
      //以下都一样。因为云函数取出的时间格式比较奇怪，需要先new date
      createTime: formatTime({ date: new Date(v.createTime) }),
      endTime: formatTime({ date: new Date(v.endTime) }),
      startTime: formatTime({ date: new Date(v.startTime) }),
    }));
    this.setData({
      actList: [...this.data.actList, ...addList],
      pageNum: this.data.pageNum + 9,
    });
    wx.stopPullDownRefresh();
    wx.hideLoading();
  },
  onReachBottom: function (e) {
    if (this.data.tabs[0].isActive) {
      this.getAll(1, this.data.pageNum, this.data.openId);
    } else {
      this.getAll(0, this.data.pageNum, this.data.openId);
    }
  },

  //下拉刷新事件，存放在页面生命周期中
  onPullDownRefresh() {
    this.setData({
      pageNum: 0,
      actList: [],
    });
    if (this.data.tabs[0].isActive) {
      this.getAll(1, this.data.pageNum, this.data.openId);
    } else {
      this.getAll(0, this.data.pageNum, this.data.openId);
    }
  },

  //搜索，按enter键返回值
  async inputBind(e) {
    wx.showLoading({
      title: '加载中',
      mask: true,
    });
    this.setData({
      actList: [],
      pageNum: 0,
    });
    let addList = [];
    let str = e.detail.value;
    const { openId } = this.data;
    if (this.data.tabs[0].isActive) {
      var res = await getSearch({
        order: 1,
        openId: openId,
        searchKey: str,
      });
      let punchData = null;
      addList = res.data;
      const db = wx.cloud.database();
      await wx.cloud
        .callFunction({
          name: 'getPunchData',
          data: {
            openId: openId,
          },
        })
        .then((res) => {
          punchData = res.result;
          console.log('punchData: ', punchData);
        });
      for (let i = 0; i < addList.length; i++) {
        var res = await getSelfPunchedTimes(
          db,
          openId,
          addList[i]._id,
          punchData
        );
        addList[i].isFinish = res.isFinish;
        addList[i].punchedTimes = res.punchedTimes;
      }
    } else {
      let res = await getSearch({
        order: 0,
        openId: this.data.openId,
        searchKey: str,
      });
      addList = res.data;
    }
    addList = addList.map((v) => ({
      ...v,
      //以下都一样。因为云函数取出的时间格式比较奇怪，需要先new date
      createTime: formatTime({ date: new Date(v.createTime) }),
      endTime: formatTime({ date: new Date(v.endTime) }),
      startTime: formatTime({ date: new Date(v.startTime) }),
    }));
    this.setData({
      actList: [...this.data.actList, ...addList],
      pageNum: this.data.pageNum + 9,
    });
    wx.stopPullDownRefresh();
    wx.hideLoading();
  },
});
