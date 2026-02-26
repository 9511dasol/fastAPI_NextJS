"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { Project } from '@/ingredients/interface';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
    projects: Project[];
    onSelect: (p: Project) => void;
}

const GROUP_CONFIG = [
    { id: 'expired', label: '기간 만료', range: [-Infinity, -1], color: '#E15759', bgColor: 'bg-red-50', textColor: 'text-[#E15759]', border: 'border-red-100' },
    { id: 'urgent', label: '30일 이내', range: [0, 30], color: '#F28E2B', bgColor: 'bg-orange-50', textColor: 'text-[#F28E2B]', border: 'border-orange-100' },
    { id: 'warning', label: '60일 이내', range: [31, 60], color: '#EDC948', bgColor: 'bg-yellow-50', textColor: 'text-[#B7950B]', border: 'border-yellow-100' },
    { id: 'safe', label: '90일 이내', range: [61, 90], color: '#59A14F', bgColor: 'bg-green-50', textColor: 'text-[#59A14F]', border: 'border-green-100' },
    { id: 'normal', label: '120일 이내', range: [91, 121], color: '#4E79A7', bgColor: 'bg-blue-50', textColor: 'text-[#4E79A7]', border: 'border-blue-100' },
    { id: 'extended', label: '120일 초과', range: [122, Infinity], color: '#A0CBE8', bgColor: 'bg-sky-50', textColor: 'text-[#4E79A7]', border: 'border-sky-100' },
    { id: 'noDate', label: '미정', range: [null, null], color: '#BAB0AC', bgColor: 'bg-gray-50', textColor: 'text-[#767171]', border: 'border-gray-200' },
];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-[#2D3436] text-white p-3 rounded shadow-2xl border border-white/10 text-[12px] z-50">
                <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
                    <span className="font-bold opacity-90">{data.label}</span>
                </div>
                <div className="text-[14px] font-black">
                    {data.value}건 <span className="text-blue-300 ml-1">({data.percentage}%)</span>
                </div>
            </div>
        );
    }
    return null;
};

