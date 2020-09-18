/*creatPlans.js*/
/** 
 * 
 * delet:
 *      -mqtt
 *      -numberTime
 *      -number
 *      -full
 *      -tempTime
 *      -upLoadArray
 *
*/
const app = getApp();
var util = require('../../../utils/util.js');
// var upLoadArray=new Array();           //不确定哪里会用到，所以先注释了
var plugin = requirePlugin("WechatSI")
let manager = plugin.getRecordRecognitionManager();
var storage=null;


var plans= {
  name: "",   //药物名称
  date: "",  //开始服药日期
  timer:[],  //设定的时间数组
  lengthOfTime: null,    //服药时间长度
  frenquency: null,      //一天吃几次
  drugsInOneDay:null,     //一次吃多少
  // afterOrBefore: null,   //饭前饭后吃
  interval:null,      //服药间隔天数（若每天都吃则为null)
  };


var upLoadPlans={       //上传数组
  name:"",              //药物名称，可用于校验
  number:-1,          //对应的药盒编号,-1代表没有办法
  timer:[],             //每天的服药时间段
  drugsInOneDay:null,   //每天吃多少
  dateArray:[],         //日期数组，可能不会要但是得写上
  // afterOrBefore:null,   //饭前吃还是饭后吃
  start:false           //是否已经开始吃药
};

/**
 * delet
 *      -N        2020/9/16
 *      -howMany  2020/9/16
 */

