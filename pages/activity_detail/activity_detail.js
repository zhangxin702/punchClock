// pages/punch_detail/punch_detail.js
import { actTableById } from '../../async/index.js';
//获取收藏的函数
import { getCollect,CollectPushDb } from '../../async/async';
import { formatTime } from '../../utils/util.js';

const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //商品
    activity: '',
    startTime: '',
    punch_num: 1,
    endTime: '',
    requires: [],
    bool: [''],

    actId:"",

    //用户是否收藏
    isCollect: false,
    //打开页面之前用户是否收藏
    isBeforeCollect: false,
  },
onLoad:function(options){
  this.setData({
    actId:options.actId
  })



},
  onShow: function () {
    this.getById(this.data.actId);
    this.getIsCollectBefor(this.data.actId);
  },

  async getById(actId) {
    var res = await actTableById({
      id: actId,
    });
    console.log(res);
    var start = formatTime({ date: res.data.startTime });
    var end = formatTime({ date: res.data.endTime });

    this.setData({
      activity: res.data,
      startTime: start,
      endTime: end,
      requires: res.data.requires,
    });
    let word, picture, location, file;
    let bool = [];
    location = this.data.requires.includes('map');
    if (location) {
      bool.push('⛳');
    }
    word = this.data.requires.includes('word');
    if (word) {
      bool.push('🖊');
    }
    picture = this.data.requires.includes('picture');
    if (picture) {
      bool.push('📸');
    }

    file = this.data.requires.includes('file');
    if (file) {
      bool.push('📁');
    }
    console.log(bool);
    console.log(this.data.requires);
    this.setData({
      bool: bool,
    });
  },

  changeIsCollect(){
    //单单改变页面的数据
    const isCollect=!this.data.isCollect;
    this.setData({
      isCollect
    })
  },

  //获取是否收藏的函数
  async getIsCollectBefor(actId) {
    //防止加载过程用户误触
    wx.showLoading({
      title: '加载中',
    });
    //获取收藏的全部
    const openId = app.globalData.userInfo._id;
    //获取该openID的全部收藏对象
    const userInfo =await wx.getStorageSync('userInfo');
    let collect = [];
    if(userInfo){
      collect =userInfo.collect;//从缓存中获取
    }
    else{
      collect = await getCollect(openId);//从数据库中获取
    }
    if(collect.indexOf(this.data.actId)>=0){//判断该活动是否在里面
      this.setData({
        isCollect: true,
        isBeforeCollect: true,
      });
    }
    wx.hideLoading();
  },

   onUnload(){
     let pages = getCurrentPages(); // 获取页面栈
     let prevPage = pages[pages.length - 2]; // 获取上一个页面
     if(prevPage.route=="pages/activity_collect/activity_collect"){
       console.log("yes");
       prevPage.setData({
         isDetailReturn: true,//将这个改成这样，判断是不是从这个页面改变了数据。
        });
      }
    //执行上述操作是因为页面改写本地缓存有时间差，因此要阻隔上页面一段时间来让缓存顺利改写
     this.handleCollect();

   },

   onHide(){
     this.handleCollect();
     wx.hideLoading();//不能写在内部
     //因为这是异步执行的一定是先执行一部分马上回退的
   },

  async handleCollect() {
    wx.showLoading({
      title: '收藏中',
      mask: true,
    });
    const actId = this.data.actId;
    const openId = app.globalData.userInfo._id;
    const isCollect= this.data.isCollect;
    const isBeforeCollect= this.data.isBeforeCollect;
    if(isCollect!=isBeforeCollect){
      await this.CollectPushStorage(isCollect,actId,openId);
      await CollectPushDb(isCollect,actId,openId);
    }
    wx.hideLoading();
  },

  /**
   * 把collect的数据放进缓存
   * order 0:删除一个actId
   * order 1:加入新的actId
  */
  async CollectPushStorage(isCollect,actId,openId){
    const userInfo=wx.getStorageSync('userInfo');
    if(userInfo){
      console.log("本地存在缓存register: ", userInfo);
      let collect =userInfo.collect;
      if(isCollect){
        await collect.push(this.data.actId);//插入一个
      }
      else{
        await collect.splice(collect.indexOf(actId),1);//删除一个
      }
      var _userInfo = userInfo;
      _userInfo.collect = collect; 
      await wx.setStorageSync('userInfo', _userInfo);
    }
    else{
      //看你们要不要写个从数据库加入缓存
      wx.hideLoading();
    }
  }
});
