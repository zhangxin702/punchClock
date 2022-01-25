import { register } from "../../utils/asyncFunc.js";

// 注册页
Page({
  data: {
    avatarPath: null,
    // 上传图片设置
    images: [],
    count: 1,
    addedCount: 0,
  },

  // 上传图片有关函数
  chooseImage() {
    var that = this;
    wx.chooseImage({
      count: 3 - that.data.addedCount,
      sizeType: ["compressed"], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          images: that.data.images.concat(res.tempFilePaths),
          addedCount: that.data.addedCount + res.tempFilePaths.length,
          avatarPath: res.tempFilePaths[0],
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

  async handleSubmit(e) {
    /**
     *  提交注册信息
     */

    // wx.cloud
    //   .callFunction({
    //     name: "getOpenId",
    //   })
    //   .then((res) => {
    //     console.log("openId: ", res.result);
    //     this.setData({
    //       openId: res.result
    //     })
    //   });

    const openId = "user-11";
    const { nickName, gender, selfIntro } = e.detail.value;

    if (nickName == "") {
      wx.showToast({
        title: "未填写昵称",
      });
    } else if (gender == "") {
      wx.showToast({
        title: "未填写性别",
      });
    } else if (this.data.avatarPath == "") {
      wx.showToast({
        title: "未选择头像",
      });
    } else {
      if (selfIntro == "") {
        this.setData({
          selfIntro: "该用户很懒，没有填自我介绍~",
        });
      }

      await register(openId, nickName, gender, selfIntro, this.data.avatarPath);
    }
  },
});
