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
import ProjectDetailModal from './dashBoard/projectDetailModal';
import AuditInsightDashboard from './dashBoard/AuditInsightDashboard';

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
                {/* <ExpiryStatusCards projects={projects} onSelect={setSelectedProject} />
                <ExpiryChart projects={projects} onSelect={setSelectedProject} />
                <ExpiryAnalysis projects={projects} onSelect={setSelectedProject} /> */}
                <AuditInsightDashboard projects={projects} onSelect={setSelectedProject} />
            </div>

            {/* --- 프로젝트 상세 정보 모달 --- */}
            <ProjectDetailModal
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
            />
        </div>
    );
};

export default ProjectDashboard;