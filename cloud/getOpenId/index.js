// 云函数入口文件
// const cloud = require("wx-server-sdk");

// cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  // 通过云函数获取用户的openId，无需传参

  // let openId = cloud.getWXContext().openId;
  const openId = event.userInfo.openId;
  // console.log("event: ", event);
  // console.log("cloud.getWXContext(): ", cloud.getWXContext());
  // console.log("openId: ", openId);
  return openId;
};
