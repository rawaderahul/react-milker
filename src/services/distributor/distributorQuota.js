import axios from 'axios';
import { uri } from '../commonURI';
const url = 'http://localhost:3005/'

export function getDistributorQuota(){
    return axios.get(uri + 'MilkQuota/1/')
}

export function getPerticluarDistributorQuota(id){
    return axios.get(url + 'DistributorQuota/' + id)
}

export function getAllDistributorQuota(){
    return axios.get(url + 'DistributorQuota/')
}

export function putDistributorQuota(id,data){
    return axios.put(url + 'DistributorQuota/' + id,data)
}

export function postDistributorQuota(data){
    return axios.post(url + 'DistributorQuota', data)
}

export function deleteDistributorQuota(id){
    return axios.delete(url + 'DistributorQuota/'+ id )
}