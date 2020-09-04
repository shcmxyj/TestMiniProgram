// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const _ = db.command
  await db.collection('knights').where({playerId:event.playerId}).remove()
  await db.collection('assholes').where({playerId:event.playerId}).remove()
  await db.collection('villages').where({playerId:event.playerId}).remove()
  await db.collection('events').doc('1').update({data:{type:'等待刷新', remainTime:120}})

  return await db.collection('resources').where({
    closed: true
  })
  .update({
    data: {
      closed: false
    },
  })
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}