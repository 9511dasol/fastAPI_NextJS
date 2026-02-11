"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { URLs } from "@/ingredients/url";
import { Item } from "@/ingredients/interface";
import { getInfo } from "@/ingredients/getInfo";

const getUser = async (id: any) => await getInfo(id);

export default function Form({ opt, id }: { opt: string, id: string }) {
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    // const [info, setInfo] = useState<Item>();
    if (opt === "u") {
        useEffect(() => {
            getUser(id).then((res) => {
                setTimeout(() => {
                    // setInfo(res)
                    setTitle(res.title);
                    setContent(res.content);
                }, 100);

            })
        }, [])
    }

    const createUser = async (e: React.FormEvent) => {
        e.preventDefault(); // 폼 기본 동작 막기
        // const title = formData.get("title") as string;
        // const content = formData.get("content") as string;
        // if (title.length > 0 && content.length > 0) {
        //     alert("전송되었습니다!");

        //     setTimeout(() => {
        //         router.push('/');
        //     }, 200);
        // } else {
        //     return alert('제목과 내용을 확인해주세요');
        //     // throw new Error('제목과 내용을 확인해주세요');
        // }
        // alert(`'${query}'을(를) 검색했습니다.`);
        if (title.length === 0 || content.length === 0) {
            alert('제목과 내용을 모두 입력해주세요');
            return;  // 전송 중단
        }

        // 5. 로딩 상태 시작
        try {
            // 2. FormData 그대로 multipart/form-data로 전송
            const response = await axios.post(
                `${URLs.local}/posts/create`,  // 타입 안전한 접근
                { title, content },
            );

            console.log('✅ 성공:', response.data);
            alert("✅ 게시글이 저장되었습니다!");

            // 3. 200ms 후 홈 이동
            setTimeout(() => router.push('/main'), 200);

        } catch (error: any) {
            console.error('❌ 에러:', error.response?.data || error.message);
            alert('전송 실패: ' + (error.response?.data?.detail || '서버 확인'));
        } finally {
            setIsPending(false);
        }
    };
    const updateUser = async (e: React.FormEvent) => {
        e.preventDefault(); // 폼 기본 동작 막기
        // console.log(id, title, content)
        // const formData = new FormData();
        // formData.append('title', title);
        // formData.append('content', content);
        // console.log(formData)
        axios.put(`${URLs.local}/posts/${id}`, { "title": title, "content": content },)
            .then(res => setTimeout(() => {
                alert(res.data);
                router.push(`/posts/${id}`)
            }, 200))
            // .then((res) => {
            //     console.log(res.data);
            // })
            .catch(err => console.error(err));
        // axios.put(`${URLs.local}/posts/${id}`, formData, {
        //     headers: {
        //         'Content-Type': 'multipart/form-data',  // FormData면 자동 설정됨
        //     }
        // },)
        //     .then(function (response) {
        //         // response  
        //         console.log(response);
        //     }).catch(function (error) {
        //         // 오류발생시 실행
        //         console.error(error);
        //     }).then(function () {
        //         // 항상 실행
        //     });
    }
    return (
        <form onSubmit={opt === "c" ? createUser : updateUser} className="flex flex-col min-h-screen justify-center items-center">
            <input name="title" onChange={(e) => setTitle(e.target.value)} value={title} className="bg-gray-400 w-xs mb-2" />
            <textarea name="content" onChange={(e) => setContent(e.target.value)} value={content} className="bg-gray-400 w-xs h-33 mt-2" />
            <div className="flex">
                <button type="submit" className="m-10">{opt === "c" ? <>등록</> : <>수정</>}</button>
                <button type="button" onClick={() => opt === "c" ? router.push('/') : router.push(`/posts/${id}`)} className="m-10">취소</button>
            </div>
        </form>
    )
}
