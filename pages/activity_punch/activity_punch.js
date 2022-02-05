// pages/activity_punch/activity_punch.js
import {getParticipatePunch,getOrganizePunch} from "../../async/async.js";
import { formatTime } from '../../utils/util.js';
const app=getApp();
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
    ],
    actList:[],
    organizeList:[],
    showActList:[],
    showOrganizeList:[]
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
  async onLoad(options) {
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
    const {openId}=app.globalData.userInfo;
    let res1 = await getParticipatePunch(openId);
    let res2= await getOrganizePunch(openId);
    this.setData({
      actList: res1.map((v) => ({
        ...v,
        //以下都一样。因为云函数取出的时间格式比较奇怪，需要先new date
        createTime: formatTime({ date: new Date(v.createTime) }),
        endTime:formatTime({ date: new Date(v.endTime) }),
        startTime:formatTime({ date: new Date(v.startTime) })
      })),
    });
    this.setData({
      organizeList: res2.map((v) => ({
        ...v,
        //以下都一样。因为云函数取出的时间格式比较奇怪，需要先new date
        createTime: formatTime({ date: new Date(v.createTime) }),
        endTime:formatTime({ date: new Date(v.endTime) }),
        startTime:formatTime({ date: new Date(v.startTime) })
      })),
    })
    this.setData({
      showActList:JSON.parse(JSON.stringify(this.data.actList)),//深拷贝防止改变引起总的改变
      showOrganizeList:JSON.parse(JSON.stringify(this.data.organizeList))//同上
    })
    console.log(this.data.actList);
    console.log(this.data.organizeList);
  },

  
  //搜索，按enter键返回值
  inputBind(e){
    if(e.detail.value==""){
      this.setData({
        showActList:JSON.parse(JSON.stringify(this.data.actList)),//深拷贝防止改变引起总的改变
        showOrganizeList:JSON.parse(JSON.stringify(this.data.organizeList))//同上
      })
    }
    else{
      let showActList=[];
      let showOrganizeList=[];
      let actTheme=null;
      let actList=this.data.actList;
      let organizeList=this.data.organizeList;
      // 检索所有参与活动
      for (let i = 0; i < actList.length; i++) {
        actTheme = actList[i].actTheme; // 获取一个活动的所有参与者
        // 检索这个活动的所有参与者
        if(actTheme==e.detail.value){
          showActList.push(actList[i]);
        }
      }
      //检索所有组织活动
      for (let i = 0; i < organizeList.length; i++) {
        actTheme = organizeList[i].actTheme; // 获取一个活动的所有参与者
        // 检索这个活动的所有参与者
        if(actTheme==e.detail.value){
          showOrganizeList.push(organizeList[i]);
        }
      }
      this.setData({
        showOrganizeList,
        showActList
      })
    }
  }
})