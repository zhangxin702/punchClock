import {
  chooseImage,
  chooseMessageFile,
  uploadFile,
  actTableById,
  punchTableInsert,
  showToast,
  actTableUpdate,
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
    userIds: [], //活动参与人

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
    await showToast({ title: '选择文件成功' });
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
      userIds: res.data.userIds,
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
    if (this.data.map === '') {
      let res = await getLocation();
      this.setData({
        map: {
          latitude: res.latitude,
          longitude: res.longitude,
        },
      });
    }
    await showToast({ title: '您已定位成功' });
  },

  Rad(d) {
    return (d * Math.PI) / 180.0; //经纬度转换成三角函数中度分表形式。
  },

  GetDistance(lat1, lng1, lat2, lng2) {
    //传入两个点的经纬度
    var radLat1 = this.Rad(lat1);
    var radLat2 = this.Rad(lat2);
    var a = radLat1 - radLat2;
    var b = this.Rad(lng1) - this.Rad(lng2);
    var s =
      2 *
      Math.asin(
        Math.sqrt(
          Math.pow(Math.sin(a / 2), 2) +
            Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
        )
      );
    s = s * 6378.137; // EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000; //输出m
    return s;
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
      let ree = this.GetDistance(
        this.data.map.latitude,
        this.data.map.longitude,
        this.data.requireMap.latitude,
        this.data.requireMap.longitude
      );
      console.log(this.data.map, this.data.requireMap);
      console.log(ree);
      if (ree > 300) {
        await showToast({ title: '您在规定的定位之外，请到达目的地' });
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
    let red = await wx.getStorageSync('userInfo');
    console.log(!this.data.userIds.includes(red._id));
    await punchTableInsert({
      actId: this.data.actId,
      nickName: red.nickName,
      punchContent: this.data.word,
      punchFile: this.data.punchFile,
      punchImages: this.data.punchImages,
      punchlocation: this.data.map,
      punchTime: new Date(),
    });
    console.log(this.data.actId, red._id);
   
    if (!this.data.userIds.includes(red._id)) {
      await actTableUpdate({
        actId: this.data.actId,
        openId: red._id,
      });
    } else {
      setTimeout(function(){
        wx.showToast({
          title: '打卡成功',
        })
       
      },1000)
      setTimeout(function(){
        wx.navigateBack({
          delta: 1,
        });
       
      },2000)
     
    }
    
  },

  // 输入框失去焦点时,即触发事件
  bindTextAreaBlur: function (e) {
    this.setData({
      word: e.detail.value,
    });
  },
});
