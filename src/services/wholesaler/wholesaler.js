import axios from 'axios';
import { uri } from '../commonURI';

export function getWholesalerInfo(){
    return axios.get(uri+ 'Wholesalers/')
}

export function getPerticularWholesaler(id){
    return axios.get(uri + 'Wholesaler/'+id)
}

export function deleteWholesaler(id){
    return axios.delete(uri + 'Wholesaler/' + id)
}

export function putWholesaler(id,data){
    return axios.put(uri + 'Wholesaler/' + id,data)
}
export function postWholesaler(data){
    return axios.post(uri + 'Wholesaler',data)
}