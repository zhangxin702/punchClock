// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  const res = await cloud.database().collection("ActTable").get();
  punchData = res.data;

  const title = ["ActId", "OpenID", "ActTheme", "ActContent", "Label", "Requires", "PunchTimes", "Announcement", "CreateTime", "StartTime", "EndTime", "ActImage"];
  let allData = [];

  for (let a in actData) {
    let data = [];
    data.push(a._id);
    data.push(a.openId);
    data.push(a.actTheme);
    data.push(a.actContent);
    data.push(a.label);
    data.push(a.requires);
    data.push(a.punchTimes);
    data.push(a.announcement);
    data.push(a.createTime);
    data.push(a.startTime);
    data.push(a.endTime);
    for (let pic in a.actImages) {
      data.push(pic);
    }
    allData.push(data);
  }

  const buffer = await xlsx.build([
    {
      name: "excel",
      data: allData,
    },
  ]);

  return await cloud.uploadFile({
    cloudPath: "temp/act.xlsx",
    fileContent: buffer,
  });
};
