import axios from 'axios';
import { uri } from '../commonURI';

export function getRoutesInfo(){
    return axios.get(uri+ 'Route/')
}

export function getRoutesByDistributerId(id){
    return axios.get(uri + 'GetRoutesByDistributerId/'+id)
}

export function deleteRoutesInfo(id){
    return axios.delete(uri + 'Route/' + id)
}

export function putRoutesInfo(id,data){
    return axios.put(uri + 'Route/' + id,data)
}
export function postRoutesInfo(data){
    return axios.post(uri + 'Route',data)
}