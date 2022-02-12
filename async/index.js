export const actTableGetAll = ({ order, skip, limit }) => {
  wx.showLoading({
    title: '加载中',
    mask: true,
  });
  return new Promise((resolve, reject) => {
    var db = wx.cloud.database().collection('ActTable');
    if (order == 0) {
      db = db.orderBy('createTime', 'desc');
    } else if (order == 1) {
      db = db.orderBy('userCounts', 'desc');
    }
    db.skip(skip)
      .limit(limit)
      .get({
        success: (res) => {
          wx.hideLoading();
          if (res.data.length === 0) {
            showToast({ title: '没有更多数据啦' });
          }
          resolve(res);
        },
        fail: (err) => {
          wx.hideLoading();
          reject(err);
        },
      });
  });
};

export const actTableById = ({ id }) => {
  return new Promise((resolve, reject) => {
    var db = wx.cloud.database().collection('ActTable').doc(id);
    db.get({
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

export const chooseImage = ({}) => {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

export const chooseMessageFile = ({}) => {
  return new Promise((resolve, reject) => {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};
/**
 * 图片上传至云存储
 * @param {选择图片路径} param0
 * @returns
 */
export const uploadFile = ({ tempFilePath, cloudPath }) => {
  wx.showLoading({
    title: '添加中',
    mask: true,
  });
  return new Promise((resolve, reject) => {
    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: tempFilePath,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      },
      complete: () => {
        wx.hideLoading();
      },
    });
  });
};

export const showToast = ({ title }) => {
  return new Promise((resolve, reject) => {
    wx.showToast({
      title: title,
      icon: 'none',
      mask: true,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

export const actTableInsert = ({
  actTheme,
  actContent,
  createTime,
  startTime,
  endTime,
  imageCloud,
  punchTimes,
  announcement,
  requires,
  label,
  actLocation,
}) => {
  return new Promise((resolve, reject) => {
    var db = wx.cloud.database().collection('ActTable');
    db.add({
      data: {
        actTheme: actTheme,
        actContent: actContent,
        createTime: createTime,
        startTime: startTime,
        endTime: endTime,
        actImage: imageCloud,
        announcement: announcement,
        punchTimes: punchTimes,
        userCounts: 0,
        userIds: [],
        requires: requires,
        label: label,
        actLocation: actLocation,
      },
      success: (res) => {
        showToast({ title: '添加成功' });
      },
      fail: (err) => {
        showToast({ title: '添加失败' });
      },
      complete: () => {
        wx.hideLoading();
        wx.navigateBack({
          delta: 1,
        });
      },
    });
  });
};

export const punchTableInsert = ({
  actId,
  punchContent,
  punchFile,
  punchImages,
  punchlocation,
  punchTime,
  nickName,
}) => {
  return new Promise((resolve, reject) => {
    var db = wx.cloud.database().collection('PunchTable');
    db.add({
      data: {
        actId: actId,
        nickName: nickName,
        punchContent: punchContent,
        punchFile: punchFile,
        punchImages: punchImages,
        punchlocation: punchlocation,
        punchTime: punchTime,
      },
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        resolve(err);
      },
    });
  });
};

export const actTableUpdate = ({ actId, openId }) => {
  return new Promise((resolve, reject) => {
    const _ = wx.cloud.database().command;
    var db = wx.cloud.database().collection('ActTable').doc(actId);
    db.update({
      data: {
        userCounts: _.inc(1),
        userIds: _.push(openId),
      },
      success: (res) => {
        showToast({ title: '打卡成功' });
      },
      fail: (err) => {
        showToast({ title: '打卡失败' });
      },
      complete: () => {
        wx.hideLoading();
        wx.navigateBack({
          delta: 1,
        });
      },
    });
  });
};
