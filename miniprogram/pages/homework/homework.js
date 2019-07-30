const db=wx.cloud.database();
// pages/homework/homework.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]//云存储图片fileID
  },
  //此函数负责获取myphoto集合所有记录并且显示模板中
  showPic(){
    //1:获取集合myphoto所有集合
    
    db.collection("myphoto")//指定集合
    .get()                  //查询
    .then(res=>{//2:将返回数据保存
      this.setData({
        list:res.data
      })
      console.log(this.data.list)
      }).catch(err=>{
        console.log(err);
      })
  },
  selectImage(){
    //此函数负责选中图片并且上传至云存储
    //上传成功后将图片fileID保存myphoto
    //集合中
    //1：选择一张图片
      //1.1：选择图片成功后将选中图片上传云存储
        //1.1.1:上传成功将fileID保存
          //myphoto集合中
    wx.chooseImage({
      //选择一张图片
      count:1,
      sizeType: ["original", "compressed"],//原图,压缩图
      sourceType:["album","camera"],//相册，相机
      success: function(res) {//选中成功
        console.log(res);
        //2:上传图片
         //2.1:获取选中图片
         var file=res.tempFilePaths[0];
         //2.2:给图片起一新名字
         var newFile=new Date().getTime()+".jpg";
         //2.3:上传图片
          console.log(file);
          console.log(newFile);
          wx.cloud.uploadFile({//上传
            cloudPath:newFile,//新文件名
            filePath:file,//选中图片名
            success:res=>{//上传成功
             // console.log(res.fileID);//返回值
             //3:将上传fileID保存 myphoto集合中
              //3.1:创建变量保存fileID
              var fId=res.fileID;
              //3.2:向集合myphoto添加一行记录
              db.collection("myphoto").add({
                data:{
                  fildID:fId
                }
              }).then(res=>{
                console.log(res);
              }).catch(err=>{
                console.log(err);
              })
              //3.3:成功 失败
            },
            fail:err=>{
              console.log(err);
            }
          })



      },
      fail:res=>{
        console.log(err);
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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