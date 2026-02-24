"use client";

import { Project } from '@/ingredients/interface';
import React, { useState, useMemo } from 'react';
import { differenceInDays, isBefore, startOfDay } from 'date-fns';

interface WeeklyVerticalListProps {
    projects: Project[];
    onSelect: (p: Project) => void;
}

const WeeklyVerticalList = ({ projects, onSelect }: { projects: Project[], onSelect: (p: Project) => void }) => {
    const today = startOfDay(new Date());

    // --- 1. 상태 관리 ---
    const INITIAL_COUNT = 5;
    const STEP = 5;
    const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
    const [hideExpired, setHideExpired] = useState(false); // 만기 가리기 상태

    // --- 2. [로직 통합] 필터링 및 그룹화 ---
    const { filteredProjects, groupedData } = useMemo(() => {
        // A. 만기 여부에 따른 필터링
        const filtered = projects.filter(p => {
            if (hideExpired) {
                return !isBefore(new Date(p.expiryDate), today);
            }
            return true;
        });

        // B. 날짜순 정렬 후 그룹화
        const groups: { [key: string]: Project[] } = {};
        const sorted = [...filtered].sort((a, b) =>
            new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
        );

        for (const p of sorted) {
            const dateKey = p.expiryDate;
            if (!groups[dateKey]) groups[dateKey] = [];
            groups[dateKey].push(p);
        }

        return {
            filteredProjects: filtered,
            groupedData: Object.keys(groups).map(date => ({
                date,
                items: groups[date]
            }))
        };
    }, [projects, hideExpired, today]);

    // --- 3. 보여줄 아이템 계산 (5개 단위 슬라이싱) ---
    let itemCount = 0;
    const displayGroups = [];

    for (const group of groupedData) {
        if (itemCount >= visibleCount) break;

        const remainingSlot = visibleCount - itemCount;
        if (group.items.length <= remainingSlot) {
            displayGroups.push(group);
            itemCount += group.items.length;
        } else {
            displayGroups.push({
                date: group.date,
                items: group.items.slice(0, remainingSlot)
            });
            itemCount += remainingSlot;
            break;
        }
    }

    const handleShowMore = () => setVisibleCount(prev => prev + STEP);
    const handleShowLess = () => setVisibleCount(prev => Math.max(INITIAL_COUNT, prev - STEP));

    return (
        <div className="space-y-10">
            {/* --- 상단 컨트롤 영역 (만기 가리기 토글) --- */}
            <div className="flex justify-end px-2">
                <button
                    onClick={() => {
                        setHideExpired(!hideExpired);
                        setVisibleCount(INITIAL_COUNT);
                    }}
                    className={`group flex items-center gap-2.5 px-5 py-2.5 rounded-[14px] text-xs font-black transition-all border shadow-sm active:scale-95
                ${hideExpired
                            ? 'bg-red-50 border-red-100 text-red-600'
                            : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300'}`}
                >
                    <div className="relative flex h-2 w-2">
                        {hideExpired && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>}
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${hideExpired ? 'bg-red-500' : 'bg-gray-300'}`} />
                    </div>
                    {hideExpired ? "만기 프로젝트 숨김" : "만기 프로젝트 포함"}
                    <i className={`bx ${hideExpired ? 'bx-low-vision' : 'bx-show'} text-lg ml-1`}></i>
                </button>
            </div>

            {/* --- 리스트 렌더링 영역 --- */}
            {displayGroups.length > 0 ? (
                <div className="space-y-12">
                    {displayGroups.map((group) => (
                        <div key={group.date} className="relative space-y-5">
                            {/* 날짜 구분선 (Sticky 스타일 권장) */}
                            <div className="flex items-center gap-4 sticky top-0 bg-white/50 backdrop-blur-sm py-2 z-10">
                                <span className="flex-none text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100/50 shadow-sm uppercase tracking-widest">
                                    <i className='bx bx-calendar-event mr-1.5'></i>
                                    {group.date !== null ? group.date : "기한 미정"}
                                </span>
                                <div className="h-px flex-1 bg-linear-to-r from-gray-100 to-transparent"></div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 px-2">
                                {group.items.map((p) => {
                                    const diff = differenceInDays(new Date(p.expiryDate), today);
                                    const isExpired = diff < 0;
                                    const isUrgent = diff >= 0 && diff <= 7;

                                    return (
                                        <div
                                            key={p.id}
                                            onClick={() => onSelect(p)}
                                            className="group relative bg-white p-5 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.08)] hover:border-blue-200 transition-all duration-300 cursor-pointer flex items-center justify-between"
                                        >
                                            {/* 왼쪽 섹션: 로고 & 이름 */}
                                            <div className="flex items-center gap-5">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-inner transition-transform group-hover:scale-110 duration-500
                                            ${isExpired ? 'bg-gray-100 text-gray-400' : isUrgent ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-600'}`}>
                                                    {p.buyer.charAt(0)}
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="font-black text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight">
                                                        {p.factoryName}
                                                    </h4>
                                                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400">
                                                        <span className="text-gray-900">{p.buyer}</span>
                                                        <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                                                        <i className='bx bx-time-five'></i>
                                                        {p.expiryDate}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 오른쪽 섹션: D-Day 배지 */}
                                            <div className="text-right">
                                                <div className={`inline-flex flex-col items-end px-4 py-2 rounded-2xl border transition-colors
                                            ${isExpired ? 'bg-gray-50 border-gray-100 text-gray-400' :
                                                        isUrgent ? 'bg-red-50 border-red-100 text-red-600 animate-pulse' :
                                                            'bg-blue-50 border-blue-100 text-blue-600'}`}>
                                                    <span className="text-[10px] font-black uppercase opacity-60 tracking-tighter">Status</span>
                                                    <span className="text-sm font-black tracking-tighter leading-none mt-1">
                                                        {isExpired ? '만기경과' : `D-${diff}`}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Empty State */
                <div className="py-24 text-center bg-gray-50/50 rounded-[40px] border-2 border-dashed border-gray-100 mx-2">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-300">
                        <i className='bx bx-folder-open text-3xl'></i>
                    </div>
                    <p className="text-gray-400 font-black text-sm">조건에 맞는 프로젝트가 없습니다</p>
                    <p className="text-xs text-gray-300 mt-2 font-medium tracking-tight">필터나 검색어를 변경해 보세요.</p>
                </div>
            )}

            {/* --- 제어 버튼 영역 --- */}
            <div className="flex flex-col items-center gap-6 mt-16 pb-12">
                <div className="flex gap-4">
                    {visibleCount < filteredProjects.length && (
                        <button
                            onClick={handleShowMore}
                            className="group flex items-center gap-3 px-10 py-4 bg-gray-900 rounded-[20px] text-[13px] font-black text-white hover:bg-blue-600 transition-all shadow-xl shadow-gray-200 active:scale-95"
                        >
                            더보기
                            <i className='bx bx-plus-circle text-lg group-hover:rotate-90 transition-transform'></i>
                        </button>
                    )}
                    {visibleCount > INITIAL_COUNT && (
                        <button
                            onClick={handleShowLess}
                            className="flex items-center gap-3 px-10 py-4 bg-white border border-gray-200 rounded-[20px] text-[13px] font-black text-gray-500 hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
                        >
                            간단히 보기
                            <i className='bx bx-minus-circle text-lg'></i>
                        </button>
                    )}
                </div>

                <div className="flex flex-col items-center gap-2">
                    <div className="px-4 py-1.5 bg-gray-100 rounded-full">
                        <p className="text-[10px] text-gray-500 font-black tracking-[0.2em] uppercase">
                            Total <span className="text-blue-600">{filteredProjects.length}</span> Projects
                            <span className="mx-2 text-gray-300">/</span>
                            Display <span className="text-blue-600">{itemCount}</span>
                        </p>
                    </div>
                    {hideExpired && (
                        <p className="flex items-center gap-1.5 text-[10px] text-red-500 font-black uppercase tracking-widest animate-bounce mt-2">
                            <i className='bx bx-info-circle'></i>
                            Expired projects are hidden
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WeeklyVerticalList;