# 路由配置 
1. 嵌套路由
            export default [
                {
                    path:"/msite",
                    component:Msite
                },
                {
                    path:"/bar",
                    component:Bar
                },
                {
                    path:"/foo",
                    component:Foo,
                    alias: '/foonew'
                },
                
        
                { path: '/', redirect: '/msite' }

        
            ]
            export default [
                {
                    path:"/msite",
                    component:Msite,
                    children:[
                        {
                            path:"/bar",
                            component:Bar
                        },
                        {
                            path:"/foo",
                            component:Foo,
                            alias: '/foonew'
                        },
                    ]
                },
        
        
        ​        { path: '/', redirect: '/msite' }

        
            ]
2. 路由别名 
3. 路由重定向
4. 路由携带参数
        方式1: 路由路径携带参数(param/query)
                {
                        path: 'mdetail/:id',
                        component: MessageDetail
                }
                路由路径
                    <router-link :to="'/home/message/mdetail/'+m.id">{{m.title}}</router-link>
                    /jj/:username/kk/:post_id	/user/evan/post/123	{ username: 'evan', post_id: '123' }
                路由组件中读取请求参数
                    this.$route.params.id

        方式2: <router-view>属性携带数据
                <router-view :msg="msg"></router-view>
5. 编程式路由
        this.$router.push(path): 相当于点击路由链接(可以返回到当前路由界面)
        this.$router.replace(path): 用新路由替换当前路由(不可以返回到当前路由界面)
        this.$router.back(): 请求(返回)上一个记录路由
        this.$router.go(-1): 请求(返回)上一个记录路由
        this.$router.go(1): 请求下一个记录路由
6. 优化路由器配置
    linkActiveClass: 'active', // 指定选中的路由链接的class
7. 懒加载

# vuex  https://juejin.im/post/58fffc52a22b9d0065b8db53

![1592826351357](C:\Users\kangb\AppData\Roaming\Typora\typora-user-images\1592826351357.png)


## 页面刷新 数据丢失问题
        export default {
        name: 'App',
        created () {
            //在页面加载时读取sessionStorage里的状态信息
            if (sessionStorage.getItem("store") ) {
                this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
            } 
    
            //在页面刷新时将vuex里的信息保存到sessionStorage里
            window.addEventListener("beforeunload",()=>{
                sessionStorage.setItem("store",JSON.stringify(this.$store.state))
            })
        }
        }
### getter
        computed : {
                    changePeople () {
                        return this.$store.getters.changePeople
                    }
                },
### actions
             this.$store.dispatch('getParamSync',{
                keyCode,
                keyWord,
                hunterCode,
                sid,
                ck,
                tm
            })
####  组合actions
            export default {
                getParamSync (context,Object) {
                    return new Promise((reslove,reject)=>{
                       
                            context.commit('getParam',Object)
                            return reslove('成功')
                        
                    })
    
                },
                changetitleSync ({commit},title){
                    setTimeout(()=>{
                        commit('changetitle',title)
                    },3000)
                }
            }
    
            created(){
                this.$store.dispatch('getParamSync',{
                                keyCode,
                                keyWord,
                                hunterCode,
                                sid,
                                ck,
                                tm
                            }).then((res)=>{
                                this.$store.dispatch('changetitleSync',res)
                            })
                }
##### 多次调用同一个
            import { mapMutations } from 'vuex'
            methods:{
                ...mapMutations({
                    setNumber:'SET_NUMBER',
                })
            }
            调用this.setNumber(10)相当调用this.$store.commit('SET_NUMBER',10)


vuex  虽然好用  但是能不用就不用----------------- 




# vue  https://juejin.im/post/5d59f2a451882549be53b170

##  props 作为一个初始值
props: ['initialCounter'],
        data: function () {
        return {
            counter: this.initialCounter
        }
        }

###  操作props

    props: ['size'],
    computed: {
        normalizedSize: function () {
            return this.size.trim().toLowerCase()
        }
    }


#### computed 和 watch 的区别和运用的场景？
computed： 是计算属性，依赖其它属性值，并且 computed 的值有缓存，只有它依赖的属性值发生改变，下一次获取 computed 的值时才会重新计算 computed  的值；
watch： 更多的是「观察」的作用，类似于某些数据的监听回调 ，每当监听的数据变化时都会执行回调进行后续操作；
运用场景：


当我们需要进行数值计算，并且依赖于其它数据时，应该使用 computed，因为可以利用 computed 的缓存特性，避免每次获取值时，都要重新计算；


当我们需要在数据变化时执行异步或开销较大的操作时，应该使用 watch，使用 watch 选项允许我们执行异步操作 ( 访问一个 API )，限制我们执行该操作的频率，并在我们得到最终结果前，设置中间状态。这些都是计算属性无法做到的。

## 生命周期

图片 +++++++++++++++++++++++++++++

####  Vue 的父组件和子组件生命周期钩子函数执行顺序？
Vue 的父组件和子组件生命周期钩子函数执行顺序可以归类为以下 4 部分：


加载渲染过程
父 beforeCreate -> 父 created -> 父 beforeMount -> 子 beforeCreate -> 子 created -> 子 beforeMount -> 子 mounted -> 父 mounted

子组件引用了父组件的数据，父组件更新此数据===渲染过程
父 beforeUpdate -> 子 beforeUpdate -> 子 updated -> 父 updated

父组件更新过程
父 beforeUpdate -> 父 updated

销毁过程
父 beforeDestroy -> 子 beforeDestroy -> 子 destroyed -> 父 destroyed

#### 在哪个生命周期内调用异步请求？
可以在钩子函数 created、beforeMount、mounted 中进行调用，因为在这三个钩子函数中，data 已经创建，可以将服务端端返回的数据进行赋值。但是本人推荐在 created 钩子函数中调用异步请求，因为在 created 钩子函数中调用异步请求有以下优点：

能更快获取到服务端数据，减少页面 loading 时间；
ssr 不支持 beforeMount 、mounted 钩子函数，所以放在 created 中有助于一致性；