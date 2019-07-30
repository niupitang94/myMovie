//6.1初始化数据库 
const db=wx.cloud.database();
// pages/comment/comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:"",//输入框中用户输入内容
    score:5,//用户评分
    movieid:0,//电影id值
    detail:{},//保存电影信息
    images:[],//保存图片
    fileIDS:[]//上传成功保存fileID
  },

  mysubmit(){
    //功能：将选中图片上云存储中
    //功能：将云存储中fileID一次性存储云数据库集中
    //1:在data添加属性fileIDS:[]
    //2:显示加载动画提示框“正在提交中”
    wx.showLoading({
      title: '正在提交中...',
    });
    //3:上传到云存储
    //3.1:创建promise数组[保存promise对象]
    var promiseArr=[];
    //3.2:创建一个循环遍历选中图片
    for(var i=0;i<this.data.images.length;i++){
      //3.3:创建promise对象
      //promise负责完成上传一张图片任务
      //并且将图片 fileID保存数组中
      promiseArr.push(new Promise((resolve,reject)=>{
        //3.3.1:获取当前图片
        var item=this.data.images[i];
        //3.3.2:创建正则表达式拆分文件后缀名
        //.jpg .gif .png
        var suffix=/\.\w+$/.exec(item)[0];
        //3.3.3:上传图片并且将fileID保存数组
        //3.3.4:为图片创建新文件名
        var newFile = new Date().getDate()+Math.floor(Math.random()*9999) + suffix;
        wx.cloud.uploadFile({//上传
          cloudPath:newFile,  //新文件名
          filePath:item,      //选中文件
          success:res=>{      //上传成功
          //3.3.5上传成功拼接fileID
            var fid=res.fileID;
            var ids=this.data.fileIDS.concat(fid);
            this.setData({
              fileIDS:ids
            })
            //3.3.6:将当前promise任务追加任务列表中
            resolve();
          },
          //3.3.7:上传失败输出错误消息
          file:err=>{         //上传失败
            console.log(err);
          }
        })//上传结束
      }));//promise end
    }//for end
      //功能2：将云存储中fileID一次性存储云数据集中
      //4:在云数据库中添加集合 comment
      //此集合用于保存评论内容与文件 id
      //5:等待数组中所有promise任务执行结束
    Promise.all(promiseArr).then(res=>{
      //6:回调函数中
      //6.1：在程序最顶端初始化数据库
      //7:将评论内容 分数 电影 id 上传图片所有 id
      //添加集合中
      db.collection("comment")//指定集合
      .add({//添加记录
        data:{//数据
          content:this.data.value,//评论内容
          score:this.data.score,//评论分数
          movieid:this.data.moieid,//电影ID
          fileIds:this.data.fileIDS  //图片fileID
        }
      })
      .then(res=>{//数据库增加成功
        //8:隐藏加载框
        wx.hideLoading();
      //9:显示提示框"发表成功"
        wx.showToast({
          title:"发表成功"
        })
      //10:添加集合失败
      //11:隐藏加载提示框
      //12:显示提示框“评论失败”
      })
      .catch(err=>{//数据库增加失败
        wx.hideLoading();
        wx.showToast({
          title: '发表失败',
        })
      })
    })//promise结束
  },//图片上传云存储结束


   onContentChange(e){//e事件对象
   //输入框对应事件
   //用户输入内容
   console.log(e.detail);
    this.setData({
      value:e.detail
    })
   },


   onScoreChange(e){
     //用户打分对应事件处理函数
     //将用户输入新分数赋值操作
     this.setData({
       score:e.detail
     })
     console.log(this.data.score);
   },


   //加载
  loadMore(){
    var id=this.data.movieid;
    wx.showLoading({
      title: '加载中....',
    });
    wx.cloud.callFunction({
      name:"comment",
      data:{
        id:id
      }
    }).then(res=>{
      //获取这个页面的所以后台数据
      var obj=JSON.parse(res.result);
      console.log(obj);
      this.setData({
        detail:obj
      });
      wx.hideLoading();
      //数据获取完成，取消加载框
      wx.hideLoading();
    }).catch(err=>{
      console.log(err);
    })
  },



    // 选择图片
  selectImage(){
    //功能:请用户选中9张图片并且保存data中
    //1:在data添加数组属性images
    //2:调用wx.chooseImage选中图片
    //3:将选中9张图片保存images中
    wx.chooseImage({
      cout:9,
      sizeType: ["original", "compressed"],//原图,压缩图
      sourceType: ["album", "camera"],//相册，相机
      //选择图片成功返回成功结果
       success: (res)=> {
         console.log(res);
         //获取图片地址
         var file=res.tempFilePaths;
         this.setData({
           images:file
         })
       },
       //选择图片失败返回失败结果
       fail(err){
         console.log(err);
       }
    })
    // .then(res=>{
    //   console.log(res);
    //   var file=res.tempFilePaths;
    //   this.setData({
    //     images:file
    //   })
    //   console.log(this.data.images);
    // }).catch(err=>{
    //   console.log(err);
    // })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //将电影列表组件传递参数 id
    //保存data中movieid
    this.setData({
      movieid:options.id
    });
    this.loadMore();
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