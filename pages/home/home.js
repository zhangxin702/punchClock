// 获取应用实例
const app = getApp();
import { formatTime } from '../../utils/util.js';
import { actTableGetAll } from '../../async/index.js';

Page({
  data: {
   

    

    currentTab: 0,
    actList: [],
    pageNum: 0,
  },
  onLoad(){
    this.GetAll(this.data.currentTab, this.data.pageNum);
  },
  async GetAll(order, skip) {
    var res = await actTableGetAll({
      order: order,
      skip: skip,
      limit: 3,
    });
    var addList = res.data.map((v) => ({
      ...v,
      createTime: formatTime({ date: v.createTime }),
    }));
    this.setData({
      actList: [...this.data.actList, ...addList],
      pageNum: this.data.pageNum + 3,
    });
    wx.stopPullDownRefresh();
    console.log(this.data.actList);
  },


});
