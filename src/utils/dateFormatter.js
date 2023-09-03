

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

window.Date.prototype.getTimeRange = function (type) {
    var startTime = new Date();
    var endTime = new Date();
    let nowMonth = '';
    let startMonth = '';
    let endMonth = '';
    switch (type) {
        case 'day':
            //  日
            startTime = startTime.pattern('yyyy-MM-dd ') + '00:00:00'
            endTime = endTime.pattern('yyyy-MM-dd ') + '23:59:59'
            return [startTime, endTime];
        case 'week':
            // 周
            var now = new Date();
            var week = now.getDay();
            var minus = week ? week - 1 : 6;
            startTime.setDate(startTime.getDate() - minus);
            endTime.setDate(startTime.getDate() + 6);
            startTime = startTime.pattern('yyyy-MM-dd ') + '00:00:00'
            // startTime = startTime.toLocaleString('zh', { hour12: false }).split('/').join('-');
            // endTime = endTime.toLocaleString('zh', { hour12: false }).split('/').join('-');
            endTime = endTime.pattern('yyyy-MM-dd ') + '23:59:59'

            return [startTime, endTime];
        case 'month':
            // 月
            startTime.setDate(1);
            endTime.setMonth(endTime.getMonth() + 1);
            endTime.setDate(0);
            startTime.setHours(0);
            startTime.setMinutes(0);
            startTime.setSeconds(0);
            endTime.setHours(23);
            endTime.setMinutes(59);
            endTime.setSeconds(59);
            // startTime = startTime.toLocaleString('zh', { hour12: false }).split('/').join('-');
            startTime = startTime.pattern('yyyy-MM-dd ') + '00:00:00'
            // endTime = endTime.toLocaleString('zh', { hour12: false }).split('/').join('-');
            endTime = endTime.pattern('yyyy-MM-dd ') + '23:59:59'
            return [startTime, endTime];
        case 'season':
            //季
            nowMonth = startTime.getMonth() < 10 ? '0' + startTime.getMonth() : startTime.getMonth();
            if (nowMonth >= 3 && nowMonth <= 5) {
                //春季
                startMonth = 3
                endMonth = 5
            } else if (nowMonth >= 6 && nowMonth <= 8) {
                //夏季
                startMonth = 6
                endMonth = 8
            } else if (nowMonth >= 9 && nowMonth <= 11) {
                //秋季
                startMonth = 9
                endMonth = 11
            } else {
                //冬季
                startMonth = 12
                endMonth = 2
                endTime.setFullYear(endTime.getFullYear() + 1);
            }

            startTime.setHours(0);
            startTime.setMinutes(0);
            startTime.setSeconds(0);
            startTime.setDate(1);
            startTime.setMonth(startMonth - 1);
            // startTime = startTime.toLocaleString('zh', { hour12: false }).split('/').join('-');
            startTime = startTime.pattern('yyyy-MM-dd ') + '00:00:00'

            endTime.setDate(1);
            endTime.setMonth(endMonth);
            endTime.setDate(0);
            endTime.setHours(23);
            endTime.setMinutes(59);
            endTime.setSeconds(59);
            // endTime = endTime.toLocaleString('zh', { hour12: false }).split('/').join('-');
            endTime = endTime.pattern('yyyy-MM-dd ') + '23:59:59'

            return [startTime, endTime];
        case 'year':
            // 年
            startTime.setHours(0);
            startTime.setMinutes(0);
            startTime.setSeconds(0);
            startTime.setDate(1);
            startTime.setMonth(0);
            endTime.setFullYear(endTime.getFullYear() + 1);
            endTime.setHours(23);
            endTime.setMinutes(59);
            endTime.setSeconds(59);
            endTime.setMonth(0);
            endTime.setDate(0);
            // startTime = startTime.toLocaleString('zh', { hour12: false }).split('/').join('-');
            startTime = startTime.pattern('yyyy-MM-dd ') + '00:00:00'
            // endTime = endTime.toLocaleString('zh', { hour12: false }).split('/').join('-');
            endTime = endTime.pattern('yyyy-MM-dd ') + '23:59:59'
            return [startTime, endTime];
    }



}





