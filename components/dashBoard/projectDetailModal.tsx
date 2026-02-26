"use client";

import { Project } from '@/ingredients/interface';
import { format } from 'date-fns';

interface ProjectDetailModalProps {
    project: Project | null;
    onClose: () => void;
}

export default function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
    if (!project) return null; // 프로젝트가 없으면 아무것도 렌더링하지 않음

    return (
        <div
            className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-[40px] max-w-md w-full overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] relative animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 상단 장식 바 */}
                <div className={`h-2 w-full ${project.dueDays <= 7 ? 'bg-red-500' : 'bg-blue-600'}`} />

                <div className="p-8">
                    {/* 헤더 섹션 */}
                    <div className="flex justify-between items-start mb-8">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Project Detail</span>
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
                                {project.factoryName}
                            </h2>
                            <p className="text-sm font-bold text-gray-400">
                                <i className='bx bx-user-circle mr-1'></i> {project.buyer}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all"
                        >
                            <i className='bx bx-x text-2xl'></i>
                        </button>
                    </div>

                    {/* 정보 카드 섹션 */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100/50">
                                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">남은 기간</p>
                                <div className="flex items-baseline gap-1">
                                    <span className={`text-xl font-black ${project.dueDays <= 7 ? 'text-red-500' : 'text-blue-600'}`}>
                                        D-{project.dueDays}
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-400">Days left</span>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100/50">
                                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">진행 상태</p>
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-gray-700 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                                    <i className={`bx bxs-circle ${project.dueDays <= 7 ? 'text-red-500' : 'text-blue-500'} text-[8px]`}></i>
                                    {project.dueDays <= 7 ? '긴급 관리' : '정상 진행'}
                                </span>
                            </div>
                        </div>

                        {/* 타임라인 상세 정보 */}
                        <div className="bg-gray-900 rounded-4xl p-6 text-white relative overflow-hidden group">
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
                                            {format(new Date(project.expiryDate), 'yyyy. MM. dd HH:mm')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 하단 액션 버튼 */}
                    <div className="mt-8 flex gap-3">
                        <button
                            onClick={onClose}
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
    );
}