export default function AuditInsightDashboard({ projects, onSelect }: Props) {
    const [mounted, setMounted] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
    const [displayCount, setDisplayCount] = useState(30);
    const observerTarget = useRef<HTMLDivElement>(null);

    useEffect(() => { setMounted(true); }, []);

    const groupedData = useMemo(() => {
        return GROUP_CONFIG.map(group => {
            const items = projects.filter(p => {
                if (group.id === 'noDate') return p.dueDays === null || p.dueDays === undefined;
                return p.dueDays !== null && p.dueDays >= (group.range[0] as number) && p.dueDays <= (group.range[1] as number);
            });
            return { ...group, value: items.length, items, percentage: projects.length > 0 ? Math.round((items.length / projects.length) * 100) : 0 };
        });
    }, [projects]);

    const allFilteredList = useMemo(() => {
        let list = selectedGroupIds.length === 0
            ? projects
            : groupedData.filter(g => selectedGroupIds.includes(g.id)).flatMap(g => g.items);

        if (searchTerm) {
            const s = searchTerm.toLowerCase();
            list = list.filter(p => p.factoryName.toLowerCase().includes(s) || p.buyer.toLowerCase().includes(s));
        }
        return [...list].sort((a, b) => (a.dueDays ?? 999) - (b.dueDays ?? 999));
    }, [selectedGroupIds, groupedData, projects, searchTerm]);

    const visibleList = useMemo(() => allFilteredList.slice(0, displayCount), [allFilteredList, displayCount]);

    const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
        if (entries[0].isIntersecting && displayCount < allFilteredList.length) {
            setDisplayCount(prev => prev + 20);
        }
    }, [displayCount, allFilteredList.length]);

    useEffect(() => {
        if (!mounted) return;
        const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
        if (observerTarget.current) observer.observe(observerTarget.current);
        return () => observer.disconnect();
    }, [handleObserver, mounted]);

    if (!mounted) return null;

    return (
        <div className="w-full max-w-[1600px] mx-auto p-4 lg:p-6 space-y-6 text-[#2C3E50] bg-[#F4F7F9] min-h-screen font-sans">

            {/* 1. 헤더 영역 */}
            <div className="flex justify-between items-end pb-3 border-b-2 border-slate-200">
                <div>
                    <h2 className="text-2xl font-black tracking-tighter text-[#1A252F]">공장 평가 현황</h2>
                    {/* <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">데이터 기반 리스크 분석 대시보드</p> */}
                </div>
                <div className="text-right hidden sm:block">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">전체 프로젝트 수</span>
                    <p className="text-2xl font-black leading-none text-[#4E79A7]">{projects.length}</p>
                </div>
            </div>

            {/* 2. 상단 대시보드 섹션 - 반응형 순서 조정 (flex-col + order) */}
            <div className="flex flex-col lg:flex-row gap-6">

                {/* 🔥 강화된 파이 차트 영역 (모바일에서 order-1로 최상단 배치) */}
                <div className="order-1 lg:order-2 flex-1 bg-white border-2 border-slate-100 rounded-lg p-6 shadow-sm flex flex-col items-center justify-between min-h-[340px]">
                    <div className="w-full text-center border-b border-slate-50 pb-3 mb-2">
                        <h4 className="text-sm font-black text-[#1A252F] tracking-tight">리스크 분포 비율</h4>
                    </div>

                    <div className="w-full h-50 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={groupedData.filter(g => g.value > 0)}
                                    innerRadius={65}
                                    outerRadius={85}
                                    dataKey="value"
                                    stroke="none"
                                    paddingAngle={3}
                                    cornerRadius={4}
                                >
                                    {groupedData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 100 }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">분류 현황</span>
                            <span className="text-2xl font-black text-[#4E79A7] leading-none mt-1">{groupedData.filter(g => g.value > 0).length}</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Groups</span>
                        </div>
                    </div>

                    <div className="w-full grid grid-cols-4 gap-x-1 gap-y-3 mt-4 pt-4 border-t border-slate-50">
                        {GROUP_CONFIG.map(g => (
                            <div key={g.id} className="flex flex-col items-center">
                                <div className="w-2 h-2 rounded-full mb-1" style={{ backgroundColor: g.color }} />
                                <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap tracking-tighter">{g.label.split(' ')[0]}</span>
                            </div>
                        ))}
                        <div className="flex items-center justify-center opacity-10"><i className='bx bx-check-circle text-xs' /></div>
                    </div>
                </div>

                {/* KPI 필터 카드 (모바일에서 order-2로 중간 배치) */}
                <div className="order-2 lg:order-1 flex-[1.8] grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {groupedData.map((group) => {
                        const isSelected = selectedGroupIds.includes(group.id);
                        return (
                            <div
                                key={group.id}
                                onClick={() => setSelectedGroupIds(prev => prev.includes(group.id) ? prev.filter(id => id !== group.id) : [...prev, group.id])}
                                className={`cursor-pointer p-4 rounded-md bg-white border-2 transition-all flex flex-col justify-between min-h-[110px] shadow-sm ${isSelected ? `ring-2 ring-[#4E79A7]/20 border-[#4E79A7] shadow-md` : 'border-slate-100 hover:border-slate-300'
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[11px] font-black text-slate-500">{group.label}</span>
                                        <div className="w-6 h-1 rounded-full" style={{ backgroundColor: group.color }} />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-300 italic">{group.percentage}%</span>
                                </div>
                                <div className="mt-4 flex items-baseline gap-1">
                                    <span className="text-3xl font-black tracking-tighter leading-none">{group.value}</span>
                                    <span className="text-xs font-bold text-slate-400 uppercase">건</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 3. 상세 리스트 테이블 영역 (order-3) */}
            <div className="bg-white border-2 border-slate-100 rounded-lg shadow-sm flex flex-col h-[650px] overflow-hidden">
                <div className="px-5 py-4 bg-[#F8FAFC] border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                        <div className="w-1.5 h-5 bg-[#4E79A7] rounded-full" />
                        <h3 className="font-black text-base text-[#1A252F] tracking-tight">전체 공장 평가 현황 상세</h3>
                    </div>
                    <div className="relative w-full sm:w-80">
                        <input
                            type="text"
                            placeholder="공장명 또는 바이어 검색..."
                            className="w-full bg-white border border-slate-300 rounded-md py-2 pl-4 pr-10 text-[12px] font-bold focus:ring-2 focus:ring-[#4E79A7]/10 focus:border-[#4E79A7] outline-none transition-all placeholder-slate-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <i className='bx bx-search absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg'></i>
                    </div>
                </div>

                <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-200">
                    <table className="w-full text-left border-collapse table-fixed min-w-[800px]">
                        <thead className="sticky top-0 bg-[#F1F4F7] text-[#64748B] text-[10px] font-black uppercase tracking-wider z-20 border-b border-slate-200 shadow-sm">
                            <tr>
                                <th className="w-[60px] px-6 py-4 text-center">상태</th>
                                <th className="px-6 py-4">공장명 (Factory)</th>
                                <th className="hidden sm:table-cell w-[20%] px-6 py-4">바이어</th>
                                <th className="hidden md:table-cell w-[12%] px-6 py-4 text-center">유형</th>
                                <th className="w-[120px] px-6 py-4">남은 기간</th>
                                <th className="hidden lg:table-cell w-[15%] px-6 py-4 text-right pr-10">만료예정일</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {visibleList.map((p) => {
                                const group = GROUP_CONFIG.find(g => {
                                    if (g.id === 'noDate') return p.dueDays === null || p.dueDays === undefined;
                                    return p.dueDays !== null && p.dueDays >= (g.range[0] as number) && p.dueDays <= (g.range[1] as number);
                                }) || GROUP_CONFIG[6];

                                return (
                                    <tr key={p.id} onClick={() => onSelect(p)} className="group hover:bg-blue-50/30 transition-colors cursor-pointer text-[13px] font-bold text-slate-600 h-[56px]">
                                        <td className="px-6 py-3 text-center">
                                            <div className="w-2.5 h-2.5 rounded-full mx-auto transition-all group-hover:scale-125 shadow-sm" style={{ backgroundColor: group.color }} />
                                        </td>
                                        <td className="px-6 py-3 text-[#1A252F] font-black truncate group-hover:text-[#4E79A7] group-hover:underline underline-offset-4 transition-all">
                                            {p.factoryName}
                                        </td>
                                        <td className="hidden sm:table-cell px-6 py-3 text-slate-400 font-medium truncate italic">{p.buyer}</td>
                                        <td className="hidden md:table-cell px-6 py-3 text-center">
                                            <span className="text-[10px] text-slate-400 border border-slate-100 px-2 py-0.5 rounded font-black">{p.auditType}</span>
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-black border ${group.bgColor} ${group.textColor} ${group.border} shadow-sm inline-block`}>
                                                {p.dueDays === null ? '날짜미정' : p.dueDays < 0 ? `만료됨` : `D-${p.dueDays}`}
                                            </span>
                                        </td>
                                        <td className="hidden lg:table-cell px-6 py-3 text-right text-slate-400 font-mono text-[11px] pr-10 tracking-tight">{p.expiryDate}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div ref={observerTarget} className="w-full h-20 flex items-center justify-center bg-white border-t border-slate-50">
                        {displayCount < allFilteredList.length && (
                            <div className="flex gap-1.5">
                                {[0, 1, 2].map(i => <div key={i} className="w-1.5 h-1.5 bg-[#4E79A7]/30 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}