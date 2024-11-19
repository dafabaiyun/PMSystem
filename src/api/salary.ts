import axios from "axios";
export enum SalaryStatus {
  待核算 = 1,
  待审核,
  审核未通过,
  待确认,
  有异议,
  待发放,
  已发放,
}
export function insertAttend(obj) {
  return axios
    .post("http://localhost:8081/salary/insertAttend", obj)
    .then((res) => res.data)
    .catch((err) => err.data);
}
export function calculateSalary() {
  return axios
    .post("http://localhost:8081/salary/calculateSalary")
    .then((res) => res.data)
    .catch((err) => err.data);
}
export function getSalaryByDate(date) {
  return axios
    .get(`http://localhost:8081/salary/getSalaryByDate/${date}`)
    .then((res) => res.data.data)
    .catch((err) => err.data);
}
export function getSalaryByStatus(status) {
  return axios
    .get(`http://localhost:8081/salary/getSalaryByStatus/${status}`)
    .then((res) => res.data.data)
    .catch((err) => err.data);
}
export function updateSalary(obj) {
  return axios
    .post("http://localhost:8081/salary/updateSalary", obj)
    .then((res) => res.data)
    .catch((err) => err.data);
}
export function updateSalaryStatus(obj) {
  return axios
    .put(`http://localhost:8081/salary/updateSalaryStatus/`,obj)
    .then((res) => res.data)
    .catch((err) => err.data);
}
export function getSalaryBySno(sno) {
  return axios
    .get(`http://localhost:8081/salary/getSalaryBySno/${sno}`)
    .then((res) => res.data.data)
    .catch((err) => err.data);
}
