"use client";

import React, { useState, useMemo } from 'react';
import { format, addDays, isBefore, startOfDay } from 'date-fns';
import { fetchData, Project } from '@/ingredients/interface';
import DayTimeline from './dashBoard/dayTimeline';
import MonthTimeline from './dashBoard/monthlyTimeline';
import YearTimeline from './dashBoard/yearlyTimeline';
import WeeklyVerticalList from './dashBoard/WeeklyVerticalList';

type ViewType = 'day' | 'month' | 'year';
// 필터 타입 정의
type FilterType = 'all' | 'urgent' | 'soon';

const ProjectDashboard = ({ items }: { items: fetchData }) => {
    const [viewType, setViewType] = useState<ViewType>('day');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    // --- 검색 및 필터 상태 ---
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<FilterType>('all');
    const INITIAL_COUNT = 15;
    const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

    // 1. 검색 + 기간 필터 통합 로직
    const filteredProjects = useMemo(() => {
        const today = startOfDay(new Date());

        return items.items.filter(p => {
            // A. 검색어 필터
            const matchesSearch = p.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.factoryName.toLowerCase().includes(searchTerm.toLowerCase());

            // B. 기간 필터
            const expiryDate = new Date(p.expiryDate);
            let matchesFilter = true;
            if (filterStatus === 'urgent') {
                matchesFilter = isBefore(expiryDate, addDays(today, 30)); // 30일 이내
            } else if (filterStatus === 'soon') {
                matchesFilter = isBefore(expiryDate, addDays(today, 90)); // 90일 이내
            }

            return matchesSearch && matchesFilter;
        });
    }, [searchTerm, filterStatus, items.items]);

    // 2. 현재 표시할 프로젝트 슬라이싱
    const visibleProjects = filteredProjects.slice(0, visibleCount);

    const loadMore = () => setVisibleCount(prev => prev + 20);
    const resetCount = () => setVisibleCount(INITIAL_COUNT);

    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* --- 상단 헤더 & 검색/필터 영역 --- */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-black text-gray-800 tracking-tight">📊 로드맵 대시보드</h1>
                            <p className="text-xs text-gray-400 mt-1">Total {filteredProjects.length} projects found</p>
                        </div>

                        {/* 기간 필터 버튼 그룹 */}
                        <div className="flex bg-gray-100 p-1 rounded-2xl gap-1">
                            {[
                                { id: 'all', label: '전체' },
                                { id: 'urgent', label: '🚨 30일 이내' },
                                { id: 'soon', label: '📅 90일 이내' }
                            ].map((f) => (
                                <button
                                    key={f.id}
                                    onClick={() => {
                                        setFilterStatus(f.id as FilterType);
                                        setVisibleCount(INITIAL_COUNT);
                                    }}
                                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${filterStatus === f.id
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3">
                        {/* 검색창 */}
                        <div className="relative flex-1">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
                            <input
                                type="text"
                                placeholder="바이어 또는 공장명 검색..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setVisibleCount(INITIAL_COUNT);
                                }}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all text-sm outline-none"
                            />
                        </div>

                        {/* 타임라인 뷰 전환 */}
                        <div className="inline-flex bg-gray-100 p-1 rounded-2xl shadow-inner">
                            {(['day', 'month', 'year'] as ViewType[]).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setViewType(type)}
                                    className={`px-5 py-2 text-xs font-bold rounded-xl transition-all ${viewType === type ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    {type === 'day' ? '15일' : type === 'month' ? '월간' : '연간'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- 타임라인 컨테이너 (커스텀 스크롤바) --- */}
                <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
                    <div className="
                        [&::-webkit-scrollbar]:w-2
                        [&::-webkit-scrollbar-track]:bg-transparent
                        [&::-webkit-scrollbar-thumb]:bg-gray-200
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        hover:[&::-webkit-scrollbar-thumb]:bg-gray-300
                    ">
                        {visibleProjects.length > 0 ? (
                            <div className="p-2">
                                {viewType === 'day' && <DayTimeline projects={visibleProjects} onSelect={setSelectedProject} />}
                                {viewType === 'month' && <MonthTimeline projects={visibleProjects} onSelect={setSelectedProject} />}
                                {viewType === 'year' && <YearTimeline projects={visibleProjects} onSelect={setSelectedProject} />}
                            </div>
                        ) : (
                            <div className="py-24 text-center">
                                <p className="text-4xl mb-4">🔍</p>
                                <p className="text-gray-400 font-medium">일치하는 프로젝트가 없습니다.</p>
                                <button
                                    onClick={() => { setSearchTerm(""); setFilterStatus('all'); }}
                                    className="mt-4 text-blue-600 text-sm font-bold underline"
                                >
                                    필터 초기화
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 하단 제어부 */}
                    <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center text-sm">
                        <div className="text-gray-500 font-medium">
                            {filterStatus !== 'all' && <span className="text-blue-600 mr-2 font-bold">[{filterStatus === 'urgent' ? '긴급' : '관심'}]</span>}
                            {visibleProjects.length} / {filteredProjects.length} 표시 중
                        </div>
                        <div className="flex gap-2">
                            {visibleCount < filteredProjects.length && (
                                <button onClick={loadMore} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all text-xs shadow-md shadow-blue-100">
                                    결과 더 보기 ↓
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* 하단 세로 리스트 */}
                <div className="mt-10">
                    <h2 className="text-xl font-black text-gray-800 mb-6 px-2 flex items-center gap-2">
                        📅 상세 리스트
                        {filterStatus !== 'all' && <span className="text-sm font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md">필터 적용됨</span>}
                    </h2>
                    <WeeklyVerticalList projects={visibleProjects} onSelect={setSelectedProject} />
                </div>
            </div>

            {/* --- 팝업 모달 (기존 로직 유지) --- */}
            {selectedProject && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200" onClick={() => setSelectedProject(null)}>
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setSelectedProject(null)} className="absolute top-5 right-6 text-gray-400 hover:text-gray-800 text-3xl font-light transition-colors"> &times; </button>
                        <div className="mb-6">
                            <span className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg">Project Detail</span>
                        </div>
                        <p className="text-blue-600 text-lg font-bold mb-8 italic">@ {selectedProject.factoryName}</p>
                        <div className="space-y-5 text-sm text-gray-700 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-gray-400 uppercase">시작 일시</span>
                                <span className="font-medium text-gray-800">{format(new Date(), 'yyyy년 MM월 dd일 HH:mm')}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-gray-400 uppercase">종료 예정</span>
                                <span className="font-medium text-gray-800">{format(new Date(selectedProject.expiryDate), 'yyyy년 MM월 dd일 HH:mm')}</span>
                            </div>
                        </div>
                        <button onClick={() => setSelectedProject(null)} className="w-full mt-8 bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg active:scale-95">닫기</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDashboard;