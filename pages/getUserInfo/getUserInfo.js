/* getUserInfo.js */
/* show the user's info and today's plans */
/* like this */
/* time  | name        |  eat? |*/
/* 12:00 | amoxicillin |  yes  |*/
/*       | Penicillin  |  yes  |*/
/* 13:00 | Gentamicin  |  no   |*/
const app = getApp()
import mqtt from '../../library/mqtt.js';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
var util = require('../../utils/util.js');

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },


  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../plan/plan'
    })
  },


  onLoad: function () {
    var today = speretTime(util.formatTime(new Date()),null,"today");  //获得今天的日期
    var involveTodayPlanArray=deletPlanNotInvolveToday(returnPlanArray(),today);//获得已经筛选过的日期数组
    if(!involveTodayPlanArray){
      console.log("今天没药吃，歇了吧您内")
    }
    var showArray=['time','name','eat?'];
    var timeSortArray=getSortedTimeArray(involveTodayPlanArray);
    for(let i=0;i<timeSortArray.length;i++){                      //将数组进行遍历并push进showArray中，最笨的方法
      
      for(let j=0;j<involveTodayPlanArray.length;j++){

      }


    }

    

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
        year : parseInt(date.substring(0, 4)),
        month : parseInt(date.substring(5, 7)),
        day : parseInt(date.substring(7, 9)),
      }
      case "time":{
        return {
          hour : parseInt(time.substring(0, 2)),
          minute : parseInt(time.substring(3, 5)),
        }
      }
      case "today":{
        return {
          year : parseInt(date.substring(0, 4)),
          month : parseInt(date.substring(5, 7)),
          day : parseInt(date.substring(8, 10)),
          hour : parseInt(date.substring(11, 13)),
          minute : parseInt(date.substring(14, 17)),
        }

      }
    default:
      break;
  }
}


function returnPlanArray() {   //返回获得的数组
  var planArray=new Array();
  for(let i=1;i<=5;i++){
    var Plan=wx.getStorageSync(i.toString())
    if(Plan){
      planArray.push(Plan);
    }
    Plan=null;
  }
  return planArray
}

function deletPlanNotInvolveToday(planArray,today){       //剔除掉那些包含不包含今天的数组，返回包含今天的数组
  if(planArray[0]){
    var involeTodayPlanArray=new Array()
    for(let i=0;i<planArray.length;i++){
      for(let j=0;j<planArray[i].dateArray.length;j++){
        if(today.day==speretTime(planArray[i].dateArray[j],null,"date").day){
          involeTodayPlanArray.push(planArray[i]);
          break;
        }
      }
    }
    planArray=null;
    return involeTodayPlanArray;
  }
  else
  return null;
}


function getSortedTimeArray(planArray) {     //返回排好序的时间数组
  var timeArray=new Array();
  for(let i=0;i<planArray.length;i++){
    for(let j=0;j<planArray[i].timer.length;j++){
      var time=speretTime(null,planArray[i].timer[j],"time");
      timeArray.push(time.hour+time.minute);
      time=null;
    }
  }
  for(let i=0;i<timeArray.length;i++){            //冒泡排序
      for(let j=timeArray.length-1;j>=i;j--){
          if(timeArray[j]<timeArray[j-1]){
              var tool=timeArray[j];
              timeArray[j]=timeArray[j-1];
              timeArray[j-1]=tool;
          }
      }
  } 
  for(let i=0;i<timeArray.length;i++){     //将时间还原成string
    timeArray[i]=parseInt(timeArray[i]/60).toString()+":"+(timeArray[i]%60).toString();
  }
  tool=null;
  return timeArray
}
