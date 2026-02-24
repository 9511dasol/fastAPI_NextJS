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
        <div className="bg-white p-6 rounded-2xl shadow-md overflow-hidden">
            <div className="w-full">
                <nav className="grid grid-cols-12 bg-gray-100 rounded-t-xl">
                    {months.map(m => (
                        <div key={m} className="text-center py-2 text-xs font-bold text-gray-500 border-r last:border-0 border-white/50">{m}</div>
                    ))}
                </nav>
                <div className="relative h-64 bg-white border border-t-0 rounded-b-xl overflow-y-auto max-h-[70vh] shadow-inner">
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
                                key={p.id} onClick={() => onSelect(p)}
                                className={`absolute h-7 bg-indigo-600/60 backdrop-blur-md text-white text-[9px] flex items-center px-3 cursor-pointer shadow-sm hover:z-10
                  ${pStart < viewStart ? 'rounded-l-none border-l-2 border-white/50' : 'rounded-l-full'}
                  ${pEnd >= viewEnd ? 'rounded-r-none border-r-2 border-white/50' : 'rounded-r-full'}
                `}
                                style={{ left: `${left}%`, width: `${width}%`, top: `${idx * 34 + 15}px` }}
                            >
                                <span className="truncate font-medium">{p.factoryName}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default YearTimeline;