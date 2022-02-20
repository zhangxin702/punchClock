import { formatTime } from "../../utils/util.js";
import { getCollect, getActTheme } from "../../async/async.js";
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    collect: [],
    actList: [],
    pageNum: 0,
    // openId: "user-1",
    openId: null,  // 错误写法 //傻嘿鬼无知啊
    limit: 9,
    isSearch: false, //看当前是否是搜索状态
    dict: {}, //为了方便搜索，创立一个字典

    isDetailReturn: false //是否是从activity_detail页面返回，如果是需要阻隔一段时间
  },
  TimeId: -1, //用于全局的timer控制
  /**
   * 生命周期函数--监听页面加载
   */
  async onShow() {
    console.log(this.data.isDetailReturn);
    if(this.data.isDetailReturn){
     console.log("yes");
     wx.showLoading({
       title: '加载中',
       mask: true,
     })
     clearTimeout(this.TimeId);
     this.TimeId = setTimeout(() => {
       //开启定时器
       this.initialize();
     }, 1000);
     this.setData({
       isDetailReturn: false,
     })
    }else{
      this.initialize();
    }
  },

  async initialize(){
    let userInfo =await wx.getStorageSync("userInfo");
    if(!userInfo){
      //提示退出
      wx.showModal({
        title: '提示',
        content: '未注册，没有权限查看收藏数据',
        showCancel: false,
        confirmText: "知道了",
        success: function (res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: -1,
            })
          } else if (res.cancel) {
            //点击取消按钮
            //取消按钮被我隐藏了，不用管这个
          }
        }
      })
    }
    else{
      //获取并且重置页面
      const openId = userInfo._id;
      const collect= userInfo.collect?userInfo.collect:[];
      const dict = await getActTheme();
      //重置页面
      await this.setData({
        collect,
        dict,
        openId:openId,
        actList: [],
        pageNum: 0,
      });
      console.log(this.data);
      await this.GetAll(this.data.pageNum, this.data.collect, this.data.limit);
    }
  },

  async GetAll(skip, collect, limit) {
    wx.showLoading({
      title: "加载中",
      mask: true,
    });
    var db = wx.cloud.database().collection("ActTable");
    var addList = [];
    if (skip >= collect.length) {
      wx.showToast({ title: "没有更多数据啦" });
    } else {
      let max = skip + limit; //for循环的最大值
      if (max > collect.length) {
        max = collect.length;
      }
      for (let i = skip; i < max; i++) {
        let actId = collect[i];
        await db
          .doc(actId)
          .get()
          .then((res) => {
            addList = addList.concat(res.data);
            console.log(addList);
            console.log("获取用户的收藏成功√\n", res);
          })
          .catch((err) => {
            wx.hideLoading();
            console.log("获取用户的收藏失败×\n", err);
          });
      }
      addList = addList.map((v) => ({
        ...v,
        createTime: formatTime({ date: v.createTime }),
      }));
    }
    this.setData({
      actList: [...this.data.actList, ...addList],
      pageNum: this.data.pageNum + 9,
    });
    console.log(this.data.pageNum);
    wx.hideLoading();
    wx.stopPullDownRefresh();
  },

  async GetAllSearch(collect, dict, input) {
    wx.showLoading({
      title: "加载中",
      mask: true,
    });
    var db = wx.cloud.database().collection("ActTable");
    var addList = [];
    for (let i = 0; i < collect.length; i++) {
      let actId = collect[i];
      let actTheme= dict[actId]?dict[actId]:"";
      if(actTheme.match(input)){
        await db.doc(actId)
        .get()
        .then((res) => {
            addList = addList.concat(res.data);
            console.log(addList);
            console.log("获取用户的收藏成功√\n", res);
          })
          .catch((err) => {
            wx.hideLoading();
            console.log("获取用户的收藏失败×\n", err);
          });
      }
    }
    addList = addList.map((v) => ({
      ...v,
      createTime: formatTime({ date: v.createTime }),
    }));
    this.setData({
      actList: [...this.data.actList, ...addList],
    });
    console.log(this.data.pageNum);
    wx.showToast({
      title: "搜索完成",
    });
    wx.stopPullDownRefresh();
  },

  onReachBottom: function (e) {
    if (this.data.isSearch) {
      wx.showToast({
        title: "已经搜索完了",
      });
    } else {
      this.GetAll(this.data.pageNum, this.data.collect, this.data.limit);
    }
  },

  //下拉刷新事件，存放在页面生命周期中，
  //而且也会让当前状态重新变回未搜索的时候
  onPullDownRefresh() {
    this.setData({
      pageNum: 0,
      actList: [],
      isSearch: false,
    });
    this.GetAll(this.data.pageNum, this.data.collect, this.data.limit);
  },

  //搜索，因为搜索如果按步数写太奇怪，所以直接全部搜
  async inputBind(e) {
    console.log("打印", e);
    if (e.detail.value == "") {
      this.setData({
        pageNum: 0,
        isSearch: false,
        actList: [],
      });
      await this.GetAll(this.data.pageNum, this.data.collect, this.data.limit);
    } else {
      this.setData({
        pageNum: 0,
        isSearch: true,
        actList: [],
      });
      await this.GetAllSearch(this.data.collect, this.data.dict, e.detail.value);
    }
  },
});
