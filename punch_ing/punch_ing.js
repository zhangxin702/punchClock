// pages/punch_ing/punch_ing.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: [],
    count: 2,
    addedCount: 0,


  },
// 上传图片有关函数
chooseImage() {
  var that = this;
  wx.chooseImage({
    count: 3 - that.data.addedCount,
    sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      that.setData({
        images: that.data.images.concat(res.tempFilePaths),
        addedCount: that.data.addedCount + res.tempFilePaths.length,
      });
    },
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


// 上传图片 微信小程序上传聊天记录的文件 功能还没完全实现
chooseMessageFile: function (e) {
  var that = this;
  wx.chooseMessageFile({
    count: 1,
    type: 'file',
    success(res) {
      var filename = res.tempFiles[0].name
      console.info(filename);
      that.setData({filename:filename});


      wx.uploadFile({
        url: app.globalData._server + "/test/object/upload",
        filePath: res.tempFiles[0].path,
        name: 'uploadFile',
        success(res) {
          //json字符串 需用JSON.parse 转
        }
      })



    }
  });
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(){
   
    }

   
})


  
