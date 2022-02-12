// 云函数入口文件
const cloud = require("wx-server-sdk");
const xlsx = require("node-xlsx");
cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  const res = await cloud.database().collection("UserTable").get();
  userData = res.data;

  let allData = [];
  const title = ["OpenID", "NickName", "Gender", "SelfIntro", "AvatarUrl"];
  allData.push(title);

  console.log("userData: \n", userData);
  for (let i = 0; i < userData.length; i++) {
    u = userData[i];
    console.log("u: \n", u);
    let data = [];
    data.push(u._id);
    console.log("u._id: \n", u._id);
    data.push(u["nickName"]);
    if (u.gender == 0) {
      data.push("男");
    } else {
      data.push("女");
    }
    data.push(u.selfIntro);
    data.push(u.avatarUrl);
    allData.push(data);
  }

  const buffer = await xlsx.build([
    {
      name: "excel",
      data: allData,
    },
  ]);

  return await cloud.uploadFile({
    cloudPath: "temp/user.xlsx",
    fileContent: buffer,
  });
};
