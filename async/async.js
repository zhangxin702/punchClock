export const getUserInfo = (openId) => {
  /**
   * 获取用户信息
   * openId: 用户的唯一标识
   */

  return new Promise((resolve, reject) => {
    let db = wx.cloud.database();
    db.collection("UserTable")
      .where({
        openId: openId,
      })
      .get()
      .then((res) => {
        console.log("调取用户信息成功√\n", res);
        resolve(res.data[0]);
      })
      .catch((err) => {
        console.log("调取用户信息失败×\n", res);
        reject(err);
      });
  });
};

export const getParticipateNum = (db) => {
  /**
   * 获取用户参与的活动数量
   * db: 数据库的引用
   */
  return new Promise((resolve, reject) => {
    const $ = db.command.aggregate;
    db.collection("PunchTable") // 统计用户参与的活动的数量
      .aggregate()
      .group({
        _id: "$actId",
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
        openId: openId,
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

export const register = (openId, nickName, gender, selfIntro, avatarPath) => {
  /**
   * 注册用户
   * openId: 用户的唯一标识
   * nickName: 昵称
   * gender: 性别
   * selfIntro: 自我介绍
   * avatarUrl: 头像
   */

  return new Promise((resolve, reject) => {
    const cloudPath = "avatar/" + openId + ".jpg";
    let avatarUrl = null;
    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: avatarPath,
      success: (res) => {
        avatarUrl = res.data.filePath;
        console.log("照片上传成功√");
      },
      fail: (err) => {
        console.log("照片上传失败×");
      },
    });

    let db = wx.cloud.database();
    db.collection("UserTable")
      .add({
        data: {
          openId: openId,
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
        resolve(res);
      })
      .catch((err) => {
        wx.showToast({
          title: "注册失败",
          icon: "fail",
          duration: 100,
        });
        console.log("注册失败×");
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
        console.log("获取定位成功√\n", res);
        const latestTime = new Date().getTime(); // 获取当前时间，单位s
        const { latitude, longitude } = res;
        resolve(latitude, longitude, latestTime);
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
        console.log(res);
        resolve(res);
      },
      fail: (err) => {
        console.log(err);
        reject(err);
      },
    });
  });
};

// 数据分析相关函数
export const countDayNum = (db, actId) => {
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

// 对参与者
export const countPunchedTimes = (db, openId, actId) => {
  /**
   * 统计参与者在一个活动中的打卡情况，并判断是否完成打卡要求
   * db: 数据库的引用
   * openId: 用户的唯一标识
   * actId: 活动的唯一标识
   *
   * 返回
   * isFinish: 是否完成打卡要求
   * punchedTimes: 用户在活动举办期间打卡的次数
   */

  return new Promise(async (resolve, reject) => {
    // 先查询活动的打卡次数要求
    db.collection("ActTable")
      .doc(actId)
      .get()
      .then((res) => {
        console.log("获取活动信息成功√\n", res);
        const { punchTimes } = res.data; // 提取出打卡次数要求
        // 再查询用户的打卡次数
        wx.cloud
          .callFunction({
            name: "getPunchData",
            data: {
              actId: actId,
              openId: openId,
            },
          })
          .then((res) => {
            console.log("获取所有打卡数据成功√\n", res);
            const punchedTimes = res.result.length;
            // 返回数据
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
            console.log("获取所有打卡数据失败×\n", err);
            reject(err);
          });
      })
      .catch((err) => {
        console.log("获取活动信息失败×\n", err);
        reject(err);
      });

    // db.collection("PunchTable")
    //   .where({
    //     openId: openId,
    //     actId: actId,
    //   })
    //   .get()
    //   .then((res) => {
    //     console.log("查询用户的打卡信息成功√\n", res);
    //     const punchedTimes = res.data.length; // 获取已打卡次数
    //     // 已打卡次数不低于活动要求，则视为完成打卡要求
    //     if (punchedTimes >= punchTimes) {
    //       resolve({
    //         isFinish: true,
    //         punchedTimes: punchedTimes,
    //       });
    //       // 已打卡次数低于活动要求，则视为未完成打卡要求
    //     } else {
    //       resolve({
    //         isFinish: false,
    //         punchedTimes: punchedTimes,
    //       });
    //     }
    //   })
    //   .catch((err) => {
    //     reject(err);
    //   });
  });
};

export const getRatioInPunch = (openId, actId) => {
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
          openId: null,
        },
      })
      .then((res) => {
        console.log("获取所有打卡数据成功√\n", res);
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
        console.log("获取所有打卡数据失败×\n", err);
        reject(err);
      });
  });
};

export const countMaxLabels = (db, openId) => {
  /**
   * 统计用户参与得最多的活动标签
   * db: 数据库的引用
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
        let labels = [], // 存储标签名
          counts = [], // 存储标签出现次数
          userIds = null;
        // 检索所有活动
        for (let i = 0; i < actData.length; i++) {
          userIds = actData[i].userIds; // 获取一个活动的所有参与者
          // 检索这个活动的所有参与者
          for (let j = 0; j < actData[i].userCounts; j++) {
            if (userIds[j] == openId) {
              // 将所有标签记录
              for (let k = 0; k < actData[i].label.length; k++) {
                // labels里还没存了这个标签
                if (labels.indexOf(actData[i].label[k]) == -1) {
                  labels.push(actData[i].label[k]);
                  counts.push(1);
                }
                // labels里已经存了这个标签
                else {
                  counts[labels.indexOf(actData[i].label[k])]++;
                }
              }
              break; // 跳出对这个活动的参与者的检索
            }
          }
        }

        let countsCopy = counts; // 复制一份标签组
        countsCopy.sort((a, b) => b - a); // 按从大到小排序
        let max = counts.length > 3 ? 3 : counts.length, // 如果标签数不足3个
          maxLabels = [],
          label = null;
        // 逐个获取出现次数最多的几个标签
        for (let i = 0; i < max; i++) {
          label = labels[counts.indexOf(countsCopy[i])];
          maxLabels.push(label);
        }
        resolve(maxLabels);
      })
      .catch((err) => {
        console.log("获取所有活动信息失败×\n", err);
        reject(err);
      });
  });
};

// // 对举办方
// export const countPunchOneAct = (openId, actId) => {
//   /**
//    * 统计用户在一个活动中的打卡情况，并判断是否完成打卡要求
//    */

//   return new Promise((resolve, reject) => {});
// };

// export const countPunchOneAct = (openId, actId) => {
//   /**
//    * 统计用户在一个活动中的打卡情况，并判断是否完成打卡要求
//    */

//   return new Promise((resolve, reject) => {});
// };
