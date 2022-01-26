// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  // 通过云函数获取用户的openId
  let openId = cloud.getWXContext().openId;

  return openId;
};