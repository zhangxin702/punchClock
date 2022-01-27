// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  /**
   * 获取指定的活动的所有打卡数据，需传参actId
   */

  const db = cloud.database();
  let totalNum = await db.collection("PunchTable").count(); // 先获取打卡数据的数量
  totalNum = totalNum.total;
  let totalList = [],
    list = null;
  // 如果指定了openId，说明是获取该用户在该活动的所有打卡数据
  if (!event.openId) {
    for (let i = 0; i < totalNum; i += 100) {
      list = await db
        .collection("PunchTable")
        .where({
          actId: event.actId,
          openId: event.openId,
        })
        .skip(i)
        .get();
      totalList = totalList.concat(list.data);
    }
  }
  // 如果未指定openId，则是获取这个活动的所有打卡数据
  else {
    for (let i = 0; i < totalNum; i += 100) {
      list = await db
        .collection("PunchTable")
        .where({
          actId: event.actId,
        })
        .skip(i)
        .get();
      totalList = totalList.concat(list.data);
    }
  }

  return totalList;
};