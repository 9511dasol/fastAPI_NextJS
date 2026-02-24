"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Project } from '@/ingredients/interface';
import { getExpiryGroups } from '@/ingredients/func';
import { differenceInDays, startOfDay } from 'date-fns';

const ExpiryChart = ({ projects }: { projects: Project[] }) => {
    const today = startOfDay(new Date());
    const groups = useMemo(() => getExpiryGroups(projects), [projects]);
    const maxCount = useMemo(() => Math.max(...groups.map(g => g.items.length), 1), [groups]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeGroup, setActiveGroup] = useState<any>(null);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const openModal = (group: any) => {
        if (group.items.length === 0) return;
        setActiveGroup(group);
        setIsModalOpen(true);
    };

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

    return (
        <div className="bg-white rounded-4xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-50 relative">
            {/* 상단 타이틀 섹션 */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <i className='bx bxs-chart text-blue-600 text-xl'></i>
                </div>
                <div className='flex flex-col'>
                    <h2 className="text-xl font-black text-gray-900">만기 구간별 분석</h2>
                    <p className="text-xs text-gray-400 font-medium tracking-tight">구간을 클릭하여 상세 기업 리스트를 확인하세요</p>
                </div>
            </div>

            {/* 그래프 렌더링 영역 */}
            <div className="space-y-4">
                {groups.map((group) => {
                    const percentage = (group.items.length / maxCount) * 100;
                    return (
                        <div
                            key={group.id}
                            onClick={() => openModal(group)}
                            className="group flex items-center gap-5 p-2 rounded-2xl transition-all cursor-pointer hover:bg-gray-50/80"
                        >
                            <div className="w-24 text-right">
                                <span className="text-[11px] font-black text-gray-400 uppercase tracking-tighter group-hover:text-gray-900 transition-colors">
                                    {group.label}
                                </span>
                            </div>
                            <div className="flex-1 h-11 bg-gray-50 rounded-[14px] overflow-hidden p-1 border border-gray-100/50">
                                <div
                                    className={`h-full transition-all duration-1000 ease-out flex items-center px-4 rounded-[10px] relative ${group.bgColor.replace('bg-', 'bg-opacity-90 bg-')}`}
                                    style={{ width: `${group.items.length === 0 ? 0 : Math.max(percentage, 8)}%` }}
                                >
                                    {group.items.length > 0 && (
                                        <span className={`text-[11px] font-black ${group.textColor}`}>
                                            {group.items.length}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* --- 팝업 모달 --- */}
            {isModalOpen && activeGroup && (
                <div
                    onClick={closeModal}
                    className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white w-full max-w-md rounded-[40px] shadow-2xl border border-white overflow-hidden animate-in zoom-in-95 duration-300"
                    >
                        {/* 모달 헤더 */}
                        <div className={`${activeGroup.bgColor} p-8 pb-6 relative`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${activeGroup.textColor} opacity-60`}>Group Details</span>
                                    <h3 className={`text-2xl font-black mt-1 ${activeGroup.textColor}`}>{activeGroup.label}</h3>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition-colors text-white"
                                >
                                    <i className='bx bx-x text-2xl'></i>
                                </button>
                            </div>
                        </div>

                        {/* 리스트 영역 */}
                        <div className="p-6 max-h-100 overflow-y-auto custom-scrollbar bg-gray-50/30">
                            <div className="space-y-3">
                                {activeGroup.items.map((p: Project) => {
                                    // 날짜가 없는 경우를 위한 안전한 계산
                                    const diff = p.expiryDate ? differenceInDays(new Date(p.expiryDate), today) : null;

                                    return (
                                        <div key={p.id} className="group/item flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover/item:bg-blue-50 group-hover/item:text-blue-500 transition-colors">
                                                    <i className='bx bx-buildings text-lg'></i>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800 leading-none">{p.factoryName}</p>
                                                    <p className="text-[10px] text-gray-400 mt-1.5 font-medium">{p.buyer}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-mono font-bold text-gray-400">
                                                    {p.expiryDate || '날짜 미입력'}
                                                </p>
                                                <p className={`text-[11px] font-black mt-0.5 ${diff !== null && diff < 7 ? 'text-red-500' : 'text-blue-600'}`}>
                                                    {/* 요청하신 D-Day 조건부 렌더링 영역 */}
                                                    {activeGroup.id === 'noDate' || diff === null
                                                        ? '기한 미정'
                                                        : (diff < 0 ? '만기경과' : `D-${diff}`)
                                                    }
                                                </p>
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
                                className="w-full py-4 bg-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg shadow-gray-200"
                            >
                                확인 후 닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpiryChart;