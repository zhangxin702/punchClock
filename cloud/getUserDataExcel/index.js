// 云函数入口文件
const cloud = require("wx-server-sdk");
const xlsx = require("node-xlsx");
cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  // 先获取对表格的引用
  const db = cloud.database().collection("UserTable");

  // 再获取用户总数
  let userNum = await db.count();
  userNum = userNum.total;
  let userData = [];

  // 再获取所有用户数据
  for (let i = 0; i < userNum; i += 50) {
    // 先获取用户数据
    let u = await db.skip(i).get();
    u = u.data;
    // console.log("u: ", u); // 正确

    // 再获取其中的avatarUrl
    let fileList = [];
    for (let j = 0; j < u.length; j++) {
      fileList.push(u[j].avatarUrl);
    }
    // console.log("fileList: ", fileList);  // 正确

    // 将FileID转为下载地址
    await cloud
      .getTempFileURL({
        fileList: fileList,
      })
      .then((res) => {
        // console.log("res: ", res);
        fileList = res.fileList;
      })
      .catch((err) => {
        return err;
      });

    // 赋值回属性avatarUrl（数据库保持不变）
    for (let j = 0; j < u.length; j++) {
      u[j].avatarUrl = fileList[j].tempFileURL;
    }
    // console.log("u: ", u); // 正确

    userData = userData.concat(u);
    // console.log("userData: ", userData);
  }
  console.log("userData: ", userData);

  // 准备excel内容
  let allData = [];
  const title = ["OpenID", "NickName", "Gender", "SelfIntro", "AvatarUrl"];
  allData.push(title);

  // console.log("userData: \n", userData);
  for (let i = 0; i < userData.length; i++) {
    let u = userData[i], // 原数据（一行）
      data = []; // 存表格数据（一行）

    data.push(u._id);
    data.push(u.nickName);
    if (u.gender == 0) {
      data.push("男");
    } else {
      data.push("女");
    }
    data.push(u.selfIntro);
    data.push(u.avatarUrl);
    allData.push(data); // 一行表格数据完成
  }
  console.log("allData: ", allData);

  const buffer = await xlsx.build([
    {
      name: "excel",
      data: allData,
    },
  ]);

  await cloud.uploadFile({
    cloudPath: "temp/user.xlsx",
    fileContent: buffer,
  });

  return true;
};
