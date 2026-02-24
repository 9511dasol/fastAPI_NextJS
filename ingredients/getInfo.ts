import axios from "axios";
import { URLs } from "./url";

export async function getInfo(id: string) {
    // await new Promise((resolve) => setTimeout(resolve, 1000)); //Loding
    // const response = await fetch(URL);
    // const json = await response.json();
    // return json
    // return fetch(URL).then(response => response.json());
    return axios(`${URLs["local"]}/posts/` + id).then((response) => response.data);
}

export async function getInfoAll() {
    await new Promise((resolve) => setTimeout(resolve, 1000)); //Loding
    // const response = await fetch(URL);
    // const json = await response.json();
    // return json
    // return fetch(URL).then(response => response.json());
    return axios(URLs["local"] + "/posts").then((response) => response.data);
}

export async function getInfos() {
    await new Promise((resolve) => setTimeout(resolve, 1000)); //Loding
    // const response = await fetch(URL);
    // const json = await response.json();
    // return json
    // return fetch(URL).then(response => response.json());
    return axios(URLs["local"] + "/api/factory-audits/")
        .then(response => response.data)
        .catch(err => alert(err));
}

export const getAuth = async (id: string, pw: string) => {
    return axios.post(`${URLs.local}/posts/auth`, { id, pw })
        .then(res => {
            return res.data;
        })
        .catch(error => {
            // alert(`error: Comfirm your ID OR PW`);
            alert(`${URLs.local}/auth`)
            return false;
        })

}

export const signup = async (id: string, pw: string) => {
    console.log(id, pw)
    if (id.length <= 4 && pw.length <= 5) return false;
    return axios.post(`${URLs.local}/signup`, { id, pw })
        .then(res => {
            return res.data;
        })
        .catch(error => {
            // alert(`error: Comfirm your ID OR PW`);
            alert(`${URLs.local}/signup`)
            return false;
        });

}
