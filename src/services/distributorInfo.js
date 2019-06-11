import axios from 'axios';
import { uri } from './commonURI';

export function getPerticluarDistributorInfo(){
    return axios.get(uri + 'Distributer/1')
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