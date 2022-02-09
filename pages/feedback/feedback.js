import { uploadProblem } from "../../async/async.js";
const app = getApp();
Page({
  data: {
    text: "",
    images: [],
  },

  handleTextInput(e) {
    /**
     * 文字输入
     */

    this.setData({
      text: e.detail.value,
    });
  },

  handleChooseImg(e) {
    /**
     * 传图
     */

    let count = 9 - this.data.images.length;
    if (count <= 0) {
      wx.showToast({
        title: "已达最大数量",
        icon: "error",
        mask: true,
      });
      return;
    }
    wx.chooseImage({
      // 同时选中的图片数量
      count: count,
      // 图片的格式：原图、压缩
      sizeType: ["original", "compressed"],
      // 图片的来源：相册
      sourceType: ["album"],
      success: (res) => {
        this.setData({
          images: [...this.data.images, ...res.tempFilePaths],
        });
      },
    });
  },

  handleRemoveImg(e) {
    /**
     * 删除一张图片
     */

    const { index } = e.currentTarget.dataset;
    let { images } = this.data;
    images.splice(index, 1);
    this.setData({
      images,
    });
  },

  handleSubmit() {
    /**
     * 提交问题反馈
     */

    const { text, images } = this.data;
    if (!text.trim()) {
      wx.showToast({
        title: "文字描述为空",
        icon: "none",
        mask: true,
      });
      return;
    }

    uploadProblem(app.globalData.userInfo.openId, text, images);
  },
});
