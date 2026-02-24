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
        <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col border border-gray-100">
            <div className="w-full">
                {/* 1. 날짜 헤더 - 프로페셔널한 스티키 헤더 */}
                <div className="grid border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-20"
                    style={{ gridTemplateColumns: `repeat(${totalDays}, minmax(0, 1fr))` }}>
                    {Array.from({ length: totalDays }).map((_, i) => {
                        const date = addDays(startDate, i);
                        const isToday = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
                        return (
                            <div key={i} className={`text-center py-3 border-r border-gray-50 last:border-0 transition-colors ${isToday ? 'bg-red-50/50' : ''}`}>
                                <div className={`text-[9px] font-black uppercase tracking-tighter ${isToday ? 'text-red-500' : 'text-gray-400'}`}>
                                    {format(date, 'EEE')}
                                </div>
                                <div className={`text-[11px] font-bold ${isToday ? 'text-red-600' : 'text-gray-900'}`}>
                                    {format(date, 'MM/dd')}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 2. 타임라인 바 영역 - 세로 스크롤 및 배경 그리드 */}
                <div className="relative mt-0 overflow-y-auto max-h-[60vh] custom-scrollbar bg-gray-50/30 transition-all">

                    {/* 배경 세로 가이드라인 (선택사항, 가독성 향상) */}
                    <div className="absolute inset-0 grid pointer-events-none"
                        style={{ gridTemplateColumns: `repeat(${totalDays}, minmax(0, 1fr))` }}>
                        {Array.from({ length: totalDays }).map((_, i) => (
                            <div key={i} className="border-r border-gray-100/50 last:border-0" />
                        ))}
                    </div>

                    <div className="relative w-full" style={{ height: `${projects.length * 52 + 40}px` }}>
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

                            // D-Day 색상 로직
                            const isUrgent = p.dueDays !== undefined && p.dueDays <= 7;

                            return (
                                <div
                                    key={p.id}
                                    onClick={() => onSelect(p)}
                                    className={`absolute h-10 flex flex-col justify-center px-3 cursor-pointer transition-all duration-300 group
                                ${isUrgent ? 'bg-red-500 shadow-lg shadow-red-100' : 'bg-blue-600 shadow-md shadow-blue-100'}
                                hover:scale-[1.01] hover:z-10 hover:brightness-110
                                ${pStart < startDate ? 'rounded-l-none' : 'rounded-l-2xl'}
                                ${pEnd >= viewEnd ? 'rounded-r-none border-r-[3px] border-white/40' : 'rounded-r-2xl'}
                            `}
                                    style={{
                                        left: `${left}%`,
                                        width: `${width}%`,
                                        top: `${idx * 52 + 20}px`,
                                    }}
                                >
                                    <div className="flex items-center gap-1.5 overflow-hidden">
                                        <i className={`bx ${isUrgent ? 'bx-error-circle' : 'bx-package'} text-white/80 text-[12px]`}></i>
                                        <div className="font-black text-white text-[10px] truncate tracking-tight">
                                            <span className="opacity-70 font-normal mr-1">[{p.buyer}]</span>
                                            {p.factoryName}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[8px] text-white/70 font-medium whitespace-nowrap leading-none">
                                            ~ {format(new Date(p.expiryDate), 'MM.dd')}
                                        </span>
                                        <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded-full text-white font-black leading-none">
                                            D-{p.dueDays}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}

                        {/* 오늘 표시 세로 가이드 (오늘 시점 강조) */}
                        <div className="absolute top-0 bottom-0 z-10 pointer-events-none"
                            style={{
                                left: `${(differenceInDays(today, startDate) / totalDays) * 100}%`,
                            }}>
                            <div className="h-full border-l-2 border-red-500/30 border-dashed relative">
                                <div className="absolute top-0 -left-1.25 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DayTimeline;