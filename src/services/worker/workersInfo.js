import axios from 'axios';
import { uri } from '../commonURI';

export function getWorkerDetails() {
    return axios.get(uri + 'WorkerDetail/');
  }
  export function deleteWorkerDetails(id) {
    return axios.delete(uri + 'WorkerDetail/' + id);
  }
  export function postWorkerDetail(data) {
    return axios.post(uri + 'WorkerDetail',data);
  }
  export function putWorkerDetail(id,data) {
    return axios.put(uri + 'WorkerDetail/'+id,data);
  }
  export function getWorkerListByDistributer() {
    return axios.get(uri + 'workerListByDistributer/1');
  }