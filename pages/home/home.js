// 获取应用实例
const app = getApp();

Page({
  data: {
    classify: [
      { id: "001", class: "iconfont icon-jianshen", name: "运动" },
      { id: "002", class: "iconfont icon-tubiaozhizuomoban-", name: "阅读" },
      { id: "003", class: "iconfont icon-kaoshi", name: "考试" },
      { id: "004", class: "iconfont icon-kaoyan", name: "考研" },
      { id: "005", class: "iconfont icon-yingyu1", name: "英语" },
      { id: "006", class: "iconfont icon-qita", name: "其他" },
    ],
  },

  onShow() {
    wx.cloud
      .callFunction({
        // name: "getUserDataExcel",
        // name: "getActDataExcel",
        name: "getPunchDataExcel",
      })
      .then((res) => {
        console.log("yes\n", res);
      })
      .catch((err) => {
        console.log("no\n", err);
      });
  },
});