Page({
  data: {
    client:null,
    test:"",
    isSubmit:false,    
    indexTime:null,                            //设置当前一天需要多少中药物
    picker:["1","2","3","4","5","6","7","8"],  //选择有多少种药物
    date1:"2020-09-16",
    array:[],
    timeChanger:[],
    numberArray:[],
    changeTempVar:false,
    MName:null
  },

  recordStart(){
    console.log('start record')
    manager.start({
      lang:"zh_CN"
    })
  },
  
  recordEnd(){
    console.log('end record')
    manager.stop()
  },

  initRecord(){
    manager.onStart=(res)=>{
      console.log("成功开始录音识别", res)
    }
    manager.onRecognize=(res)=>{
      let text=res.result;
      text=text.substring(0,text.length-1);
      console.log(text);
      this.setData({
        MName:text
      })
    }
    manager.onStop=(res)=>{
      let text=res.result;
      text=text.substring(0,text.length-1);
      console.log(text);
      this.setData({
        MName:text
      })
      if(text==''){
        console.log("no record is recognized")
      }
    }
  },
  /** 选择一天能吃几顿药，并进行plan.timer的创建工作
   * 2020/9/15 00:07
   *    -delet
   *      -numberTime
   *      -tempTime
   */

  PickerChange(e) {
    this.setData({
      indexTime: e.detail.value,          //一天以内吃几次的数量（frequency)
    });                         
    plans.timer=new Array(parseInt(this.data.indexTime));   //将timer数组赋值成NP的数组
    var arr=new Array();
    for(var i=0;i<parseInt(this.data.indexTime);i++)
    {
      arr.push({"symbolTime":"symbolTime"+i.toString(),time:"12:00"});
    }
    this.setData({
      array: arr,
    }); 
    arr=null;
  },
/** 
 * 2020/9/14 代码重构，主要解决不能整第二遍的情况
 * 2020/9/16 完成此函数的简化
 */
  TimeChange(e){
    var time= e.detail.value;
    plans.timer[parseInt(e.currentTarget.id)]=time;
    var arr=this.data.array;
    arr[parseInt(e.currentTarget.id)].time=time;  //同时改变渲染数组
    this.setData({
      array:arr
    })
    arr=null;
    //接下来进行plans.timer的重新排序
  },

DateChange(e) {     //将显示的日期改变
    var date=e.detail.value;
    plans.date=date;
      this.setData(
        {
          date1:date
        })
  },

/*表单提交函数*/
Submit: function(e)
{
  if(e.currentTarget.id=='drugName'){
  var name=e.detail.value;
  //console.log(e);
  if(name==plans.name&&name==null)
  {
    wx.showToast({
      title: 'error',
      duration: 2000
    })
  }
  else{
    plans.name=name;
    }
  
  }
  else if (e.currentTarget.id =='lengthOfTime')
  {
    var lengthOfTime = e.detail.value;
    if (lengthOfTime == null) {
      wx.showToast({
        title: 'error',
        icon: "none",
        duration: 2000
      })
    }
    else
      plans.lengthOfTime = lengthOfTime;
  }
  else if (e.currentTarget.id == 'drugInOneDay') {
    var drugInOneDay = e.detail.value;
    if (drugInOneDay == null) {
      wx.showToast({
        title: 'error',
        icon: "none",
        duration: 2000
      })
    }
    else {
      plans.drugsInOneDay = drugInOneDay;
    }
  }
  else if (e.currentTarget.id == 'interval') {
    var interval = e.detail.value;
    if (interval == null) {
      wx.showToast({
        title: 'error',
        icon: "none",
        duration: 2000
      })
    }
    else {
      plans.interval = interval;
      console.log(plans);
    }
  }
  },

getStorageSlef:function(){         //只有在输入药物名称的时候才可以进行下一步操作
  var that = this
  wx.getStorage({
    key: 'nmsl',
    success(res) {
      console.log(res.data)
      for (let i = 0; i < 8; i++) {
        if (res.data[i] == null) {
          upLoadPlans.number = i + 1;           //设置药盒编号
          res.data[i] = "Occupied"
          try {
            wx.setStorage({
              key: "nmsl",
              data: res.data,
            });
          }
          catch (e) {
            console.log(e);
          }
          break;
        }
      }
      storage=res.data;
    }
  })
},


dateCaculator(plans,upLoadPlans)   //计算日期数组
{
  if(upLoadPlans.dateArray[0]!=null){
    upLoadPlans.dateArray=[]
  }
  var year=parseInt(plans.date.substring(0,4));
  var month=parseInt(plans.date.substring(5,7));
  var day=parseInt(plans.date.substring(8,10));
  var dateMax=null;
  if(month==2)
  {
      if(year%4==0&&year%100!=0)
          dateMax=29;
      else
          dateMax=20;
  }
  else if(month>6&&month%2==0||month<7&&month%2!==0)
  {
      dateMax=31;
  }
  else{
      dateMax=30;
  }
  for(var i=0;i<plans.lengthOfTime;i++)
  {
      var string=new String();
      string=year.toString()+"-"+month.toString()+"-"+day.toString();
      upLoadPlans.dateArray.push(string);
    day = day + parseInt(plans.interval);
    if (day >= dateMax) {
      day = day % dateMax;
      month++;
      console.log(day);
    }
      console.log(string);
  }
},


upLoad(upLoadPlans){
    // var newJson = JSON.stringify(upLoadPlans); //数组转json字符串
    var newJson=upLoadPlans.number.toString()+"N"+upLoadPlans.name.toString()+"T"+this.timeArry()+"A";
    var that = this;
    that.data.client = app.globalData.client;
    that.data.client.on('connect', e => {
      console.log("药物上传连接成功");
      that.data.client.subscribe('SW_LED', function (err) {
        if (!err) {
          that.data.client.publish('SW_LED', newJson)
        }
      })
    });
    that.data.client.publish('time',currentTime());//向对面发送现在的时间
    that.data.client.on('message', function (topic, message) {
      console.log(message.toString(),"这是接受到的信息，接下来将关闭mqtt连接");
  })
 
},

/**
 *    此函数无引用，可以删除 
 * 
 *
*/

refresh(plans){     //plans 按值传递
    var toolplans= {
      name: "",
      date: "",
      lengthOfTime: null,
      frenquency: null,
      afterOrBefore: null,
      };
      toolplans.name=plans.name;
      toolplans.date=plans.date;
      toolplans.lengthOfTime=plans.lengthOfTime;
      toolplans.frenquency=plans.frenquency;
      toolplans.afterOrBefore=plans.afterOrBefore;
      return toolplans;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    if(upLoadPlans.timer[0]!=null&&plans.timer[0]!=null){
      upLoadPlans.timer=[];
      plans.timer=[]
    }
    this.getStorageSlef();
    console.log(upLoadPlans);
    this.initRecord();
    //var N=this.getOpenerEventChannel()
    
    
    const eventChannel = this.getOpenerEventChannel()
    //console.log(eventChannel);  
    eventChannel.emit('acceptDataFromCreatePlanPage', {data: 'get The information'});
  },

  changeTemp:function(e){
    console.log(e)
    if(e.detail.value==true){
      console.log(e.value)
      this.setData({
        changeTempVar:true
      })
    }
    },

  SM: function () {
    if(!plans.name){      //如果不对药名进行输入操作，则将识别的药名上传到数组里
      upLoadPlans.name=this.data.MName;  
    }
    else{
    upLoadPlans.name=plans.name;
    }
    upLoadPlans.drugsInOneDay=plans.drugsInOneDay;   //将输入的信息转移到上传的结构体中
    // upLoadPlans.afterOrBefore=plans.afterOrBefore;
    // upLoadPlans.timer=plans.timer;
    this.dateCaculator(plans,upLoadPlans);        //计算日期并直接修改upLoadPlans中的dateArray
    upLoadPlans.timer=sortTimer(plans.timer);
    console.log(upLoadPlans);
    var errorMessage=testAllFilled(upLoadPlans);
    console.log(errorMessage)
    if(errorMessage){                           //校验message
      wx.showModal({
        title:'请填写完整',
        content:(res=>{
          var message="有以下信息未填写完整:";
          for(let i=0;i<errorMessage.length;i++){
            message=message+errorMessage[i]+' ';
          }
          return message
        })(),
        success(res){
         if(res.confirm){
           //do nothong,wait for next move
         }
         else if(res.cancel){  //点击取消并返回
           storage[upLoadPlans.number-1]=null;
           console.log('storage',storage);
           wx.setStorage({
             data: storage,
             key: 'nmsl',
           })
           wx.navigateBack({
             delta: 1,
           })
         }
        }
      })
    }
    else{
      wx.setStorage({
          key: upLoadPlans.number.toString(),
          data: upLoadPlans,
        });
      this.upLoad(upLoadPlans);
     wx.navigateBack({
       delta: 1,
     })
    }
    
    // wx.showModal({
    //   title: '提示',
    //   content: '这是一个模态弹窗',
    //   success (res) {
    //     if (res.confirm) {
    //     console.log('用户点击确定')
    //   } 
    //   else if (res.cancel) {
    //     console.log('用户点击取消')
    //   }
    //   }
    // })

    // wx.showToast({
    //   title: '成功',
    //   icon:'success',
    //   duration:2000
    // })
  },

  onUnload: function () {
   if(this.data.isSubmit)
   {
     
      // console.log("Unload方法被调用");
       //console.log("下面是Data中的数据")
     const newEventChannel = this.getOpenerEventChannel();//注意这里必须新声明一个新的eventChannel
     newEventChannel.emit('acceptDataFromHidePlanPage', { data: this.data.test });
    
   }
  },
/**
 * 2020/08/19 预感到以后可能看不懂了
 * 
 * 2020/09/16 确实，看不懂了
 * 
 */
  
  timeArry:function(){         //计算数组发送  
    // console.log(timeCaluToday(today),upLoadPlans.dateArray[0],timeCaluPlan(upLoadPlans.dateArray[0]));
    var today=timeCaluToday(util.formatTime(new Date())) //获得今天的日期
    var day=timeCaluPlan(upLoadPlans)    //获取plan中的日期数组
    var timerUse=timeCaluPlanTimer(upLoadPlans.timer)
    
    var result=timeDiff(today.day,day[0],today.hour,timerUse[0].hour,today.min,timerUse[0].minute,1);
    var upLoadTimeString=result.hour.toString()+":"+result.minute.toString()+","
    
    for(let i=0;i<day.length;i++){
      for(let j=0;j<timerUse.length;j++){
        if(i==0&&j==0){
          continue;
        }
        else if(j==0){
          result=timeDiff(day[i-1],day[i],timerUse[timerUse.length-1].hour,timerUse[0].hour,timerUse[timerUse.length-1].minute,timerUse[0].minute,1);
          upLoadTimeString=upLoadTimeString+result.hour.toString()+":"+result.minute.toString()+",";
        }
        else{
          result=timeDiff(null,null,timerUse[j-1].hour,timerUse[j].hour,timerUse[j-1].minute,timerUse[j].minute,0)
          upLoadTimeString=upLoadTimeString+result.hour.toString()+":"+result.minute.toString()+",";
        }
      }
    }
    upLoadTimeString=upLoadTimeString.substring(0,upLoadTimeString.length-1);
    console.log(upLoadTimeString);
    return upLoadTimeString;
  }

})

