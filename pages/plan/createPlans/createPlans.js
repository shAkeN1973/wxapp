/*creatPlans.js*/
var number=null;
var temp=null;
var upLoadArray=new Array();
var plans= {
  name: "",
  date: "",
  lengthOfTime: null,
  frenquency: null,
  afterOrBefore: null,
  }
Page({
  data: {
    test:"",
    isSubmit:false,
    N:{},
    index:null,                                //默认数组的当前下标名
    picker:["1","2","3","4","5","6","7","8"],  //选择有多少种药物
    howMany:"0",
    date1:"2019-07-01",
    date2: "2019-07-01",
    array:[],
  },

  PickerChange(e) {
    this.setData({
      index: e.detail.value,
    });
    var size =parseInt(this.data.index);  //index为字符串，parseInt将其转化为数值
    number=size;                        //设立哨兵
    temp=0;                            //
    var arr=new Array();
    for(var i=0;i<size+1;i++)
    {
      arr.push({"symbol":"symbol"+i.toString(),date:"2019-01-01"});
    }
    this.setData({
      array: arr,
    }); 
  },


DateChange(e) {
    var date=e.detail.value;
    if(number>-1)
    {
      plans.date=date;
      var toolArray=new Array();
      toolArray=this.data.array;
      toolArray[temp].date=date;
      //upLoadArray[temp].date=date;
      this.setData(
        {
          array:toolArray
        }
      );
      
    this.upLoad(plans);
      toolArray=null;
    }
    else{
      wx.showToast({
        title: 'error',
        //icon: 'loading',
        duration: 2000
      })
    }
    /*
    arr3[0].date=plans.date;
    console.log(arr2);
    this.setData({
      array: arr3
    })*/
  },

/*表单提交函数*/
//药物名称改变函数
Submit: function(e)
{
  var name=e.detail.value;
  //upLoadArray[temp].name = name;
  if(name==plans.name&&name==null)
  {
    wx.showToast({
      title: 'error',
      //icon: 'loading',
      duration: 2000
    })
  }
  else{
    plans.name=name;
  }
},

upLoad(plans){
  var toolPlans={};
  toolPlans.name=plans.name;
  toolPlans.date=plans.date;
  if(number>-1&&plans.name!=null&&plans.date!=null)
  {
    upLoadArray.push(toolPlans);
    number--;
    temp++;
    console.log(upLoadArray);
   /*plans.date=null;
    plans.name=null;*/
  }
  else{
    wx.showToast({
      title: 'error',
      //icon: 'loading',
      duration: 2000
    })
  }



  /*
  plans.name=e.detail.value;
  //console.log(plans);
  this.setData({
    //test:abc,
    isSubmit:true
  });
 /*
  if (this.data.isSubmit){
    const eventChannel=this.getOpenerEventChannel();//注意这里必须新声明一个新的eventChannel
    eventChannel.emit('acceptDataFromHidePlanPage', { data: this.data.test });
   }*/
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //var N=this.getOpenerEventChannel()
    
    const eventChannel = this.getOpenerEventChannel()
    //console.log(eventChannel);  
    eventChannel.emit('acceptDataFromCreatePlanPage', {data: 'get The information'});
  },

  SM: function () {/*
    setTimeout(function () {
      wx.showToast({
        title: '上传成功',
        icon: 'success',
        duration: 2000
      })
    }, 2000),
      wx.showToast({
        title: '正在上传',
        icon: 'loading',
        duration: 2000
      });*/
      this.upLoad(plans);
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})