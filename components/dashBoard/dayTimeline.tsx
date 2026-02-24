"use client";

import React from 'react';
import {
    addDays, subDays, format, differenceInDays,
    startOfDay
} from 'date-fns';
import { Project } from '@/ingredients/interface';

const DayTimeline = ({ projects, onSelect }: { projects: Project[], onSelect: (p: Project) => void }) => {
    const today = startOfDay(new Date());
    const startDate = subDays(today, 2);
    const totalDays = 15;
    const viewEnd = addDays(startDate, totalDays);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md overflow-hidden flex flex-col">
            <div className="w-full">
                {/* 1. 날짜 헤더 - 상단 고정 (z-index 조절) */}
                <div className="grid border-b border-gray-100 bg-white sticky top-0 z-20"
                    style={{ gridTemplateColumns: `repeat(${totalDays}, minmax(0, 1fr))` }}>
                    {Array.from({ length: totalDays }).map((_, i) => (
                        <div key={i} className="text-center py-2 text-[10px] text-gray-400 border-r border-gray-50 last:border-0">
                            {format(addDays(startDate, i), 'MM/dd')}
                        </div>
                    ))}
                </div>

                {/* 2. 타임라인 바 영역 - 세로 스크롤 적용 */}
                <div className="relative mt-2 overflow-y-auto 
                    /* 최대 높이 설정 (원하는 크기로 조절 가능) */
                    max-h-[70vh]
                    /* 커스텀 스크롤바 디자인 */
                    [&::-webkit-scrollbar]:w-1.5
                    [&::-webkit-scrollbar-track]:bg-gray-50
                    [&::-webkit-scrollbar-thumb]:bg-gray-200
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    hover:[&::-webkit-scrollbar-thumb]:bg-blue-300
                    bg-gray-50/50 rounded-xl transition-all"
                >
                    {/* 프로젝트 바들이 들어갈 컨테이너 - 높이를 데이터 개수에 맞게 동적 설정 */}
                    <div className="relative w-full" style={{ height: `${projects.length * 45 + 20}px` }}>
                        {projects.map((p, idx) => {
                            const pStart = today;
                            const pEnd = startOfDay(new Date(p.expiryDate));

                            if (pEnd < startDate || pStart >= viewEnd) return null;

                            const startOffset = differenceInDays(pStart, startDate);
                            const left = Math.max(0, (startOffset / totalDays) * 100);

                            const displayStart = pStart < startDate ? startDate : pStart;
                            const displayEnd = pEnd >= viewEnd ? subDays(viewEnd, 1) : pEnd;
                            const duration = differenceInDays(displayEnd, displayStart) + 1;
                            const width = (duration / totalDays) * 100;

                            return (
                                <div
                                    key={p.id} onClick={() => onSelect(p)}
                                    className={`absolute h-9 bg-blue-600/60 backdrop-blur-md text-white text-[10px] flex flex-col justify-center px-3 cursor-pointer shadow-sm transition-transform hover:scale-[1.01] hover:z-10
                                        ${pStart < startDate ? 'rounded-l-none' : 'rounded-l-xl'}
                                        ${pEnd >= viewEnd ? 'rounded-r-none border-r-4 border-white/30' : 'rounded-r-xl'}
                                    `}
                                    style={{
                                        left: `${left}%`,
                                        width: `${width}%`,
                                        top: `${idx * 45 + 12}px`,
                                    }}
                                >
                                    <div className="font-bold truncate">[{p.buyer}] {p.factoryName}</div>
                                    <div className="text-[8px] opacity-80">~ {p.expiryDate} (D-{p.dueDays})</div>
                                </div>
                            );
                        })}

                        {/* 오늘 표시 세로선 - 전체 높이에 맞춰 표시 */}
                        <div className="absolute top-0 bottom-0 border-l-2 border-dashed border-red-500/40 z-0 pointer-events-none"
                            style={{
                                left: `${(differenceInDays(today, startDate) / totalDays) * 100}%`,
                            }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DayTimeline;