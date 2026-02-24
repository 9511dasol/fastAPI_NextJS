"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Project } from '@/ingredients/interface';
import { getExpiryGroups } from '@/ingredients/func';
import { differenceInDays, startOfDay } from 'date-fns';

interface ExpiryStatusCardsProps {
    projects: Project[];
    onCardClick?: (groupId: string) => void;
}

const ExpiryStatusCards = ({ projects }: { projects: Project[] }) => {
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
    const cardStyles: { [key: string]: { border: string, text: string, icon: string } } = {
        noDate: { border: 'bg-gray-800', text: 'text-gray-500', icon: 'bx-calendar-x' },
        expired: { border: 'bg-pink-500', text: 'text-pink-600', icon: 'bx-error' },
        within1Week: { border: 'bg-red-500', text: 'text-red-600', icon: 'bx-alarm-exclamation' },
        within2Weeks: { border: 'bg-orange-500', text: 'text-orange-600', icon: 'bx-time' },
        within1Month: { border: 'bg-yellow-500', text: 'text-yellow-700', icon: 'bx-calendar-event' },
        within3Months: { border: 'bg-green-500', text: 'text-green-600', icon: 'bx-calendar-check' },
        within6Months: { border: 'bg-blue-500', text: 'text-blue-600', icon: 'bx-info-circle' },
        within1Year: { border: 'bg-indigo-500', text: 'text-indigo-600', icon: 'bx-history' },
        over1Year: { border: 'bg-gray-400', text: 'text-gray-600', icon: 'bx-dots-horizontal-rounded' },
    };

    return (
        <div className="w-full">
            {/* 카드 그리드 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {groups.map((group) => {
                    const style = cardStyles[group.id] || cardStyles['over1Year'];
                    return (
                        <div
                            key={group.id}
                            onClick={() => openModal(group)}
                            className="relative bg-white border border-gray-100 rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group overflow-hidden"
                        >
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.border}`}></div>
                            <div className="flex flex-col items-center text-center space-y-2">
                                <div className={`text-xl ${style.text} opacity-80 group-hover:scale-110 transition-transform`}>
                                    <i className={`bx ${style.icon}`}></i>
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-tighter ${style.text}`}>
                                    {group.label}
                                </span>
                                <span className="text-2xl font-black text-gray-900 leading-none">
                                    {group.items.length}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* --- 팝업 모달 --- */}
            {isModalOpen && activeGroup && (
                <div
                    onClick={closeModal}
                    className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white w-full max-w-lg rounded-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                    >
                        {/* 모달 헤더 */}
                        <div className={`p-6 pb-4 ${activeGroup.bgColor} border-b border-white/20`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className={`text-xl font-black ${activeGroup.textColor}`}>
                                        {activeGroup.label} 리스트
                                    </h3>
                                    <p className={`text-xs font-bold opacity-70 ${activeGroup.textColor}`}>
                                        총 {activeGroup.items.length}개의 프로젝트가 포함되어 있습니다.
                                    </p>
                                </div>
                                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <i className='bx bx-x text-2xl'></i>
                                </button>
                            </div>
                        </div>

                        {/* 리스트 영역 */}
                        <div className="p-6 max-h-112.5 overflow-y-auto custom-scrollbar bg-gray-50/30">
                            <div className="space-y-3">
                                {activeGroup.items.map((p: Project) => {
                                    const diff = p.expiryDate ? differenceInDays(new Date(p.expiryDate), today) : null;
                                    return (
                                        <div key={p.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-xs font-black text-gray-400 border border-gray-100">
                                                    {p.buyer.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800 leading-none">{p.factoryName}</p>
                                                    <p className="text-[10px] text-gray-400 mt-1">{p.buyer}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-mono font-bold text-gray-500">
                                                    {p.expiryDate ? p.expiryDate : '기한 미설정'}
                                                </p>
                                                <p className={`text-[11px] font-black ${diff !== null && diff < 7 ? 'text-red-500' : 'text-blue-500'}`}>
                                                    {activeGroup.id === 'noDate' || diff === null
                                                        ? '기한 미정' // 날짜 없음 그룹일 때 표시될 텍스트
                                                        : (diff < 0 ? '만기경과' : `D-${diff}`)
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 푸터 */}
                        <div className="p-4 bg-white border-t border-gray-50 text-center">
                            <button
                                onClick={closeModal}
                                className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest"
                            >
                                Close (Esc)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpiryStatusCards;