"use client";
import React from 'react';
import { differenceInDays, startOfMonth, getDaysInMonth, addDays, startOfDay, subDays } from 'date-fns';
import { Project } from '@/ingredients/interface';

const MonthTimeline = ({ projects, onSelect }: { projects: Project[]; onSelect: (p: Project) => void }) => {
    const today = startOfDay(new Date());
    const viewStart = startOfMonth(new Date());
    const daysInMonth = getDaysInMonth(viewStart);
    const viewEnd = addDays(viewStart, daysInMonth);
    return (
        <div className="bg-white rounded-[28px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden flex flex-col">
            <div className="w-full">
                {/* 1. 월간 날짜 헤더 - 숫자가 많으므로 더 깔끔하게 디자인 */}
                <div className="grid border-b border-gray-100 bg-white sticky top-0 z-20"
                    style={{ gridTemplateColumns: `repeat(${daysInMonth}, minmax(0, 1fr))` }}>
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const dayNum = i + 1;
                        // 주말이나 특정 날짜 강조 로직을 넣으면 더 좋습니다.
                        return (
                            <div key={i} className="group flex flex-col items-center py-2 border-r border-gray-50/50 last:border-0 hover:bg-gray-50 transition-colors">
                                <span className="text-[9px] font-black text-gray-300 group-hover:text-blue-500 transition-colors">
                                    {dayNum}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* 2. 타임라인 영역 - 배경 그리드와 부드러운 스크롤 */}
                <div className="relative mt-0 overflow-y-auto max-h-[60vh] custom-scrollbar bg-gray-50/20">

                    {/* 세로 그리드 가이드라인 (날짜 구분선) */}
                    <div className="absolute inset-0 grid pointer-events-none"
                        style={{ gridTemplateColumns: `repeat(${daysInMonth}, minmax(0, 1fr))` }}>
                        {Array.from({ length: daysInMonth }).map((_, i) => (
                            <div key={i} className="border-r border-gray-100/30 last:border-0" />
                        ))}
                    </div>

                    <div className="relative w-full py-4 px-1" style={{ height: `${projects.length * 48 + 20}px` }}>
                        {projects.map((p, idx) => {
                            const pStart = today;
                            const pEnd = startOfDay(new Date(p.expiryDate));

                            if (pEnd < viewStart || pStart >= viewEnd) return null;

                            const startOffset = differenceInDays(pStart, viewStart);
                            const left = Math.max(0, (startOffset / daysInMonth) * 100);

                            const displayStart = pStart < viewStart ? viewStart : pStart;
                            const displayEnd = pEnd >= viewEnd ? subDays(viewEnd, 1) : pEnd;
                            const duration = differenceInDays(displayEnd, displayStart) + 1;
                            const width = (duration / daysInMonth) * 100;

                            return (
                                <div
                                    key={idx}
                                    onClick={() => onSelect(p)}
                                    className={`
                                absolute h-9 flex items-center px-3 cursor-pointer transition-all duration-300 group shadow-sm
                                bg-emerald-500 hover:bg-emerald-600 hover:scale-[1.005] hover:shadow-lg hover:shadow-emerald-100 hover:z-10
                                ${pStart < viewStart ? 'rounded-l-none' : 'rounded-l-xl'}
                                ${pEnd >= viewEnd ? 'rounded-r-none border-r-[3px] border-white/30' : 'rounded-r-xl'}
                            `}
                                    style={{
                                        left: `${left}%`,
                                        width: `${width}%`,
                                        top: `${idx * 48 + 12}px`
                                    }}
                                >
                                    <div className="flex items-center gap-2 overflow-hidden w-full text-white">
                                        <i className='bx bx-spreadsheet text-[12px] opacity-80 group-hover:scale-110 transition-transform'></i>
                                        <span className="text-[10px] font-black truncate tracking-tight">
                                            {p.factoryName}
                                        </span>
                                        {/* 월간 뷰에서는 공간이 좁으므로 D-Day를 아주 작게 표시 */}
                                        <span className="ml-auto text-[8px] bg-black/10 px-1.5 py-0.5 rounded-md font-bold whitespace-nowrap">
                                            D-{p.dueDays}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}

                        {/* 현재 시점 세로 인디케이터 */}
                        <div className="absolute top-0 bottom-0 pointer-events-none z-10"
                            style={{
                                left: `${(differenceInDays(today, viewStart) / daysInMonth) * 100}%`,
                            }}>
                            <div className="h-full border-l-2 border-emerald-500/30 border-dashed relative">
                                <div className="absolute top-0 -left-[4.5px] w-2 h-2 bg-emerald-500 rounded-full border-2 border-white shadow-md"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthTimeline;