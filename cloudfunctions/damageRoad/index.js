// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  var defenseNum;
  await db.collection('players').doc(event.playerId).get().then(res => {
    defenseNum = res.data.defenseNum;
  })

  if (defenseNum > 0) {
    defenseNum = defenseNum - 1;
    await db.collection('players').doc(event.playerId).update({data:{defenseNum:defenseNum}})
    return {result:"破坏被防御"}
  } else {
    return {result:"破坏成功"}
  }
}