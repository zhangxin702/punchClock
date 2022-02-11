import { register } from "../../async/async.js";
const app = getApp();

// 注册页
Page({
  data: {
    nickName: null,
    gender: null,
    selfIntro: null,
    avatarPath: null, // 为了方便cropper接口传递所设
  },

  async onShow() {
    const register = await wx.getStorageSync("register");
    if (register) {
      console.log("本地存在缓存register: ", register);

      this.setData({
        nickName: register.nickName,
        gender: register.gender,
        selfIntro: register.selfIntro,
        avatarPath: register.avatarPath,
      });
      if (!register.nickName) {
        this.setData({ nickName: "请输入昵称" });
      }
      if (!register.selfIntro) {
        this.setData({ selfIntro: "请输入自我介绍" });
      }
    }
  },

  onUnload() {
    const register = {
      nickName: this.data.nickName,
      gender: this.data.gender,
      selfIntro: this.data.selfIntro,
      avatarPath: this.data.avatarPath,
    };
    wx.setStorageSync("register", register);
  },

  toCropper() {
    wx.navigateTo({
      url: `../../pages/cropper/cropper?imgSrc=${this.data.avatarPath}`,
    });
  },

  handleNickName(e) {
    this.setData({ nickName: e.detail.value });
  },

  handleGender(e) {
    this.setData({ gender: e.detail.value });
  },

  handleSelfIntro(e) {
    console.log(e);
    this.setData({ selfIntro: e.detail.value });
  },

  async handleSubmit(e) {
    /**
     *  提交注册信息
     */

    let openId = null;
    await wx.cloud.callFunction({ name: "getOpenId" }).then((res) => {
      openId = res.result;
    });
    // console.log("openId: ", openId);
    const { nickName, gender } = e.detail.value;
    let { selfIntro } = e.detail.value;

    if (nickName == "") {
      wx.showToast({
        title: "未填写昵称",
      });
    } else if (gender == "") {
      wx.showToast({
        title: "未选择性别",
      });
    } else if (this.data.avatarPath == null) {
      wx.showToast({
        title: "未上传头像",
      });
    } else {
      wx.showLoading({
        title: "加载中",
        mask: true,
      });
      if (selfIntro == "") {
        selfIntro = "该用户很懒，没有填自我介绍~";
      }

      const userInfo = await register(openId, nickName, gender, selfIntro, this.data.avatarPath);
      wx.hideLoading();
      // 注册成功，返回用户信息
      if (userInfo) {
        app.globalData.userInfo = userInfo;
        wx.setStorageSync("userInfo", userInfo);
        wx.removeStorageSync("register"); // 清除register的本地缓存
        wx.navigateBack({
          delta: -1,
        });
      }
      // 注册失败，返回false
      else {
        wx.showToast({
          title: "注册失败",
          icon: "fail",
        });
      }
    }
  },
});
