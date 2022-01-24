// 注册页
import { getUserInfo, register } from "../../utils/asyncFunc.js";

Page({
  data: {
    openId: null,
    nickName: null,
    gender: null,
    selfIntro: null,
    avatarUrl: null,
  },

  onShow() {
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
    this.setData({
      openId: "user-1",
    });
  },

  handleTextNickName(e) {
    /**
     *  记录输入的昵称
     */

    this.setData({
      nickName: e.detail.value,
    });
  },

  handleTextGender(e) {
    /**
     *  记录输入的性别
     */

    this.setData({
      gender: e.detail.value,
    });
  },

  handleTextSelfIntro(e) {
    /**
     *  记录输入的自我介绍
     */

    this.setData({
      selfIntro: e.detail.value,
    });
  },

  handleChooseImage() {
    /**
     *  上传头像图片
     */

    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: (res) => {
        this.setData({
          avatarUrl: res.tempFilePaths,
        });
      },
    });
  },

  handleSubmit() {
    /**
     *  提交注册信息
     */

    if (!this.data.nickName) {
      wx.showToast({
        title: "未填写昵称",
      });
    } else if (!this.data.gender) {
      wx.showToast({
        title: "未填写性别",
      });
    } else if (!this.data.avatar) {
      wx.showToast({
        title: "未选择头像",
      });
    } else {
      if (!this.data.selfIntro) {
        this.setData({
          selfIntro: "该用户很懒，没有填自我介绍~",
        });
      }

      const openId = this.data.openId;
      const nickName = this.data.nickName;
      const gender = this.data.gender;
      const selfIntro = this.data.selfIntro;
      const avatarUrl = this.data.avatarUrl;
      await register(openId, nickName, gender, selfIntro, avatarUrl);
    }
  },
});
