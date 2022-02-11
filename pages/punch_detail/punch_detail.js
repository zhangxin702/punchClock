// pages/punch_detail/punch_detail.js
import { actTableById } from '../../async/index.js';
import { formatTime } from '../../utils/util.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //商品
    activity: '',
    startTime: '',
    punch_num: 1,
    endTime: '',
    requires:[],
    bool:[""]

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getById(options.actId);
  },
 
  async getById(actId) {
    var res = await actTableById({
      id: actId,
    });
    console.log(res);
    var start = formatTime({ date: res.data.startTime });
    var end = formatTime({ date: res.data.endTime });
 

    this.setData({
      activity: res.data,
      startTime: start,
      endTime: end,
      requires:res.data.requires
    });
    let word, picture, location, file;
    let bool = [];
    location = this.data.requires.includes('map');
    if(location){
      bool.push('⛳')
     }
     word = this.data.requires.includes('word');
    if(word){
     bool.push('🖊')
    }
    picture = this.data.requires.includes('picture');
    if(picture){
    bool.push('📸')
     }
  
    file = this.data.requires.includes('file');
    if(file){
    bool.push('📁')
     }
    console.log(bool);
    console.log(this.data.requires);
    this.setData({
      bool:bool
    })
    
 
  }


});
