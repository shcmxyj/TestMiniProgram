// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  var knight = null;
  var asshole = null;

  await db.collection('knights').doc(event.knightId).get().then(res => {
    knight = res.data;
  });
  await db.collection('assholes').doc(event.assholeId).get().then(res => {
    asshole = res.data;
  });

  if (knight == null) {
    return '未找到骑士';
  }

  if (asshole == null) {
    return '未找到恶魔';
  }

  while (asshole.hp > 0 && knight.hp > 0) {
    var randomNum = Math.random();
    if (randomNum < asshole.accuracy) {
      knight.hp -= asshole.attack;
    }
    
    randomNum = Math.random();
    if (randomNum < knight.accuracy) {
      asshole.hp -= knight.attack;	
    }
  }

  var result = '';
  if (asshole.hp < 1) {
    // 开启资源点
    await db.collection('resources').where({
      _id: asshole.resourceId
    })
    .update({
      data: {
        closed: false
      },
    })

    // 删除恶霸
    await db.collection('assholes').doc(asshole._id).remove()
    result += '恶霸阵亡 ';
  } else {
    // 更新恶霸信息
    await db.collection('assholes').doc(asshole._id).update({
      data:{
        hp:asshole.hp,
        name:"恶霸r" + asshole.resourceId + "h" + asshole.hp
      }
    })
  }

  if (knight.hp < 1) {
    // 删除骑士
    await db.collection('knights').doc(knight._id).remove()
    result += '骑士阵亡'
  } else {
    // 更新骑士信息
    await db.collection('knights').doc(knight._id).update({
      data:{
        hp:knight.hp,
        name:"骑士h" + knight.hp
      }
    })
  }
  return result;
}