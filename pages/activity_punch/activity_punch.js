// pages/activity_punch/activity_punch.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        tab_id:0,
        name:"已参与活动",
        isActive:true
      },
      {
        tab_id:1,
        name:"已组织活动",
        isActive:false
      }
    ]
  },
  //标题点击事件，从组件中传过来
  handleTabsItemChange(e){
    //对tabs进行一次生拷贝，以防影响到原来数据
    //let index=JSON.parse(JSON.stringify(e.detail));
    let{index}=e.detail;
    let{tabs}=this.data;
    //找哪个是index，是的改成isActive为true，否则为false
    tabs.forEach((v,i) =>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  },
  //加载时获取page_id以此确保能够从按钮中走向正确样式
  onLoad: function (options) {
    //如果没看见上面的组件可以把下面的注释划掉
    //console.log(options);
    const {page_id}=options;
    let{tabs}=this.data;
    //因为传过来的是string应该转为Number
    const index=Number(page_id);
    //找哪个是page_id，是的改成isActive为true，否则为false
    tabs.forEach((v,i) =>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  },
})