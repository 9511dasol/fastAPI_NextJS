"use client";
import { URLs } from '@/ingredients/url';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface btns {
    name: string;
    num: number
}
const update = () => { }


export default function Btn({ name, num }: btns) {
    const router = useRouter()
    const del = async () => {
        await axios.delete(
            `${URLs.local}/posts/${+num}`,  // 타입 안전한 접근
        ).then(res => {
            console.log('✅ 삭제:', res.data);
            alert("✅ 게시글이 삭제되었습니다!");
            setTimeout(() => router.push('/'), 200);
        }).catch(error => {
            console.error('❌ 에러:', error.response?.data || error.message);
            alert('전송 실패: ' + (error.response?.data?.detail || '서버 확인'));
        });
    }
    return (
        <button onClick={() => del()}>{name}</button>
    )
}
