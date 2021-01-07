//对Ajax的二次封装
import qs from 'qs'
import axios from 'axios'

//创建一个假的axios
 const instance  = axios.create({
  baseURL:'/api'
 })
// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
////instance.defaults.headers.post['Content-Type'] = 'application/json';
//添加请求拦截器
instance.interceptors.request.use(
  config=>{
    //批量添加token
    let token =  localStorage.getItem('token_key')
    if(config.headers.needToken){
      if(token){
        config.headers.authorization = token 
      }else{
        throw new Error('token不存在，请先登录')
      }
      
    }
    
    //对post请求进行转码处理
    if(config.method.toUpperCase()==='POST'&&config.data instanceof Object){
      ////config.data = qs.stringify(config.data)
      config.data = JSON.stringify(config.data)
    }
    return config
  }
)

//添加响应拦截器
instance.interceptors.response.use(
  response=>response.data,
  error=>{
    //当请求没有发送出去时 error. response 不存在
    if(!error.response){
      console.log(error.message)
     
    }else{
      if(error.response.status===401){
       
        console.log('token过期，请重新登录')
      }else if (error.response.status===404){
      
        console.log('请求资源不存在')
      }else{
        console.log('请求失败')
      }
    }

    alert('请求出错了 ')
    console.log(error)
    return new Promise (()=>{})
  }
)
export default instance