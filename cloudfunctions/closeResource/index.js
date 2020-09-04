// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  var oldAsshole = null;
  var oldHp = 5;
  console.log(event)
  await db.collection('assholes').doc(event.assholeId).get().then(res => {
    if (res.data != null) {
      if (res.data.resourceId > 0) {
        oldAsshole = res.data;
        oldAp = oldAsshole.hp;
      }
    }
  })

  if (oldAsshole != null && oldAsshole.resourceId > 0) {
    await db.collection('resources').where({
      _id: oldAsshole.resourceId
    }).update({
      data: {
        closed: false
      },
    })
  }

  await db.collection('assholes').doc(event.assholeId).update({
    data:{
      resourceId:event.resourceId,
      name:"恶霸r" + event.resourceId + "h" + oldHp
    }
  })

  return await db.collection('resources').where({
    _id: event.resourceId
  })
  .update({
    data: {
      closed: true
    },
  })
}