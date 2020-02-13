//index.js
//获取应用实例
const app = getApp()
import mqtt from '../../library/mqtt.js';

Page({
  data: {                    //page页面数据定义
    client: null,  
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    time:(new Date()).toString()
  },

  
 
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../plan/creatPlans'
    })
  },


  onLoad: function () {
    //验证网络请求，getUserInfo
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  

  ////验证网络请求，getUserInfo


  //
  testName: function(testValue){
    testValue="test";
    console.log(this.testValue);
    console.log(testValue);
    this.setData(
      {time:20});
  wx.navigateTo({
      url: '../getUserInfo/getUserInfo',
    })
//old ends here

    var that = this;
    that.data.client=app.globalData.client;
  
    that.data.client.on('connect',e=>{
      console.log("ok");
      that.data.client.subscribe('presence',function(err){
        if(!err)
        {
          that.data.client.publish('presence','my first mqtt connection')
        }
      })
    });
    that.data.client.on('message',function(topic,message){
      console.log(message.toString());
      that.data.client.end();
      
    })
  
  },
  

initialization:function(){           //缓存数组编号
    var numberArray=new Array();
    for(let i=0;i<12;i++)
    {
      numberArray.push(null);
    }
    wx.setStorage({
      key:"nmsl",
      data:numberArray,
      success:function(){
        console.log("success");
      }
    })
  }

 
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

function log(){
  console.log("ok");
}