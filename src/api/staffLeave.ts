import axios from "axios";
export enum Leave {
    待审核 = 1,
    待审批,
    未通过,
    已通过,
    取消请假
}
export function insertStaffLeave(obj){
    return axios.post('http://localhost:8081/staffLeave/insertStaffLeave',obj)
    .then(res=>res.data)
    .catch(err=>err.errMsg)
}
export function updateStaffLeaveStatus(obj){
    return axios.put('http://localhost:8081/staffLeave/updateStaffLeaveStatus',obj)
    .then(res=>res.data)
    .catch(err=>err.errMsg)
}
export function updateStaffLeave(obj){
    return axios.put('http://localhost:8081/staffLeave/updateStaffLeave',obj)
    .then(res=>res.data)
    .catch(err=>err.errMsg)
}
export function getStaffLeaveByDep(dep){
    return axios.get(`http://localhost:8081/staffLeave/getStaffLeaveByDep/${dep}`)
    .then(res=>res.data.data)
    .catch(err=>err.errMsg)

}
export function getStaffLeaveBySno(sno){
    return axios.get(`http://localhost:8081/staffLeave/getStaffLeaveBySno/${sno}`)
    .then(res=>res.data.data)
    .catch(err=>err.errMsg)

}
export function getStaffLeaveByStatus(status){
    return axios.get(`http://localhost:8081/staffLeave/getStaffLeaveByStatus/${status}`)
    .then(res=>res.data.data)
    .catch(err=>err.errMsg)

}