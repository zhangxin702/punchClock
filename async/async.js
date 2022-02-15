export const getOpenId = () => {
  /**
   * 获取用户OpenId
   */
  return new Promise((resolve, reject) => {
    wx.cloud // 先获取该用户的openId
      .callFunction({
        name: "getOpenId",
      })
      .then((res) => {
        console.log("res: ", res);
        resolve(res.result);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getUserInfo = (openId) => {
  wx.showLoading({
    title: "加载中",
    mask: true,
  });
  /**
   * 获取用户信息
   * openId: 用户的唯一标识
   */

  return new Promise((resolve, reject) => {
    let db = wx.cloud.database();
    db.collection("UserTable")
      .doc(openId)
      .get()
      .then((res) => {
        wx.hideLoading();
        console.log("调取用户信息成功√\n", res);
        resolve(res.data);
      })
      .catch((err) => {
        wx.hideLoading();
        // console.log("调取用户信息失败×\n", err);
        console.log("查无此人，新用户");
        resolve();
      });
  });
};

export const getParticipateNum = (db, openId) => {
  /**
   * 获取用户参与的活动数量
   * db: 数据库的引用
   */

  return new Promise((resolve, reject) => {
    const $ = db.command.aggregate;
    db.collection("PunchTable") // 统计用户参与的活动的数量
      .aggregate()
      .match({
        _openid: openId,
      })
      .group({
        _id: "$actId",
        count: $.sum(1),
      })
      .end()
      .then((res) => {
        console.log("统计参与活动数量成功√\n", res);
        resolve(res.list.length);
      })
      .catch((err) => {
        console.log("统计参与的活动数量失败×\n", err);
        reject(err);
      });
  });
};

export const getOrganizeNum = (db, openId) => {
  /**
   * 获取用户组织的活动的数量
   * db: 数据库的引用
   * openId: 用户的唯一标识
   */

  return new Promise((resolve, reject) => {
    db.collection("ActTable") // 统计用户组织的活动的数量
      .where({
        _openid: openId,
      })
      .get()
      .then((res) => {
        console.log("统计组织的活动数量成功√\n", res);
        resolve(res.data.length);
      })
      .catch((err) => {
        console.log("统计组织的活动数量失败×\n", err);
        reject(err);
      });
  });
};

export const getParticipatePunch = (openId) => {
  /**
   * 获取用户参与的活动
   * openId: 用户的唯一标识
   */

  return new Promise((resolve, reject) => {
    wx.cloud
      .callFunction({
        name: "getActData",
      })
      .then((res) => {
        console.log("获取所有活动信息成功√\n", res);
        const actData = res.result;

        // 对所有活动数据进行分析
        let actList = [], // 存储活动
          userIds = null;
        // 检索所有活动
        for (let i = 0; i < actData.length; i++) {
          userIds = actData[i].userIds; // 获取一个活动的所有参与者
          // 检索这个活动的所有参与者
          for (let j = 0; j < actData[i].userCounts; j++) {
            if (userIds[j] == openId) {
              actList.push(actData[i]);
              break;
            }
          }
        }
        resolve(actList);
      })
      .catch((err) => {
        console.log("获取所有活动信息失败×\n", err);
        reject(err);
      });
  });
};

export const getOrganizePunch = (openId) => {
  /**
   * 获取用户参与的活动
   * openId: 用户的唯一标识
   */

  return new Promise((resolve, reject) => {
    wx.cloud
      .callFunction({
        name: "getActData",
      })
      .then((res) => {
        console.log("获取所有活动信息成功√\n", res);
        const actData = res.result;

        // 对所有活动数据进行分析
        let actList = [], // 存储活动
          organizeId = null;
        // 检索所有活动
        for (let i = 0; i < actData.length; i++) {
          organizeId = actData[i]._openid; // 获取一个活动的组织者
          // 检索这个活动的所有组织者
          if (organizeId == openId) {
            actList.push(actData[i]);
          }
        }
        resolve(actList);
      })
      .catch((err) => {
        console.log("获取所有活动信息失败×\n", err);
        reject(err);
      });
  });
};

export const register = (openId, nickName, gender, selfIntro, avatarPath) => {
  /**
   * 注册用户
   * openId: 用户的唯一标识
   * nickName: 昵称
   * gender: 性别
   * selfIntro: 自我介绍
   * avatarPath: 头像文件的临时路径
   */

  return new Promise((resolve, reject) => {
    wx.cloud
      .uploadFile({
        cloudPath: "avatar/" + openId + ".jpg", // 上传到云存储的路径
        filePath: avatarPath, // 临时路径
      })
      .then((res) => {
        console.log(res);
        const avatarUrl = res.fileID; // 云存储的路径
        console.log("照片云存储路径生成成功√\n", res);

        const db = wx.cloud.database();
        db.collection("UserTable")
          .add({
            data: {
              _id: openId,
              nickName: nickName,
              gender: gender,
              selfIntro: selfIntro,
              avatarUrl: avatarUrl,
            },
          })
          .then((res) => {
            wx.showToast({
              title: "注册成功",
              icon: "success",
              duration: 100,
            });
            console.log("注册成功√");
            const userInfo = {
              _id: openId,
              nickName: nickName,
              gender: gender,
              selfIntro: selfIntro,
              avatarUrl: avatarUrl,
            };
            resolve(userInfo);
          })
          .catch((err) => {
            wx.showToast({
              title: "注册失败",
              icon: "fail",
              duration: 100,
            });
            console.log("注册失败×");
            reject(false);
          });
      })
      .catch((err) => {
        console.log("照片云存储路径生成失败×\n", err);
        reject(err);
      });
  });
};

export const getLocation = () => {
  /**
   * 获取当前的定位信息，并避频繁获取
   */

  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: "wgs84",
      altitude: true,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        console.log("获取定位失败×\n", err);
        const currentTime = new Date().getTime(); // 获取时间，单位ms
        const interval = (currentTime - this.data.latestTime) / 1000; // 计算距离上次获取定位的时间间隔，单位s
        const title = "您的定位获取过于频繁，请在" + (30 - interval).toFixed(0).toString() + "s后再尝试";
        wx.showToast({
          title: title,
          icon: "none",
          duration: 1500,
        });
      },
    });
  });
};

