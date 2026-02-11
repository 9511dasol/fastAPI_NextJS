export interface User {
    id: string;
    email: string;
    username: string;
    // 기타 필요한 사용자 정보 필드들
}

export interface AuthState {
    user: User | null;
    token: string | null;
    setUser: (user: User, token: string) => void;
    clearUser: () => void;
}