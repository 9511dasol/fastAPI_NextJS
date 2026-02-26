"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MENU_ITEMS = [
    {
        title: "기본 분석",
        items: [
            { icon: "bx-grid-alt", label: "대시보드", href: "/" },
            { icon: "bx-search-alt", label: "데이터 탐색", href: "/search" },
            { icon: "bx-data", label: "데이터 업로드", href: "/upload" },
        ],
    },
    {
        title: "조직 관리",
        items: [
            { icon: "bx-user-pin", label: "근로자 현황", href: "/staff" },
        ],
    },
    {
        title: "환경 설정",
        items: [
            { icon: "bx-slider-alt", label: "시스템 구성", href: "/settings" },
        ],
    },
];

export default function Menu() {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col gap-8 py-6 h-full">
            {MENU_ITEMS.map((section) => (
                <div key={section.title} className="flex flex-col">
                    {/* 섹션 타이틀: 태블로 스타일의 작고 진한 캡션 */}
                    <h3 className="hidden lg:block text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] px-4 mb-3">
                        {section.title}
                    </h3>

                    <div className="flex flex-col gap-1">
                        {section.items.filter((v) => v.label !== "데이터 탐색").map((item) => {
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                                        group relative flex items-center gap-3 px-4 py-2.5 transition-all duration-200
                                        ${isActive
                                            ? 'bg-slate-100 text-blue-700'
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                                    `}
                                >
                                    {/* 활성화 인디케이터: 좌측 수직 바 (태블로의 정석) */}
                                    {isActive && (
                                        <div className="absolute left-0 w-[3px] h-full bg-blue-600 animate-pulse" />
                                    )}

                                    {/* 아이콘: 더 정교한 느낌을 위해 텍스트 크기 조정 */}
                                    <div className={`
                                        flex items-center justify-center flex-shrink-0 w-6 h-6
                                        ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}
                                    `}>
                                        <i className={`bx ${item.icon} text-xl transition-transform group-hover:scale-110`}></i>
                                    </div>

                                    {/* 라벨: 가독성을 위해 자간 조정 */}
                                    <span className={`
                                        hidden lg:block text-[13px] font-bold tracking-tight whitespace-nowrap
                                        ${isActive ? 'text-slate-900' : 'text-slate-500'}
                                    `}>
                                        {item.label}
                                    </span>

                                    {/* 모바일 호버 툴팁 (선택 사항) */}
                                    <div className="lg:hidden absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                        {item.label}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}
        </nav>
    );
}