import axios from 'axios';
const url ='http://localhost:3005/DemoSheet';

export function getDemoSheet(){
    return axios.get(url + 'DemoSheet/')
}

export function getBlankSheet(){
    return axios.get(url + 'BlankSheet/')
}
