import axios from 'axios';
import { uri } from '../commonURI';

export function getCustomerListByDistributerId(id){
    return axios.get(uri + 'CustomerListByDistributerId/'+id)
}

export function getCustomerListByRouteId(id){
    return axios.get(uri + 'CustomerListByRouteId/'+id)
}

export function putCustomerInfo(id,data){
    return axios.put(uri + 'Customer/' +id,data)
}

export function postCustomerInfo(data){
    return axios.post(uri + 'Customer', data)
}
