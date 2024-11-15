import axios from "axios";

export function insertInterview(obj){
    return axios.post('http://localhost:8081/interview/insertInterview',obj)
    .then(res=>res.data)
    .catch(err=>err.data)
}

export function getInterviewByPeriod(period){
    return axios.get(`http://localhost:8081/interview/getInterviewByPeriod/${period}`)
    .then(res=>res.data.data)
    .catch(err=>err.data)

}
export function getInterviewByStatus(status){
    return axios.get(`http://localhost:8081/interview/getInterviewByStatus/${status}`)
    .then(res=>res.data.data)
    .catch(err=>err.data)

}
export function getInterviewByDep(dep){
    return axios.get(`http://localhost:8081/interview/getInterviewByDep/${dep}`)
    .then(res=>res.data.data)
    .catch(err=>err.data)

}
export function updateinterview(obj){
    console.log('addResume:'+JSON.stringify(obj));
    
    return axios.put(`http://localhost:8081/interview/updateinterview`,obj)
    .then(res=>res.data)
    .catch(err=>err.data)

}