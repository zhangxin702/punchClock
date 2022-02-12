// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const res = await cloud.database().collection("PunchTable").get();
  punchData = res.data;

  const title = ["PunchID", "ActID", "OpenID", "PunchContent", "PunchImages", "PunchLocation", "PunchFile", "PunchTime"];
  let allData = [];

  for (let p in punchData) {
    let data = [];
    data.push(p._id);
    data.push(p.actId);
    data.push(p.openId);
    data.push(p.punchContent);
    data.push(p.punchLocation);
    data.push(p.punchFile);
    data.push(p.punchTime);
    for(let pic in p.punchImages)
    {
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
    cloudPath: "temp/punch.xlsx",
    fileContent: buffer,
  });
}