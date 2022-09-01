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

module.exports = {
  formatTime,
  formatDate,
  formatBirthday
}
