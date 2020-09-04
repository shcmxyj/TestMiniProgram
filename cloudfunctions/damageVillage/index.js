// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const _ = db.command

  var playerId;
  var deltaScore;
  await db.collection('villages').where({name:event.name}).get().then(res => {
    playerId = res.data[0].playerId;
    if (res.data[0].level == 1) {
      deltaScore = -1;
    } else {
      deltaScore = -2;
    }
  })

  var defenseNum;
  await db.collection('players').doc(playerId).get().then(res => {
    defenseNum = res.data.defenseNum;
  })

  if (defenseNum > 0) {
    defenseNum = defenseNum - 1;
    await db.collection('players').doc(playerId).update({data:{defenseNum:defenseNum}})
    return {result:"破坏被防御"}
  } else {
    await db.collection('villages').where({name:event.name}).remove()
    await db.collection('players').doc(playerId).update({data:{score:_.inc(deltaScore)}})
    return {result:"破坏成功"}
  }

}