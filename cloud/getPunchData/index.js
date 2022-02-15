// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  /**
   * 获取打卡数据
   * 若传参actId，则获取该活动的所有打卡数据；否则，获取所有活动的所有打卡数据
   * 若传参openId，则获取该用户在该活动的所有打卡数据；否则，获取所有用户在该活动的所有打卡数据
   */

  const db = cloud.database(),
    actId = event.actId,
    openId = event.openId;
  console.log("actId: ", actId);
  console.log("openId: ", openId);
  let option = null;
  // actId和openId均未定义，即获取全部打卡数据
  if (typeof actId == "undefined" && typeof openId == "undefined") {
    option = {};
  }
  // openId定义了但actId未定义，即获取用户openId所有活动的所有打卡数据
  else if (typeof actId == "undefined" && typeof openId != "undefined") {
    option = {
      _openid: openId,
    };
  }
  // actId定义了，不管openId是否定义，即获取活动actId的所有打卡数据
  else {
    option = {
      actId: actId,
    };
  }

  let totalNum = await db.collection("PunchTable").where(option).count(); // 先获取打卡数据的数量
  totalNum = totalNum.total;
  let totalList = [],
    list = null;

  for (let i = 0; i < totalNum; i += 100) {
    list = await db.collection("PunchTable").where(option).skip(i).get();
    totalList = totalList.concat(list.data);
  }

  return totalList;
};
