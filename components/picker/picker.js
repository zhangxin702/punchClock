const GetDate = require('./GetDate.js');

const error = (msg) => {
  console.error(msg);
};

Component({
  externalClasses: ['rui-class'],

  options: {
    multipleSlots: true
  },
  lifetimes: {
    attached() {
      switch (this.data.fields){
        case 'year':
          if (this.data.value.length !== 4) {error('时间粒度和时间格式不一致');this.setData({ disabled: true });return false;}
          if (this.data.start.length !== 4) { error('时间粒度和开始时间格式不一致'); this.setData({ disabled: true }); return false;}
          if (this.data.end.length !== 4) { error('时间粒度和结束时间格式不一致'); this.setData({ disabled: true }); return false;}
          break;
        case 'month':
          if (this.data.value.length !== 7) { error('时间粒度和时间格式不一致'); this.setData({ disabled: true }); return false;}
          if (this.data.start.length !== 7) { error('时间粒度和开始时间格式不一致'); this.setData({ disabled: true }); return false;}
          if (this.data.end.length !== 7) { error('时间粒度和结束时间格式不一致'); this.setData({ disabled: true }); return false;}
          break;
        case 'day':
          if (this.data.value.length !== 10) { error('时间粒度和时间格式不一致'); this.setData({ disabled: true }); return false;}
          if (this.data.start.length !== 10) { error('时间粒度和开始时间格式不一致'); this.setData({ disabled: true }); return false;}
          if (this.data.end.length !== 10) { error('时间粒度和结束时间格式不一致'); this.setData({ disabled: true }); return false;}
          break;
        case 'hour':
          if (this.data.value.length !== 13) { error('时间粒度和时间格式不一致'); this.setData({ disabled: true }); return false;}
          if (this.data.start.length !== 13) { error('时间粒度和开始时间格式不一致'); this.setData({ disabled: true }); return false;}
          if (this.data.end.length !== 13) { error('时间粒度和结束时间格式不一致'); this.setData({ disabled: true }); return false;}
          break;
        case 'minute':
          if (this.data.value.length !== 16) { error('时间粒度和时间格式不一致'); this.setData({ disabled: true }); return false;}
          if (this.data.start.length !== 16) { error('时间粒度和开始时间格式不一致'); this.setData({ disabled: true }); return false;}
          if (this.data.end.length !== 16) { error('时间粒度和结束时间格式不一致'); this.setData({ disabled: true }); return false;}
          break;
        case 'second':
          if (this.data.value.length !== 19) { error('时间粒度和时间格式不一致'); this.setData({ disabled: true }); return false;}
          if (this.data.start.length !== 19) { error('时间粒度和开始时间格式不一致'); this.setData({ disabled: true }); return false;}
          if (this.data.end.length !== 19) { error('时间粒度和结束时间格式不一致'); this.setData({ disabled: true }); return false;}
          break;
        default: 
          error('时间粒度不存在')
          break;
      }
      let values = this.data.value.split(' ');
      let targets = this.data.fields === 'year' || this.data.fields === 'month' || this.data.fields === 'day' ? [...(values[0].split('-'))] : [...(values[0].split('-')), ...(values[1].split(':'))];

      if (GetDate.getTimes(this.data.value) < GetDate.getTimes(this.data.start)){
        error('默认时间不能小于开始时间')
        this.setData({ disabled: true })
        return false;
      }
      if (GetDate.getTimes(this.data.value) > GetDate.getTimes(this.data.end)) {
        error('默认时间不能大于开始时间')
        this.setData({ disabled: true })
        return false;
      }
      let times = GetDate.getDateTimes({
        start: this.data.start.substring(0, 4),
        end: this.data.end.substring(0, 4),
        curyear: this.data.value.substring(0, 4),
        curmonth: this.data.value.substring(5, 7),
        fields: this.data.fields,
      })
      let timesIndex = GetDate.getTimeIndex(times, targets);
      let timesString = [];
      timesIndex.forEach(o => timesString.push(o));

      this.setData({ 
        times: times,
        timesIndex: timesIndex,
        timesString: timesString
      })
    }
  },
  properties: {
    start: {
      type: String,
      value: '1900-00-00 00:00:00'
    },
    end: {
      type: String,
      value: '2500-12-30 23:59:59'
    },
    value: {
      type: String,
      value: '2019-03-15 10:45:00'
    },
    fields: {
      type: String,
      value: 'second'
    },
    disabled: {
      type: Boolean,
      value: false
    }
  },

  data: {
    times:[['2019','2020'],['01','02']],
    timesIndex: [1,1],
    timesString: null
  },

  methods: {
    changeDate(e){
      let values = e.detail.value;
      let times = this.data.times;
      let curarr = [];
      for (let i = 0, len = values.length; i < len; i++) {
        curarr.push(times[i][values[i]])
      }
      let str = GetDate.format(curarr);
      this.setData({ value: str});
      this.triggerEvent('changedatepicker', { value: str }, {});
    },
    columnchangeDate(e){
      if ((this.data.fields === 'year' || this.data.fields === 'month')){
        let timesIndex = this.data.timesIndex;
        timesIndex[e.detail.column] = e.detail.value;
        this.setData({ timesIndex: timesIndex });
        return false;
      }
      // 先对timesIndex做出改变
      if ((e.detail.column === 0 || e.detail.column === 1 || e.detail.column === 2) && (this.data.fields !== 'year' || this.data.fields !== 'month')) {
        let times = this.data.times;
        let timesIndex = this.data.timesIndex;
        timesIndex[e.detail.column] = e.detail.value;
        let days = GetDate.getMonthDay(times[0][timesIndex[0]], times[1][timesIndex[1]]);
        if (timesIndex[2] >= days.length) {
          timesIndex[2] = days.length - 1;
        } else {
          timesIndex[e.detail.column] = e.detail.value;
        }
        this.setData({ timesIndex: timesIndex });
      } else {
        let timesIndex = this.data.timesIndex;
        timesIndex[e.detail.column] = e.detail.value;
        this.setData({ timesIndex: timesIndex });
      }
      // 判断当前选择是否小于开始时间或者大于结束时间
      let values = this.data.timesIndex;
      let times = this.data.times;
      let curarr = [];
      for (let i = 0, len = values.length; i < len; i++) {
        curarr.push(times[i][values[i]])
      }
      let str = GetDate.format(curarr);
      
      if (GetDate.getTimes(str) < GetDate.getTimes(this.data.start)) {
        let timesString = this.data.timesString;
        let timesIndex = [];
        timesString.forEach(o => timesIndex.push(o));
        this.setData({ timesIndex: timesIndex})
      }
      if (GetDate.getTimes(str) > GetDate.getTimes(this.data.end)) {
        let timesString = this.data.timesString;
        let timesIndex = [];
        timesString.forEach(o => timesIndex.push(o));
        this.setData({ timesIndex: timesIndex })
      }
    },
    cancelDate(e){
      this.triggerEvent('canceldatepicker', { value: e }, {});
    }
  }
})
