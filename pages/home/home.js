// 获取应用实例
const app = getApp();
import { formatTime } from '../../utils/util.js';
import { actTableGetAll } from '../../async/index.js';

Page({
  data: {
    classify: [
      { id: "001", class: "iconfont icon-jianshen", name: "运动" },
      { id: "002", class: "iconfont icon-tubiaozhizuomoban-", name: "阅读" },
      { id: "003", class: "iconfont icon-kaoshi", name: "考试" },
      { id: "004", class: "iconfont icon-kaoyan", name: "考研" },
      { id: "005", class: "iconfont icon-yingyu1", name: "英语" },
      { id: "006", class: "iconfont icon-qita", name: "其他" },
    ],

    // 日期
    curYear: new Date().getFullYear(), // 年份
    curMonth: new Date().getMonth(),// 月份 0-11
    day: new Date().getDate(), // 日期 1-31 若日期超过该月天数，月份自动增加
    header_show: true, // 主标题是否显示
    prev: true, // 上一个月按钮是否显示
    next: true, // 下一个月按钮是否显示
    // ramark_show:true,
    // count_txt:true

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
  nextMonth: function (e) {
    console.log(e)
    const currentYear = e.detail.currentYear;
    const currentMonth = e.detail.currentMonth;
    wx.showModal({
      title: '当前日期',
      content: '当前年份：' + currentYear + '年\n当前月份：' + currentMonth + '月'
    });
  },
  onShow() {
    wx.cloud
      .callFunction({
        // name: "getUserDataExcel",
        // name: "getActDataExcel",
        name: "getPunchDataExcel",
      })
      .then((res) => {
        console.log("yes\n", res);
      })
      .catch((err) => {
        console.log("no\n", err);
      });
  },
});
