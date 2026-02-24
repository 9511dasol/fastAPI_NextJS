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
        <div className="bg-white p-6 rounded-2xl shadow-md overflow-hidden">
            <div className="w-full">
                <div className="grid border-b border-gray-50" style={{ gridTemplateColumns: `repeat(${daysInMonth}, minmax(0, 1fr))` }}>
                    {Array.from({ length: daysInMonth }).map((_, i) => (
                        <div key={i} className="text-center py-1 text-[9px] text-gray-400 border-r last:border-0 border-gray-50">
                            {i + 1}
                        </div>
                    ))}
                </div>
                <div className="relative mt-4 h-48 overflow-y-auto max-h-[70vh] bg-gray-50/50 rounded-xl overflow-hidden">
                    {projects.map((p, idx) => {
                        const pStart = today;
                        const pEnd = startOfDay(new Date(p.expiryDate));

                        // 뷰 범위 밖 프로젝트 필터링
                        if (pEnd < viewStart || pStart >= viewEnd) return null;

                        // 좌표 계산 및 클램핑
                        const startOffset = differenceInDays(pStart, viewStart);
                        const left = Math.max(0, (startOffset / daysInMonth) * 100);

                        const displayStart = pStart < viewStart ? viewStart : pStart;
                        const displayEnd = pEnd >= viewEnd ? subDays(viewEnd, 1) : pEnd;
                        const duration = differenceInDays(displayEnd, displayStart) + 1;
                        const width = (duration / daysInMonth) * 100;

                        return (
                            <div
                                key={idx} onClick={() => onSelect(p)}
                                className={`absolute h-8 bg-emerald-600/60 backdrop-blur-md text-white text-[10px] flex items-center px-2 cursor-pointer shadow-sm transition-transform hover:scale-[1.01]
                  ${pStart < viewStart ? 'rounded-l-none border-l-2 border-white/50' : 'rounded-l-lg'}
                  ${pEnd >= viewEnd ? 'rounded-r-none border-r-2 border-white/50' : 'rounded-r-lg'}
                `}
                                style={{ left: `${left}%`, width: `${width}%`, top: `${idx * 40 + 12}px` }}
                            >
                                <span className="truncate">{p.factoryName}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MonthTimeline;