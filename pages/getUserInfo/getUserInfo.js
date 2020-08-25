//index.js
//获取应用实例
const app = getApp()
import mqtt from '../../library/mqtt.js';

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    time: (new Date()).toString(),
    client:null,
    formArray:null
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../plan/plan'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
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


  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

})


function speretTime(date,time,mood) {          //分开时间返回整形数  
  switch (mood) {
    case "date":
      return {
        year :parseInt(dateArray.substring(0, 4)),
        month : parseInt(dateArray.substring(5, 7)),
        day : parseInt(dateArray.substring(8, 10)),
      }
      case "time":{
        return {

        }

      }
  
    default:
      break;
  }

}
