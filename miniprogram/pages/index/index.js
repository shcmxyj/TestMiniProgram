//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    playerId: null,
    mu:0,
    yang:0,
    mai:0,
    zhuan:0,
    tie:0,
    muSp:1,
    yangSp:1,
    maiSp:1,
    zhuanSp:1,
    tieSp:1,
    cannotBuild:false,
    cannotTran:false,
    roadBtn: true,
    villageBtn: true,
    townBtn: true,
    developBtn: true,
    openDevelopBtn: true,
    darkDevelopBtn: true,
    assholeBtn: true,
    knightBtn: true,
    multiArray: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19], [0, 2, 4], [0]],
    multiIndex: [0, 0, 0],
    assholeSelected:"未选择",
    assholeSelectedId:null,
    knightSelected:"未选择",
    knightSelectedId:null,
    allResourceIds:[1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    auctionNumbers:[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    allIntervals:[],
    devYangCostO:0,
    devMaiCostO:0,
    devTieCostO:0,
    devYangCostD:0,
    devMaiCostD:0,
    devTieCostD:0,
    score:0.0,
    buildCost:1,
    isFirstVillage:true,
    allVillages:[],
    btnText:{road:"1木1砖", village:"1木1砖1羊1麦", town:"2麦3铁"},
    curOpenDevelop: {name: "等待刷新", remainTime:30},
    intervalMap:null,
    cardInterval:null,
    eventInterval:null,
    developTimer:[],
    developCardTypes:[[{name:"破坏-村庄", costYang:[2, 3, 6], costMai:[1, 3, 5], costTie:[1, 2, 5]}, {name:"破坏-城镇", costYang:[2, 6, 10], costMai:[3, 6, 10], costTie:[3, 6, 10]}, {name:"破坏-道路", costYang:[1, 2, 4], costMai:[1, 2, 4], costTie:[1, 2, 4]} ,{name:"破坏-掠夺", costYang:[1, 2, 4], costMai:[1, 2, 4], costTie:[1, 2, 4]}],
      [{name:"制裁-资源", costYang:[1, 2, 3], costMai:[1, 1, 3], costTie:[0, 1, 2]}, {name:"制裁-港口", costYang:[1, 1, 2], costMai:[1, 1, 1], costTie:[0, 1, 1]}, {name:"制裁-建造", costYang:[1, 2, 3], costMai:[1, 2, 3], costTie:[1, 1, 2]}],
      [{name:"投资-黑市", costYang:[1, 2, 3], costMai:[1, 2, 3], costTie:[1, 1, 3]}, {name:"投资-期货", costYang:[1, 2, 2], costMai:[1, 1, 2], costTie:[0, 1, 2]}, {name:"投资-科技", costYang:[1, 2, 4], costMai:[1, 2, 4], costTie:[1, 2, 4]}, {name:"投资-借贷", costYang:[1, 2, 3], costMai:[1, 1, 2], costTie:[0, 1, 2]}],
      [{name:"防御-加固", costYang:[2, 3, 6], costMai:[1, 3, 5], costTie:[1, 2, 5]}]],
    eventTypes:[["自然灾害-木", "自然灾害-羊", "自然灾害-麦", "自然灾害-砖", "自然灾害-铁"], ["资源贬值-木", "资源贬值-羊", "资源贬值-麦", "资源贬值-砖", "资源贬值-铁"],["陨石"],["地震"],["拍卖恶龙"],["恶霸"],["拍卖生产专家"]],
    developPhase:0,
    defenseNum:0,
    allDevelopCards:[],
    curEvent:{type:'等待刷新', remainTime:120, remark:'', target:[]},
    // harvestInterval:[72, 72, 72, 72, 72, 72, 60, 51, 45, 40, 36, 33, 30, 28, 26, 24, 22, 21, 20, 19, 18, 17, 16, 16, 15, 14, 14, 13, 13, 12, 12],
    harvestInterval:[45, 45, 45, 45, 45, 45, 40, 36, 33, 30, 28, 26, 24, 22, 21, 20, 19, 18, 17, 16, 16, 15, 14, 14, 13, 13, 12, 12],
    allTimeouts:[],
    isAttacking: false
  },
  
  onLoad: function() {
    const db = wx.cloud.database()
    var that = this
    wx.getSetting({
      success: res => {
        console.log("xxx")
        console.log(res.authSetting)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log("xxx")
              console.log(res.userInfo)

              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },
  handleGetUserInfo(e) {
    console.log(e.detail.userInfo)
  },

  init: function() {
    this.setData({assholeSelectedId:null})
    this.setData({assholeSelected:"未选择"})
    this.setData({knightSelectedId:null})
    this.setData({knightSelected:"未选择"})
    this.setData({score:0.0})
    this.setData({buildCost: 1})
    this.setData({btnText: {road: "1木1砖", village: "1木1砖1羊1麦", town: "2麦3铁"}})
    this.setData({isFirstVillage: true})
    this.setData({intervalMap: new Map()})
    if (this.data.cardInterval != null) {
      clearInterval(this.data.cardInterval)
    }
    if (this.data.eventInterval != null) {
      clearInterval(this.data.eventInterval)
    }
    
    this.setData({cardInterval: null})
    this.setData({eventInterval: null})
    if (this.data.allTimeouts.length > 0) {
      for (var i = 0; i < this.data.allTimeouts.length; i++) {
        clearTimeout(this.data.allTimeouts[i])
      }
    } 
    this.setData({allTimeouts: []})
    this.setData({developPhase: 0})
    this.setData({allDevelopCards:[]})
    this.setData({isAttacking:false})

    
    const db = wx.cloud.database()
    var that = this;
    db.collection("players").where({name:this.data.userInfo.nickName}).get().then(res=>{
        console.log(this.data.userInfo);

        console.log(res);
        if (res.data.length > 0) {
          that.data.playerId = res.data[0]._id;
          db.collection("players").doc(res.data[0]._id).update({
            data:{
              name:that.data.userInfo.nickName,
              mu:4,
              yang:2,
              mai:2,
              zhuan:4,
              tie:0,
              muSp:1,
              yangSp:1,
              maiSp:1,
              zhuanSp:1,
              tieSp:1,
              score:0,
              cannotBuild:false,
              cannotTran:false,
              defenseNum:0
            }
          })
          that.initData()
        } else {
          console.log("2222");
          db.collection("players").add({
            data: {
              openid:that.data.userInfo.openid,
              name:that.data.userInfo.nickName,
              mu:4,
              yang:2,
              mai:2,
              zhuan:4,
              tie:0,
              muSp:1,
              yangSp:1,
              maiSp:1,
              zhuanSp:1,
              tieSp:1,
              score:0,
              cannotBuild:false,
              cannotTran:false,
              defenseNum:0
            }
          }).then (res=>{
              console.log('3333')
              console.log(res);
              that.data.playerId = res._id;
              that.initData()
            }
          )
        }
    }) 

   
  },

  initData: function() {
    var that = this;
    for (var i = 0; i < this.data.allIntervals.length; i++) {
      clearInterval(this.data.allIntervals[i])
    }
    this.data.allIntervals = [];
    for (var i = 0; i < this.data.developTimer.length; i++) {
      clearTimeout(this.data.developTimer[i])
    }
    this.data.developTimer = [];
    const db = wx.cloud.database()
    // db.collection("assholes").where({playerId:this.data.playerId}).remove()
    // db.collection("knights").where({playerId:this.data.playerId}).remove()
    wx.cloud.callFunction({name:'initData', data:{playerId:this.data.playerId}}).then(res => {
      const db = wx.cloud.database()
      const watcher = db.collection('players').doc(that.data.playerId)
        .watch({
          onChange: function(snapshot) {
            that.setData({mu: snapshot.docs[0].mu});
            that.setData({yang: snapshot.docs[0].yang});
            that.setData({mai: snapshot.docs[0].mai});
            that.setData({zhuan: snapshot.docs[0].zhuan});
            that.setData({tie: snapshot.docs[0].tie});
            that.setData({muSp: snapshot.docs[0].muSp});
            that.setData({yangSp: snapshot.docs[0].yangSp});
            that.setData({maiSp: snapshot.docs[0].maiSp});
            that.setData({zhuanSp: snapshot.docs[0].zhuanSp});
            that.setData({tieSp: snapshot.docs[0].tieSp});
            that.setData({score: snapshot.docs[0].score});
            // if (that.data.score < 5) {
            //   that.setData({buildCost: 1})
            //   that.setData({btnText: {road: "1木1砖", village: "1木1砖1羊1麦", town: "2麦3铁"}})
            // } else if (that.data.score < 9) {
            //   that.setData({buildCost: 2})
            //   that.setData({btnText: {road: "2木2砖", village: "2木2砖2羊2麦", town: "4麦6铁"}})
            // } else {
            //   that.setData({buildCost: 4})
            //   that.setData({btnText: {road: "4木4砖", village: "4木4砖4羊4麦", town: "8麦12铁"}})
            // }
            that.setData({cannotBuild: snapshot.docs[0].cannotBuild});
            that.setData({cannotTran: snapshot.docs[0].cannotTran});
            if (snapshot.docs[0].defenseNum < that.data.defenseNum) {
              console.log("defenseNumOld:" + that.data.defenseNum)
              console.log("defenseNumNew:" + snapshot.docs[0].defenseNum)
              var nowIdx = 0;
              for (var i = 0; i < that.data.allDevelopCards.length; i++) {
                if (that.data.allDevelopCards[i].name == '防御-加固') {
                  nowIdx = i;
                  that.data.allDevelopCards.splice(nowIdx, 1);
                  break;
                }
              }
              that.setData({allDevelopCards:that.data.allDevelopCards})
            }
            that.setData({defenseNum: snapshot.docs[0].defenseNum});

            that.refreshBtn();
          },
          onError: function(err) {
            console.error('the watch closed because of error', err)
          }
        })

        db.collection('villages').where({playerId:that.data.playerId}).watch({
          onChange:function(snapshot) {
            for (var i = 0; i < snapshot.docs.length; i++) {
              if (snapshot.docs[i].level == 2) {
                snapshot.docs[i].name = snapshot.docs[i].name.replace('村庄', '城镇')
              }
            }

            that.setData({allVillages:snapshot.docs})
          },
          onError: function(err) {
            console.error('the watch closed because of error', err)
          }
        })

        db.collection('events')
        .watch({
          onChange: function(snapshot) {
            var oldRemark = that.data.curEvent.remark;
            that.setData({curEvent: snapshot.docs[0]});
            that.newEvent(oldRemark)
          },
          onError: function(err) {
            console.error('the watch closed because of error', err)
          }
        })

        this.newOpenCard();
        this.setData({devYangCostD:1, devMaiCostD:1, devTieCostD:1})
        
        // var timer = setTimeout(function(){
        //   that.setData({developPhase: that.data.developPhase + 1})
        //   that.setData({devYangCostD:2, devMaiCostD:2, devTieCostD:2})
        //   that.refreshBtn()
        //   var timer2 = setTimeout(function(){
        //     that.setData({developPhase: that.data.developPhase + 1})
        //     that.setData({devYangCostD:3, devMaiCostD:3, devTieCostD:3})
        //     that.refreshBtn()
        //   }, 200000)
        //   that.data.developTimer.push(timer2)
        // }, 200000)
        // that.data.developTimer.push(timer)

        // 主机
        if (that.data.playerId == '15d399db5f1886b400613380723d4504') {
          db.collection('events').doc('1').update({data:{type:"等待刷新", remainTime:120, remark:''}})
          that.data.eventInterval = setInterval(that.eventTimePass, 1000) 
        }
    })
  },

  eventTimePass: function(){
    const db = wx.cloud.database()
    var that = this;
    db.collection('events').doc('1').get().then(res => {
      var remainTime = res.data.remainTime;
      if (remainTime < 1) {
        clearInterval(that.data.eventInterval)
        that.publishNewEvent().then(res2 => {
          
        })
        
      } else {
        remainTime--;
        db.collection('events').doc('1').update({data:{remainTime:remainTime}})
      }
    })
  },

  saveAuction: function(e) {
    const db = wx.cloud.database()
    var that = this;
    db.collection('events').doc('1').get().then(res => {
      if (res.data.type == '拍卖恶龙') {
        var resourceNum = that.data.auctionNumbers[e.detail.value]; 
        if (resourceNum > that.data.tie) {
          wx.showToast({
            title: '没有足够的铁',
            icon: 'none',
            duration: 2000
          })
        } else {
          that.addTie(null, resourceNum * -1);
          db.collection('eventSells').add({data:{playerId:that.data.playerId, num:resourceNum}})
        }
      } else if (res.data.type == '拍卖生产专家') {
        var resourceNum = that.data.auctionNumbers[e.detail.value]; 
        if (resourceNum > that.data.mu) {
          wx.showToast({
            title: '没有足够的木',
            icon: 'none',
            duration: 2000
          })
        } else {
          that.addMu(null, resourceNum * -1);
          db.collection('eventSells').add({data:{playerId:that.data.playerId, num:resourceNum}})
        }
      } else {
        wx.showToast({
          title: '没有拍卖进行',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  publishNewEvent: function() {
    var that = this;
    var randomNum = Math.floor(Math.random() * this.data.eventTypes.length);
    var eventGroup = this.data.eventTypes[randomNum];
    randomNum = Math.floor(Math.random() * eventGroup.length);
    var type = eventGroup[randomNum];
    console.log("类型" + type);
    // var type = '拍卖生产专家'
    return new Promise(function(resolve, reject) {
      wx.cloud.callFunction({name:"newDisaster", data:{type:type, isAuto:true}}).then(res => {
        that.data.eventInterval = setInterval(that.eventTimePass, 1000);
        resolve(res)
      })
    })
  },

  newEvent: function(oldRemark) {
    if (this.data.curEvent == null) {
      return;
    }

    if (oldRemark != this.data.curEvent.remark && this.data.curEvent.remark != null && 
      this.data.curEvent.remark != '') {
      wx.showToast({
        title: this.data.curEvent.remark,
        icon: 'none',
        duration: 3000
      })
    }

    var that = this;
    const db = wx.cloud.database()
    const _ = db.command 
    db.collection('events').doc('1').get().then(res => {
      if (res.data.type == '等待恶龙攻击') {
        if (res.data.owner == that.data.playerId) {
          if (!that.data.isAttacking) {
            that.data.isAttacking = true;
            db.collection('villages').where({playerId:_.neq(this.data.playerId)}).orderBy('level', 'desc').get().then(res => {
              var length = res.data.length;
              if (length > 6) {
                length = 6;
              }
              var items = []
              for (var i = 0; i < length; i++) {
                items.push(res.data[i].name);
              }
              that.getVillageName(items).then(function(res){
                wx.cloud.callFunction({name:'newDisaster',  data:{
                  type: '恶龙',
                  villageName: res,
                  isAuto: false
                }}).then(res => {
                  that.data.isAttacking = false;
                })
              })        
            })
          }
        } else {
          db.collection('eventSells').where({playerId:that.data.playerId}).get().then(res => {
            that.addTie(null, Number(res.data[0].num));
          })
        }
      } 
    })
  },

  addOpenDevelop: function () {
    if (this.data.allDevelopCards.length >= 3) {
      wx.showToast({
        title:"无法购买更多发展卡",
        icon: "none"
      }) 
      return;
    }

    this.data.allDevelopCards.push(this.data.curOpenDevelop)
    this.data.curOpenDevelop.remainTime = 1;
    this.setData({allDevelopCards: this.data.allDevelopCards})
    if (this.data.curOpenDevelop.name == '防御-加固') {
      const db = wx.cloud.database()
      db.collection('players').doc(this.data.playerId).get().then(res => {
        var defenseNum = res.data.defenseNum + 1;
        db.collection('players').doc(this.data.playerId).update({data:{defenseNum:defenseNum}})
      })
    }

    this.addYang(null, -this.data.devYangCostO);
    this.addMai(null, -this.data.devMaiCostO);
    this.addTie(null, -this.data.devTieCostO);
  },

  useDevelopCard: function (e) {
    var nowIdx = e.currentTarget.dataset.idx;
    var card = this.data.allDevelopCards[nowIdx];
    const db = wx.cloud.database()
    const _ = db.command
    var that = this;
    if (card.name == '破坏-村庄') {
      db.collection('villages').where({playerId:_.neq(this.data.playerId), level:1}).get().then(res => {
        var length = res.data.length;
        if (length > 6) {
          length = 6;
        }
        var items = []
        for (var i = 0; i < length; i++) {
          items.push(res.data[i].name);
        }
        that.getVillageName(items).then(function(res){
          wx.cloud.callFunction({name:'damageVillage',  data:{
            name: res
          }}).then(res => {
            wx.showToast({
              title: res.result.result,
              icon: "none",
              duration: 3000
            })
          })
          that.data.allDevelopCards.splice(nowIdx, 1);
          that.setData({allDevelopCards:that.data.allDevelopCards})          
        })        
      })
    } else if (card.name == '破坏-城镇') {
      db.collection('villages').where({playerId:_.neq(this.data.playerId), level:2}).get().then(res => {
        var length = res.data.length;
        if (length > 6) {
          length = 6;
        }
        var items = []
        for (var i = 0; i < length; i++) {
          items.push(res.data[i].name);
        }
        that.getVillageName(items).then(function(res){
          wx.cloud.callFunction({name:'damageVillage',  data:{
            name: res
          }}).then(res => {
            wx.showToast({
              title: res.result.result,
              icon: "none",
              duration: 3000
            })
          }) 
          that.data.allDevelopCards.splice(nowIdx, 1);
          that.setData({allDevelopCards:that.data.allDevelopCards})         
        })        
      })
    } else if (card.name == '破坏-道路') {
      db.collection('players').where({_id:_.neq(this.data.playerId)}).get().then(res => {
        var items = []
        for (var i = 0; i < res.data.length; i++) {
          items.push(res.data[i].name);
        }
        that.getPlayerId(items, res.data).then(function(res){
          wx.cloud.callFunction({name:'damageRoad', data:{playerId:res}}).then(res => {
            wx.showToast({
              title: res.result.result,
              icon: "none",
              duration: 3000
            })
            that.data.allDevelopCards.splice(nowIdx, 1);
            that.setData({allDevelopCards:that.data.allDevelopCards})
          })
         })
        })
      
    } else if (card.name == '破坏-掠夺') {
      db.collection('players').where({_id:_.neq(this.data.playerId)}).get().then(res => {
        var items = []
        for (var i = 0; i < res.data.length; i++) {
          items.push(res.data[i].name);
        }
        that.getPlayerId(items, res.data).then(function(res){
          that.getResourceType().then(function(res2){
            wx.cloud.callFunction({name:'robResource', data:{playerId:res, resourceType:res2, mineId: that.data.playerId}}).then(res => {
              wx.showToast({
                title: res.result.result,
                icon: "none",
                duration: 3000
              })
              that.data.allDevelopCards.splice(nowIdx, 1);
              that.setData({allDevelopCards:that.data.allDevelopCards})
            })
          })
        })        
      })
    } else if (card.name == '制裁-资源') {
      db.collection('players').where({_id:_.neq(this.data.playerId)}).get().then(res => {
        var items = []
        for (var i = 0; i < res.data.length; i++) {
          items.push(res.data[i].name);
        }
        that.getPlayerId(items, res.data).then(function(res){
          that.getResourceType().then(function(res2){
            wx.cloud.callFunction({name:'stopResource', data:{playerId:res, resources:[res2], newSp:0}}).then(res3 => {
              wx.showToast({
                title: '制裁成功',
                icon: "none"
              })
              that.data.allTimeouts.push(setTimeout(function(){
                wx.cloud.callFunction({name:'stopResource', data:{playerId:res, resources:[res2], newSp:1}})
              }, 60000))
              that.data.allDevelopCards.splice(nowIdx, 1);
              that.setData({allDevelopCards:that.data.allDevelopCards})
            })
          })
        })        
      })
    } else if (card.name == '制裁-港口') {
      db.collection('players').where({_id:_.neq(this.data.playerId)}).get().then(res => {
        var items = []
        for (var i = 0; i < res.data.length; i++) {
          items.push(res.data[i].name);
        }
        that.getPlayerId(items, res.data).then(function(res){
          wx.cloud.callFunction({name:'stopTran', data:{playerId:res, value:true}}).then(res2 => {
            wx.showToast({
              title: '制裁成功',
              icon: "none"
            })
            that.data.allTimeouts.push(setTimeout(function(){
              wx.cloud.callFunction({name:'stopTran', data:{playerId:res, value:false}})
            }, 30000))
            that.data.allDevelopCards.splice(nowIdx, 1);
            that.setData({allDevelopCards:that.data.allDevelopCards})
          })    
        })        
      })
    } else if (card.name == '制裁-建造') {
      db.collection('players').where({_id:_.neq(this.data.playerId)}).get().then(res => {
        var items = []
        for (var i = 0; i < res.data.length; i++) {
          items.push(res.data[i].name);
        }
        that.getPlayerId(items, res.data).then(function(res){
          wx.cloud.callFunction({name:'stopBuild', data:{playerId:res, value:true}}).then(res2 => {
            wx.showToast({
              title: '制裁成功',
              icon: "none"
            })
            that.data.allTimeouts.push(setTimeout(function(){
              wx.cloud.callFunction({name:'stopBuild', data:{playerId:res, value:false}})
            }, 30000))
            that.data.allDevelopCards.splice(nowIdx, 1);
            that.setData({allDevelopCards:that.data.allDevelopCards})
          })    
        })        
      })
    } else if (card.name == '投资-黑市') {
      that.data.allDevelopCards.splice(nowIdx, 1);
      that.setData({allDevelopCards:that.data.allDevelopCards})
      wx.showToast({
        title: '请任意+2资源',
        icon:'none',
        duration:2500
      })
    } else if (card.name == '投资-科技') {
      this.updateScore(1);
      that.data.allDevelopCards.splice(nowIdx, 1);
      that.setData({allDevelopCards:that.data.allDevelopCards})
    } else if (card.name == '投资-借贷') {
      that.harvest(true)
      db.collection('villages').where({playerId:this.data.playerId}).get().then(res => {
        for (var i = 0; i < res.data.length; i++) {
          // for (var j = 0; j < res.data[i].resources.length; j++) {
          //   var resourceId = res.data[i].resources[j];
          //   that.harvest(resourceId, res.data[i]._id)
          // }
          db.collection('villages').doc(res.data[i]._id).update({data:{closed:true}});
          var delta = Math.floor(Math.random() * 41) - 20;
          that.data.allTimeouts.push(setTimeout(function(num){
            db.collection('villages').doc(res.data[num]._id).update({data:{closed:false}});
            wx.showToast({
              title: '投资-借贷结束',
              icon: 'none',
              duration: 3000
            })
          }, (30 + delta) * 1000, i))
        }
        that.data.allDevelopCards.splice(nowIdx, 1);
        that.setData({allDevelopCards:that.data.allDevelopCards})
      })
    } else if (card.name == '投资-期货') {
      that.getResourceType().then(function(res2){
        db.collection('players').doc(that.data.playerId).get().then(res => {
          var ratios = [0.5, 1, 1.5, 1.5, 2, 2, 2, 2.5, 3, 4]
          var randomNum = Math.floor(Math.random() * ratios.length);
          if (res2 == '木') {
            var mu = res.data.mu;
            db.collection('players').doc(that.data.playerId).update({data:{mu:0}});
            that.data.allTimeouts.push(setTimeout(function(num){
              db.collection('players').doc(that.data.playerId).update({data:{mu:num}});
              wx.showToast({
                title: '投资-期货结束，获取' + num + '木',
                icon: 'none',
                duration: 3000
              })
            }, 30000, Math.round(ratios[randomNum] * mu)))
          } else if (res2 == '羊') {
            var yang = res.data.yang;
            db.collection('players').doc(that.data.playerId).update({data:{yang:0}});
            that.data.allTimeouts.push(setTimeout(function(num){
              db.collection('players').doc(that.data.playerId).update({data:{yang:num}});
              wx.showToast({
                title: '投资-期货结束，获取' + num + '羊',
                icon: 'none',
                duration: 3000
              })
            }, 30000, Math.round(ratios[randomNum] * yang)))
          } else if (res2 == '麦') {
            var mai = res.data.mai;
            db.collection('players').doc(that.data.playerId).update({data:{mai:0}});
            that.data.allTimeouts.push(setTimeout(function(num){
              db.collection('players').doc(that.data.playerId).update({data:{mai:num}});
              wx.showToast({
                title: '投资-期货结束，获取' + num + '麦',
                icon: 'none',
                duration: 3000
              })
            }, 30000, Math.round(ratios[randomNum] * mai)))
          } else if (res2 == '砖') {
            var zhuan = res.data.zhuan;
            db.collection('players').doc(that.data.playerId).update({data:{zhuan:0}});
            that.data.allTimeouts.push(setTimeout(function(num){
              db.collection('players').doc(that.data.playerId).update({data:{zhuan:num}});
              wx.showToast({
                title: '投资-期货结束，获取' + num + '砖',
                icon: 'none',
                duration: 3000
              })
            }, 30000, Math.round(ratios[randomNum] * zhuan)))
          } else if (res2 == '铁') {
            var tie = res.data.tie;
            db.collection('players').doc(that.data.playerId).update({data:{tie:0}});
            that.data.allTimeouts.push(setTimeout(function(num){
              db.collection('players').doc(that.data.playerId).update({data:{tie:num}});
              wx.showToast({
                title: '投资-期货结束，获取' + num + '铁',
                icon: 'none',
                duration: 3000
              })
            }, 30000, Math.round(ratios[randomNum] * tie)))
          }
          that.data.allDevelopCards.splice(nowIdx, 1);
          that.setData({allDevelopCards:that.data.allDevelopCards})
        })
      });      
    } else {
      
    }
  },

  addDarkDevelop: function() {
    if (this.data.allDevelopCards.length >= 3) {
      wx.showToast({
        title:"无法购买更多发展卡",
        icon: "none"
      }) 
      return;
    }
    var randomNum = Math.floor(Math.random()*4);
    var cardGroup = this.data.developCardTypes[randomNum];
    randomNum = Math.floor(Math.random() * cardGroup.length);

    this.data.allDevelopCards.push(cardGroup[randomNum])
    this.setData({allDevelopCards: this.data.allDevelopCards})
     var that = this;
    if (cardGroup[randomNum].name == '防御-加固') {
      const db = wx.cloud.database()
      db.collection('players').doc(this.data.playerId).get().then(res => {
        var defenseNum = res.data.defenseNum + 1;
        db.collection('players').doc(this.data.playerId).update({data:{defenseNum:defenseNum}})
      })
    }

    this.addYang(null, -this.data.devYangCostD);
    this.addMai(null, -this.data.devMaiCostD);
    this.addTie(null, -this.data.devTieCostD);
  },

  newOpenCard: function() {
    var randomNum = Math.floor(Math.random()*4);
    var cardGroup = this.data.developCardTypes[randomNum];
    randomNum = Math.floor(Math.random() * cardGroup.length);
    cardGroup[randomNum].remainTime = 30;
    this.data.cardInterval = setInterval(this.cardTimePass, 1000, cardGroup[randomNum])
    this.setData({curOpenDevelop:cardGroup[randomNum]});
    this.setData({devYangCostO:cardGroup[randomNum].costYang[this.data.developPhase], devMaiCostO:cardGroup[randomNum].costMai[this.data.developPhase], devTieCostO:cardGroup[randomNum].costTie[this.data.developPhase]})
    this.refreshBtn();
  },

  cardTimePass: function(card) {
    card.remainTime--;
    this.setData({curOpenDevelop: card})
    this.refreshBtn()
    if (card.remainTime < 1) {
      clearInterval(this.data.cardInterval)
      this.newOpenCard()
    }
  },

  updateScore: function(delta) {
    const db = wx.cloud.database()
    db.collection('players').doc(this.data.playerId).get().then(res => {
      db.collection('players').doc(this.data.playerId).update({data:{score:res.data.score + delta}})
    })
  },

  addMu: function(e, value) {
    var delta;
    var that = this;
    if (e != null) {
      delta = Number(e.currentTarget.dataset.value);
    } else {
      delta = value;
    }
    // this.setData({ mu: this.data.mu + delta})

    const db = wx.cloud.database()
    db.collection("players").doc(this.data.playerId).get().then(res => {
      db.collection("players").doc(that.data.playerId).update({data:{mu: res.data.mu + delta}});
    })    
  },

  addMai: function(e, value) {
    var delta;
    var that = this;
    if (e != null) {
      delta = Number(e.currentTarget.dataset.value);
    } else {
      delta = value;
    }
    // this.setData({ mai: this.data.mai + delta})

    const db = wx.cloud.database()
    db.collection("players").doc(this.data.playerId).get().then(res => {
      db.collection("players").doc(that.data.playerId).update({data:{mai: res.data.mai + delta}});
    })    
  },

  addYang: function(e, value) {
    var delta;
    var that = this;
    if (e != null) {
      delta = Number(e.currentTarget.dataset.value);
    } else {
      delta = value;
    }
    // this.setData({ yang: this.data.yang + delta})

    const db = wx.cloud.database()
    db.collection("players").doc(this.data.playerId).get().then(res => {
      db.collection("players").doc(that.data.playerId).update({data:{yang: res.data.yang + delta}});
    })    
  },

  addZhuan: function(e, value) {
    var delta;
    var that = this;
    if (e != null) {
      delta = Number(e.currentTarget.dataset.value);
    } else {
      delta = value;
    }
    // this.setData({ zhuan: this.data.zhuan + delta})

    const db = wx.cloud.database()
    db.collection("players").doc(this.data.playerId).get().then(res => {
      db.collection("players").doc(that.data.playerId).update({data:{zhuan: res.data.zhuan + delta}});
    })    
  },

  addTie: function(e, value) {
    var delta;
    var that = this;
    if (e != null) {
      delta = Number(e.currentTarget.dataset.value);
    } else {
      delta = value;
    }
    // this.setData({ tie: this.data.tie + delta})

    const db = wx.cloud.database()
    db.collection("players").doc(this.data.playerId).get().then(res => {
      db.collection("players").doc(that.data.playerId).update({data:{tie: res.data.tie + delta}});
    })    
  },
  
  addRoad: function(e) {
    this.addMu(null, -1 * this.data.buildCost);
    this.addZhuan(null, -1 * this.data.buildCost);
    this.refreshBtn()
  },

  addTown: function(e) {
    const db = wx.cloud.database()
    var that = this;

    db.collection("villages").where({playerId:this.data.playerId}).get().then(res => {
      var allVillages = res.data;
      var items = [];
      for (var i = 0; i < allVillages.length; i++) {
        if (allVillages[i].level == 1) {
          items.push(allVillages[i].name);
        }
      }

      that.getVillageName(items).then(function(res){
        that.upgradeVillage(res, allVillages);
      })
    })
    
  },

  getVillageName: function(items) {
    if (items.length > 6) {
      items = items.slice(0, 6)
    }

    return new Promise(function(resolve, reject) {
      wx.showActionSheet({
        itemList: items,
        success: function(res) {
          var itemName = items[res.tapIndex];
          resolve(itemName)
        }
      })
    })
  },

  getPlayerId: function(items, players) {
    return new Promise(function(resolve, reject) {
      wx.showActionSheet({
        itemList: items,
        success: function(res) {
          resolve(players[res.tapIndex]._id)
        }
      })
    })
  },

  getResourceType: function() {
    var items = ['木', '麦', '羊', '砖', '铁'];
    return new Promise(function(resolve, reject) {
      wx.showActionSheet({
        itemList: items,
        success: function(res) {
          resolve(items[res.tapIndex])
        }
      })
    })
  },

  addDevelop: function(e) {
    this.setData({yang: this.data.yang - 1})
    this.setData({mai: this.data.mai - 1})
    this.setData({tie: this.data.tie - 1})
    this.refreshBtn()
  },

  addAsshole: function(e) {
    const db = wx.cloud.database()
    db.collection("assholes").add({
      data: {
        playerId:this.data.playerId,
        hp:5,
        attack:1,
        accuracy:0.5,
        resourceId:0,
        name:"恶霸r0h5"
      }
    }) 
    this.setData({yang: this.data.yang - 2})
    this.setData({mu: this.data.mu - 1})
    this.refreshBtn()
  },

  addKnight: function(e) {
    const db = wx.cloud.database()
    db.collection("knights").add({
      data: {
        playerId:this.data.playerId,
        hp:5,
        attack:1,
        accuracy:0.7,
        name:"骑士h5"
      }
    })
    this.setData({mai: this.data.mai - 1})
    this.setData({tie: this.data.tie - 1})
    this.setData({zhuan: this.data.zhuan - 1})
    this.refreshBtn()
  },

  selectAsshole: function() {
    const db = wx.cloud.database()
    var items = [];
    var assholeIds = [];
    var that = this;
    db.collection("assholes").where({playerId:this.data.playerId}).get().then(res => {
      console.log(res.data);
      for (var i = 0; i < res.data.length; i++) {
        items.push(res.data[i].name)
        assholeIds.push(res.data[i]._id)
      }

      wx.showActionSheet({
        itemList: items,
        success: function(res) {
          that.setData({assholeSelected:items[res.tapIndex]})
          that.setData({assholeSelectedId:assholeIds[res.tapIndex]})
        }
     })
    });
    
  },

  assholeAttack:function(e) {
    if (this.data.assholeSelectedId == null) {
      wx.showToast({
        title:"未选择恶霸",
        icon: "none"
      }) 
      return;
    }

    var that = this;
    const db = wx.cloud.database();
    db.collection("assholes").doc(this.data.assholeSelectedId).get().then(res => {
      if (res.data == null) {
        wx.showToast({
          title:"恶霸已阵亡",
          icon: "none"
        }) 
      } else {
        wx.cloud.callFunction({
          name:'closeResource',
          data:{
            resourceId: that.data.allResourceIds[e.detail.value],
            assholeId: res.data._id
          }
        }).then(res => {
          wx.showToast({
            title:"攻击成功",
            icon: "none"
          }) 
          that.setData({assholeSelected:"未选择", assholeSelectedId:null})
        })
      }
    })
  },

  selectKnight: function() {
    const db = wx.cloud.database()
    var items = [];
    var knightIds = [];
    var that = this;
    db.collection("knights").where({playerId:this.data.playerId}).get().then(res => {
      console.log(res.data);
      for (var i = 0; i < res.data.length; i++) {
        items.push(res.data[i].name)
        knightIds.push(res.data[i]._id)
      }

      wx.showActionSheet({
        itemList: items,
        success: function(res) {
          that.setData({knightSelected:items[res.tapIndex]})
          that.setData({knightSelectedId:knightIds[res.tapIndex]})
        }
     })
    });
  },

  knightAttack:function() {
    if (this.data.knightSelectedId == null) {
      wx.showToast({
        title:"未选择骑士",
        icon: "none"
      }) 
      return;
    }

    var knightId = this.data.knightSelectedId;
    var that = this;
    const db = wx.cloud.database()
    const _ = db.command
    db.collection("assholes").where({playerId:_.neq(this.data.playerId), resourceId:_.neq(0)}).get().then(res => {
      if (res.data.length > 0) {
        var items = [];
        var assholeIds = [];
        for (var i = 0; i < res.data.length; i++) {
          items.push(res.data[i].name);
          assholeIds.push(res.data[i]._id);
        }

        wx.showActionSheet({
          itemList: items,
          success: function(res) {
            var assholeId = assholeIds[res.tapIndex];
            wx.cloud.callFunction({
              name:'openResource',
              data: {
                knightId:knightId,
                assholeId:assholeId
              }
            }).then(res => {
              wx.showToast({
                title:res.result,
                icon: "none"
              }) 
              that.setData({knightSelected:"未选择", knightSelectedId:null})
            })
          }
       })
      }
    })
    
  },

  refreshBtn: function(e) {
    if (this.data.mu >= 1 * this.data.buildCost && this.data.zhuan >= 1 * this.data.buildCost) {
      this.setData({roadBtn: false})
    } else {
      this.setData({roadBtn: true})
    }
    if (this.data.mu >= 1 * this.data.buildCost && this.data.zhuan >= 1 * this.data.buildCost && this.data.yang >= 1 * this.data.buildCost && this.data.mai >= 1 * this.data.buildCost) {
      this.setData({villageBtn: false})
    } else {
      this.setData({villageBtn: true})
    }

    if (this.data.mai >= 2 * this.data.buildCost && this.data.tie >= 3 * this.data.buildCost) {
      this.setData({townBtn: false})
    } else {
      this.setData({townBtn: true})
    }

    if (this.data.yang >= this.data.devYangCostO && this.data.mai >= this.data.devMaiCostO && this.data.tie >= this.data.devTieCostO) {
      this.setData({openDevelopBtn:false})
    } else {
      this.setData({openDevelopBtn:true})
    }

    if (this.data.yang >= this.data.devYangCostD && this.data.mai >= this.data.devMaiCostD && this.data.tie >= this.data.devTieCostD) {
      this.setData({darkDevelopBtn:false})
    } else {
      this.setData({darkDevelopBtn:true})
    }

    // if (this.data.yang >= 1 && this.data.mai >= 1 && this.data.tie >= 1) {
    //   this.setData({developBtn: false})
    // } else {
    //   this.setData({developBtn: true})
    // }

    // if (this.data.yang >= 2 && this.data.mu >= 1) {
    //   this.setData({assholeBtn: false})
    // } else {
    //   this.setData({assholeBtn: true})
    // }

    // if (this.data.mai >= 1 && this.data.zhuan >= 1 && this.data.tie >= 1) {
    //   this.setData({knightBtn: false})
    // } else {
    //   this.setData({knightBtn: true})
    // }

    // if (this.data.mu >= 1 && this.data.zhuan >= 1) {
    //   this.setData({roadBtn: false})
    // } else {
    //   this.setData({roadBtn: true})
    // }
  },

  upgradeVillage: function(name, allVillages) {
    const db = wx.cloud.database()
    for (var i = 0; i < allVillages.length; i++) {
      if (allVillages[i].name == name) {
        db.collection("villages").where({name:name}).update({data:{level:2}})
        this.addMai(null, -2 * this.data.buildCost)
        this.addTie(null, -3 * this.data.buildCost)
        this.updateScore(1);

      }
    }  
  },

  getRandomNumbers: function (length, numbers) {
    var result = [];
    while (result.length < numbers) {
      var num = Math.floor(Math.random() * length);
      if (result.indexOf(num) < 0) {
        result.push(num)
      }
    }
    return result;
  },

  harvest: function(isOneTime) {
    var that = this;
    const db = wx.cloud.database()
    db.collection('villages').where({playerId: this.data.playerId}).get().then(res2 => {
      if (res2.data.length > 0) {
        that.getAllResources(res2.data).then(res => {
          var randomNumbers;
          if (res.length > 2) {
            randomNumbers = that.getRandomNumbers(res.length, 3); 
          } else {
            randomNumbers = that.getRandomNumbers(res.length, res.length);
          }
          for (var i = 0; i < randomNumbers.length; i++) {
            var type = res[randomNumbers[i]].type;
            var level = res[randomNumbers[i]].level;
            if (type == '麦') {
              if (level == 1) {
                this.addMai(null, 1 * that.data.maiSp)
                console.log(`时间: ${new Date()} 麦+1`)
              } else {
                this.addMai(null, 2 * that.data.maiSp)
                console.log(`时间: ${new Date()} 麦+2`)
              }
            } else if (type == "木") {
              if (level == 1) {
                this.addMu(null, 1 * that.data.muSp)
                console.log(`时间: ${new Date()} 木+1`)
              } else {
                this.addMu(null, 2 * that.data.muSp)
                console.log(`时间: ${new Date()} 木+2`)
              }
            } else if (type == '羊') {
              if (level == 1) {
                this.addYang(null, 1 * that.data.yangSp)
                console.log(`时间: ${new Date()} 羊+1`)
              } else {
                this.addYang(null, 2 * that.data.yangSp)
                console.log(`时间: ${new Date()} 羊+2`)
              }
            } else if (type == '砖') {
              if (level == 1) {
                this.addZhuan(null, 1 * that.data.zhuanSp)
                console.log(`时间: ${new Date()} 砖+1`)
              } else {
                this.addZhuan(null, 2 * that.data.zhuanSp)
                console.log(`时间: ${new Date()} 砖+2`)
              }
            } else if (type == '铁') {
              if (level == 1) {
                this.addTie(null, 1 * that.data.tieSp)
                console.log(`时间: ${new Date()} 铁+1`)
              } else {
                this.addTie(null, 2 * that.data.tieSp)
                console.log(`时间: ${new Date()} 铁+2`)
              } 
            }
          } 
          
          if (!isOneTime) {
            that.data.allTimeouts.push(setTimeout(that.harvest, that.data.harvestInterval[res.length] * 1000));
          }
        })
      //   var resources = [];
      //   for (var i = 0; i < res2.data.length; i++) {
      //     if (!res2.data[i].closed) {
      //       for (var j = 0; j < res2.data[i].resources.length; j++) {
      //         that.getResource(res2.data[i].resources[j]).then(res => {
      //           if (res != null) {
      //             resources.push(res);
      //             console.log(`时间: ${new Date()} `)
      //           }
      //         })
      //       }
      //     }
      //   }
      //   console.log(resources.length);
      }
    })
  },

  getAllResources: function(villages) {
    var that = this;
    return new Promise(function(resolve, reject) {
      var resources = [];
        for (var i = 0; i < villages.length; i++) {
          if (!villages[i].closed) {
            for (var j = 0; j < villages[i].resources.length; j++) {
              if (villages[i].resources[j] > 0) {
                resources.push(that.getResource(villages[i].resources[j], villages[i].level))
              }
            }
          }
        }
        Promise.all(resources).then(res => {
          var resources = [];
          for (var i = 0; i < res.length; i++) {
            if (res[i] != null) {
              resources.push(res[i])
            }
          }
          resolve(resources);
        })
    })
  },

  getResource: function(resourceId, level) {
    return new Promise(function(resolve, reject) {
      const db = wx.cloud.database()
      db.collection("resources").doc(resourceId).get().then(res => {
        if (res.data.closed) {
          resolve(null)
        } else {
          var r = new Object;
          r.type = res.data.type;
          r.level = level;
          resolve(r)
        }
      })
    })
  },

  // harvest: function(resourceId, villageId) {
  //   var that = this;
  //   const db = wx.cloud.database()
  //   db.collection("villages").where({_id:villageId}).get().then(res2 => {
  //     if (res2.data.length > 0 && !res2.data[0].closed) {
  //       db.collection("resources").doc(resourceId).get().then(res => {
  //         if (!res.data.closed) {
  //           var level = res2.data[0].level;
  //           if (res.data.type == '麦') {
  //             if (level == 1) {
  //               this.addMai(null, 1 * that.data.maiSp)
  //               console.log(`时间: ${new Date()} 麦+1`)
  //             } else {
  //               this.addMai(null, 1.5 * that.data.maiSp)
  //               console.log(`时间: ${new Date()} 麦+1.5`)
  //             }
  //           } else if (res.data.type == "木") {
  //             if (level == 1) {
  //               this.addMu(null, 1 * that.data.muSp)
  //               console.log(`时间: ${new Date()} 木+1`)
  //             } else {
  //               this.addMu(null, 1.5 * that.data.muSp)
  //               console.log(`时间: ${new Date()} 木+1.5`)
  //             }
  //           } else if (res.data.type == '羊') {
  //             if (level == 1) {
  //               this.addYang(null, 1 * that.data.yangSp)
  //               console.log(`时间: ${new Date()} 羊+1`)
  //             } else {
  //               this.addYang(null, 1.5 * that.data.yangSp)
  //               console.log(`时间: ${new Date()} 羊+1.5`)
  //             }
  //           } else if (res.data.type == '砖') {
  //             if (level == 1) {
  //               this.addZhuan(null, 1 * that.data.zhuanSp)
  //               console.log(`时间: ${new Date()} 砖+1`)
  //             } else {
  //               this.addZhuan(null, 1.5 * that.data.zhuanSp)
  //               console.log(`时间: ${new Date()} 砖+1.5`)
  //             }
  //           } else if (res.data.type == '铁') {
  //             if (level == 1) {
  //               this.addTie(null, 1 * that.data.tieSp)
  //               console.log(`时间: ${new Date()} 铁+1`)
  //             } else {
  //               this.addTie(null, 1.5 * that.data.tieSp)
  //               console.log(`时间: ${new Date()} 铁+1.5`)
  //             }
  //           }
  //         }
  //       })
  //     }
  //   })
   
  // },

  bindMultiPickerChange: function (e) {
    // this.data.allVillages.push()
    const db = wx.cloud.database()
    var that = this;
    var resources = [this.data.multiArray[0][e.detail.value[0]], this.data.multiArray[1][e.detail.value[1]], this.data.multiArray[2][e.detail.value[2]]];
    var v = new Object;
    v.playerId = this.data.playerId;
    v.resources = resources;
    v.level = 1;
    v.closed = false;
    var name = "村庄";
    for (var i = 0; i < resources.length - 1; i++) {
      name += resources[i] + "_";
    }
    name += resources[resources.length - 1];
    v.name = name;

    db.collection("villages").where({name:v.name}).get().then(res => {
      if (res.data.length > 0) {
        wx.showToast({
          title:"村庄已存在",
          icon: "none"
        }) 
      } else {
        db.collection("villages").add({
          data:v
        }).then(res => {
          v._id = res._id;
          that.addMu(null, -1 * this.data.buildCost)
          that.addZhuan(null, -1 * this.data.buildCost)
          that.addMai(null, -1 * this.data.buildCost)
          that.addYang(null, -1 * this.data.buildCost)
          that.updateScore(1);
          if (that.data.isFirstVillage) {
            that.setData({isFirstVillage: false});
            that.harvest(false);
          }
          // if (that.data.isFirstVillage) {
          //   that.setData({isFirstVillage: false});
          //   for (var i = 0; i < resources.length; i++) {
          //     if (resources[i] > 0) {
          //       that.harvest(resources[i], v._id)
          //     }
          //   }
          // }
    
          // that.refreshBtn()
          // var resourceId = v.resources[0];
          // db.collection('resources').doc(resourceId).get().then(res =>{
          //   this.data.allIntervals.push(setInterval(that.harvest, res.data.interval, resourceId, v._id));
          //   resourceId = v.resources[1];
          //   if (resourceId > 0) {
          //     db.collection('resources').doc(resourceId).get().then(res =>{
          //       this.data.allIntervals.push(setInterval(that.harvest, res.data.interval, resourceId, v._id));
          //       resourceId = v.resources[2];
          //       if (resourceId > 0) {
          //         db.collection('resources').doc(resourceId).get().then(res =>{
          //           this.data.allIntervals.push(setInterval(that.harvest, res.data.interval, resourceId, v._id));
          //         });
          //       }
          //     })
          //   }
          // })
        })
      }
    })
},
  bindMultiPickerColumnChange: function (e) {
    console.log(e);
    var data = {
        multiArray: this.data.multiArray,
        multiIndex: this.data.multiIndex
    };
        data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
        case 0:
        switch (data.multiArray[0][data.multiIndex[0]]) {
            case 1:
            data.multiArray[1] = [0, 2, 4];
            data.multiArray[2] = [0];
            break;
            case 2:
            data.multiArray[1] = [0, 3, 5];
            data.multiArray[2] = [0];
            break;
            case 3:
            data.multiArray[1] = [0, 6, 7];
            data.multiArray[2] = [0];
            break;
            case 4:
            data.multiArray[1] = [0, 5, 8];
            data.multiArray[2] = [0];
            break;
            case 5:
            data.multiArray[1] = [6, 9];
            data.multiArray[2] = [0];
            break;
            case 6:
            data.multiArray[1] = [7, 11];
            data.multiArray[2] = [11];
            break;
            case 7:
            data.multiArray[1] = [0, 11, 12];
            data.multiArray[2] = [0];
            break;
            case 8:
            data.multiArray[1] = [0, 9, 13];
            data.multiArray[2] = [0];
            break;
            case 9:
            data.multiArray[1] = [13, 14];
            data.multiArray[2] = [14];
            break;
            case 11:
            data.multiArray[1] = [12, 15];
            data.multiArray[2] = [16];
            break;
            case 12:
            data.multiArray[1] = [0, 16];
            data.multiArray[2] = [0];
            break;
            case 13:
            data.multiArray[1] = [0, 14, 17];
            data.multiArray[2] = [0];
            break;
            case 14:
            data.multiArray[1] = [15, 17];
            data.multiArray[2] = [0];
            break;
            case 15:
            data.multiArray[1] = [16, 18];
            data.multiArray[2] = [19];
            break;
            case 16:
            data.multiArray[1] = [0, 19];
            data.multiArray[2] = [0];
            break;
            case 17:
            data.multiArray[1] = [0, 18];
            data.multiArray[2] = [0];
            break;
            case 18:
            data.multiArray[1] = [0, 19];
            data.multiArray[2] = [0];
            break;
            case 19:
            data.multiArray[1] = [0];
            data.multiArray[2] = [0];
            break;
        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
        case 1:
        switch (data.multiArray[0][data.multiIndex[0]]) {
        case 1:
          switch (data.multiArray[1][data.multiIndex[1]]) {
            case 0:
            data.multiArray[2] = [0];
            break;
            case 2:
            data.multiArray[2] = [0, 5];
            break;
            case 4:
            data.multiArray[2] = [0, 5];
            break;
          
          }
          break;
        case 2:
          switch (data.multiArray[1][data.multiIndex[1]]) {
            case 0:
            data.multiArray[2] = [0];
            break;
            case 3:
            data.multiArray[2] = [0, 6];
            break;
            case 5:
            data.multiArray[2] = [6];
            break;
          }
          break;
        case 2:
          switch (data.multiArray[1][data.multiIndex[1]]) {
            case 0:
            data.multiArray[2] = [0];
            break;
            case 3:
            data.multiArray[2] = [0, 6];
            break;
            case 5:
            data.multiArray[2] = [6];
            break;
          }
          break;
        case 3:
          switch (data.multiArray[1][data.multiIndex[1]]) {
            case 0:
            data.multiArray[2] = [0];
            break;
            case 6:
            data.multiArray[2] = [7];
            break;
            case 7:
            data.multiArray[2] = [0];
            break;
          }
          break;
        case 4:
          switch (data.multiArray[1][data.multiIndex[1]]) {
            case 0:
            data.multiArray[2] = [0];
            break;
            case 5:
            data.multiArray[2] = [9];
            break;
            case 8:
            data.multiArray[2] = [0, 9];
            break;
          }
          break;
        case 5:
          switch (data.multiArray[1][data.multiIndex[1]]) {
            case 6:
            data.multiArray[2] = [0];
            break;
            case 9:
            data.multiArray[2] = [0];
            break;
          }
          break;
        case 6:
          switch (data.multiArray[1][data.multiIndex[1]]) {
            case 7:
            data.multiArray[2] = [11];
            break;
            case 11:
            data.multiArray[2] = [0];
            break;
          }
          break;
        case 7:
          switch (data.multiArray[1][data.multiIndex[1]]) {
            case 0:
            data.multiArray[2] = [0];
            break;
            case 11:
            data.multiArray[2] = [12];
            break;
            case 12:
            data.multiArray[2] = [0];
            break;
          }
          break;
        case 8:
          switch (data.multiArray[1][data.multiIndex[1]]) {
            case 0:
            data.multiArray[2] = [0];
            break;
            case 9:
            data.multiArray[2] = [13];
            break;
            case 13:
            data.multiArray[2] = [0];
            break;
          }
          break;
        case 9:
          switch (data.multiArray[1][data.multiIndex[1]]) {
            case 13:
            data.multiArray[2] = [14];
            break;
            case 14:
            data.multiArray[2] = [0];
            break;
          }
          break;
        case 11:
          switch (data.multiArray[1][data.multiIndex[1]]) {
            case 12:
            data.multiArray[2] = [16];
            break;
            case 15:
            data.multiArray[2] = [0, 16];
            break;
          }
          break;
        case 12:
          switch (data.multiArray[1][data.multiIndex[1]]) {
            case 0:
            data.multiArray[2] = [0];
            break;
            case 16:
            data.multiArray[2] = [0];
            break;
          }
          break;
        case 13:
          switch (data.multiArray[1][data.multiIndex[1]]) {
            case 0:
            data.multiArray[2] = [0];
            break;
            case 14:
            data.multiArray[2] = [17];
            break;
            case 17:
            data.multiArray[2] = [0];
            break;
          }
          break;
        case 14:
          switch (data.multiArray[1][data.multiIndex[1]]) {
            case 15:
            data.multiArray[2] = [0, 18];
            break;
            case 17:
            data.multiArray[2] = [18];
            break;
          }
          break;
        case 15:
          switch (data.multiArray[1][data.multiIndex[1]]) {
            case 16:
            data.multiArray[2] = [19];
            break;
            case 18:
            data.multiArray[2] = [19];
            break;
          }
          break;
        case 16:
          switch (data.multiArray[1][data.multiIndex[1]]) {
            case 0:
            data.multiArray[2] = [0];
            break;
            case 19:
            data.multiArray[2] = [0];
            break;
          }
          break;
        case 17:
          switch (data.multiArray[1][data.multiIndex[1]]) {
            case 0:
            data.multiArray[2] = [0];
            break;
            case 18:
            data.multiArray[2] = [0];
            break;
          }
          break;
        case 18:
          switch (data.multiArray[1][data.multiIndex[1]]) {
            case 0:
            data.multiArray[2] = [0];
            break;
            case 19:
            data.multiArray[2] = [0];
            break;
          }
          break;
        case 19:
          switch (data.multiArray[1][data.multiIndex[1]]) {
            case 0:
            data.multiArray[2] = [0];
            break;
          }
          break;
        } 
    data.multiIndex[2] = 0;
    // console.log(data.multiIndex);
    break;
}
this.setData(data);
},

  // onLoad: function() {
  //   if (!wx.cloud) {
  //     wx.redirectTo({
  //       url: '../chooseLib/chooseLib',
  //     })
  //     return
  //   }

  //   // 获取用户信息
  //   wx.getSetting({
  //     success: res => {
  //       if (res.authSetting['scope.userInfo']) {
  //         // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
  //         wx.getUserInfo({
  //           success: res => {
  //             this.setData({
  //               avatarUrl: res.userInfo.avatarUrl,
  //               userInfo: res.userInfo
  //             })
  //           }
  //         })
  //       }
  //     }
  //   })
  // },

  // onGetUserInfo: function(e) {
  //   if (!this.data.logged && e.detail.userInfo) {
  //     this.setData({
  //       logged: true,
  //       avatarUrl: e.detail.userInfo.avatarUrl,
  //       userInfo: e.detail.userInfo
  //     })
  //   }
  // },

  // onGetOpenid: function() {
  //   // 调用云函数
  //   wx.cloud.callFunction({
  //     name: 'login',
  //     data: {},
  //     success: res => {
  //       console.log('[云函数] [login] user openid: ', res.result.openid)
  //       app.globalData.openid = res.result.openid
  //       wx.navigateTo({
  //         url: '../userConsole/userConsole',
  //       })
  //     },
  //     fail: err => {
  //       console.error('[云函数] [login] 调用失败', err)
  //       wx.navigateTo({
  //         url: '../deployFunctions/deployFunctions',
  //       })
  //     }
  //   })
  // },

  // // 上传图片
  // doUpload: function () {
  //   // 选择图片
  //   wx.chooseImage({
  //     count: 1,
  //     sizeType: ['compressed'],
  //     sourceType: ['album', 'camera'],
  //     success: function (res) {

  //       wx.showLoading({
  //         title: '上传中',
  //       })

  //       const filePath = res.tempFilePaths[0]
        
  //       // 上传图片
  //       const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
  //       wx.cloud.uploadFile({
  //         cloudPath,
  //         filePath,
  //         success: res => {
  //           console.log('[上传文件] 成功：', res)

  //           app.globalData.fileID = res.fileID
  //           app.globalData.cloudPath = cloudPath
  //           app.globalData.imagePath = filePath
            
  //           wx.navigateTo({
  //             url: '../storageConsole/storageConsole'
  //           })
  //         },
  //         fail: e => {
  //           console.error('[上传文件] 失败：', e)
  //           wx.showToast({
  //             icon: 'none',
  //             title: '上传失败',
  //           })
  //         },
  //         complete: () => {
  //           wx.hideLoading()
  //         }
  //       })

  //     },
  //     fail: e => {
  //       console.error(e)
  //     }
  //   })
  // },

})
