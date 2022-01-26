export const actTableGetAll = ({ order }) => {
  return new Promise((resolve, reject) => {
    var db = wx.cloud.database().collection('ActTable');
    if (order == 0) {
      db = db.orderBy('nowTime', 'asc');
    } else if (order == 1) {
      db = db.orderBy('userCounts', 'desc');
    }
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

export const chooseImage = ({ addedCount }) => {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count: 1 - addedCount,
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

/**
 * 图片上传至云存储
 * @param {选择图片路径} param0
 * @returns
 */
export const uploadFile = ({ tempFilePath }) => {
  wx.showLoading({
    title: '添加中',
    mask: true,
  });
  return new Promise((resolve, reject) => {
    wx.cloud.uploadFile({
      cloudPath: 'punchImage/nihao.jpg',
      filePath: tempFilePath,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
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
  nowTime,
  startTime,
  endTime,
  imageCloud,
}) => {
  return new Promise((resolve, reject) => {
    var db = wx.cloud.database().collection('ActTable');
    db.add({
      data: {
        actTheme: actTheme,
        actContent: actContent,
        nowTime: nowTime,
        startTime: startTime,
        endTime: endTime,
        actImg: imageCloud,
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