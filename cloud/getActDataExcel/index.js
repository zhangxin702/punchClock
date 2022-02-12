// 云函数入口文件
const cloud = require("wx-server-sdk");
const xlsx = require("node-xlsx");
cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  // 先获取对表格的引用
  const db = cloud.database().collection("ActTable");

  // 再获取活动总数
  let actNum = await db.count();
  actNum = actNum.total;
  let actData = [];

  // 再获取所有活动数据
  for (let i = 0; i < actNum; i += 50) {
    // 先获取用户数据
    let a = await db.skip(i).get();
    a = a.data;

    // 再获取其中的actImage
    let fileList = [];
    for (let j = 0; j < a.length; j++) {
      fileList.push(a[j].actImage);
    }

    // 将FileID转为下载地址
    await cloud
      .getTempFileURL({
        fileList: fileList,
      })
      .then((res) => {
        fileList = res.fileList;
      })
      .catch((err) => {
        return err;
      });

    // 赋值回属性avatarUrl（数据库保持不变）
    for (let j = 0; j < a.length; j++) {
      a[j].actImage = fileList[j].tempFileURL;
    }

    actData = actData.concat(a);
  }
  console.log("actData: ", actData);

  // 准备excel内容
  let allData = [];
  const title = ["ActId", "OpenID", "ActTheme", "ActContent", "Label", "Requires", "PunchTimes", "Announcement", "CreateTime", "StartTime", "EndTime", "ActImage"];
  allData.push(title);

  for (let i = 0; i < actData.length; i++) {
    let a = actData[i],
      data = [];

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
    data.push(a.actImage);
    allData.push(data);
  }

  const buffer = await xlsx.build([
    {
      name: "excel",
      data: allData,
    },
  ]);

  await cloud.uploadFile({
    cloudPath: "temp/act.xlsx",
    fileContent: buffer,
  });

  return true;
};
