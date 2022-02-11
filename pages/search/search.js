Page({
  data: {
    actData: [], // 所有的活动数据
    resultData: [], // 查询结果
    isFocus: false, // 配合“取消”按钮的
    isActDataGet: false, // 配合handleSearch的
  },

  onShow() {
    // 进入这个页面就先异步获取全部活动的数据到本地
    let that = this;
    wx.cloud
      .callFunction({
        name: "getActData",
      })
      .then((res) => {
        console.log("获取所有活动数据成功√\n", res);
        that.setData({
          actData: res.result,
          isActDataGet: true,
        });
      })
      .catch((err) => {
        console.log("获取所有活动数据失败×\n", err);
      });
  },

  handleInput(e) {
    // 当输入的值发生改变时，执行该函数
    const str = e.detail.value;
    // 如果输入为空
    if (!str.trim()) {
      this.setData({
        resultData: [],
        isFocus: true,
      });
      return;
    }
    // 如果输入非空
    else {
      this.setData({
        isFocus: true,
      });
      // 清除定时器
      clearTimeout(timer);
      // 设置定时器
      timer = setTimeout(() => {
        this.handleSearch(str);
      }, 640); // 640ms后执行this.handleSearch(str)
    }
  },

  handleCancel() {
    this.setData({
      resultData: [],
      isFocus: false,
    });
  },

  handleSearch(str) {
    wx.showToast({
      title: "搜索中",
      mask: true,
    });

    let resultData = null;

    // 如果还没获取到全部的活动数据，就阻塞一会儿
    if (!isActDataGet) {
      while (!isActDataGet) {
        clearTimeout(timer); // 清除定时器
        timer = setTimeout(function () {}, 640); // 定时640ms
      }
    }

    const actData = this.data.actData;
    for (let i = 0; i < actData.length; i++) {
      if (actData[i].actTheme.indexOf(str) >= 0) {
        resultData.push(actData[i]);
      }
    }
    this.setData({
      resultData: resultData,
    });

    wx.hideToast();
  },
});
