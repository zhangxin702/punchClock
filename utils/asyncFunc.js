export const getUserInfo = (db, openId) => {
  /**
   * 获取用户信息
   * db: 数据库的引用
   * openId: 用户的唯一标识
   */

  return new Promise((resolve, reject) => {
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
        _id: null,
        acts: $.addToSet("$actId"),
      })
      .end()
      .then((res) => {
        console.log("统计参与活动数量成功√\n", res);
        resolve(res.list[0].acts.length);
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

export const register = (openId, nickName, gender, selfIntro, avatarUrl) => {
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
    wx.cloud.upLoadFile({
      cloudPath: cloudPath,
      filePath: avatarUrl,
      success: (res) => {
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
          avatarUrl: cloudPath,
        },
      })
      .then((res) => {
        wx.showToast({
          title: "注册成功",
          icon: "success",
          duration: 100,
        });
        console.log("注册成功√");
      })
      .catch((err) => {
        wx.showToast({
          title: "注册失败",
          icon: "fail",
          duration: 100,
        });
        console.log("注册失败×");
      });
  });
};
