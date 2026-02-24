"use client"; // Next.js 클라이언트 컴포넌트 선언

import React, { useState } from 'react';
import { differenceInDays, startOfYear, addDays, startOfDay, subDays } from 'date-fns';
import { Project } from '@/ingredients/interface';

const YearTimeline = ({ projects, onSelect }: { projects: Project[], onSelect: (p: Project) => void }) => {
    const today = startOfDay(new Date());
    const viewStart = startOfYear(new Date());
    const viewEnd = addDays(viewStart, 365); // 윤년 제외 간소화
    const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

    return (
        <div className="bg-white rounded-4xl shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden flex flex-col transition-all">
            <div className="w-full">
                {/* 1. 연간 월 헤더 (1월 ~ 12월) */}
                <nav className="grid grid-cols-12 bg-white-900 rounded-t-[28px] mx-1 mt-1">
                    {months.map((m, i) => (
                        <div
                            key={m}
                            className="text-center py-3 text-[10px] font-black text-gray-400 border-r last:border-0 border-white/5 uppercase tracking-tighter"
                        >
                            {m}
                        </div>
                    ))}
                </nav>

                {/* 2. 타임라인 컨테이너 */}
                <div className="relative mt-0 bg-white border border-t-0 rounded-b-4xl overflow-y-auto max-h-[60vh] custom-scrollbar min-h-75">

                    {/* 월별 세로 가이드라인 (12칸 그리드) */}
                    <div className="absolute inset-0 grid grid-cols-12 pointer-events-none">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="border-r border-gray-50 last:border-0" />
                        ))}
                    </div>

                    <div className="relative w-full py-6" style={{ height: `${projects.length * 36 + 40}px` }}>
                        {projects.map((p, idx) => {
                            const pStart = today;
                            const pEnd = startOfDay(new Date(p.expiryDate));

                            if (pEnd < viewStart || pStart >= viewEnd) return null;

                            const startOffset = differenceInDays(pStart, viewStart);
                            const left = Math.max(0, (startOffset / 365) * 100);

                            const displayStart = pStart < viewStart ? viewStart : pStart;
                            const displayEnd = pEnd >= viewEnd ? subDays(viewEnd, 1) : pEnd;
                            const duration = differenceInDays(displayEnd, displayStart) + 1;
                            const width = (duration / 365) * 100;

                            return (
                                <div
                                    key={p.id}
                                    onClick={() => onSelect(p)}
                                    className={`
                                absolute h-6 flex items-center px-4 cursor-pointer transition-all duration-300 group
                                bg-indigo-600 hover:bg-indigo-500 hover:scale-[1.002] hover:shadow-lg hover:shadow-indigo-100 hover:z-10
                                ${pStart < viewStart ? 'rounded-l-none' : 'rounded-l-full'}
                                ${pEnd >= viewEnd ? 'rounded-r-none border-r-2 border-white/40' : 'rounded-r-full'}
                            `}
                                    style={{
                                        left: `${left}%`,
                                        width: `${width}%`,
                                        top: `${idx * 36 + 15}px`
                                    }}
                                >
                                    <div className="flex items-center gap-2 overflow-hidden w-full text-white">
                                        <i className='bx bx-git-commit text-[10px] opacity-60'></i>
                                        <span className="text-[9px] font-black truncate tracking-tighter uppercase">
                                            {p.factoryName}
                                        </span>
                                    </div>

                                    {/* 아주 작은 툴팁 효과 (Hover 시 강조) */}
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                                        {p.factoryName} (D-{p.dueDays})
                                    </div>
                                </div>
                            );
                        })}

                        {/* 오늘 날짜 세로선 (연간 뷰) */}
                        <div className="absolute top-0 bottom-0 pointer-events-none z-10"
                            style={{
                                left: `${(differenceInDays(today, viewStart) / 365) * 100}%`,
                            }}>
                            <div className="h-full border-l-2 border-indigo-500/20 border-dashed relative">
                                <div className="absolute top-0 -left-1.25 w-2.5 h-2.5 bg-indigo-600 rounded-full border-2 border-white shadow-sm"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default YearTimeline;