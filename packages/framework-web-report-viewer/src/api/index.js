/* 
  专门用于发送请求的多个函数对象
*/

import ajax from './ajax.js'
import {postJSON} from './post'
//reportFile = '%2F20200811_bing.report'
// export const reqsheetData = postJSON('/report/loadCalculatedReport.action', "postData="+JSON.stringify({data:[{vtype:'attr',name:'reportFile',data:'%2F20200713-132747-135.report'}]}))
// export const reqsheetData = postJSON('/report/loadCalculatedReport.action', "postData="+JSON.stringify({data:[{vtype:'attr',name:'reportFile',data:'%2F20200713-132747-135.report'}]}))
// export const reqsheetData = postJSON('/report/loadCalculatedReport.action', "postData="+JSON.stringify({data:[{vtype:'attr',name:'reportFile',data:'%2F20200713-132747-135.report'}]}))
// 1. 请求表式data
export const reqsheetData_api = (reportFile)=>postJSON('/report/loadCalculatedReport.action', {
  postData: JSON.stringify({
    data: [{
      vtype: 'attr',
      name: 'reportFile',
      data: reportFile,
    }]
  })
});
//2. 请求inputdata
export const reqinputData_api = (reportFile)=>postJSON('/report/loadFillData.action', {
  postData: JSON.stringify({
    data: [{
      vtype: 'attr',
      name: 'reportFile',
      data: reportFile
    }]
  })
});

//3. 保存inputdata
export const saveinputData_api = (inputData,reportFile)=> postJSON('/report/saveFillData.action', {
  postData: JSON.stringify({
    data: [{
      vtype: 'attr',
      name: 'reportFile',
      data: reportFile
    },{
      vtype: 'attr',
      name: 'fixedFillData',
      data: JSON.stringify(inputData.fixedFillData)
    },{
      vtype: 'attr',
      name: 'floatFillData',
      data: JSON.stringify(inputData.floatFillData)
    }]
  })
});
//4. 请求下拉框下拉树信息
export const getDropDownData_api = (url) =>postJSON(url,{
  postData:[{
    vtype:'attr',
    name:"dropDownData",
    data:""
  }]
})


/* export const reqShops = (latitude,longitude)=>ajax({
  url:'/shops',
  method:'GET',
  params:{
    latitude,
    longitude,
  },
  headers: { needToken: true }

})
  export const reqLoginPwd = (name,pwd,captcha)=>ajax({
    url:'/login_pwd',
    method:'POST',
    data:{
      name,
      pwd,
      captcha
    }
  }) */