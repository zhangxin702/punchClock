import { formatTime } from "../../utils/util.js";
import { getPunchAll, getActTheme, getPunchDataExcel } from "../../async/async.js";
const app = getApp();

Page({
  data: {
    currentTab: 0,
    punchList: [],
    pageNum: 0,
    dict: {}, // 将actId映射为actTheme的字典
  },

  async onLoad() {
    const dict = await getActTheme();
    this.setData({
      dict: dict,
    });
    this.GetAll(this.data.currentTab, this.data.pageNum);
  },

  async GetAll(order, skip) {
    wx.showLoading({
      title: "加载中",
      mask: true,
    });
    var res = await getPunchAll(
      order,
      skip,
      9,
      "user-2"
      // app.globalData.userInfo.openId,
    );
    var addList = res.map((v) => ({
      ...v,
      punchTime: formatTime({ date: v.punchTime }),
    }));
    if (order == 0) {
      this.setData({
        punchList: [...this.data.punchList, ...addList],
        pageNum: this.data.pageNum + 9,
      });
    } else {
      this.setData({
        punchList: [...this.data.punchList, ...addList],
        pageNum: this.data.pageNum + 3,
      });
      console.log(this.data.punchList);
    }
    wx.hideLoading();
    wx.stopPullDownRefresh();
  },

  onReachBottom: function (e) {
    this.GetAll(this.data.currentTab, this.data.pageNum);
    console.log(this.data.pageNum);
  },

  bindChange: function (e) {
    this.setData({
      currentTab: e.detail.current,
    });
  },

  swichNav: function (e) {
    if (this.data.currentTab === e.target.dataset.current) {
      this.setData({
        currentTab: e.detail.current,
        pageNum: 0,
        punchList: [],
      });
      this.GetAll(this.data.currentTab, this.data.pageNum);
      return false;
    } else {
      this.setData({
        currentTab: e.target.dataset.current,
        pageNum: 0,
        punchList: [],
      });
      this.GetAll(this.data.currentTab, this.data.pageNum);
    }
  },

  onPullDownRefresh() {
    this.setData({
      pageNum: 0,
      punchList: [],
    });
    this.GetAll(this.data.currentTab, this.data.pageNum);
  },

  async shareFile(fileId) {
    /**
     * 分享文件到聊天
     */

    // 获取临时文件地址
    await wx.cloud
      .downloadFile({
        fileID: fileId,
      })
      .then((res) => {
        const index = fileId.lastIndexOf("/");
        const fileName = fileId.substring(index + 1, fileId.length);
        console.log("fileName: ", fileName);
        // console.log("res1: ", res);
        const temp = res.tempFilePath;
        wx.showModal({
          title: fileName,
          content: "点击确定即可分享文件到聊天",
          success: (res) => {
            console.log("res2: ", res);
            // 用户点击了确定
            if (res.confirm) {
              // 分享文件到聊天
              wx.shareFileMessage({
                filePath: temp,
                success: (res) => {
                  console.log(res);
                },
                fail: (err) => {
                  console.log(err);
                },
              });
            }
            // 用户点击了取消
            else if (res.cancel) {
              wx.showToast({
                title: "已取消",
                icon: "error",
                duration: 2000,
              });
            }
          },
        });
      })
      .catch((err) => {
        console.log("获取文件临时地址失败×\n", err);
      });
  },

  async handleMyOwnPunchData() {
    /**
     * 下载我的打卡记录到本地
     */

    const openId = app.globalData.userInfo._id;
    const fileId = await getPunchDataExcel(openId, 1);
    console.log("fileId: ", fileId);
    await this.shareFile(fileId);
  },

  async handleMyActPunchData() {
    /**
     * 下载我举办的活动的打卡记录到本地
     */

    const openId = app.globalData.userInfo._id;
    const fileId = await getPunchDataExcel(openId, 2); // 获取fileId
    console.log("fileId: ", fileId);
    await this.shareFile(fileId);
  },
});
