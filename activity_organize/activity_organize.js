import {
  chooseImage,
  uploadFile,
  showToast,
  actTableInsert,
} from '../../async/index.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 上传图片设置
    images: [],
    count: 1,
    addedCount: 0,
    tempFilePaths: [],
  
    // 活动简介
    active_introduce: '',
   
    // 活动名字
    active_name: '',
    // 活动时间，具体到秒
    startTime: '2019-03-15 10:45:45',
    endTime: '2022-08-15 10:45:23',
// 活动公告
    active_announce:'',
    //最低打卡次数
    punch_num : 1
  },

  // 打卡次数设置
  num_blur: function (e) {
    console.log(e.detail.value);
    var that = this;
    that.setData({
      punch_num: e.detail.value,
    });
    // console.log(this.Date.active_announce)
  },
  
  prevNum(){
    this.setData({punch_num: this.data.punch_num + 1 });
  },
  nextNum(){
    this.setData({punch_num: this.punch_num - 1 });
  },


// 打卡次数设置


  // 改变时间
  changeStartDate(e){
    console.log(e.detail.value)
    this.setData({ startTime: e.detail.value})
  },
  changeEndDate(e){
    console.log(e.detail.value)
    this.setData({ endTime: e.detail.value})
    
  },
  async submit() {
    if (this.data. endTime < this.data. startTime) {
      await showToast({
        title: '您选择的时间有误，请重新选择',
      });
      return;
    }
    if (this.data.active_name === '') {
      await showToast({
        title: '当前活动名称为空，请输入活动名称',
      });
      return;
    }
    if (this.data.active_introduce === '') {
      await showToast({
        title: '当前活动介绍为空，请输入活动介绍',
      });
      return;
    }
    if (this.data. active_announce === '') {
      await showToast({
        title: '当前活动公告为空，请输入活动介绍',
      });
      return;
    }

    var res = await uploadFile({
      tempFilePath: this.data.tempFilePaths[0],
    });
    var ree = await actTableInsert({
      actTheme: this.data.active_name,
      actContent: this.data.active_introduce,
      nowTime: new Date(),
      startTime: this.data.selectedActivexDate,
      endTime: this.data.activeDateEnd,
      actImg: res.fileID,
    });

  },

  // 上传图片有关函数
  async chooseImage() {
    var res = await chooseImage({
      addedCount: this.data.addedCount,
    });
    console.log(res);
    this.setData({
      images: this.data.images.concat(res.tempFilePaths),
      addedCount: this.data.addedCount + res.tempFilePaths.length,
      tempFilePaths: res.tempFilePaths,
    });
  },

  // 删除图片
  deleteImage(e) {
    this.data.images.splice(e.detail, 1);
    this.setData({
      images: this.data.images,
      addedCount: this.data.addedCount - 1,
    });
  },



  // 活动简介设置  输入框失去焦点时,即触发事件
  bindTextAreaBlur: function (e) {
    // console.log(e.detail.value);
    var that = this;
    that.setData({
      active_introduce: e.detail.value,
    });
  },
  // 活动名字设置  输入框失去焦点时,即触发事件
  bindTextAreaBlurName: function (e) {
    // console.log(e.detail.value);
    var that = this;
    that.setData({
      active_name: e.detail.value,
    });
  },
   // 活动公告设置  输入框失去焦点时,即触发事件
   bindBlurAnnounce: function (e) {
    console.log(e.detail.value);
    var that = this;
    that.setData({
      active_announce: e.detail.value,
    });
    // console.log(this.Date.active_announce)
  },
});
