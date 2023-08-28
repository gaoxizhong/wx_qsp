// 字符串拼接
function strFormat(str){
  return str < 10 ? `0${str}` : str
}
// 获取当前时间
function currentTime(){
  const myDate = new Date();
  const y = myDate.getFullYear(); // 年
  const m = myDate.getMonth() + 1; // 月
  const d = myDate.getDate(); // 日
  const ymdDate = y + '-' + strFormat(m) + '-' + strFormat(d);
  const date = strFormat(m) + '-' + strFormat(d);
  const hour = myDate.getHours(); // 时
	const min = myDate.getMinutes(); // 分
  const secon = myDate.getSeconds(); // 秒
  const time = strFormat(hour) + ':' + strFormat(min) + ':' + strFormat(secon);
  
	return {
    ymdDate,
		date,
		time
	}
}

//时间戳转日期
function timeStamp(time) {
	const dates = new Date(time)
	const year = dates.getFullYear();
	const month = dates.getMonth() + 1;
	const date = dates.getDate();
	const day = dates.getDay();
	const hour = dates.getHours();
	const min = dates.getMinutes();
	const days = ['日', '一', '二', '三', '四', '五', '六'];
	return {
		allDate: `${year}-${strFormat(month)}-${strFormat(date)}`,
		// date: `${strFormat(year)}-${strFormat(month)}-${strFormat(date)}`, 
		date: `${strFormat(month)}-${strFormat(date)}`, //返回的日期 07-01
		day: `星期${days[day]}`, //返回的礼拜天数  星期一
		hour: strFormat(hour) + ':' + strFormat(min) + ':00' //返回的时钟 08:00
	}
}
//获取最近7天的日期和礼拜天数
function initData() {
	const time = []
	const date = new Date();
	const now = date.getTime() //获取当前日期的时间戳
	let timeStr = 3600 * 24 * 1000 //一天的时间戳
	let obj = {
		0: "今天",
		1: "明天",
		2: "后天"
	}
	for (let i = 0; i < 7; i++) {
		const timeObj = {}
    timeObj.date = timeStamp(now + timeStr * i).date //保存日期
		timeObj.allDate = timeStamp(now + timeStr * i).allDate
		timeObj.timeStamp = now + timeStr * i //保存时间戳
		timeObj.week = obj[i] ?? timeStamp(now + timeStr * i).day
		time.push(timeObj)
	}
	return time
}
//时间数组
function initTime(startTime = '10:00:00', endTime = '21:00:00', timeInterval = 1) {
	const time = []
	const date = timeStamp(Date.now()).allDate
	const startDate = `${date} ${startTime}`
	const endDate = `${date} ${endTime}`
	const startTimeStamp = new Date(startDate).getTime()
	const endTimeStamp = new Date(endDate).getTime()
	const timeStr = 3600 * 1000 * timeInterval
	for (let i = startTimeStamp; i <= endTimeStamp; i = i + timeStr) {
		const timeObj = {}
		timeObj.time = timeStamp(i).hour
		timeObj.disable = false
		time.push(timeObj)
	}
	return time
}
export { currentTime, timeStamp, initData, initTime }
