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
    return {result:"掠夺被防御"}
  } else {
    var value = 0;
    db.collection('players').doc(event.playerId).get().then(res => {
      if (event.resourceType == '木') {
        if (res.data.mu > 0) {
          db.collection('players').doc(event.playerId).update({data:{mu:0}})
          db.collection('players').doc(event.mineId).get().then(res2 => {
            db.collection('players').doc(event.mineId).update({data:{mu:res2.data.mu + res.data.mu/2}})
          })
        }
      } else if (event.resourceType == '羊') {
        if (res.data.yang > 0) {
          db.collection('players').doc(event.playerId).update({data:{yang:0}})
          db.collection('players').doc(event.mineId).get().then(res2 => {
            db.collection('players').doc(event.mineId).update({data:{yang:res2.data.yang + res.data.tang/2}})
          })
        }
      } else if (event.resourceType == '麦') {
        if (res.data.mai > 0) {
          db.collection('players').doc(event.playerId).update({data:{mai:0}})
          db.collection('players').doc(event.mineId).get().then(res2 => {
            db.collection('players').doc(event.mineId).update({data:{mai:res2.data.mai + res.data.mai/2}})
          })
        }
      } else if (event.resourceType == '砖') {
        if (res.data.zhuan > 0) {
          db.collection('players').doc(event.playerId).update({data:{zhuan:0}})
          db.collection('players').doc(event.mineId).get().then(res2 => {
            db.collection('players').doc(event.mineId).update({data:{zhuan:res2.data.zhuan + res.data.zhuan/2}})
          })
        }
      } else if (event.resourceType == '铁') {
        if (res.data.tie > 0) {
          db.collection('players').doc(event.playerId).update({data:{tie:0}})
          db.collection('players').doc(event.mineId).get().then(res2 => {
            db.collection('players').doc(event.mineId).update({data:{tie:res2.data.tie + res.data.tie/2}})
          })
        }
      }
    })

    return {result:"掠夺成功"}
  }

}