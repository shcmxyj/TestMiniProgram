// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()

  for (var i = 0; i < event.resources.length; i++) {
    if (event.resources[i] == '木') {
      db.collection('players').doc(event.playerId).update({data:{muSp:event.newSp}})
    } else if (event.resources[i] == '羊') {
      db.collection('players').doc(event.playerId).update({data:{yangSp:event.newSp}})
    } else if (event.resources[i] == '麦') {
      db.collection('players').doc(event.playerId).update({data:{maiSp:event.newSp}})
    } else if (event.resources[i] == '砖') {
      db.collection('players').doc(event.playerId).update({data:{zhuanSp:event.newSp}})
    } else if (event.resources[i] == '铁') {
      db.collection('players').doc(event.playerId).update({data:{tieSp:event.newSp}})
    } 
  }

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}