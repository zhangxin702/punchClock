const GetDate = {
  withData: (param) => {
    return param < 10 ? '0' + param : '' + param;
  },
  getTimes(str){
    return new Date(str.replace(/-/g,'/')).getTime();
  },
  format(arr){
    let curarr = [];
    let curarr0 = [];
    let str = '';
    arr.forEach((o,index) => {
      if(index > 2){
        curarr.push(o);
      }else{
        curarr0.push(o)
      }
    })
    if(arr.length < 4){
      str = arr.join('-')
    }else{
      str = curarr0.join('-') + ' ' + curarr.join(':')
    }
    return str;
  },
  getLoopArray: (start, end) => {
    var start = start || 0;
    var end = end || 1;
    var array = [];
    for (var i = start; i <= end; i++) {
      array.push(GetDate.withData(i));
    }
    return array;
  },
  getMonthDay: (year, month) => {
    var flag = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0), array = null;

    switch (month) {
      case '01':
      case '03':
      case '05':
      case '07':
      case '08':
      case '10':
      case '12':
        array = GetDate.getLoopArray(1, 31)
        break;
      case '04':
      case '06':
      case '09':
      case '11':
        array = GetDate.getLoopArray(1, 30)
        break;
      case '02':
        array = flag ? GetDate.getLoopArray(1, 29) : GetDate.getLoopArray(1, 28)
        break;
      default:
        array = '月份格式不正确，请重新输入！'
    }
    return array;
  },
  getDateTimes: (opts) => {
    var years = GetDate.getLoopArray(opts.start, opts.end);
    var months = GetDate.getLoopArray(1, 12);
    var days = GetDate.getLoopArray(1, 31);
    var hours = GetDate.getLoopArray(0, 23);
    var minutes = GetDate.getLoopArray(0, 59);
    var seconds = GetDate.getLoopArray(0, 59);
    var times = null;

    switch (opts.fields) {
      case 'year':
        times = [years]
        break;
      case 'month':
        times = [years, months]
        break;
      case 'day':
        times = [years, months, days]
        break;
      case 'hour':
        times = [years, months, days, hours]
        break;
      case 'minute':
        times = [years, months, days, hours, minutes]
        break;
      case 'second':
        times = [years, months, days, hours, minutes, seconds]
        break;
      default:
        times = [years, months, days, hours, minutes, seconds]
    }
    return times;
  },
  getIndex(arr,target){
    let len = arr.length;
    for(let i = 0; i < len; i++){
      if(arr[i] == target){
        return i;
      }
    }
  },
  getTimeIndex(arrs, targets){
    let len = arrs.length;
    let arr = [];
    for(let i = 0; i < len; i++){
      arr.push(GetDate.getIndex(arrs[i], targets[i]))
    }
    return arr;
  }
}

module.exports = GetDate; 