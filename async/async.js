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

export const getParticipatePunch = (openId) => {
  /**
   * 获取用户参与的活动
   * db: 数据库的引用
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
      cloudPath: cloudPath, // 上传到云存储的路径
      filePath: avatarPath, // 本地文件路径
      success: (res) => {
        avatarUrl = res.data.filePath; // 临时文件路径
        console.log("照片临时路径生成成功√\n", res);
      },
      fail: (err) => {
        console.log("照片临时路径生成失败×\n", err);
        reject(err);
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
// 对参与者
export const getSelfPunchedTimes = (db, openId, actId) => {
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
        console.log("参与者——获取活动信息成功√\n", res);
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
            console.log("参与者——获取所有打卡数据成功√\n", res);
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
            console.log("参与者——获取所有打卡数据失败×\n", err);
            reject(err);
          });
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
          openId: null,
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

export const getSeflMaxLabels = (openId) => {
  /**
   * 统计用户参与得最多的活动标签
   * db: 数据库的引用
   * openId: 用户的唯一标识
   *
   * 返回
   * maxLabels: 返回参与的最多的x个标签，0<=x<=3
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
          userIds = null;

        // 检索所有活动
        for (let i = 0; i < actData.length; i++) {
          userIds = actData[i].userIds; // 获取一个活动的所有参与者
          // 检索这个活动的所有参与者
          for (let j = 0; j < actData[i].userCounts; j++) {
            if (userIds[j] == openId) {
              // console.log("活动", i + 1, "的标签：", actData[i].label);
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

        let countsCopy = counts; // 复制一份标签组，并在对其排序完后保持不变
        countsCopy.sort((a, b) => b - a); // 按从大到小排序
        let max = counts.length > 3 ? 3 : counts.length, // 如果标签数不足3个
          maxLabels = [], // 参与最多的x个标签
          label = null; // 临时存储

        // 逐个获取出现次数最多的几个标签
        for (let i = 0; i < max; i++) {
          label = labels[counts.indexOf(countsCopy[i])];
          //建议加入深拷贝后加入划线的下一句，否则这种索引方式在同值的情况下会出错
          counts[counts.indexOf(countsCopy[i])] = 0; // 保证下一次不会再管它
          maxLabels.push(label);
        }
        resolve(maxLabels);
      })
      .catch((err) => {
        console.log("参与者——获取所有活动信息失败×\n", err);
        reject(err);
      });
  });
};

// 对举办方
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
              openId: userIds[i],
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
        openId: openId,
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
            .where({
              openId: userIds[i],
            })
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
        openId: openId,
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

export const getActHotRankvsSelf = (db, openId) => {
  /**
   * 获取举办的活动名及其在自己举办的所有活动中对应的排名
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
    db.collection("ActTable")
      .where({
        openId: openId,
      })
      .get()
      .then(async (res) => {
        console.log("举办方——获取举办的活动信息成功√\n", res);
        const acts = res.data;
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
              actId: acts[i]._id,
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
        let actUserNumCopy = actUserNum.sort((a, b) => b - a),
          actPunchNumCopy = actPunchNum.sort((a, b) => b - a);
        console.log("活动主题：", actThemes);
        console.log("参与人数：", actUserNum);
        console.log("打卡次数：", actPunchNum);
        for (let i = 0; i < actUserNum.length; i++) {
          actUserRank.push(actUserNumCopy.indexOf(actUserNum[i]) + 1);
          actUserNumCopy[actUserNumCopy.indexOf(actUserNum[i])] = -1;

          actPunchRank.push(actPunchNumCopy.indexOf(actPunchNum[i]) + 1);
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
    db.collection("ActTable")
      .get()
      .then(async (res) => {
        console.log("举办方——获取举办的活动信息成功√\n", res);
        const acts = res.data;
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
        let actUserNumCopy = actUserNum.sort((a, b) => b - a),
          actPunchNumCopy = actPunchNum.sort((a, b) => b - a);
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
