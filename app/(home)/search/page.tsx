"use client";

import { useState, useMemo, useRef } from 'react';
import { getInfos } from '@/ingredients/getInfo';
import { fetchData, Project } from '@/ingredients/interface';
import { useQuery } from '@tanstack/react-query';

export default function SearchPage() {
    // --- 1. React Query 도입 (기존 useState, useEffect 제거) ---
    const { data: queryData, isLoading, isError } = useQuery<fetchData>({
        queryKey: ['factory-audits'], // 캐시 식별 키
        queryFn: getInfos,           // 데이터 페칭 함수
        staleTime: 10 * 60 * 1000,   // 10분 동안 데이터를 '신선'하다고 간주 (캐시 유지)
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [viewType, setViewType] = useState<'day' | 'month' | 'year'>('day');
    const [showExpired, setShowExpired] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // --- 2. 필터링 로직 (queryData 사용) ---
    const filteredProjects = useMemo(() => {
        if (!queryData?.items) return [];

        let filtered = queryData.items.filter((p: Project) =>
            p.factoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.buyer.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (!showExpired) {
            filtered = filtered.filter(p => p.dueDays >= 0);
        }

        if (viewType === 'day') filtered = filtered.filter(p => p.dueDays <= 15);
        else if (viewType === 'month') filtered = filtered.filter(p => p.dueDays <= 30);

        return filtered.sort((a, b) => a.dueDays - b.dueDays);
    }, [searchTerm, queryData, viewType, showExpired]);

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 animate-in fade-in duration-700">

            {/* --- 상단 다크 톤 검색 섹션 --- */}
            <div className="bg-gray-900 p-6 rounded-[2.5rem] shadow-2xl space-y-4">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="relative flex-1 w-full group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2">
                            {/* React Query의 isLoading 상태 사용 */}
                            <i className={`bx ${isLoading ? 'bx-loader-alt bx-spin' : 'bx-search'} text-xl text-blue-400`}></i>
                        </div>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="바이어 또는 공장명을 검색하세요..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-12 py-4 bg-gray-800 border border-gray-700 rounded-2xl text-white placeholder:text-gray-500 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold"
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                                <i className='bx bxs-x-circle text-xl'></i>
                            </button>
                        )}
                    </div>

                    <div className="flex bg-gray-800 p-1.5 rounded-2xl border border-gray-700 w-full md:w-auto overflow-x-auto">
                        {['day', 'month', 'year'].map((id) => (
                            <button
                                key={id}
                                onClick={() => setViewType(id as any)}
                                className={`flex-1 md:flex-none px-6 py-2.5 text-xs font-black rounded-xl transition-all whitespace-nowrap ${viewType === id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'}`}
                            >
                                {id === 'day' ? '15일' : id === 'month' ? '한달' : '전체'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end items-center gap-3 pt-2">
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">만료된 항목 표시</span>
                    <button
                        onClick={() => setShowExpired(!showExpired)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showExpired ? 'bg-blue-500' : 'bg-gray-700'}`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showExpired ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
            </div>

            {/* --- 결과 리스트 영역 --- */}
            <div className="grid grid-cols-1 gap-3">
                {isLoading ? (
                    <div className="py-20 text-center animate-pulse text-gray-400 font-bold bg-white rounded-3xl border">
                        데이터를 불러오는 중...
                    </div>
                ) : isError ? (
                    <div className="py-20 text-center text-red-400 font-bold bg-white rounded-3xl border border-red-100">
                        데이터를 가져오는데 실패했습니다.
                    </div>
                ) : filteredProjects.length > 0 ? (
                    filteredProjects.map((p) => (
                        <div
                            key={p.id}
                            onClick={() => { setSelectedProject(p); setIsModalOpen(true); }}
                            className={`flex items-center gap-4 p-4 rounded-3xl border transition-all cursor-pointer active:scale-[0.98] ${p.dueDays < 0 ? 'bg-gray-50 opacity-60 border-gray-100' : 'bg-white border-gray-100 hover:border-blue-200 shadow-sm'}`}
                        >
                            <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black border flex-shrink-0 ${p.dueDays < 0 ? 'bg-gray-200 text-gray-500 border-gray-300' :
                                p.dueDays <= 15 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                                }`}>
                                <span className="text-[9px] uppercase leading-none mb-1">{p.dueDays < 0 ? 'Expired' : 'D-Day'}</span>
                                <span className="text-lg leading-none">{Math.abs(p.dueDays)}</span>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h4 className="font-bold text-gray-900 truncate">{p.factoryName}</h4>
                                    {p.dueDays < 0 && <span className="text-[9px] font-black text-gray-400 border border-gray-300 px-1 rounded">PAST</span>}
                                </div>
                                <p className="text-xs text-gray-400 font-medium">{p.buyer} • {p.co}</p>
                            </div>
                            <i className='bx bx-chevron-right text-2xl text-gray-300'></i>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center text-gray-400 font-bold bg-white rounded-3xl border border-dashed">
                        일치하는 결과가 없습니다.
                    </div>
                )}
            </div>

            {/* --- 상세 정보 모달 (Floating Detail View) --- */}
            {isModalOpen && selectedProject && (
                <div
                    className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-gray-900/60 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-300"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="bg-white w-full sm:max-w-lg h-[85vh] sm:h-auto sm:rounded-[2.5rem] rounded-t-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-400 flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* 모바일용 상단 핸들 */}
                        <div className="sm:hidden w-full flex justify-center pt-3 pb-1">
                            <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
                        </div>

                        {/* 모달 헤더: 상태에 따라 색상 변경 */}
                        <div className={`p-8 ${selectedProject.dueDays < 0 ? 'bg-gray-400' : 'bg-blue-600'} relative`}>
                            <div className="flex justify-between items-start text-white">
                                <div className="space-y-1">
                                    <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        {selectedProject.auditType}
                                    </span>
                                    <h3 className="text-2xl font-black leading-tight mt-2">{selectedProject.factoryName}</h3>
                                    <p className="text-sm font-bold opacity-80 uppercase">{selectedProject.buyer}</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors"
                                >
                                    <i className="bx bx-x text-2xl"></i>
                                </button>
                            </div>
                        </div>

                        {/* 상세 내용 섹션 */}
                        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Factory ID</p>
                                    <p className="text-sm font-bold text-gray-800">{selectedProject.fctId}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Country / Region</p>
                                    <p className="text-sm font-bold text-gray-800">{selectedProject.co}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-xs font-black text-gray-900 border-l-4 border-blue-600 pl-2 uppercase tracking-tight">Audit Timeline</h4>
                                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                                    <span className="text-sm font-medium text-gray-500">최근 감사일</span>
                                    <span className="text-sm font-bold text-gray-800">{selectedProject.latestAuditDate}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                                    <span className="text-sm font-medium text-gray-500">차기 만료일</span>
                                    <span className={`text-sm font-bold ${selectedProject.dueDays < 0 ? 'text-gray-400' : 'text-red-500'} underline decoration-2 underline-offset-4`}>
                                        {selectedProject.expiryDate}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                                    <span className="text-sm font-medium text-gray-500">상태</span>
                                    <span className={`text-sm font-black px-3 py-1 rounded-full ${selectedProject.dueDays < 0 ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-600'}`}>
                                        {selectedProject.dueBucket}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 하단 닫기 버튼 */}
                        <div className="p-6 bg-white border-t border-gray-50">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-full py-4 bg-gray-900 text-white rounded-2xl text-sm font-black active:scale-[0.98] transition-all"
                            >
                                창 닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}