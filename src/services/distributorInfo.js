import axios from 'axios';
import { uri } from './commonURI';
const url = 'http://localhost:3005/'

export function getPerticluarDistributorInfo(id){
    return axios.get(uri + 'Distributer/'+id)
}

export function getAllDistributorInfo(){
    return axios.get(uri + 'Distributers/')
}

export function putDistributorInfo(id,data){
    return axios.put(uri + 'Distributer/' + id,data)
}

export function postDistributorInfo(data){
    return axios.post(uri + 'Distributer', data)
}

export function deleteDistributorInfo(id){
    return axios.delete(uri + 'Distributer/'+ id )
}

export function getDistributorQuota(){
    return axios.get(url + 'DistributorQuota/')
}