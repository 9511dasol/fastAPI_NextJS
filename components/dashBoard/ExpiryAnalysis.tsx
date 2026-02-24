import { getExpiryGroups } from "@/ingredients/func";
import { Project } from "@/ingredients/interface";

const ExpiryAnalysis = ({ projects, onSelect }: { projects: Project[], onSelect: (p: Project) => void }) => {
    // 1. 위에서 작성한 정렬 및 그룹화 로직 적용
    const groups = getExpiryGroups(projects);

    // 2. 그룹별 아이콘 및 뱃지 라벨 매핑 (UI 전용)
    const getGroupMeta = (id: string) => {
        switch (id) {
            case 'expired': return { icon: 'bx-error', badge: 'Urgent' };
            case 'within1Week': return { icon: 'bx-alarm-exclamation', badge: 'Warning' };
            case 'within2Weeks': return { icon: 'bx-time', badge: 'Notice' };
            case 'within1Month': return { icon: 'bx-calendar-event', badge: 'Soon' };
            case 'within3Months': return { icon: 'bx-trending-up', badge: 'Plan' };
            case 'within6Months': return { icon: 'bx-layer', badge: 'Stable' };
            case 'over6Months': return { icon: 'bx-archive-in', badge: 'Long-term' };
            default: return { icon: 'bx-help-circle', badge: 'TBD' };
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
            {groups.map((group) => {
                const meta = getGroupMeta(group.id);
                // Tailwind에서 동적 클래스 할당을 위해 bg-red-50 등은 group에 정의된 값을 그대로 사용
                return (
                    <div
                        key={group.id}
                        className={`group rounded-4xl p-6 border border-transparent shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${group.bgColor} ${group.textColor.replace('text-', 'border-').replace('600', '100')}`}
                    >
                        {/* 섹션 헤더 */}
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center justify-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl">
                                    <i className={`bx ${meta.icon}`}></i>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-90 leading-none mb-1">
                                        {meta.badge}
                                    </p>
                                    <h3 className="font-black text-[15px] tracking-tight leading-none text-gray-900">
                                        {group.label}
                                    </h3>
                                </div>
                            </div>
                            <span className="text-[11px] font-black bg-white/80 px-3 py-1.5 rounded-xl shadow-sm border border-white">
                                {group.items.length} <span className="opacity-50">건</span>
                            </span>
                        </div>

                        {/* 데이터 리스트 영역 */}
                        <div className="space-y-3 max-h-72 overflow-y-auto pr-1 custom-scrollbar relative">
                            {group.items.length > 0 ? (
                                group.items.map(p => (
                                    <div
                                        key={p.id}
                                        onClick={() => onSelect(p)}
                                        className="group/item relative bg-white/70 backdrop-blur-md p-4 rounded-[22px] border border-white/50 shadow-sm hover:bg-white hover:shadow-md transition-all cursor-pointer overflow-hidden"
                                    >
                                        {/* 강조 포인트 데코 */}
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover/item:opacity-100 transition-opacity ${group.textColor.replace('text-', 'bg-')}`} />

                                        <div className="flex flex-col gap-1.5">
                                            <p className="font-black text-[13px] text-gray-800 truncate group-hover/item:text-blue-600 transition-colors">
                                                {p.factoryName}
                                            </p>
                                            <div className="flex justify-between items-center text-[10px] font-bold">
                                                <span className="text-gray-400 flex items-center gap-1">
                                                    <i className='bx bx-user-circle'></i>
                                                    {p.buyer}
                                                </span>
                                                <span className="text-gray-500 bg-gray-100/50 px-2 py-0.5 rounded-md font-mono">
                                                    {p.expiryDate || '날짜미정'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-black/5 rounded-[28px] opacity-40">
                                    <i className={`bx ${meta.icon} text-2xl mb-2`}></i>
                                    <p className="text-[10px] font-bold">항목이 없습니다</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ExpiryAnalysis;