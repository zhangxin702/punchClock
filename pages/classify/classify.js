Page({

  /**
   * 页面的初始数据
   */
  data: {
  
    classify: [
      { id: "000", class: "iconfont icon-qita", name: "全部",bgImgUrl:"https://7a68-zhangxinying-1g0quq2g2d68268c-1307395035.tcb.qcloud.la/projectImage/%E6%B4%BB%E5%8A%A8%E5%88%86%E7%B1%BB-%E5%85%A8%E9%83%A8.png"  },
      { id: "001", class: "iconfont icon-jianshen", name: "健身" ,bgImgUrl:"https://7a68-zhangxinying-1g0quq2g2d68268c-1307395035.tcb.qcloud.la/projectImage/%E6%B4%BB%E5%8A%A8%E5%88%86%E7%B1%BB-%E5%81%A5%E8%BA%AB.png" },
      { id: "002", class: "iconfont icon-tubiaozhizuomoban-", name: "阅读" ,bgImgUrl:"https://7a68-zhangxinying-1g0quq2g2d68268c-1307395035.tcb.qcloud.la/projectImage/%E6%B4%BB%E5%8A%A8%E5%88%86%E7%B1%BB-%E9%98%85%E8%AF%BB.png" },
      { id: "003", class: "iconfont icon-kaoshi", name: "考试",bgImgUrl:"https://7a68-zhangxinying-1g0quq2g2d68268c-1307395035.tcb.qcloud.la/projectImage/%E6%B4%BB%E5%8A%A8%E5%88%86%E7%B1%BB-%E8%80%83%E8%AF%95.png"  },
      { id: "004", class: "iconfont icon-kaoyan", name: "考研",bgImgUrl:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fbpic.588ku.com%2Fart_origin_min_pic%2F19%2F06%2F18%2Ff060c6885e9d9cc776a81aa39e43d6f8.jpg"  },
      { id: "005", class: "iconfont icon-yingyu1", name: "英语",bgImgUrl:"https://7a68-zhangxinying-1g0quq2g2d68268c-1307395035.tcb.qcloud.la/projectImage/%E6%B4%BB%E5%8A%A8%E5%88%86%E7%B1%BB-%E8%8B%B1%E8%AF%AD.png"  },
      { id: "006", class: "iconfont icon-qita", name: "考勤",bgImgUrl:"https://7a68-zhangxinying-1g0quq2g2d68268c-1307395035.tcb.qcloud.la/projectImage/%E6%B4%BB%E5%8A%A8%E5%88%86%E7%B1%BB-%E8%80%83%E5%8B%A4.png"  },
      { id: "007", class: "iconfont icon-qita", name: "其他",bgImgUrl:"https://7a68-zhangxinying-1g0quq2g2d68268c-1307395035.tcb.qcloud.la/projectImage/%E6%B4%BB%E5%8A%A8%E5%88%86%E7%B1%BB-%E5%85%B6%E4%BB%96.png"  },
    
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