function timeCaluToday(today){   //分割今天的时间和数组
  var day=parseInt(today.substring(8,10));
  var hour=parseInt(today.substring(11,13));
  var min=parseInt(today.substring(14,16));
  var todayDHM={
    day:day,
    hour:hour,
    min:min
  }
  return todayDHM;
}

function timeCaluPlan(plans){
  var day=[];
  try {
    for(let i=0;i<plans.dateArray.length;i++){
      day[i]=parseInt(plans.dateArray[i].substring(7,9));
    }
  } catch (error) {
    console.log(error);
  }
  return day
}

function timeCaluPlanTimer(timer){
  var timerSperet=[]
  try {
    for(let i=0;i<timer.length;i++){
      var toolTimeSruct={
        hour:parseInt(timer[i].substring(0,2)),
        minute:parseInt(timer[i].substring(3,5))
      }
      timerSperet.push(toolTimeSruct);
    }
  } catch (error) {
    console.log(error);
  }
  return timerSperet
}

function timeDiff(Aday,Bday,Ahour,Bhour,Amin,Bmin,type){      //计算时间差
  var result={
    hour:null,
    minute:null
  }
  if(type==1){    //计算天之间的时间差
    result.hour=parseInt((((Bday-Aday)*24+Bhour-Ahour)*60+(Bmin-Amin))/60)
    result.minute=(((Bday-Aday)*24+Bhour-Ahour)*60+(Bmin-Amin))%60
  }
  else{
    result.hour=parseInt(((Bhour-Ahour)*60+(Bmin-Amin))/60)
    result.minute=((Bhour-Ahour)*60+(Bmin-Amin))%60
  }
  return result;
}

