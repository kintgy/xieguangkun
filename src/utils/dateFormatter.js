/* * * 对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)、上下午(A)
    可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) * eg: * (new
    Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423      
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04      
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04      
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04      
 * (new Date()).pattern("yyyy-MM-dd EEE AA hh:mm:ss") ==> 2009-03-10 星期二 上午 08:09:04      
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18      
  */
window.Date.prototype.pattern = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1,  // 月份
    "d+": this.getDate(),  // 日
    "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12,  // 小时
    "H+": this.getHours(),  // 小时
    "m+": this.getMinutes(),  // 分
    "s+": this.getSeconds(),  // 秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds()  // 毫秒
  };
  var week = {
    "0": "一",
    "1": "二",
    "2": "三",
    "3": "四",
    "4": "五",
    "5": "六",
    "6": "日"
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[`${(this.getDay() + 4) % 7}`]);
  }
  if (/(A+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getHours() > 12 ? '下午' : '上午'));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}


/**
 * @description ：获取当前周、月、季的开始和结束时间
 * @param {*}
 * @return {*}
 */

window.Date.prototype.getTimeRange = function (type, diff = 0, end_diff = 0) {
  let date = new Date();
  let dateStart = new Date();
  let dateEnd = new Date();

  if (end_diff === 0) date.setDate(date.getDate() + 1)
  dateStart.setMilliseconds(0);
  dateStart.setSeconds(0)
  dateStart.setMinutes(0);
  dateStart.setHours(0);
  dateEnd.setMilliseconds(0);
  dateEnd.setSeconds(0)
  dateEnd.setMinutes(0);
  dateEnd.setHours(0);
  if ('year' === type) {
    if (diff > 0) {
      dateStart.setFullYear(date.getFullYear() - diff);
      dateEnd.setFullYear(date.getFullYear() - diff + 1);
    } else {
      dateEnd.setFullYear(date.getFullYear() + 1);
    }
    dateStart.setMonth(0);
    dateStart.setDate(1);
    dateEnd.setMonth(0);
    dateEnd.setDate(1);
    dateEnd.setTime(dateEnd.getTime() - 1);
  } else if ('season' === type) {
    let season = Math.floor(date.getMonth() / 3);
    dateStart.setDate(1);
    dateStart.setMonth(((season - diff) * 3));
    dateEnd.setDate(1);
    dateEnd.setMonth((season + 1 - diff) * 3);
    dateEnd.setTime(dateEnd.getTime() - 1)
  } else if ('day' === type) {
    dateStart.setDate(date.getDate() - diff);
    if (!diff) {
      dateEnd.setDate(date.getDate() + 1);
      dateEnd.setTime(dateEnd.getTime() - 1);
    } else {
      dateEnd.setDate(date.getDate());
      dateEnd.setTime(dateEnd.getTime() - 1);
    }
  } else if ('month' === type) {
    dateStart.setDate(1);
    dateStart.setMonth(date.getMonth() - diff);
    if (date.getTime() - dateStart.getTime() <= 24 * 3600 * 1000) {
      dateStart.setMonth(dateStart.getMonth() - 1);
    }

    dateEnd.setMonth(date.getMonth() + 1 - diff);
    dateEnd.setDate(1);
    dateEnd.setTime(dateEnd.getTime() - 1);
  } else if ('week' === type) {
    //本周第一天
    dateStart.setTime(dateStart.getTime() - (24 * 3600 * 1000 * (dateStart.getDay() - 1)))
    dateStart.setDate(dateStart.getDate() + diff)
    dateEnd.setDate(dateStart.getDate() + 6)
  }
  if (dateEnd.getTime() > date.getTime() && type !== 'day') {
    dateEnd.setTime(date.getTime());
    dateEnd.setMilliseconds(0);
    dateEnd.setSeconds(0)
    dateEnd.setMinutes(0);
    dateEnd.setHours(0);
    dateEnd.setTime(dateEnd.getTime() - 1);
    if (dateEnd.getTime() < dateStart.getTime()) dateEnd.setDate(dateEnd.getDate() + 1)
  }

  dateStart = dateStart.pattern('yyyy-MM-dd ') + '00:00:00'
  dateEnd = dateEnd.pattern('yyyy-MM-dd ') + '23:59:59'
  console.log(type, dateStart, dateEnd)
  return [dateStart, dateEnd];
}





