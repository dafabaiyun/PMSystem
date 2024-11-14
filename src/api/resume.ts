import axios from "axios";

export function getAllRecruit(){
    return axios.get('http://localhost:8081/resume/getAllRecruit')
    .then(res=>res.data.data)
    .catch(err=>err.errMsg)
}
export function getResumeByUserid(id){
    return axios.get(`http://localhost:8081/resume/getResumeByUserid/${id}`)
    .then(res=>res.data.data)
    .catch(err=>err.errMsg)

}
export function getResumeByStatus(status){
    return axios.get(`http://localhost:8081/resume/getResumeByStatus/${status}`)
    .then(res=>res.data.data)
    .catch(err=>err.errMsg)

}
export function getResumeByDep(sdep){
    return axios.get(`http://localhost:8081/resume/getResumeByDep/${sdep}`)
    .then(res=>res.data.data)
    .catch(err=>err.errMsg)

}
export function addResume(obj){
    console.log('addResume:'+JSON.stringify(obj));
    
    return axios.post(`http://localhost:8081/resume/addResume`,obj)
    .then(res=>res.data)
    .catch(err=>err.data)

}
export function updateResume(obj){
    console.log('addResume:'+JSON.stringify(obj));
    
    return axios.put(`http://localhost:8081/resume/updateResume`,obj)
    .then(res=>res.data)
    .catch(err=>err.data)

}