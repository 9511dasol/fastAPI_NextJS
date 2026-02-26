"use client";
import Menu from "@/components/menu";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const pathname = usePathname();
    return (
        <div className="h-screen flex flex-col md:flex-row bg-[#F7F8FA] overflow-hidden">

            {/* --- SIDEBAR / MOBILE HEADER --- */}
            {/* --- SIDEBAR --- */}
            <aside className="
    /* 1. 고정 너비와 수축 방지 추가 */
    w-full md:w-20 lg:w-60 
    min-w-18 md:min-w-20 lg:min-w-60 
    shrink-0 
    
    /* 기존 스타일 */
    bg-white border-r border-gray-100 
    p-4 md:p-6 
    flex md:flex-col justify-between items-center md:items-stretch
    z-50
">
                {/* 로고 영역에도 수축 방지 */}
                <Link href="/" className="flex items-center gap-3 shrink-0">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl shrink-0 flex items-center justify-center shadow-lg shadow-blue-100 aspect-square">
                        <i className='bx bxs-bolt text-white text-xl shrink-0'></i>
                    </div>
                    <span className="hidden lg:block font-black text-xl text-gray-900 truncate">Execel</span>
                </Link>

                <nav className="hidden md:block mt-10 flex-1 shrink-0">
                    <Menu />
                </nav>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <main className="
        flex-1 
        min-w-0
        h-[calc(100vh-72px)] md:h-screen 
        overflow-y-auto 
        scroll-smooth
        relative
    ">
                {/* 내부 컨텐츠가 사이드바를 밀어내지 않도록 padding과 max-width 조절 */}
                <div className="p-4 md:p-8 lg:p-10 max-w-400 mx-auto w-full">
                    {children}
                </div>

                {/* 모바일 전용 하단 네비게이션 (UX 최적화 버전) */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 px-4 py-2 flex justify-around items-center z-50 pb-safe">
                    {/* 1. 홈/대시보드 */}
                    <Link href="/" className="flex flex-col items-center justify-center w-12 h-12 flex-shrink-0">
                        <i className={`bx ${pathname === '/' ? 'bxs-home-circle text-blue-600' : 'bx-home-alt text-gray-400'} text-2xl transition-colors`}></i>
                        <span className={`text-[10px] mt-1 ${pathname === '/' ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>홈</span>
                    </Link>

                    {/* 2. 파일 업로드 */}
                    <Link href="/upload" className="flex flex-col items-center justify-center w-12 h-12 flex-shrink-0">
                        <i className={`bx ${pathname === '/upload' ? 'bx-cloud-upload text-blue-600' : 'bx-cloud-upload text-gray-400'} text-2xl transition-colors`}></i>
                        <span className={`text-[10px] mt-1 ${pathname === '/upload' ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>업로드</span>
                    </Link>

                    {/* 3. 중앙 액션 버튼 (플러스 버튼 강조) */}
                    {/* 3. 중앙 검색 버튼 (기존 플러스 버튼에서 변경) */}
                    <Link href="/search" className="relative -top-4 shrink-0">
                        <div className={`
        w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 border-white transition-all active:scale-90
        ${pathname === '/search'
                                ? 'bg-blue-600 shadow-blue-200'
                                : 'bg-gray-900 shadow-gray-200'}
    `}>
                            <i className='bx bx-search text-white text-3xl'></i>
                        </div>
                        {/* 활성화 상태일 때 작은 빛 효과 (선택사항) */}
                        {pathname === '/search' && (
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                        )}
                    </Link>

                    {/* 4. 직원 관리 (준비중) */}
                    <Link href="/staff" className="flex flex-col items-center justify-center w-12 h-12 flex-shrink-0">
                        <i className={`bx ${pathname === '/staff' ? 'bxs-group text-blue-600' : 'bx-group text-gray-400'} text-2xl transition-colors`}></i>
                        <span className={`text-[10px] mt-1 ${pathname === '/staff' ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>직원</span>
                    </Link>

                    {/* 5. 설정 (준비중) */}
                    <Link href="/settings" className="flex flex-col items-center justify-center w-12 h-12 flex-shrink-0">
                        <i className={`bx ${pathname === '/settings' ? 'bxs-cog text-blue-600' : 'bx-cog text-gray-400'} text-2xl transition-colors`}></i>
                        <span className={`text-[10px] mt-1 ${pathname === '/settings' ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>설정</span>
                    </Link>
                </div>
            </main>

        </div>
    );
}