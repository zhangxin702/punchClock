const app = getApp()

Page({
  data: {
    imageSrc:[
      "https://img1.baidu.com/it/u=1285150111,2384442222&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1046",
      "https://img0.baidu.com/it/u=578124454,2840032519&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1069",
      "https://img2.baidu.com/it/u=825500491,1502243950&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1084",
      "https://img1.baidu.com/it/u=3994288368,3568592542&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1083"
    ],
    //图片数量，用于计算容器宽度
    scrollItemNumber:0,
    // 当前高亮的图片序号
    nowImage:0,
    // 获取屏幕的宽度
    screenWidth:'',
    // 完成加载的图片数量
    imageLoadNumber:0,
  },
  // 滑动行为监听
  scrollHandle(scrollParameter){
    var _this=this;
    _this.createSelectorQuery().selectAll(".msc-common-image").
      boundingClientRect(
        (res)=>{
         console.log(res);
         var halfWidth=_this.data.screenWidth/2
         for (var i=0;i<res.length;i++) {
           if(res[i].left<0||res[i].right>_this.data.screenWidth){
             continue;
           }
           if(res[i].left<halfWidth&&res[i].right>halfWidth){
             _this.setData({
               nowImage:i,
             })
             console.log("已设置屏幕中心图片，图片编号",_this.data.nowImage);
             return;
           }
        }
   }).exec();
  },
  // 图片加载进度监听
  imageLoadHandle(){
    var _this=this;
    console.log("图片已加载数量："+_this.data.imageLoadNumber);
    this.setData({
      imageLoadNumber:++_this.data.imageLoadNumber
    })
    if(_this.data.imageLoadNumber===_this.data.imageSrc.length){
      console.log("写信页面加载完成，过渡效果已关闭")
      //此处可关闭过渡效果
      wx.showToast({
        title: '点击底部卡片以选择',
        icon:"none",
        duration:3000,
      })
    }
  },
  clickCard(even){
    let index=even.currentTarget.dataset.id;
    console.log("用户点击卡片编号："+index);
    switch(index){
      case 0:
        // 此处可跳转
        // wx.navigateTo({
        //   url: 'xxx',
        //   success:function(){}
        // });
        break;
      case 1:
        // 此处可跳转
        // wx.navigateTo({
        //   url: '/pages/saveAsPicture/saveAsPicture',
        //   fail:function(){
        //     wx.showToast({
        //       title: '跳转失败，稍后再试',
        //     })
        //   }
        // });
        break; 
      case 2:
        // 此处可跳转
        // wx.navigateTo({
        //   url: 'xxx',
        //   fail:function(){
        //     wx.showToast({
        //       title: '跳转失败，稍后再试',
        //     })
        //   }
        // });
        break; 
      case 3:
        // 此处可跳转
        // wx.navigateTo({
        //   url: 'xxx',
        //   fail:function(){
        //     wx.showToast({
        //       title: '跳转失败，稍后再试',
        //     })
        //   }
        // });
        break; 
    }
  },
  onLoad() {
    var _this=this;
    // 在组件实例进入页面节点树时获取屏幕参数
    wx.getSystemInfo({
      success(res){
		// 此处可打开过渡效果
        _this.setData({
          scrollItemNumber:_this.data.imageSrc.length,
          screenWidth:res.windowWidth,
        })
        console.log('获取到宽度：'+res.windowWidth);
      },
      fail(res){
        console.log("调用失败！无法获取屏幕的宽度。");
      },
    })
  },
})