export const chooseLocation = () => {
  /**
   * 选择定位信息
   */

  return new Promise((resolve, reject) => {
    wx.chooseLocation({
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

// 对参与者的数据分析相关函数
export const getSelfPunchedTimes = (db, openId, actId, punchData) => {
  /**
   * 统计参与者在一个活动中的打卡情况，并判断是否完成打卡要求
   * db: 数据库的引用
   * openId: 用户的唯一标识
   * actId: 活动的唯一标识
   * punchData: 若指定，则在punchData范围内分析
   *
   * 返回
   * isFinish: 是否完成打卡要求
   * punchedTimes: 用户在活动举办期间打卡的次数
   */

  return new Promise((resolve, reject) => {
    // 先查询活动的打卡次数要求
    db.collection("ActTable")
      .doc(actId)
      .get()
      .then((res) => {
        // console.log("参与者——获取活动信息成功√\n", res);
        const { punchTimes } = res.data; // 提取出打卡次数要求

        // 若未指定punchData，则要先获得
        if (!punchData) {
          wx.cloud
            .callFunction({
              name: "getPunchData",
              data: {
                actId: actId,
                _openid: openId,
              },
            })
            .then((res) => {
              punchData = res.result;
            });
        }

        let punchedTimes = 0;
        for (let i = 0; i < punchData.length; i++) {
          if (punchData[i].actId == actId) {
            punchedTimes++;
          }
        }
        if (punchedTimes >= punchTimes) {
          resolve({
            isFinish: true,
            punchedTimes: punchedTimes,
          });
          // 已打卡次数低于活动要求，则视为未完成打卡要求
        } else {
          resolve({
            isFinish: false,
            punchedTimes: punchedTimes,
          });
        }
      })
      .catch((err) => {
        console.log("参与者——获取活动信息失败×\n", err);
        reject(err);
      });
  });
};

export const getSelfPunchedRank = (openId, actId) => {
  /**
   * 统计参与者在一个活动中相较于其它参与者的打卡情况
   * db: 数据库的引用
   * openId: 用户的唯一标识
   * actId: 活动的唯一标识
   *
   * 返回
   * rank: 该参与者打卡次数超过百分之多少的人
   */

  return new Promise((resolve, reject) => {
    // 获取所有的打卡数据
    wx.cloud
      .callFunction({
        name: "getPunchData",
        data: {
          actId: actId,
          _openid: null,
        },
      })
      .then((res) => {
        console.log("参与者——获取所有打卡数据成功√\n", res);
        const punchData = res.result;
        // 对所有打卡数据进行分析
        let punchTimes = [], // 存储每个用户的打卡次数
          openIds = []; // 存储每个用户的openId
        for (let i = 0; i < punchData.length; i++) {
          openId = punchData[i].openId;
          if (openIds.indexOf(openId) == -1) {
            openIds.push(openId); // 新增
            punchTimes.push(1); // 计数1
          } else {
            punchTimes[openIds.indexOf(openId)]++; // 自增
          }
        }

        const punchTime = punchTimes[openIds.indexOf(openId)]; // 获得该用户在该活动的打卡次数
        punchTimes.sort((a, b) => b - a); // 按从大到小排序
        let rank = 0.0;
        for (let j = 0; j < punchTimes.length; j++) {
          if (punchTimes[j] <= punchTime) {
            rank = (punchTimes.length - j) / punchTimes.length; // 计算超过了百分之多少的人
            resolve(rank);
          }
        }
      })
      .catch((err) => {
        console.log("参与者——获取所有打卡数据失败×\n", err);
        reject(err);
      });
  });
};

export const getSelfLabels = (openId, max) => {
  /**
   * 统计用户参与得最多的活动标签
   * db: 数据库的引用
   * openId: 用户的唯一标识
   * max: 返回的标签个数，-1表示全部
   *
   * 返回
   * maxLabels: 返回标签
   */

  return new Promise((resolve, reject) => {
    console.log(openId);
    wx.cloud
      .callFunction({
        name: "getActData",
      })
      .then((res) => {
        console.log("参与者——获取所有活动信息成功√\n", res);
        const actData = res.result;
        // 对所有活动数据进行分析
        let labels = [], // 存储标签名
          counts = [], // 存储标签出现次数
          userIds = null,
          sum = 0; //总的已参与数量

        // 检索所有活动
        for (let i = 0; i < actData.length; i++) {
          // console.log("actData[", i, "]: ", actData[i]);
          userIds = actData[i].userIds; // 获取一个活动的所有参与者
          // 检索这个活动的所有参与者
          for (let j = 0; j < actData[i].userCounts; j++) {
            // 看是否有该用户的openId
            if (userIds[j] == openId) {
              // console.log("活动", i, "：", actData[i].userIds);
              // 将标签记录
              if (labels.indexOf(actData[i].label) == -1) {
                labels.push(actData[i].label);
                counts.push(1);
              } else {
                counts[labels.indexOf(actData[i].label)]++;
              }

              // for (let k = 0; k < actData[i].label.length; k++) {
              //   // labels里还没存了这个标签
              //   if (labels.indexOf(actData[i].label[k]) == -1) {
              //     labels.push(actData[i].label[k]);
              //     counts.push(1);
              //   }
              //   // labels里已经存了这个标签
              //   else {
              //     counts[labels.indexOf(actData[i].label[k])]++;
              //   }
              // }
              sum++;
              break; // 跳出对这个活动的参与者的检索
            }
          }
        }
        // console.log("labels: ", labels);
        // console.log("counts: ", counts);

        let countsCopy = JSON.parse(JSON.stringify(counts)); // 复制一份标签组，并在对其排序完后保持不变
        countsCopy.sort((a, b) => b - a); // 按从大到小排序

        let maxLabels = [],
          labelNum = [], //纪录每个标签的数量
          label = null, // 临时存储
          otherSum = 0;
        if (max == -1 || max > counts.length) {
          max = counts.length;
        }

        console.log("max: ", max);
        // 逐个获取出现次数最多的几个标签
        for (let i = 0; i < max; i++) {
          label = labels[counts.indexOf(countsCopy[i])];
          console.log(label);
          //建议加入深拷贝后加入划线的下一句，否则这种索引方式在同值的情况下会出错
          counts[counts.indexOf(countsCopy[i])] = 0; // 保证下一次不会再管它
          otherSum += countsCopy[i]; //临时存储，最后用上面的sum减去他

          maxLabels.push(label);
          labelNum.push(countsCopy[i]);
        }
        // if (counts.length > 3) {
        //   labels.push("其他");
        //   otherSum = sum - otherSum;
        //   labelNum.push(otherSum);
        // }
        resolve({
          maxLabels: maxLabels,
          labelNum: labelNum,
        });
      })
      .catch((err) => {
        console.log("参与者——获取所有活动信息失败×\n", err);
        reject(err);
      });
  });
};

// 对举办方的数据分析相关函数
export const getActPunchedTimes = (db, actId) => {
  /**
   * 统计一个活动中所有用户的打卡情况，并判断是否完成打卡要求
   * db: 数据库的引用
   * actId: 活动的唯一标识
   *
   * 返回
   * isFinish: 是否完成打卡要求的数组
   * punchedTimes: 用户在活动举办期间打卡的次数的数组
   */

  return new Promise((resolve, reject) => {
    db.collection("ActTable")
      .doc(actId)
      .get()
      .then(async (res) => {
        console.log("举办方——获取活动信息成功√\n", res);
        const { punchTimes, userIds } = res.data; // 获取要求的打卡次数和参与的所有用户id
        let isFinish = [],
          punchedTimes = [];

        // 对每个用户的所有打卡记录进行检索
        for (let i = 0; i < userIds.length; i++) {
          await db
            .collection("PunchTable")
            .where({
              _openid: userIds[i],
              actId: actId,
            })
            .get()
            .then((res) => {
              console.log("举办方——获取用户", userIds[i], "的打卡数据成功√\n", res);
              punchedTimes.push(res.data.length);
              if (res.data.length >= punchTimes) {
                isFinish.push(true);
              } else {
                isFinish.push(false);
              }
            })
            .catch((err) => {
              console.log("举办方——获取用户", userIds[i], "的打卡数据失败×\n", err);
              reject(err);
            });
        }
        console.log("isFinish: ", isFinish);
        console.log("punchedTimes: ", punchedTimes);
        resolve({
          isFinish: isFinish,
          punchedTimes: punchedTimes,
        });
      })
      .catch((err) => {
        console.log("举办方——获取活动信息失败×\n", err);
        reject(err);
      });
  });
};

export const getActUserGender = (db, openId, actId = null) => {
  /**
   * 获取参与活动的用户的性别比
   * db: 数据库的引用
   * openId: 用户的唯一标识
   * actId: 活动的唯一标识
   *
   * 返回
   * gender: gender[0]记录男性的人数，gender[1]记录女性的人数
   */

  return new Promise((resolve, reject) => {
    db.collection("ActTable")
      .where({
        _id: actId,
        _openid: openId,
      })
      .get()
      .then(async (res) => {
        console.log("举办方——获取活动信息成功√\n", res);
        const { userIds } = res.data[0]; // 获取所有参与者的openId
        let gender = [];
        gender.push(0);
        gender.push(0);

        // 逐个用户进行检索
        for (let i = 0; i < userIds.length; i++) {
          await db
            .collection("UserTable")
            .doc(userIds[i])
            .get()
            .then((res) => {
              console.log("举办方——获取用户信息成功√\n", res);
              gender[res.data[0].gender]++; // 对应性别计数
            })
            .catch((err) => {
              console.log("举办方——获取用户信息失败×\n", err);
              reject(err);
            });
        }
        resolve(gender);
      })
      .catch((err) => {
        console.log("举办方——获取活动信息失败×\n", err);
        reject(err);
      });
  });
};

export const countActHeldDays = (db, actId) => {
  /**
   * 统计活动到目前为止举办的天数
   * db: 数据库的引用
   * actId: 活动的唯一标识
   *
   * 返回
   * isStart: 该活动是否已开始
   * dayNum: 活动到目前为止举办的天数
   */

  return new Promise((resolve, reject) => {
    // 获取活动信息
    db.collection("ActTable")
      .doc(actId)
      .get()
      .then((res) => {
        console.log("获取活动信息成功√\n", res);
        let { startTime, endTime } = res.data;
        startTime = startTime.getTime(); // 将开始时间转成毫秒
        endTime = endTime.getTime(); // 将结束时间转成毫秒
        const currentTime = new Date().getTime(); // 将当前时间转成毫秒
        if (currentTime < startTime) {
          // 活动尚未开始
          resolve({
            isStart: false,
          });
        } else {
          // 活动已经开始
          let dayNum = 0;
          if (currentTime <= endTime) {
            dayNum = (currentTime - startTime) / 1000 / 600 / 600 / 24; // 转为天数
          } else {
            dayNum = (currentTime - endTime) / 1000 / 600 / 600 / 24; // 转为天数
          }
          resolve({
            isStart: true,
            dayNum: (dayNum + 1).toFixed(0), // 取整
          });
        }
      });
  });
};

export const countActHeldNum = (db, openId) => {
  /**
   * 获取用户举办的活动数量
   * db: 数据库的引用
   * openId: 用户的唯一标识
   *
   * 返回
   * actNum: 活动数
   */

  return new Promise((resolve, reject) => {
    db.collection("ActTable")
      .where({
        _openid: openId,
      })
      .get()
      .then((res) => {
        console.log("举办方——获取活动信息成功√\n", res);
        const actNum = res.data.length;
        resolve(actNum);
      })
      .catch((err) => {
        console.log("举办方——获取活动信息失败×\n", err);
        reject(err);
      });
  });
};

function quickSort(arr, left, right) {
  /**
   * 快速排序，仅用于排名运算
   * arr: 数组，每一个元素为一个字典
   */

  var len = arr.length,
    partitionIndex = 0;

  if (left < right) {
    partitionIndex = partition(arr, left, right);
    quickSort(arr, left, partitionIndex - 1);
    quickSort(arr, partitionIndex + 1, right);
  }
}

function partition(arr, left, right) {
  let pivot = left,
    index = pivot + 1;
  for (let i = index; i <= right; i++) {
    if (arr[i].v < arr[pivot].v) {
      swap(arr, i, index);
      index++;
    }
  }
  swap(arr, pivot, index - 1);
  return index - 1;
}

function swap(arr, i, j) {
  const t = arr[i];
  arr[i] = arr[j];
  arr[j] = t;
}

export const getActHotRankvsSelf = (db, openId) => {
  /**
   * 获取举办的活动名及其在自己举办的所有活动中对应的排名
   * db: 数据库的引用
   * openId: 用户的唯一标识
   *
   * 返回
   * themesByUserNum: 根据参与人数排序的活动主题数组
   * userNum: 排序后的参与人数数组
   * themesByPunchNum: 根据打卡次数排序的活动主题数组
   * punchNum: 排序后的打卡次数数组
   *
   * ps
   * 配合countActHeldNum可以展示成“x/y”的形式
   */

  return new Promise((resolve, reject) => {
    wx.cloud
      .callFunction({
        name: "getActData",
        data: {
          openId: openId,
        },
      })
      .then(async (res) => {
        console.log("举办方——获取举办的活动信息成功√\n", res);
        const acts = res.result;
        let actThemes = [],
          actUserNum = [], // 参与人数
          actUserRank = [], // 参与人数排名
          actPunchNum = [], // 打卡次数
          actPunchRank = []; // 打卡次数排名

        //
        for (let i = 0; i < acts.length; i++) {
          actThemes.push(acts[i].actTheme); // 记录活动主题
          actUserNum.push(acts[i].userCounts); // 记录参与人数

          await db
            .collection("PunchTable")
            .where({
              actId: acts[i]._id,
            })
            .get()
            .then((res) => {
              // console.log("举办方——获取打卡数据成功√\n", res);
              actPunchNum.push(res.data.length); // 记录打卡次数
            })
            .catch((err) => {
              // console.log("举办方——获取打卡数据失败×\n", err);
              reject(err);
            });
        }
        console.log("活动主题（原始数据）：", actThemes);
        console.log("参与人数（原始数据）：", actUserNum);
        console.log("打卡次数（原始数据）：", actPunchNum);

        let dict1 = [],
          dict2 = [];
        // 将活动主题分别与参与人数和打卡次数绑定
        for (let i = 0; i < actThemes.length; i++) {
          dict1.push({ n: actThemes[i], v: actUserNum[i] });
          dict2.push({ n: actThemes[i], v: actPunchNum[i] });
        }

        // 快速排序
        quickSort(dict1, 0, actThemes.length - 1);
        quickSort(dict2, 0, actThemes.length - 1);

        let themesByUserNum = [],
          userNum = [],
          themesByPunchNum = [],
          punchNum = [];
        // 解绑
        for (let i = 0; i < actThemes.length; i++) {
          themesByUserNum.push(dict1[i].n);
          userNum.push(dict1[i].v);
          themesByPunchNum.push(dict2[i].n);
          punchNum.push(dict2[i].v);
        }

        resolve({
          themesByUserNum: themesByUserNum,
          userNum: userNum,
          themesByPunchNum: themesByPunchNum,
          punchNum: punchNum,
        });
      })
      .catch((err) => {
        console.log("举办方——获取举办的活动信息失败×\n", err);
        reject(err);
      });
  });
};

//真的建议打卡排名还有参与人数排名分成两部分写，用orderby desc不是更好，可以参考index里的函数actTableGetAll
//这样写的话一次只能获取二十个数据，也只是在这20个数据里排一次序。
export const getActHotRankvsAll = (db, openId) => {
  /**
   * 获取举办的活动名及其在所有活动中对应的排名
   * db: 数据库的引用
   * openId: 用户的唯一标识
   *
   * 返回
   * actThemes: 活动主题数组
   * actUserRank: 活动参与人数排名数组
   * actPunchRank: 活动打卡数排名数组
   *
   * ps
   * 配合countActHeldNum可以展示成“x/y”的形式
   */

  return new Promise((resolve, reject) => {
    wx.cloud
      .callFunction({
        name: "getActData",
        data: {
          _openid: openId,
        },
      })
      .then(async (res) => {
        console.log("举办方——获取举办的活动信息成功√\n", res);
        const acts = res.result;
        let actThemes = [],
          actUserNum = [], // 参与人数
          actUserRank = [], // 参与人数排名
          actPunchNum = [], // 打卡次数
          actPunchRank = []; // 打卡次数排名

        //
        for (let i = 0; i < acts.length; i++) {
          actThemes.push(acts[i].actTheme);
          actUserNum.push(acts[i].userCounts);

          await db
            .collection("PunchTable")
            .where({
              _id: acts[i]._id,
            })
            .get()
            .then((res) => {
              console.log("举办方——获取打卡数据成功√\n", res);
              actPunchNum.push(res.data.length);
            })
            .catch((err) => {
              console.log("举办方——获取打卡数据失败×\n", err);
              reject(err);
            });
        }

        // 排位
        let actUserNumCopy = JSON.parse(JSON.stringify(actUserNum.sort((a, b) => b - a))),
          actPunchNumCopy = JSON.parse(JSON.stringify(actUserNum.sort((a, b) => b - a)));
        console.log("活动主题：", actThemes);
        console.log("参与人数：", actUserNum);
        console.log("打卡次数：", actPunchNum);
        for (let i = 0; i < actUserNum.length; i++) {
          actUserRank.push(actUserNumCopy.indexOf(actUserNum[i]));
          actUserNumCopy[actUserNumCopy.indexOf(actUserNum[i])] = -1;

          actPunchRank.push(actPunchNumCopy.indexOf(actPunchNum[i]));
          actPunchNumCopy[actPunchNumCopy.indexOf(actPunchNum[i])] = -1;
        }

        resolve({
          actThemes: actThemes,
          actUserRank: actUserRank,
          actPunchRank: actPunchRank,
        });
      })
      .catch((err) => {
        console.log("举办方——获取举办的活动信息失败×\n", err);
        reject(err);
      });
  });
};

// 其它
export const uploadProblem = (text, imagePaths) => {
  /**
   * 上传用户的反馈
   * openId: 用户的唯一标识
   * context: 反馈的文本内容
   * imagePath: 图片路径数组
   */

  return new Promise((resolve, reject) => {
    // let date = new Date();
    let cloudPaths = [];
    for (let i = 0; i < imagePaths.length; i++) {
      cloudPaths.push("feedback/" + imagePaths[i].substr(11, imagePaths[i].length - 4) + i + ".png");
    }
    console.log("imagePaths: ", imagePaths);
    console.log("cloudPaths: ", cloudPaths);

    // 先把临时文件上传到云存储
    for (let i = 0; i < imagePaths.length; i++) {
      wx.cloud
        .uploadFile({
          cloudPath: cloudPaths[i],
          filePath: imagePaths[i],
        })
        .then((res) => {
          console.log("上传图片到云存储成功\n", res);
        })
        .catch((err) => {
          console.log("上传图片到云存储失败×\n", err);
          reject(err);
        });
    }

    // 再把临时文件上传到服务器
    const db = wx.cloud.database();
    db.collection("ProbTable")
      .add({
        data: {
          text: text,
          imagePath: cloudPaths,
        },
      })
      .then((res) => {
        console.log("上传问题反馈成功√\n", res);

        wx.showToast({
          title: "反馈已发送",
        });
        wx.navigateBack({
          delta: 1,
        });
        resolve(res);
      })
      .catch((err) => {
        console.log("上传问题反馈失败×\n", err);
        reject(err);
      });
  });
};

// export const getActTableByCollect=({collect,skip,limit}) => {
//   wx.showLoading({
//     title: '加载中',
//     mask: true,
//   })
//   return new Promise((resolve, reject) => {
//     var db =wx.cloud.database().collection('ActTable');
//     var actList=[];//如果是大于直接返回空数组
//     if(skip>=collect.length){
//       wx.showToast({title: '没有更多数据啦',});
//       resolve(actList);
//     }else{
//       let max = skip + limit;//for循环的最大值
//       if(max > collect.length){
//         max = collect.length;
//       }
//       for(let i=skip; i<max; i++){
//         let actId = collect[i];
//         db.doc(actId)
//         .get()
//         .then((res) => {
//             actList = actList.concat(res.data);
//             console.log(actList);
//             console.log("获取用户的收藏成功√\n", res);
//         })
//         .catch((err) => {
//           wx.hideLoading()
//           console.log("获取用户的收藏失败×\n", err);
//           reject(err);
//         })
//       }
//       console.log("actList",actList);
//       wx.hideLoading();
//       resolve(actList);
//     }
//   })
// }

export const getCollect = (openId) => {
  /**
   * 获取收藏的活动id
   */

  return new Promise((resolve, reject) => {
    const db = wx.cloud.database();
    db.collection("UserTable")
      .doc(openId)
      .get()
      .then((res) => {
        console.log("获取用户的收藏成功√\n", res);
        const { collect } = res.data;
        resolve(collect);
      })
      .catch((err) => {
        console.log("获取用户的收藏失败×\n", err);
        reject(err);
      });
  });
};

export const getPunchAll = (order, skip, limit, openId) => {
  /**
   * 获取打卡记录
   * order: order为0表示获取我的打卡记录，1表示获取我举办的活动的打卡记录
   * skip: 表示跳过多少条数据
   * limit: 获取上限
   * openId: 用户的唯一标识
   */

  wx.showLoading({
    title: "加载中",
    mask: true,
  });

  return new Promise((resolve, reject) => {
    var db = wx.cloud.database();
    // 打卡的是openId对应的用户
    if (order == 0) {
      db.collection("PunchTable")
        .where({
          _openid: openId,
        })
        .skip(skip)
        .limit(limit)
        .get()
        .then(async (res) => {
          console.log("获取openId对应的用户的打卡数据成功√\n", res);

          if (res.data.length === 0) {
            wx.showToast({ title: "没有更多数据啦" });
            resolve([]);
          }

          const punchData = res.data;
          for (let i = 0; i < punchData.length; i++) {
            await db
              .collection("ActTable")
              .doc(punchData[i].actId)
              .get()
              .then((res) => {
                punchData[i].actTheme = res.data.actTheme;
              })
              .catch((err) => {
                reject(err);
              });
          }
          resolve(punchData);
        })
        .catch((err) => {
          console.log("获取openId对应的用户的打卡数据失败×\n", err);
          reject(err);
        });
    }
    // 活动是openId对应的用户举办的
    else if (order == 1) {
      db.collection("ActTable")
        .where({
          _openid: openId,
        })
        .get()
        .then(async (res) => {
          console.log("获取openId对应的用户举办的活动数据成功√\n", res);
          const actData = res.data;

          let punchData = [];
          for (let i = 0; i < actData.length; i++) {
            // 没有用户打了卡
            if (actData[i].userIds.length == 0) {
              continue;
            }

            // 有用户打卡
            await db
              .collection("PunchTable")
              .where({
                actId: actData[i]._id, // 查这个actId的打卡记录
              })
              .skip(skip)
              .limit(3) // 如果遵循limit的9的话，所有活动加在一起会获取到很多数据
              .get()
              .then((res) => {
                punchData = punchData.concat(res.data);
              })
              .catch((err) => {
                reject(err);
              });
          }

          resolve(punchData);
        })
        .catch((err) => {
          reject(err);
        });
    }
    wx.hideLoading();
  });
};

export const getActTheme = () => {
  /**
   * 获取一个能将actId转为actTheme的字典
   */

  return new Promise((resolve, reject) => {
    wx.cloud
      .callFunction({
        name: "getActData",
      })
      .then((res) => {
        const actData = res.result;
        let dict = {};
        for (let i = 0; i < actData.length; i++) {
          dict[actData[i]._id] = actData[i].actTheme; // 形成_id即actId到actTheme的映射
        }
        resolve(dict);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
