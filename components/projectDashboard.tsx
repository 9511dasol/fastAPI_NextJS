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

        if (!selectedProject) return; // 선택된 게 없으면 아무것도 안 함

        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
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
                <ExpiryStatusCards projects={projects} onSelect={setSelectedProject} />
                <ExpiryChart projects={projects} onSelect={setSelectedProject} />
                <ExpiryAnalysis projects={projects} onSelect={setSelectedProject} />
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