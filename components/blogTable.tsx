"use client";
import { useEffect } from "react";
import { Item } from "@/ingredients/interface";
import useAuthStore from "@/stores/getAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const post: string[] = ["Title", "Content", "Name"];

interface BlogTableProps {
    infoAll: Item[];
}

export default function BlogTable({ infoAll }: BlogTableProps) {
    const { confirmAuth, clearAuth } = useAuthStore();
    const router = useRouter();


    const handleLogout = () => {
        clearAuth();
        router.push("/");
    };

    useEffect(() => {
        if (!confirmAuth()) {
            alert("정상적인 방법으로 로그인 해주세요")
            handleLogout(); // 로그인 안했으면 로그인 페이지로
        }
    }, [confirmAuth, router]);

    return (
        <>
            {confirmAuth() && <>
                <table className="table-auto md:table-fixed m-10 text-left">
                    <thead>
                        <tr>{post.map((v, idx) => <th key={idx}>{v}</th>)}</tr>
                    </thead>
                    <tbody>
                        {infoAll.map((v, idx) => (
                            <tr key={idx}>
                                <td>{v.title}</td>
                                <td>{v.content}</td>
                                <td><Link href={`/posts/${v.id}`}>{v.id}</Link></td>
                            </tr>
                        ))}
                    </tbody>

                </table>
                <div className="flex justify-between m-10">
                    <Link href={"/create"} className="bg-amber-100 text-black">추가</Link>
                    <button onClick={handleLogout} className="bg-amber-100 text-black">
                        로그아웃
                    </button>
                    <Link href={"#"} className="bg-amber-100 text-black">삭제</Link>
                </div>
            </>}

        </>
    );
}
