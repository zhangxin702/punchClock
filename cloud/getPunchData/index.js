// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

// 云函数入口函数
exports.main = async (event, context) => {
  /**
   * 获取打卡数据
   * lengthOnly: 是否只返回数量
   * 若传参actId，则获取该活动的所有打卡数据；否则，获取所有活动的所有打卡数据
   * 若传参openId，则获取该用户在该活动的所有打卡数据；否则，获取所有用户在该活动的所有打卡数据
   */

  const db = cloud.database(),
    actId = event.actId,
    openId = event.openId;
  // console.log("actId: ", actId);
  // console.log("openId: ", openId);
  let option = null;
  // actId和openId均未定义，即获取全部打卡数据
  if (typeof actId == "undefined" && typeof openId == "undefined") {
    console.log(1);
    option = {};
  }
  // openId定义了但actId未定义，即获取用户openId所有活动的所有打卡数据
  else if (typeof actId == "undefined" && typeof openId != "undefined") {
    console.log(2);
    option = {
      _openid: openId,
    };
  }
  // actId定义了，不管openId是否定义，即获取活动actId的所有打卡数据
  else {
    console.log(3);
    option = {
      actId: actId,
    };
  }

  let length = 0,
    l = 0,
    i = 0;
  while (true) {
    console.log("while(", i, ")");
    l = await db.collection("PunchTable").where(option).skip(i).count();
    console.log("l", l);
    length += l.total; // 累加
    i += 100;

    // 查不到数据了
    if (l.total < 100) {
      console.log("查不到数据了");
      if (typeof event.lengthOnly != "undefined" && event.lengthOnly) {
        console.log("lengthOnly: ", event.lengthOnly, length);
        return length;
      } else {
        console.log("all");
        let totalList = [],
          list = null;
        for (let i = 0; i < length; i += 100) {
          list = await db.collection("PunchTable").where(option).skip(i).get();
          totalList = totalList.concat(list.data);
        }
        return totalList;
      }
    }
  }
};
