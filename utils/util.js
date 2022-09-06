const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  console.log('格式化时间')
  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

var formatDate = function(date) {
  var d = date.split('T')[0]
  // d = d.replace('-', '.').replace('-', '.')
  return d
};

const formatBirthday = function(date){
  date = String(date)
  let year = date.slice(0, 4)
  let month = date.slice(4, 6)
  let day = date.slice(6, 8)
  let birthday= new Date(year + "-" + (month) + "-" + day).getTime();
  return birthday
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const getDistance= function(lat1, lng1, lat2, lng2){
  var radLat1 = Rad(lat1);
  var radLat2 = Rad(lat2);
  var a = radLat1 - radLat2;
  var b = Rad(lng1) - Rad(lng2);
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137;
  s = Math.round(s * 10000) / 10000;
  if (s < 1) {
    s = s.toFixed(3) * 1000 + ' m' //保留小数
    return s
  } else {
    s = s.toFixed(1) + ' km' //保留小数
    return s
  }
}
var Rad = function(d) {
  return d * Math.PI / 180.0;
}


module.exports = {
  formatTime,
  formatDate,
  formatBirthday,
  getDistance
}
