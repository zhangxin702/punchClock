// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  /**
   * 获取所有活动的数据
   */

  const db = cloud.database();
  let actNum = await db.collection("ActTable").count(); // 先获取活动的数量
  actNum = actNum.total;
  let totalList = [],
    list = null;
  // 再将所有活动获取
  for (let i = 0; i < actNum; i += 100) {
    list = await db.collection("ActTable").skip(i).get();
    totalList = totalList.concat(list.data);
  }

  return totalList;
};
