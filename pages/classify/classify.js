Page({

  /**
   * 页面的初始数据
   */
  data: {
  
    classify: [
      { id: "000", class: "iconfont icon-qita", name: "全部",bgImgUrl:"https://i.postimg.cc/MHTHqJ1d/8dfed916-2fd0-476d-9439-37b3c2a1cd51.png"  },
      { id: "001", class: "iconfont icon-jianshen", name: "健身" ,bgImgUrl:"https://i.postimg.cc/W3bd3VTQ/image.png" },
      { id: "002", class: "iconfont icon-tubiaozhizuomoban-", name: "阅读" ,bgImgUrl:"https://i.postimg.cc/zfdgTvtJ/image.png" },
      { id: "003", class: "iconfont icon-kaoshi", name: "考试",bgImgUrl:"https://i.postimg.cc/d1qQqcGg/7cf4cad6-2fd8-411f-8fb6-a8f4913a1538.png"  },
      { id: "004", class: "iconfont icon-kaoyan", name: "考研",bgImgUrl:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fbpic.588ku.com%2Fart_origin_min_pic%2F19%2F06%2F18%2Ff060c6885e9d9cc776a81aa39e43d6f8.jpg"  },
      { id: "005", class: "iconfont icon-yingyu1", name: "英语",bgImgUrl:"https://i.postimg.cc/fRgKNMXg/da40a191-18a0-459d-a487-394740385163.png"  },
      { id: "006", class: "iconfont icon-qita", name: "考勤",bgImgUrl:"https://i.postimg.cc/7PmqDRsT/image.png"  },
      { id: "007", class: "iconfont icon-qita", name: "其他",bgImgUrl:"https://i.postimg.cc/xjwV0SG8/c04f53a4-fcc3-4d72-b6af-f665b5cbce62.png"  },
    
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let name = options.name
    this.setData({
      name :name
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})