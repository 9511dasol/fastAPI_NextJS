"use client";

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { format, addDays, isBefore, startOfDay } from 'date-fns';
import { fetchData, Project } from '@/ingredients/interface';
import DayTimeline from './dashBoard/dayTimeline';
import MonthTimeline from './dashBoard/monthlyTimeline';
import YearTimeline from './dashBoard/yearlyTimeline';
import WeeklyVerticalList from './dashBoard/WeeklyVerticalList';
import ExpiryAnalysis from './dashBoard/ExpiryAnalysis';
import ExpiryChart from './dashBoard/expiryChart';
import SkeletonTimeline from './dashBoard/skeletonTimeline';
import ExpiryStatusCards from './dashBoard/expiryStatusCards';
import 'boxicons/css/boxicons.min.css';

type ViewType = 'day' | 'month' | 'year';
// 필터 타입 정의
type FilterType = 'all' | 'urgent' | 'soon';

const ProjectDashboard = ({ items }: { items: fetchData }) => {
    const [viewType, setViewType] = useState<ViewType>('day');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const projects: Project[] = items.items;
    // --- 검색 및 필터 상태 ---
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<FilterType>('all');
    const INITIAL_COUNT = 15;
    const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
    const [activeFilter, setActiveFilter] = useState<string>("all");
    // 1. 현재 선택된 필터 ID 상태 관리 (null이면 전체 표시)
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

    // 3. 카드 클릭 핸들러
    const handleFilterChange = (groupId: string) => {
        // 이미 선택된 필터를 다시 누르면 해제(null), 아니면 새로 선택
        setSelectedFilter(prev => prev === groupId ? null : groupId);
    };

    // --- [추가] 모달 닫기 핸들러 ---
    const closeProjectModal = useCallback(() => {
        setSelectedProject(null);
    }, []);

    // --- [추가] 키보드 Esc 및 스크롤 제어 로직 ---
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeProjectModal();
                // 만약 activeFilter도 초기화하고 싶다면 여기에 추가 가능
            }
        };

        if (selectedProject) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden'; // 배경 스크롤 차단
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset'; // 스크롤 원복
        };
    }, [selectedProject, closeProjectModal]);

    // 1. 검색 + 기간 필터 통합 로직
    const filteredProjects = useMemo(() => {
        const today = startOfDay(new Date());

        return projects.filter(p => {
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
                <ExpiryStatusCards projects={projects} />
                <ExpiryChart projects={projects} />
                <ExpiryAnalysis projects={projects} onSelect={setSelectedProject} />
                {/* --- 상단 헤더 & 검색/필터 영역 --- */}
                <div className="bg-white p-8 rounded-4xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 space-y-8">

                    {/* 1. 최상단 타이틀 & 프로젝트 카운트 */}
                    <div className="bg-white p-8 rounded-4xl shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-100/80 mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">

                            {/* 1. 타이틀 및 카운트 섹션 */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                                        <i className='bx bxs-dashboard text-white text-2xl'></i>
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-none">
                                            로드맵 대시보드
                                        </h1>
                                        <p className="text-[11px] font-bold text-blue-600/50 uppercase tracking-[0.2em] mt-1">
                                            Project Management System
                                        </p>
                                    </div>
                                </div>

                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
                                    <i className='bx bx-list-check text-blue-500 text-lg'></i>
                                    <p className="text-xs font-bold text-gray-500">
                                        현재 검색 결과 <span className="text-blue-600 px-1">{filteredProjects.length}</span> 건
                                    </p>
                                </div>
                            </div>

                            {/* 2. 세그먼트 필터 컨트롤 (Figma 스타일) */}
                            <div className="relative flex bg-gray-100/80 p-1.5 rounded-[22px] border border-gray-200/50 backdrop-blur-sm shadow-inner min-w-max">
                                {[
                                    { id: 'all', label: '전체 보기', icon: 'bx-grid-alt' },
                                    { id: 'urgent', label: '30일 이내', icon: 'bx-error-circle', color: 'text-red-500' },
                                    { id: 'soon', label: '90일 이내', icon: 'bx-calendar-event', color: 'text-orange-500' }
                                ].map((f) => {
                                    const isActive = filterStatus === f.id;
                                    return (
                                        <button
                                            key={f.id}
                                            onClick={() => {
                                                setFilterStatus(f.id as FilterType);
                                                setVisibleCount(INITIAL_COUNT);
                                            }}
                                            className={`
                                    relative flex items-center gap-2.5 px-6 py-3 text-xs font-black rounded-[18px] transition-all duration-500 ease-out
                                    ${isActive
                                                    ? 'bg-white text-gray-900 shadow-[0_10px_20px_rgba(0,0,0,0.05)] scale-[1.02] z-10'
                                                    : 'text-gray-400 hover:text-gray-600 hover:bg-white/40'
                                                }
                                `}
                                        >
                                            <i className={`bx ${f.icon} text-lg transition-transform duration-300 ${isActive ? (f.color || 'text-blue-500') : 'text-gray-300'} ${isActive && 'scale-110'}`}></i>
                                            <span className="tracking-tight">{f.label}</span>

                                            {isActive && (
                                                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${f.id === 'all' ? 'bg-blue-400' : f.id === 'urgent' ? 'bg-red-400' : 'bg-orange-400'}`}></span>
                                                    <span className={`relative inline-flex rounded-full h-2 w-2 ${f.id === 'all' ? 'bg-blue-500' : f.id === 'urgent' ? 'bg-red-500' : 'bg-orange-500'}`}></span>
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* 하단 컨트롤 바: 검색 & 뷰 전환 */}
                    <div className="flex flex-col md:flex-row items-center gap-4 pt-2">

                        {/* 3. 통합 검색창 (Boxicons 적용) */}
                        <div className="relative flex-1 w-full group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center">
                                {isLoading ? (
                                    <i className='bx bx-loader-alt bx-spin text-blue-500 text-xl'></i>
                                ) : (
                                    <i className='bx bx-search text-gray-400 text-xl group-focus-within:text-blue-500 transition-colors'></i>
                                )}
                            </div>
                            <input
                                type="text"
                                placeholder="바이어 명칭 또는 공장명을 입력하세요..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setIsLoading(true);
                                    setSearchTerm(e.target.value);
                                    setVisibleCount(INITIAL_COUNT);
                                    setTimeout(() => setIsLoading(false), 300);
                                }}
                                className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium outline-none placeholder:text-gray-300 shadow-sm"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-400 transition-colors"
                                >
                                    <i className='bx bx-x text-xl'></i>
                                </button>
                            )}
                        </div>

                        {/* 4. 뷰 타입 전환 버튼 (Figma Icon Tab 스타일) */}
                        <div className="flex bg-gray-900 p-1.5 rounded-2xl shadow-xl">
                            {[
                                { id: 'day', label: '15일', icon: 'bx-time-five' },
                                { id: 'month', label: '월간', icon: 'bx-calendar' },
                                { id: 'year', label: '연간', icon: 'bx-layer' }
                            ].map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => setViewType(type.id as ViewType)}
                                    className={`flex items-center gap-2 px-6 py-3 text-xs font-black rounded-xl transition-all duration-300 ${viewType === type.id
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'text-gray-400 hover:text-gray-200'
                                        }`}
                                >
                                    <i className={`bx ${type.icon}`}></i>
                                    <span className="hidden sm:inline">{type.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- 타임라인 컨테이너 (커스텀 스크롤바) --- */}
                <div className="bg-white rounded-4xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                    {/* 메인 타임라인 영역 */}
                    <div className="
                        [&::-webkit-scrollbar]:w-2
                        [&::-webkit-scrollbar-track]:bg-transparent
                        [&::-webkit-scrollbar-thumb]:bg-gray-100
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        hover:[&::-webkit-scrollbar-thumb]:bg-gray-200
                        transition-all
                    ">
                        {visibleProjects.length > 0 ? (
                            <div className="relative min-h-100">
                                {isLoading ? (
                                    <div className="p-8 transition-opacity duration-300">
                                        <SkeletonTimeline />
                                    </div>
                                ) : (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        {viewType === 'day' && <DayTimeline projects={visibleProjects} onSelect={setSelectedProject} />}
                                        {viewType === 'month' && <MonthTimeline projects={visibleProjects} onSelect={setSelectedProject} />}
                                        {viewType === 'year' && <YearTimeline projects={visibleProjects} onSelect={setSelectedProject} />}
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* 데이터 없음 (Empty State) 고도화 */
                            <div className="py-32 text-center flex flex-col items-center justify-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                    <i className='bx bx-search-alt text-4xl text-gray-300'></i>
                                </div>
                                <h3 className="text-lg font-black text-gray-800">일치하는 프로젝트가 없습니다</h3>
                                <p className="text-sm text-gray-400 mt-2 font-medium">단어의 철자가 맞는지 확인하거나 필터를 변경해보세요.</p>
                                <button
                                    onClick={() => { setSearchTerm(""); setFilterStatus('all'); }}
                                    className="mt-6 flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-2xl text-xs font-black hover:bg-blue-100 transition-all active:scale-95"
                                >
                                    <i className='bx bx-refresh text-lg'></i>
                                    필터 초기화
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 하단 제어부 (Info Bar) */}
                    <div className="px-8 py-5 bg-gray-50/80 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl border border-gray-200 shadow-sm">
                                <i className='bx bx-data text-blue-500'></i>
                                <span className="text-[11px] font-black text-gray-700">
                                    {visibleProjects.length} <span className="text-gray-300 mx-1">/</span> {filteredProjects.length} 표시 중
                                </span>
                            </div>

                            {filterStatus !== 'all' && (
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-black text-[11px] ${filterStatus === 'urgent'
                                    ? 'bg-red-50 border-red-100 text-red-500'
                                    : 'bg-orange-50 border-orange-100 text-orange-500'
                                    }`}>
                                    <i className={`bx ${filterStatus === 'urgent' ? 'bx-error-circle' : 'bx-alarm'}`}></i>
                                    {filterStatus === 'urgent' ? '긴급 프로젝트' : '관심 프로젝트'}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            {visibleCount < filteredProjects.length && (
                                <button
                                    onClick={loadMore}
                                    className="group flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-2xl text-xs font-black hover:bg-blue-600 transition-all shadow-lg shadow-gray-200 active:scale-95"
                                >
                                    데이터 더 보기
                                    <i className='bx bx-chevron-down text-lg group-hover:animate-bounce'></i>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* 하단 세로 리스트 */}
                <div className="mt-12 group/list">
                    {/* 1. 상세 리스트 헤더 영역 */}
                    <div className="flex items-center justify-between mb-7 px-2">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-gray-900 flex items-center justify-center shadow-xl shadow-gray-200 transition-transform group-hover/list:scale-105 duration-500">
                                <i className='bx bx-list-ul text-white text-2xl'></i>
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-900 tracking-tight leading-none">
                                    상세 리스트
                                </h2>
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] mt-1.5 flex items-center gap-1.5">
                                    <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                                    Detailed Project Schedule
                                </p>
                            </div>
                        </div>

                        {/* 필터 상태 배지 */}
                        {filterStatus !== 'all' && (
                            <div className="flex items-center gap-2.5 animate-in slide-in-from-right-4 fade-in duration-500">
                                <div className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </div>
                                <span className="text-[10px] font-black text-red-600 bg-red-50 border border-red-100/50 px-4 py-2 rounded-xl shadow-sm tracking-tight">
                                    {filterStatus === 'urgent' ? '긴급 프로젝트 전용' : '관심 프로젝트 전용'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* 2. 리스트 컨테이너 (그림자 및 여백 조절) */}
                    <div className="relative">
                        {/* 리스트가 비어있지 않을 때 부드러운 배경 효과 */}
                        <div className="absolute -inset-4 bg-gray-50/50 rounded-[40px] -z-10 border border-gray-100/50"></div>

                        <div className="space-y-4">
                            {/* WeeklyVerticalList 컴포넌트 내부에서 각 아이템(Card)을 
                bg-white, rounded-2xl, shadow-sm 스타일로 구현하시면 됩니다.
            */}
                            <WeeklyVerticalList
                                projects={visibleProjects}
                                onSelect={setSelectedProject}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 프로젝트 상세 정보 모달 --- */}
            {selectedProject && (
                <div
                    className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300"
                    onClick={() => setSelectedProject(null)}
                >
                    <div
                        className="bg-white rounded-[40px] max-w-md w-full overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] relative animate-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 상단 장식 바 (긴급도에 따른 색상 변화 가능) */}
                        <div className={`h-2 w-full ${selectedProject.dueDays <= 7 ? 'bg-red-500' : 'bg-blue-600'}`} />

                        <div className="p-8">
                            {/* 헤더 섹션 */}
                            <div className="flex justify-between items-start mb-8">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Project Detail</span>
                                    </div>
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
                                        {selectedProject.factoryName}
                                    </h2>
                                    <p className="text-sm font-bold text-gray-400">
                                        <i className='bx bx-user-circle mr-1'></i> {selectedProject.buyer}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all"
                                >
                                    <i className='bx bx-x text-2xl'></i>
                                </button>
                            </div>

                            {/* 정보 카드 섹션 */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    {/* D-Day 배지 카드 */}
                                    <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100/50">
                                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">남은 기간</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className={`text-xl font-black ${selectedProject.dueDays <= 7 ? 'text-red-500' : 'text-blue-600'}`}>
                                                D-{selectedProject.dueDays}
                                            </span>
                                            <span className="text-[10px] font-bold text-gray-400">Days left</span>
                                        </div>
                                    </div>
                                    {/* 상태 배지 카드 */}
                                    <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100/50">
                                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">진행 상태</p>
                                        <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-gray-700 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                                            <i className={`bx bxs-circle ${selectedProject.dueDays <= 7 ? 'text-red-500' : 'text-blue-500'} text-[8px]`}></i>
                                            {selectedProject.dueDays <= 7 ? '긴급 관리' : '정상 진행'}
                                        </span>
                                    </div>
                                </div>

                                {/* 타임라인 상세 정보 */}
                                <div className="bg-gray-900 rounded-4xl p-6 text-white relative overflow-hidden group">
                                    {/* 배경 데코레이션 아이콘 */}
                                    <i className='bx bx-calendar absolute -right-4 -bottom-4 text-8xl text-white/5 opacity-10 group-hover:scale-110 transition-transform duration-500'></i>

                                    <div className="relative z-10 space-y-5">
                                        <div className="flex items-start gap-4">
                                            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-blue-400">
                                                <i className='bx bx-time-five text-xl'></i>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">분석 시작일</p>
                                                <p className="text-sm font-bold">{format(new Date(), 'yyyy. MM. dd HH:mm')}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-red-400">
                                                <i className='bx bx-flag text-xl'></i>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">만기 예정일</p>
                                                <p className="text-sm font-bold text-red-300">
                                                    {format(new Date(selectedProject.expiryDate), 'yyyy. MM. dd HH:mm')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 하단 액션 버튼 */}
                            <div className="mt-8 flex gap-3">
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="flex-1 bg-gray-100 text-gray-900 py-4 rounded-2xl font-black text-xs hover:bg-gray-200 transition-all active:scale-95"
                                >
                                    닫기
                                </button>
                                <button
                                    className="flex-2 bg-blue-600 text-white py-4 rounded-2xl font-black text-xs hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    상세 리포트 보기
                                    <i className='bx bx-right-arrow-alt text-lg'></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDashboard;