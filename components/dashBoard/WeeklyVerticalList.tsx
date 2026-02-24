import React from 'react';
import { addDays, format, startOfDay, isWithinInterval } from 'date-fns';
import { Project } from '@/ingredients/interface';


// Props 인터페이스 정의
interface WeeklyVerticalListProps {
    projects: Project[];
    onSelect: (project: Project) => void;
}

const WeeklyVerticalList: React.FC<WeeklyVerticalListProps> = ({ projects, onSelect }) => {
    const today = new Date();

    // 오늘부터 7일간의 날짜 배열 생성
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(today, i));

    return (
        <div className="flex flex-col gap-4">
            {weekDays.map((day) => {
                // 해당 날짜에 진행 중인 프로젝트 필터링
                const dailyProjects = projects.filter((p) => {
                    const projectStart = startOfDay(new Date());
                    const projectEnd = startOfDay(new Date(p.expiryDate));
                    const currentDay = startOfDay(day);

                    return isWithinInterval(currentDay, { start: projectStart, end: projectEnd });
                });

                const isToday = format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');

                return (
                    <div
                        key={day.toString()}
                        className={`flex bg-white rounded-2xl shadow-sm border transition-all ${isToday ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-gray-100 hover:border-gray-200'
                            }`}
                    >
                        {/* 왼쪽 날짜 영역 */}
                        <div className={`w-24 md:w-32 p-4 flex flex-col items-center justify-center border-r border-gray-50 ${isToday ? 'bg-blue-50/50' : ''}`}>
                            <span className={`text-[10px] font-bold uppercase tracking-tighter ${isToday ? 'text-blue-600' : 'text-gray-400'}`}>
                                {format(day, 'EEEE')}
                            </span>
                            <span className={`text-xl font-black ${isToday ? 'text-blue-700' : 'text-gray-800'}`}>
                                {format(day, 'MM.dd')}
                            </span>
                            {isToday && (
                                <span className="mt-1 px-2 py-0.5 bg-blue-600 text-[9px] text-white font-bold rounded-full uppercase">Today</span>
                            )}
                        </div>

                        {/* 오른쪽 프로젝트 리스트 영역 */}
                        <div className="grow p-4 space-y-3">
                            {dailyProjects.length > 0 ? (
                                dailyProjects.map((p) => (
                                    <div
                                        key={p.id}
                                        onClick={() => onSelect(p)}
                                        className="group cursor-pointer p-3 rounded-xl border border-gray-50 bg-gray-50/50 hover:bg-blue-50 hover:border-blue-100 transition-all flex items-center justify-between"
                                    >
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-black text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                                                    {p.factoryName}
                                                </span>
                                                {/* <span className="text-xs font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                                                    {p.project}
                                                </span> */}
                                            </div>
                                            <div className="text-[10px] text-gray-400">
                                                {format(new Date(), 'HH:mm')} ~ {format(new Date(p.expiryDate), 'MM/dd HH:mm')}
                                            </div>
                                        </div>
                                        {/* 화살표 아이콘 (선택 사항) */}
                                        <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex items-center justify-center py-4">
                                    <span className="text-xs text-gray-300 italic">등록된 일정이 없습니다.</span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default WeeklyVerticalList;