function currentTime(){        //获得今天的日期，并进行字符串的拼接
  var todaySent=timeCaluToday(util.formatTime(new Date())) //获得今天的日期
  var stringSend=' Wed'+' Aug'+' '+todaySent.day.toString()+' '+todaySent.hour.toString()+":"+todaySent.min.toString()+":"+(Math.floor(Math.random()*60)).toString()+" 2020";
  console.log(stringSend);
  return stringSend;
}

function sortTimer(timer){   //接受未排序的时间分钟和小时进行累加，并进行排序，最后将时间还原成字符串
  var sortedTimer=timeCaluPlanTimer(timer);   //接受数组以便排序
  console.log(timer);
  try {
    for(let i=0;i<sortedTimer.length;i++){      //累加
      sortedTimer[i]=sortedTimer[i].hour*60+sortedTimer[i].minute
    }
  } catch (error) {
    console.log(error);
  }
  console.log("累加结束后的tiemr:",sortedTimer)
  for(let i=0;i<sortedTimer.length;i++){            //冒泡排序
    for(let j=sortedTimer.length-1;j>=i;j--){
        if(sortedTimer[j]<sortedTimer[j-1]){
            var tool=sortedTimer[j];
            sortedTimer[j]=sortedTimer[j-1];
            sortedTimer[j-1]=tool;
        }
    }
  }
  tool=null;

  for(let i=0;i<sortedTimer.length;i++)
  {
    var hourString=parseInt(sortedTimer[i]/60);
    var minuteString=parseInt(sortedTimer[i]%60);
    if(hourString<10){
      hourString="0"+hourString.toString()
    }
    if(minuteString<10){
      minuteString="0"+minuteString.toString();
    }
    else if(minuteString==0){
      minuteString="00"
    }
    sortedTimer[i]=hourString+":"+minuteString;
  }

  console.log("all done timer:",sortedTimer);
  return sortedTimer
}

/**
 *  对填入的信息进行校验
 * 
 * */ 
function testAllFilled(upLoadPlans){
  var errorMessage=new Array()
  for(var itemTest in upLoadPlans){
    if(upLoadPlans[itemTest] instanceof Array && upLoadPlans[itemTest][0]==null){
      errorMessage.push(itemTest);
    }
    else if(upLoadPlans[itemTest]==null)
    errorMessage.push(itemTest);
  }
  if(errorMessage[0]==null)
  return null;
  else
  return errorMessage;
}
