import {
  chooseImage,
  uploadFile,
  showToast,
  actTableInsert,
} from '../../async/index.js';
import { formatTime } from '../../utils/util.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {

    show:false,//控制下拉列表的显示隐藏，false隐藏、true显示
    selectData:['考试','健身','考研','英语','阅读','其他'],//下拉列表的数据
    index:0,//选择的下拉列表下标


    //  选择打卡的方式
    list: [
      {
        id: 1,
        name: '🖊',
        value: 'word',
      },
      {
        id: 2,
        name: '📸',
        value: 'picture',
      },
      {
        id: 3,
        name: '⛳',
        value: 'map',
      },
      {
        id: 3,
        name: '📁',
        value: 'file',
      },
    ],
    // 复选框选择的value
    selectList: [],

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
    startTime: '',
    startTimeString: '0000/00/00 00:00:00',
    endTime: '',
    endTimeString: '0000/00/00 00:00:00',
    // 活动公告
    active_announce: '',
    //最低打卡次数
    punch_num: 1,
  },

    // 点击下拉显示框
    selectTap(){
      this.setData({
        show: !this.data.show
      });
    },
    // 点击下拉列表
    optionTap(e){
      let Index=e.currentTarget.dataset.index;//获取点击的下拉列表的下标
      this.setData({
        index:Index,
        show:!this.data.show
      });
    },
  // 打卡方式复选框 把选择的保持在selectList
  handleCheckboxChange(e) {
    this.setData({
      selectList: e.detail.value,
    });
  },
  // 打卡次数设置
  num_blur: function (e) {
    console.log(e.detail.value);
    var that = this;
    that.setData({
      punch_num: parseInt(e.detail.value),
    });
    // console.log(this.Date.active_announce)
  },

  prevNum() {
    this.setData({ punch_num: this.data.punch_num + 1 });
  },
  nextNum() {
    this.setData({ punch_num: this.data.punch_num - 1 });
  },

  // 打卡次数设置

  // 改变时间
  changeStartDate(e) {
    let res = new Date(e.detail.value.replace(/-/g, '/'));
    this.setData({
      startTime: res,
      startTimeString: formatTime({ date: res }),
    });
  },
  changeEndDate(e) {
    let res = new Date(e.detail.value.replace(/-/g, '/'));
    this.setData({
      endTime: res,
      endTimeString: formatTime({ date: res }),
    });
  },
  async submit() {
    if (
      this.data.endTime <= this.data.startTime ||
      this.data.startTime < new Date()
    ) {
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
    if (this.data.active_announce === '') {
      await showToast({
        title: '当前活动公告为空，请输入活动介绍',
      });
      return;
    }
    if (this.data.selectList.length === 0) {
      await showToast({
        title: '当前打卡方式为空，请选取对应打卡方式',
      });
      return;
    }
    if (this.data.tempFilePaths.length === 0) {
      await showToast({
        title: '当前海报为空，请选取海报',
      });
      return;
    }
    var res = await uploadFile({
      tempFilePath: this.data.tempFilePaths[0],
      cloudPath: 'punchImage/' + this.data.tempFilePaths[0].split('/').pop(),
    });
    var ree = await actTableInsert({
      actTheme: this.data.active_name,
      actContent: this.data.active_introduce,
      createTime: new Date(),
      startTime: this.data.startTime,
      endTime: this.data.endTime,
      imageCloud: res.fileID,
      punchTimes: this.data.punch_num,
      announcement: this.data.active_announce,
      requires: this.data.selectList,
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
      tempFilePaths: [],
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
