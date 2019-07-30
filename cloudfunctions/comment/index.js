// var rp=require("request-promise");
// exports.main = async (event, context)=>{
//   var url = `http://api.douban.com/v2/movie/subject/${event.id}?apikey=0df993c66c0c636e29ecbb5344252a4a`;
//   return rp(url).then(res=>{
//     console.log(res);
//   }).catch(err=>{
//     console.log(err);
//   })
// }

var rp = require("request-promise");
//2:创建main函数
exports.main = async (event, context) => {
  //3:创建变量 url 请求地址
  var url = `http://api.douban.com/v2/movie/subject/${event.id}?apikey=0df993c66c0c636e29ecbb5344252a4a`;
  //4:请求rp函数发送请求并且将豆瓣返回电影列表返回调用者
  return rp(url)        //发送请求
    .then(res => {          //请求成功
      return res;         //返回结果
    }).catch(err => {       //出错
      console.log(err);   //出错原因
    })
}
