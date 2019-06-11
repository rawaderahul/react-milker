import axios from 'axios';
import { uri } from '../services/commonURI';

export function getCustomerListByDistributerId(){
    return axios.get(uri + 'CustomerListByDistributerId/1')
}

export function getCustomerListByRouteId(){
    return axios.get(uri + 'CustomerListByRouteId/1')
}

export function putCustomerInfo(id,data){
    return axios.put(uri + 'Customer/' +id,data)
}

export function postCustomerInfo(data){
    return axios.post(uri + 'Customer', data)
}
