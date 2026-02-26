"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MENU_ITEMS = [
    {
        title: "MAIN",
        items: [
            {
                icon: "bx-home-alt-2",
                label: "대시보드",
                href: "/",
            },

            {
                icon: "bx-search", // 검색 아이콘 추가
                label: "검색",
                href: "/search",
            },
            {
                icon: "bx-cloud-upload",
                label: "파일 업로드",
                href: "/upload",
            },
        ],
    },
    {
        title: "MANAGEMENT",
        items: [
            {
                icon: "bx-group",
                label: "직원 관리",
                href: "/staff", // 실제 경로에 맞춰 수정하세요
            },
        ],
    },
    {
        title: "SYSTEM",
        items: [
            {
                icon: "bx-cog",
                label: "설정",
                href: "/settings",
            },
        ],
    },
];

export default function Menu() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col gap-6 py-4">
            {MENU_ITEMS.map((section) => (
                <div key={section.title} className="flex flex-col gap-2">
                    {/* 섹션 타이틀 */}
                    <span className="hidden lg:block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-3 mb-1">
                        {section.title}
                    </span>

                    {section.items.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                                flex items-center gap-4 px-3 py-3 rounded-2xl transition-all duration-300 group relative
                                min-w-fit
                                ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:bg-white'}
                                `}
                            >
                                {/* --- 아이콘 컨테이너 수정 --- */}
                                {/* 아이콘 컨테이너: 크기를 강제 고정하고 수축 방지 */}
                                <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 min-w-[24px] min-h-[24px] aspect-square">
                                    <i className={`bx ${item.icon} text-2xl flex-shrink-0 ${isActive ? 'text-white' : ''}`}></i>
                                </div>

                                {/* 라벨 */}
                                <span className={`hidden lg:block text-[14px] font-bold whitespace-nowrap`}>
                                    {item.label}
                                </span>

                                {/* 활성화 상태 인디케이터 */}
                                {isActive && (
                                    <div className="lg:hidden absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}