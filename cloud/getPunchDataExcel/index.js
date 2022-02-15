// 云函数入口文件
const cloud = require("wx-server-sdk");
const xlsx = require("node-xlsx");
cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  // 获取对表格的引用
  const db = cloud.database(),
    { openId, mode } = event;
  let punchData = [];

  // 模式1：查询该用户的所有打卡记录
  if (mode == 1) {
    const option = {
      _openid: openId,
    };

    // 先获取活动总数
    let length = 0,
      l = 0,
      i = 0;
    while (true) {
      l = await db.collection("PunchTable").where(option).skip(i).count();
      length += l.total;
      i += 100;

      if (l.total < 100) {
        break;
      }
    }

    // 再获取用户的所有打卡数据
    let p = null;
    for (i = 0; i < length; i += 100) {
      p = await db.collection("PunchTable").where(option).skip(i).get();
      p = p.data;
      p = await FileIDtoUrl(p); // 将FileID转为下载地址
      punchData = punchData.concat(p);
    }
  }
  // 模式2：查询该用户举办的所有活动的打卡记录
  else {
    // 先获取用户举办的所有活动
    // 先获取数量
    let length = 0,
      l = 0,
      i = 0;
    while (true) {
      l = await db.collection("ActTable").where({ _openid: openId }).skip(i).count();
      length += l.total;
      i += 100;

      if (l.total < 100) {
        break;
      }
    }

    // 再获取活动
    let actData = [],
      a = null;
    for (let i = 0; i < length; i += 100) {
      a = await db.collection("ActTable").where({ _openid: openId }).skip(i).get();
      a = a.data;
      console.log("a: ", a);
      actData = actData.concat(a);
    }
    console.log("length: ", length);
    console.log("actData: ", actData);

    // 再获取每个活动的所有打卡记录
    for (let i = 0; i < actData.length; i++) {
      // // 先获取数量
      // for (let length = 0, l = 0, j = 0; true; j += 100) {
      //   l = await db.collection("PunchTable").where({ actId: actData[i]._id }).skip(j).count();
      //   length += l.total;

      //   if (l.total < 100) {
      //     break;
      //   }
      // }

      // 获取打卡记录
      for (let j = 0; j == 0; j += 100) {
        p = await db.collection("PunchTable").where({ actId: actData[i]._id }).skip(j).get();
        console.log("p: ", p);
        if (p.data.length == 0) {
          break;
        }

        // p = p.data;
        p = await FileIDtoUrl(p.data); // 将FileID转为下载地址
        punchData = punchData.concat(p);
      }
    }
  }

  // 准备excel内容
  let allData = [];
  const title = ["PunchID", "ActID", "OpenID", "PunchContent", "PunchLocation", "PunchFile", "PunchTime", "PunchImages"];
  allData.push(title);

  for (let i = 0; i < punchData.length; i++) {
    let p = punchData[i],
      data = [];
    // console.log("p: ", p);

    data.push(p._id);
    data.push(p.actId);
    data.push(p.openId);
    data.push(p.punchContent);
    if (p.punchLocation == null) {
      data.push(" ");
    } else {
      const location = "(" + p.punchLocation.latitude + ", " + p.punchLocation.longitude + ")";
      data.push(location);
    }
    data.push(p.punchFile);
    data.push(p.punchTime);
    for (let j = 0; j < p.punchImages.length; j++) {
      data.push(p.punchImages[j]);
    }
    // console.log("data: ", data);
    allData.push(data);
  }
  // console.log("allData: ", allData);

  const buffer = await xlsx.build([
    {
      name: "excel",
      data: allData,
    },
  ]);

  await cloud.uploadFile({
    cloudPath: "temp/punch.xlsx",
    fileContent: buffer,
  });

  return true;
};

async function FileIDtoUrl(punchData) {
  /**
   * 将打卡原始数据中的所有的文件的云存储fileID转为下载地址url
   * punchData: 打卡原始数据，最大长度50
   */

  let count = 0, // 记录fileList的长度
    fileList = [];

  // 先转换punchImages
  try {
    for (let i = 0; i < punchData.length; i++) {
      // 保证每次转数总数不超过50（getTempFileURL的上限）
      if (count + punchData[i].punchImages.length) {
        for (let j = 0; j < punchData[i].punchImages.length; j++) {
          fileList.push(punchData[i].punchImages[j]);
          count++;
        }
      }
      // 逼近上限时，转换
      else {
        // 转换
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

        // 逐个punchData回填
        for (let j = i - count; j < count; j++) {
          let c = 0;
          // 逐个punchImages回填
          for (let k = 0; k < punchData[j].punchImages.length; k++) {
            punchData[j].punchImages[k] = fileList[c++].tempFileURL;
          }
        }
        count = 0;
        fileList = [];
      }
    }

    // 剩余但未逼近上限的，转换
    // 转换
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
    // 回填
    // 逐个punchData回填
    for (let j = punchData.length - count; j < count; j++) {
      let c = 0;
      // 逐个punchImages回填
      for (let k = 0; k < punchData[j].punchImages.length; k++) {
        punchData[j].punchImages[k] = fileList[c++].tempFileURL;
      }
    }
  } catch (err) {
    console.log("err in images: ", err);
  }

  count = 0;
  fileList = [];
  // 在转换punchFiles
  try {
  } catch (err) {
    console.log("err in files: ", err);
  }

  return punchData;
}
