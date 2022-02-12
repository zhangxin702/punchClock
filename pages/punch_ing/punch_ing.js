import {
  chooseImage,
  chooseMessageFile,
  uploadFile,
  actTableById,
  punchTableInsert,
  showToast,
} from '../../async/index.js';
import { getLocation } from '../../async/async.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    actId: '',
    count: 2,
    addedCount: 0,
    requires: [],
    bool: [], //判断用的，位置[word,picture,map,file]，值为true或false
    filePath: '', //选取文件的路径
    images: [], //选取图片的路径
    requireMap: '', //活动位置

    punchFile: '', //文件
    punchImages: [], //图片
    map: '', //位置
    word: '', //文字
  },
  // 上传图片有关函数
  async chooseImage() {
    var res = await chooseImage({});
    console.log(res);
    this.setData({
      images: [...this.data.images, res.tempFilePaths[0]],
      addedCount: this.data.addedCount + 1,
    });
  },
  // 删除图片
  deleteImage(e) {
    this.data.images.splice(e.detail, 1);
    this.setData({
      images: this.data.images,
      addedCount: this.data.addedCount - 1,
    });
  },

  // 上传文件
  async chooseMessageFile() {
    var res = await chooseMessageFile({});
    this.setData({
      filePath: res.tempFiles[0].path,
    });
    console.log(this.data.filePath);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    this.setData({ actId: e.actId });
    this.getById();
  },

  async getById() {
    var res = await actTableById({
      id: this.data.actId,
    });
    this.setData({
      requires: res.data.requires,
      requireMap: res.data.actLocation,
    });
    let word, picture, location, file;
    word = this.data.requires.includes('word');
    picture = this.data.requires.includes('picture');
    location = this.data.requires.includes('map');
    file = this.data.requires.includes('file');
    this.setData({
      bool: [word, picture, location, file],
    });
    
  },

  async location() {
    let res = await getLocation();
    this.setData({
      map: {
        latitude: res.latitude,
        longitude: res.longitude,
      },
    });
    wx.showToast({
      title: '获取定位成功',
    })
    console.log(this.data.map);
  },

  async submit() {
    if (this.data.bool[0] === true) {
      if (this.data.word === '') {
        await showToast({ title: '您还未填写文档，请填写' });
        return false;
      }
    }
    if (this.data.bool[1] === true) {
      if (this.data.images.length === 0) {
        await showToast({ title: '您还未上传图片，请上传' });
        return false;
      }
    }
    if (this.data.bool[2] === true) {
      if (this.data.map === '') {
        await showToast({ title: '您还未定位，请定位' });
        return false;
      }
    }
    if (this.data.bool[3] === true) {
      if (this.data.filePath === '') {
        await showToast({ title: '您还未上传文件，请上传' });
        return false;
      }
      if (this.data.bool[1] === true) {
        for (var i = 0; i < this.data.images.length; i++) {
          var imgUrl = this.data.images[i];
          var res = await uploadFile({
            tempFilePath: imgUrl,
            cloudPath: 'actImage/' + imgUrl.split('/').pop(),
          });
          this.setData({
            punchImages: [...this.data.punchImages, res.fileID],
          });
        }
        console.log(this.data.punchImages);
      }
      var ree = await uploadFile({
        tempFilePath: this.data.filePath,
        cloudPath: 'punchFile/' + this.data.filePath.split('/').pop(),
      });
      console.log(ree);
      this.setData({
        punchFile: ree.fileID,
      });
    }
    // await punchTableInsert({
    //   actId: this.data.actId,
    //   punchContent: this.data.word,
    //   punchFile: this.data.punchFile,
    //   punchImages: this.data.punchImages,
    //   punchlocation: this.data.map,
    //   punchTime: new Date(),
    // });
  },
});
