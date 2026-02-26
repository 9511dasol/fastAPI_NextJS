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
                <Link href="/" className="flex items-center gap-3 shrink-0 group transition-all duration-300">
                    {/* 로고 아이콘 */}
                    <div className="relative w-9 h-9 shrink-0 flex items-center justify-center bg-white border-2 border-slate-200 rounded-md transition-all group-hover:border-blue-600 group-hover:shadow-sm">
                        <i className='bx bxs-grid-alt text-blue-600 text-xl z-10 transition-transform group-hover:rotate-90'></i>

                        {/* 장식용 포인트 */}
                        <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-400 rounded-full opacity-80 animate-pulse"></div>
                        <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-amber-400 rounded-full opacity-80"></div>
                    </div>

                    {/* 브랜드 텍스트: 이 부분이 return 안에 있어야 오류가 안 납니다 */}
                    <div className="hidden lg:flex flex-col leading-none">
                        <span className="font-black text-[18px] text-slate-900 tracking-tighter uppercase italic">
                            Dashboard
                        </span>
                        <span className="text-[9px] font-bold text-blue-600 tracking-[0.2em] mt-0.5 opacity-80 uppercase">
                            Insight Engine
                        </span>
                    </div>
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
                    <Link href="/add" className="relative -top-5 shrink-0 group">
                        {/* 메인 버튼 컨테이너 */}
                        <div className={`
        w-14 h-14 rounded-xl flex items-center justify-center 
        border-4 border-[#F4F7F9] transition-all duration-300
        active:scale-90 shadow-xl
        ${pathname === '/add'
                                ? 'bg-blue-600 shadow-blue-200 rotate-90' // 활성화 시 살짝 회전 효과
                                : 'bg-slate-800 shadow-slate-200 hover:bg-slate-700'}
    `}>
                            {/* 플러스(+) 아이콘: 데이터 추가/생성 의미 */}
                            <i className={`bx bx-plus text-white text-3xl transition-transform ${pathname === '/search' ? 'scale-110' : 'group-hover:scale-125'}`}></i>
                        </div>

                        {/* 태블로 스타일 하단 툴팁 라벨 (데스크탑 전용) */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden lg:block">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-2 py-1 rounded shadow-sm border border-slate-100">
                                Add Data
                            </span>
                        </div>

                        {/* 활성화 인디케이터: 단순 점 대신 바(Bar) 형태 */}
                        {pathname === '/add' && (
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-1 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
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