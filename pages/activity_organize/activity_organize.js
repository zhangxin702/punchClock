Page({

  /**
   * 页面的初始数据
   */
  data: {

   // 上传图片设置
  images: [],
  count: 1,
  addedCount: 0,
  // 活动时间
  selectedActiveDate:'2022-1-23',
  // 活动简介
  active_introduce:"",
  // 活动截止时间
  activeDateEnd:"2022-2-23",
  // 活动名字
  active_name:""
    
  },

  

  // 上传图片有关函数
  chooseImage() {
    var that = this;
    wx.chooseImage({
      count: 1- that.data.addedCount,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          images: that.data.images.concat(res.tempFilePaths),
          addedCount: that.data.addedCount + res.tempFilePaths.length,
        });
      }
    })
  },
  // 删除图片
  deleteImage(e){
    this.data.images.splice(e.detail,1)
    this.setData({
      images: this.data.images,
      addedCount: this.data.addedCount - 1
    })
  },
 // 活动时间填写
 dateChange:function(e){
  let day = e.detail.value;
  this.setData({
    selectedActiveDate:day
  });
  // console.log(selectedActiveDate)
},

// 活动结束时间填写
dateEnd:function(e){
  let day = e.detail.value;
  this.setData({
    activeDateEnd:day
  });
  // console.log(selectedActiveDate)
},

// 活动简介设置  输入框失去焦点时,即触发事件
bindTextAreaBlur: function(e) {
  // console.log(e.detail.value);
  var that = this;
  that.setData({
    active_introduce: e.detail.value
  });
},
// 活动名字设置  输入框失去焦点时,即触发事件
bindTextAreaBlurName: function(e) {
  // console.log(e.detail.value);
  var that = this;
  that.setData({
    active_name: e.detail.value
  });
},


})