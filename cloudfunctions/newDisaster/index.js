// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const db = cloud.database()
  const _ = db.command
  var type = event.type;
  var owner = null;
  var isAuto = event.isAuto

  if (isAuto) {
    // 先处理上次事件的恢复
    var res = null;
    await db.collection('events').doc('1').get().then(res2 => {
      res = res2;
    })
    var oldType = '';
    if (res != null) {
      oldType = res.data.type;
    }
    
    if (oldType == '自然灾害-木') {
      db.collection("resources").where({type:'木'}).update({data:{closed:false}})
    } else if (oldType == '自然灾害-羊') {
      db.collection("resources").where({type:'羊'}).update({data:{closed:false}})
    } else if (oldType == '自然灾害-麦') {
      db.collection("resources").where({type:'麦'}).update({data:{closed:false}})
    } else if (oldType == '自然灾害-砖') {
      db.collection("resources").where({type:'砖'}).update({data:{closed:false}})
    } else if (oldType == '自然灾害-铁') {
      db.collection("resources").where({type:'铁'}).update({data:{closed:false}})
    } else if (oldType == '恶龙') {
      for (var i = 0; i < res.data.target.length; i++) {
        await db.collection("resources").doc(Number(res.data.target[i])).update({data:{closed:false}});
      }
    } else if (oldType == '恶霸') {
      for (var i = 0; i < res.data.target.length; i++) {
        await db.collection("resources").doc(res.data.target[i]).update({data:{closed:false}});
      }
    } else if (oldType == '拍卖恶龙') {
      await db.collection('eventSells').get().then(res => {
        if (res.data.length > 0) {
          var maxNum = 0;
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].num > maxNum) {
              owner = res.data[i].playerId;
              maxNum =  res.data[i].num;
            }
          }
          type = '等待恶龙攻击'
        } else {
          type = '恶龙'
        }
      })
    } else if (oldType == '拍卖生产专家') {
      await db.collection('eventSells').get().then(res => {
        if (res.data.length > 0) {
          var maxNum = 0;
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].num > maxNum) {
              owner = res.data[i].playerId;
              maxNum =  res.data[i].num;
            }
          }
          type = '生产专家'
        } else {
          type = '生产专家'
        }
      })
    } else if (oldType == '生产专家') {
      var owner = null;
      await db.collection('events').doc('1').get().then(res => {
        owner = res.data.owner;
      })

      if (owner != null) {
        await db.collection('players').doc(owner).update({data:{muSp:1, maiSp:1, yangSp:1, zhuanSp:1, tieSp:1}})
      } else {
        await db.collection('players').where({_id:_.neq("0")}).update({data:{muSp:1, maiSp:1, yangSp:1, zhuanSp:1, tieSp:1}})
      }
    }

    if (type.indexOf('拍卖') < 0) {
      await db.collection('events').doc('1').update({data:{type:type, remainTime:60, owner:owner}})
    } else {
      await db.collection('events').doc('1').update({data:{type:type, remainTime:15, owner:owner}})
      await db.collection('eventSells').where({num:_.neq(-1)}).remove()
    }
  } else {
    await db.collection('events').doc('1').update({data:{type:type, owner:owner}})
  }

  var remark = '';
  if (type == '自然灾害-木') {
    db.collection("resources").where({type:'木'}).update({data:{closed:true}})
  } else if (type == '自然灾害-羊') {
    db.collection("resources").where({type:'羊'}).update({data:{closed:true}})
  } else if (type == '自然灾害-麦') {
    db.collection("resources").where({type:'麦'}).update({data:{closed:true}})
  } else if (type == '自然灾害-砖') {
    db.collection("resources").where({type:'砖'}).update({data:{closed:true}})
  } else if (type == '自然灾害-铁') {
    db.collection("resources").where({type:'铁'}).update({data:{closed:true}})
  } else if (type == '地震') {
    db.collection('players').get().then(res => {
      for (var i = 0; i < res.data.length; i++) {
        if (res.data[i].defenseNum > 0) {
          var defenseNum = res.data[i].defenseNum - 1;
          db.collection('players').doc(res.data[i]._id).update({data:{defenseNum:defenseNum}})
        } else {
          var mu = Math.round(res.data[i].mu / 2);
          var yang = Math.round(res.data[i].yang / 2);
          var mai = Math.round(res.data[i].mai / 2);
          var zhuan = Math.round(res.data[i].zhuan / 2);
          var tie = Math.round(res.data[i].tie / 2);
          db.collection('players').doc(res.data[i]._id).update({data:{mu:mu, mai:mai, yang:yang, zhuan:zhuan, tie:tie}})
        }
      }
    })
  } else if (type == '陨石') {
    var sites = ["1_0_0", "1_2_0", "1_2_5", "1_4_0", "1_4_5", "2_0_0", "2_3_0", "2_3_6", "2_5_6", "3_0_0", "3_6_7", "3_7_0", "4_0_0", "4_5_9", "4_8_0", "4_8_9", "5_6_0", "5_9_0", "6_7_11", "6_11_0", "7_0_0", "7_11_0", "7_12_0", "8_0_0", "8_9_13", "8_13_0", "9_13_14", "9_14_0", "11_12_16", "11_15_16", "12_0_0", "12_16_0", "13_0_0", "13_14_0", "13_17_0", "14_15_0", "14_17_18", "15_16_19", "15_18_19", "16_0_0", "16_19_0", "17_0_0", "17_18_0", "18_0_0", "18_19_0", "19_0_0"]

    var randomNums = [];
    while (randomNums.length < 3) {
      var num =  Math.floor(Math.random() * sites.length);
      if (randomNums.indexOf(num) < 0) {
        randomNums.push(num);
      }
    }
    remark += '陨石'
    for (var i = 0; i < randomNums.length; i++) {
      var name = '村庄' + sites[randomNums[i]];
      var village = null;
      await db.collection('villages').where({name:name}).get().then(res => {
        if (res.data.length > 0) {
          village = res.data[0];
        }
      })

      if (village != null) {
        await db.collection('players').doc(village.playerId).get().then(res => {
          if (res.data.defenseNum > 0) {
            db.collection('players').doc(village.playerId).update({data:{defenseNum:_.inc(-1)}})
            remark += "破坏被防御 ";
          } else {
            db.collection('villages').doc(village._id).remove()
            remark += "破坏" + village.name + "成功"
            var deltaScore = -1;
            if (village.level == 2) {
              deltaScore = -2;
            }
            db.collection('players').doc(village.playerId).update({data:{score:_.inc(deltaScore)}})
          }
        })
      }
    }
  } else if (type == '恶龙') {
    var village = null;
    var site = null;

    if (event.villageName != null) {
      site = event.villageName.replace('村庄', '');
      await db.collection('villages').where({name:event.villageName}).get().then(res => {
        village = res.data[0]
      })
    } else {
      var sites = ["1_2_5", "1_4_5", "2_3_6", "2_5_6", "3_6_7", "4_5_9", "4_8_9","6_7_11", "8_9_13", "9_13_14", "11_12_16", "11_15_16", "14_17_18", "15_16_19", "15_18_19"]
      var num = Math.floor(Math.random() * sites.length);
      var name = '村庄' + sites[num]
      site = sites[num]
      remark += '恶龙'
      await db.collection('villages').where({name:name}).get().then(res => {
        if (res.data.length > 0) {
          village = res.data[0];
        }
      })
    }
    
    if (village != null) {
      await db.collection('villages').doc(village._id).remove()
      remark += "破坏" + village.name + "成功"
      var deltaScore = -1;
      if (village.level == 2) {
        deltaScore = -2;
      }
      await db.collection('players').doc(village.playerId).update({data:{score:_.inc(deltaScore)}})
    } else {
      remark += "攻击" + site + "成功"
    }
    var target = site.split("_");
    for (var i = 0; i < target.length; i++) {
      await db.collection('resources').doc(Number(target[i])).update({data:{closed:true}})
    }
    await db.collection('events').doc('1').update({data:{target:target}}) 
    
  } else if (type == '恶霸') {
    var resources = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19]
    var target = []
    
    while (target.length < 3) {
      var num = Math.floor(Math.random() * resources.length)
      if (target.indexOf(resources[num]) < 0) {
        target.push(resources[num])
      }
    }

    for (var i = 0; i < target.length; i++) {
      await db.collection('resources').doc(target[i]).update({data:{closed:true}})
    }

    remark = '恶霸占领资源点' + target[0] + "_" + target[1] + "_" + target[2];
    db.collection('events').doc('1').update({data:{target:target}})
    
  } else if (type == '生产专家') {
    var owner = null;
    await db.collection('events').doc('1').get().then(res => {
      owner = res.data.owner;
    })

    if (owner != null) {
      await db.collection('players').doc(owner).update({data:{muSp:2, maiSp:2, yangSp:2, zhuanSp:2, tieSp:2}})
    } else {
      await db.collection('players').where({_id:_.neq("0")}).update({data:{muSp:1.5, maiSp:1.5, yangSp:1.5, zhuanSp:1.5, tieSp:1.5}})
    }
  }

  db.collection('events').doc('1').update({data:{remark:remark}})

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}