//app.js

wx.cloud.init({  //初始调用云函数
  env:"test-0tr93",
  traceUser:true
})

import mqtt from './library/mqtt.js';

const host =
'wxs://www.xjtuzhijiysx.cn/mqtt';
const options = {
  protocolVersion: 4, //MQTT连接协议版本
  //clientId: randomString(10),
  clientId: "userShAkeN",
  clean: true,
  //username: '1v1r5ep/zhihu_iamliubo',
  //password: 'tNVKODyl2chbm5yp',
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  resubscribe: true
};
App({
  globalData: {
    userInfo: null,
    client_ID: options.clientId,
    client: mqtt.connect(host, options),
    CONNECT:true,
    db:wx.cloud.database({
      env:"test-0tr93"
    })
  },

  onLaunch: function () {
    var that=this;

 

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    //get system information
    /*wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })*/
  
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息，并校验用户的openId与数据库中储存的openID是否匹配，若不匹配则增加新的字段
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
              let openid=123;
              let fuckPromise=new Promise((resolve)=>{   //promise风格
                wx.cloud.callFunction({
                  name:'getOpenID',
                }).then((res)=>{
                  openid=res.result.openid;
                }).then(()=>{
                  testCloudOpenId(that.globalData.userInfo.nickName,that.globalData.db,openid);  //测试有无此用户
                  testStroage(that.globalData.db,that.globalData.userInfo.nickName);// 测试缓存里有无该用户的信息
                })
                resolve();
              })
            }
          })
        }
      }
    }),
      wx.getSystemInfo({
        success: e => {
          this.globalData.StatusBar = e.statusBarHeight;
          let capsule = wx.getMenuButtonBoundingClientRect();
          if (capsule) {
            this.globalData.Custom = capsule;
            //this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
          } else {
            //this.globalData.CustomBar = e.statusBarHeight + 50;
          }
        }
      })
      var that=this;
      this.globalData.client.on('connect',function(err){
        if(!err){
          that.globalData.CONNECT=false;
          console.log(that.globalData.CONNECT);
        }
      })

  },



})



function randomString(len) {
  len = len || 32;
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  var maxPos = $chars.length;
  var pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}
/** 
 * 对nickName进行查询操作，若未查询到相应字段，则进行字段补全操作
*/

function testCloudOpenId(nickName,db,openid){   
  db.collection('user').doc(nickName).get({
    success:res=>{
      if(openid==res.data.openid){
        return 1;
      }
      else{
        db.collection('user').doc(nickName).update({    //回调..
          data:{
            openid:openid
          },
          success:res=>{
            console.log("update success");
          }
        })
      }
    },
    fail:res=>{
      db.collection('user').add({
        data:{
          _id:nickName,
          openid:openid
        },
        success:()=>{
          console.log("success add")
        }
      });
      emptyPlanArray=new Array(8);
      db.collection('userPlan').doc(nickName).update({
        data:{
          planArray:emptyPlanArray
        }
      })
    }
  })
}

/**
 * 
 * @param {database} db  
 * @param {string} nickName 
 */

function testStroage(db,nickName){
  db.collection('userPlans').doc(nickName).get({
    success:(res)=>{
    wx.setStorageSync('nmsl', res.data.nmsl);
    for(var i=0;i<res.data.planArray.length;i++){
      if(res.data.planArray[i]!=null){
      wx.setStorageSync((i+1).toString(),res.data.planArray[i]);
      }
      if(res.data.timeList[i]!=null){    //cloudFeedBackList 3 dim array
      wx.setStorageSync("timeList"+(i+1).toString(), res.data.timeList[i]);
      }
    }

    },
    fail:()=>{
      console.log("没有此用户的数据")
    }
  });

}
