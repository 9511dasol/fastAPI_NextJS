"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from '@/stores/getAuth'; // Zustand 스토어
import { getAuth } from "@/ingredients/getInfo";
import "../css/login.css";
import Link from "next/link";

export default function LoginForm() {
    const [id, setId] = useState<string>("");
    const [pw, setPw] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();
    const { setAuth, confirmAuth } = useAuthStore();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // 폼 기본 동작 막기
        setLoading(true);

        try {
            const loginData = await getAuth(id, pw);
            if (loginData.status === "success") {
                setAuth(id, true); // Zustand 상태 업데이트
                router.push("/main"); // 로그인 성공 후 리다이렉트
            } else {
                alert("로그인 실패! ID/비밀번호를 확인해주세요.");
            }
        } catch (error) {
            alert("로그인 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="publishing">
            <div className="wraaper">
                <form className="form" onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder="Username"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            disabled={loading}
                        />
                        <i className="bx bxs-user"></i>
                    </div>
                    <div className="input-box">
                        <input
                            type="password"
                            placeholder="Password"
                            value={pw}
                            onChange={(e) => setPw(e.target.value)}
                            disabled={loading}
                        />
                        <i className="bx bxs-lock-alt"></i>
                    </div>
                    <div className="remember-forget">
                        <label>
                            <input type="checkbox" />
                            Remember me
                        </label>
                        <a href="#">Forget Password?</a>
                    </div>
                    <button className="btn" type="submit" disabled={loading}>
                        {loading ? "로그인 중..." : "Login"}
                    </button>
                    <div className="register-link">
                        <p>Don't have an account? <Link href="/register">Register</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
}
