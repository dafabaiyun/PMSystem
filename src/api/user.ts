import request from "@/utils/request";
import axios from "axios";
export enum Role {
  "系统管理员",
  "员工",
  "人事专员",
  "财政专员",
  "技术部主管",
  "人事经理",
  "招聘助理",
  "应聘者",
}
export enum Status{
  "待审核"='1',
  "审核未通过"='2',
  "待筛选"='3',
  "筛选未通过"='4',
  "面试意愿确认"='5',
  "已同意面试"='6',
  "已拒绝面试"='7',
}
export enum Period{
  "一面"=1,
  "二面",
  "三面",
}
export enum InterStatus{
  "待面试"=1,
  "未通过",
  "已通过面试",
  "已发录用函",
}
export enum InterType{
  "线下面试"=1,
  "视频面试",
  "电话面试",
}
export const userRegisterServe = ({ userid,psw }) => {
  return axios.post("http://localhost:8081/user/createNewUser", { userid,psw })
  .then(res=>res.data)
  .catch(err=>err.data)
};

export const userLoginServe = ({ userid, psw }) => {
  console.log("Sending login request with", userid, psw);
  return axios
    .post("http://localhost:8081/user/login", { userid, psw })
    .then((response) => {
      // console.log("response from login:", response);
      // if (response && response.data.success) {
      //   return response.data;
      // } else {
      //   console.error("Login failed:", response.data.errMsg);
      //   return response.data.errMsg;
      // }
      return response.data;
    })
    .catch((error) => {
      console.error("Error during login request:", error);
      return null;
    });
};
// export const userLoginServe=({ sno:sno, psw:psw })=>{
//     // request.post('/user/login',{ sno:sno, psw:psw })
//     console.log("userLoginServe",sno,psw)
//     return request.post('/user/login', { "sno":sno, "psw":psw })
//     .then(response => {
//         console.log("response from login:", response);  // 打印响应
//         if (response && response.data.success) {
//             // 如果登录成功，返回 data 部分
//             return response.data;
//         } else {
//             // 如果登录失败，根据返回的 errMsg 处理
//             console.error("Login failed:", response.data.errMsg);
//             return null;  // 登录失败时返回 null
//         }
//     })
//     .catch(error => {
//         console.error("Error during login request:", error);  // 错误处理
//         if (error.response) {
//             console.error("Error response:", error.response);  // 打印响应错误内容
//         } else {
//             console.error("Network error:", error.message);  // 打印网络错误
//         }
//         return null;  // 出错时返回 null
//     })   ;
// }
// export const userLoginServe = ({ username, password }) => {
//     return request.post('/user/login', { username, password })
//         .then(response => {
//             // 这里可以检查返回数据
//             console.log('User login response:', response);
//             return response;  // 返回完整的响应
//         })
//         .catch(error => {
//             console.error('Login error:', error);
//             throw error;  // 处理错误
//         });
// };
// export function getUserRole(sno){
//     request.get('/user/getUserRoleBySno/',sno)
// }
// 获取用户角色的请求函数
export const getUserRole = (userid) => {
  console.log("Sending request to get user role for userid:", userid);

  return axios
    .get(`http://localhost:8081/user/getUserRoleByuserid/${userid}`)
    .then((response) => {
      console.log("response from getUserRole:", response);
      // 假设返回的数据结构类似 { data: [...], success: true, errMsg: null }
      if (response && response.data.success) {
        return response.data; // 返回成功的角色数据
      } else {
        console.error("Failed to get user roles:", response.data.errMsg);
        return null; // 登录失败时返回 null
      }
    })
    .catch((error) => {
      console.error("Error during getUserRole request:", error);
      return null; // 出错时返回 null
    });
};

export const showAllUsers = async() => {
  let userList = [];
  await axios
    .get("http://localhost:8081/user/showUsers")
    .then((res) => {
      const { data } = res.data;
      console.log("showUsers:" + Array.isArray(data));
      console.log("showUsers:" + JSON.stringify(data));
      console.log("showUsers:" + typeof data);
      userList = data.map((item) => {
        const { userid, staff, roleList } = item;
        const { sname, sdep, sphone, sentryDate } = staff;

        return {
          userid,
          sname,
          sdep,
          sphone,
          roleList,
          sentryDate,
        };
      });
    })
    .catch((error) => {
      console.error("Error during showAllUsers request:", error);
      return null; // 出错时返回 null
    });
  console.log("mapUserList:" + userList);
  return userList;
};
export function addUserRole({ userid, roleList }) {
  return axios
    .post("http://localhost:8081/user/insertUserRole", { userid, roleList })
    .then((res) => res.data)
    .catch((err) => err.data);
}
export function deleteUserRole({ userid, roleList }) {
  console.log('delete:'+userid,roleList);
  
  return axios
    .delete("http://localhost:8081/user/deleteUserRole", { userid, roleList })
    .then((res) => res.data)
    .catch((err) => err.data);
}
export function deleteUserByUserid(userid) {
  console.log(typeof userid);
  
  return axios
    .delete(`http://localhost:8081/user/deleteUserByuserid/${userid}`)
    .then((res) =>{console.log(res)}
    )
    .catch((err) => err.data);
}
export function getAllRecruit() {
  return axios
    .get("/recruit/getAllRecruit")
    .then((res) => res.data)
    .catch((err) => err.success);
}
export function getResume(recNo) {
  return axios
    .get(`/resume/getResumeByRecNo/${recNo}`)
    .then((res) => res.data)
    .catch((err) => err.success);
}
export function getResumeFile(resNo) {
  return axios
    .get(`/resume/getResumeFile/${resNo}`)
    .then((res) => res.data)
    .catch((err) => err.success);
}
