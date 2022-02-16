// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

// 云函数入口函数
exports.main = async (event, context) => {
  /**
   * 获取所有活动的数据
   * 可传参openId
   */

  let totalList = [],
    list = null;

  // 如果未定义openId，则获取所有
  if (typeof event.openId == "undefined") {
    const db = cloud.database();
    let actNum = await db.collection("ActTable").count(); // 先获取活动的数量
    actNum = actNum.total;
    // 再将所有活动获取
    for (let i = 0; i < actNum; i += 100) {
      list = await db.collection("ActTable").skip(i).get();
      totalList = totalList.concat(list.data);
    }
  }
  // 否则，获取openId举办的活动
  else {
    const db = cloud.database();
    let actNum = await db
      .collection("ActTable")
      .where({
        _openid: event.openId,
      })
      .count(); // 先获取活动的数量

    actNum = actNum.total;
    // 再将所有活动获取
    for (let i = 0; i < actNum; i += 100) {
      list = await db
        .collection("ActTable")
        .where({
          _openid: event.openId,
        })
        .skip(i)
        .get();
      totalList = totalList.concat(list.data);
    }
  }

  return totalList;
};
