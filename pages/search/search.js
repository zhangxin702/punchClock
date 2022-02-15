import { actTableBySearch } from '../../async/index.js';
Page({
  data: {
    resultData: [], // 查询结果
    isFocus: false, // 配合“取消”按钮的
    inpValue: '', //控制输入框的输入
  },
  TimeId: -1, //用于全局的timer控制

  handleInput(e) {
    clearTimeout(this.TimeId); //清除定时器
    const str = e.detail.value;
    // 如果输入为空
    if (!str.trim()) {
      this.setData({
        isFocus: false,
        resultData: [],
      });
      return;
    }
    this.setData({
      isFocus: true,
    });
    this.TimeId = setTimeout(() => {
      //开启定时器
      this.qsearch(str);
    }, 800);
  },

  async qsearch(query) {
    var res = await actTableBySearch({ searchKey: query });
    this.setData({
      resultData: res.data,
    });
  },

  handleCancel() {
    this.setData({
      resultData: [],
      isFocus: false,
      inpValue: '',
    });
  },
});
