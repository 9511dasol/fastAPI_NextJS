"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Project } from '@/ingredients/interface';
import { getExpiryGroups } from '@/ingredients/func';
import { differenceInDays, startOfDay } from 'date-fns';

interface ExpiryStatusCardsProps {
    projects: Project[];
    onCardClick?: (groupId: string) => void;
}

const ExpiryStatusCards = ({ projects, onSelect }: { projects: Project[], onSelect: (p: Project) => void }) => {
    const today = startOfDay(new Date());
    const groups = useMemo(() => getExpiryGroups(projects), [projects]);

    // --- 모달 상태 관리 ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeGroup, setActiveGroup] = useState<any>(null);

    const openModal = (group: any) => {
        if (group.items.length === 0) return; // 데이터 없으면 무시
        setActiveGroup(group);
        setIsModalOpen(true);
    };

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    // Esc 키 닫기 및 스크롤 방지
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeModal();
        };
        if (isModalOpen) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen, closeModal]);

    // 카드별 스타일 (Light 테마)
    const cardStyles: { [key: string]: { bg: string, accent: string, text: string, icon: string } } = {
        noDate: {
            bg: 'bg-slate-50',     // 아주 연한 배경
            accent: 'bg-slate-400', // 포인트 선
            text: 'text-slate-600', // 텍스트
            icon: 'bx-calendar-x'
        },
        expired: {
            bg: 'bg-rose-50',
            accent: 'bg-rose-500',
            text: 'text-rose-600',
            icon: 'bx-error'
        },
        within1Week: {
            bg: 'bg-red-50',
            accent: 'bg-red-500',
            text: 'text-red-600',
            icon: 'bx-alarm-exclamation'
        },
        within2Weeks: {
            bg: 'bg-orange-50',
            accent: 'bg-orange-500',
            text: 'text-orange-600',
            icon: 'bx-time'
        },
        within1Month: {
            bg: 'bg-amber-50',
            accent: 'bg-amber-500',
            text: 'text-amber-700',
            icon: 'bx-calendar-event'
        },
        within3Months: {
            bg: 'bg-emerald-50',
            accent: 'bg-emerald-500',
            text: 'text-emerald-600',
            icon: 'bx-calendar-check'
        },
        within6Months: {
            bg: 'bg-blue-50',
            accent: 'bg-blue-500',
            text: 'text-blue-600',
            icon: 'bx-info-circle'
        },
        within1Year: {
            bg: 'bg-indigo-50',
            accent: 'bg-indigo-500',
            text: 'text-indigo-600',
            icon: 'bx-history'
        },
        over1Year: {
            bg: 'bg-gray-50',
            accent: 'bg-gray-400',
            text: 'text-gray-600',
            icon: 'bx-dots-horizontal-rounded'
        },
    };

    return (
        <div className="w-full max-w-400 mx-auto space-y-6">
            {/* 1. 상단 요약 정보 (모바일 UX: 현재 상태를 한눈에) */}
            <div className="md:hidden px-1 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-black text-gray-900">Dashboard</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Project Status Overview</p>
                </div>
            </div>

            {/* 2. 카드 그리드 - 모바일에서는 1열 또는 2열, 테블릿 이상에서 확장 */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
                {groups.map((group, idx) => {
                    const style = cardStyles[group.id] || cardStyles.noDate;
                    const hasItems = group.items.length > 0;

                    return (
                        <button
                            key={idx}
                            onClick={() => openModal(group)}
                            disabled={!hasItems}
                            className={`
                                        relative w-full overflow-hidden group p-6 rounded-4xl 
                                        transition-all duration-500 text-left flex flex-col justify-between
                                        ${hasItems ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1.5' : 'cursor-default opacity-50'}
                                        ${style.bg} h-52 sm:h-60 border-b-4 ${style.accent.replace('bg-', 'border-')}
                                        `}
                        >
                            {/* 상단 라벨 */}
                            <div className="relative z-10">
                                <span className={`text-[20px] sm:text-[24px] font-black leading-tight tracking-tight break-keep ${style.text}`}>
                                    {group.label}
                                </span>
                                <div className={`w-8 h-1 rounded-full ${style.accent} mt-2 opacity-40 group-hover:w-16 transition-all duration-500`} />
                            </div>

                            {/* 하단 데이터 영역 */}
                            <div className="relative z-10 flex items-end justify-between">
                                <div className="flex flex-col">
                                    <span className={`text-4xl sm:text-5xl font-[1000] tracking-tighter ${style.text} leading-none`}>
                                        {group.items.length.toString().padStart(2, '0')}
                                    </span>
                                    <span className={`text-[9px] font-bold uppercase tracking-[0.15em] mt-2 opacity-50 ${style.text}`}>
                                        Projects
                                    </span>
                                </div>

                                {hasItems && (
                                    <div className="p-2.5 rounded-xl bg-white/40 backdrop-blur-md shadow-sm group-hover:bg-white group-hover:rotate-90 transition-all duration-300">
                                        <i className={`bx bx-chevron-right text-xl ${style.text}`}></i>
                                    </div>
                                )}
                            </div>

                            {/* 배경 큰 숫자 (모바일 시각적 재미) */}
                            <div className={`absolute -right-4 -bottom-2 text-8xl font-black opacity-[0.05] select-none ${style.text}`}>
                                {group.items.length}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* 3. --- 팝업 모달 (모바일 최적화: Bottom Sheet 느낌 연출) --- */}
            {isModalOpen && activeGroup && (
                <div
                    className="fixed inset-0 z-100 flex items-end sm:items-center justify-center bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300 p-0 sm:p-4"
                    onClick={closeModal}
                >
                    <div
                        className="
                                    bg-white w-full shadow-2xl overflow-hidden flex flex-col
                                    /* 모바일 설정 */
                                    h-[85vh] rounded-t-[2.5rem] animate-in slide-in-from-bottom duration-400
                                    /* 데스크톱(sm 이상) 설정 수정 */
                                    sm:max-w-lg 
                                    sm:h-auto sm:max-h-[80vh]  /* <- 최대 높이를 화면의 80%로 제한 */
                                    sm:rounded-[2.5rem] sm:zoom-in-95
                                "
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 모달 헤더 (손잡이 추가로 모바일 UX 향상) */}
                        <div className="sm:hidden w-full flex justify-center pt-3 pb-1">
                            <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
                        </div>

                        <div className={`p-6 sm:p-8 ${activeGroup.bgColor} relative`}>
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h3 className={`text-2xl font-black ${activeGroup.textColor} tracking-tight`}>
                                        {activeGroup.label}
                                    </h3>
                                    <p className={`text-xs font-bold opacity-80 ${activeGroup.textColor} uppercase tracking-widest`}>
                                        {activeGroup.items.length} Active Projects
                                    </p>
                                </div>
                                <button onClick={closeModal} className="p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors">
                                    <i className={`bx bx-x text-2xl ${activeGroup.textColor}`}></i>
                                </button>
                            </div>
                        </div>

                        {/* 모달 리스트 영역 (터치 스크롤 최적화) */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50/50 custom-scrollbar">
                            <div className="grid gap-3">
                                {activeGroup.items.map((p: Project) => {
                                    const diff = p.expiryDate ? differenceInDays(new Date(p.expiryDate), today) : null;
                                    return (
                                        <div key={p.id}
                                            className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm active:scale-[0.98] transition-all"
                                            onClick={() => onSelect(p)}>
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-sm font-black text-blue-600 border border-blue-50">
                                                    {p.buyer.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-[14px] font-bold text-gray-900 leading-tight">{p.factoryName}</p>
                                                    <p className="text-[11px] text-gray-500 font-medium">{p.buyer}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-mono font-bold text-gray-400">{p.expiryDate || 'N/A'}</p>
                                                <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-tighter ${diff !== null && diff < 7 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                                    {activeGroup.id === 'noDate' || diff === null ? '기한미정' : (diff < 0 ? 'EXPIRED' : `D-${diff}`)}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 모달 푸터 */}
                        <div className="p-6 bg-white border-t border-gray-50">
                            <button
                                onClick={closeModal}
                                className="w-full py-4 bg-gray-900 text-white rounded-2xl text-sm font-bold active:scale-95 transition-transform"
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpiryStatusCards;