import axios from "axios";
import { URLs } from "./url";
import { fetchData } from "./interface";



export async function getInfos(): Promise<fetchData> {
    // 인위적인 로딩 지연 (UI 확인용)
    await new Promise((resolve) => setTimeout(resolve, 2000));
    try {
        const response = await axios.get(URLs["local"] + "/api/factory-audits");
        const data: fetchData = response.data;

        return data;
    } catch (err) {
        console.error("데이터 로드 실패, 로컬 템플릿 사용:", err);
        return tempData as fetchData;
    }
}

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



export const getAuth = async (id: string, pw: string) => {
    return axios.post(`${URLs.local}/posts/auth`, { id, pw })
        .then(res => {
            return res.data;
        })
        .catch(error => {
            // alert(`error: Comfirm your ID OR PW`);
            // alert(`${URLs.local}/auth`)
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
            console.error(`${URLs.local}/signup`)
            return false;
        });

}

export const uploadResult = async (file: File | null) => {
    if (!file) return null;
    // await new Promise((resolve) => setTimeout(resolve, 2000)); //Loding

    // 1. 파일을 FormData에 담기 (백엔드의 file: UploadFile 매개변수 대응)
    const formData = new FormData();
    formData.append('file', file);

    // 2. Query String 구성 (백엔드의 sheetName: str 대응)
    const sheetName = "Audit Status";
    const url = `${URLs["local"]}/api/factory-audits/imports/commit-with-file?sheetName=${encodeURIComponent(sheetName)}`;

    try {
        const res = await axios.post(url, formData, {
            headers: {
                // 브라우저가 자동으로 바운더리를 설정하게 하려면 이 줄을 생략해도 되지만,
                // 명시적으로 넣어도 무방합니다.
                'Content-Type': 'multipart/form-data',
            }
        });

        // 백엔드 성공 시 로그: "POST ... 200"
        return res.data;
    } catch (err) {
        console.error("Upload Error:", err);
        throw err;
    }
};


const tempData = {
    items: [
        {
            id: 1,
            auditType: "BW",
            buyer: "Better Work",
            co: "PT. Bintang Baru Sukses",
            dueBucket: "Green",
            dueDays: 365,
            dueSoon: false,
            expiryDate: "2027-01-13",
            factoryName: "PT. Bintang Baru Sukses Factory",
            fctId: "FCT001",
            latestAuditDate: "2026-01-13"
        },
        {
            id: 2,
            auditType: "I",
            buyer: "International Buyer",
            co: "Better Work Factory A",
            dueBucket: "Yellow",
            dueDays: 180,
            dueSoon: true,
            expiryDate: "2026-08-01",
            factoryName: "Better Work Factory A",
            fctId: "FCT002",
            latestAuditDate: "2026-02-01"
        },
        {
            id: 3,
            auditType: "SC",
            buyer: "Supply Chain Co.",
            co: "Global Manufacturing",
            dueBucket: "Red",
            dueDays: 30,
            dueSoon: true,
            expiryDate: "2026-03-30",
            factoryName: "Global Manufacturing Plant",
            fctId: "FCT003",
            latestAuditDate: "2025-03-01"
        }
    ],
    totalCount: 150,
    totalPages: 15
}