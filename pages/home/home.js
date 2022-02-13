// 获取应用实例
const app = getApp();
import { actTableGetAll } from '../../async/index.js';

Page({
  data: {
    actList: [],
  },
  onLoad() {
    this.GetAll(0, 0);
  },
  async GetAll(order, skip) {
    var res = await actTableGetAll({
      order: order,
      skip: skip,
      limit: 3,
    });
    this.setData({
      actList: res.data,
    });
  },
});
