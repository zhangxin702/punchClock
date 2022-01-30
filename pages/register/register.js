import { register} from "../../async/async.js";
//import { register ,uploadImage} from "../../async/async.js";
const app = getApp();

// 注册页
Page({
  data: {
    avatarPath: null, //为了方便cropper接口传递所设
    
  },

  toCropper() {
    wx.navigateTo({
      url: `../../pages/cropper/cropper?imgSrc=${this.data.avatarPath}`,
    });
  },

  onShow() {
    if (app.globalData.imgSrc) {
      this.setData({
        avatarPath: app.globalData.imgSrc,
      });
    }
    console.log(app.globalData.imgSrc);
  },

  async handleSubmit(e) {
    /**
     *  提交注册信息
     */

    // const openId = app.globalData.userInfo.openId;
    const openId = "user-11";
    const { nickName, gender} = e.detail.value;
    let{selfIntro}=e.detail.value;

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
      wx.showLoading({
        title: '加载中',
        mask:true
      })
      if (selfIntro == "") {
        // this.setData({
        //   selfIntro: "该用户很懒，没有填自我介绍~",
        // });
        selfIntro="该用户很懒，没有填自我介绍~";
      }
      //建议加下，之前那种写法会产生异步
      //let avatarUrl=await uploadImage(openId,this.data.avatarPath);
      await register(openId, nickName, gender, selfIntro, this.data.avatarPath);
      wx.hideLoading();
      wx.navigateBack({
        delta: -1,
      })
    }
  },
});
