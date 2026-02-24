import { differenceInDays, differenceInMonths, isBefore, startOfDay } from 'date-fns';
import { Project } from './interface';

export const groupProjectsByExpiry = (projects: Project[]) => {
    const today = startOfDay(new Date());

    const groups = {
        expired: [] as Project[],     // 만기 지남
        within1Week: [] as Project[], // 1주 내
        within2Weeks: [] as Project[],// 2주 내
        within4Weeks: [] as Project[],// 4주 내 (한 달 내)
        within6Months: [] as Project[],// 6개월 내
        over6Months: [] as Project[], // 6개월 이상
        over1Year: [] as Project[],   // 1년 이상
        over2Years: [] as Project[],  // 2년 이상
    };

    for (const project of projects) {
        const end = new Date(project.expiryDate);
        const diffDays = differenceInDays(end, today);
        const diffMonths = differenceInMonths(end, today);

        if (isBefore(end, today)) {
            groups.expired.push(project);
        } else if (diffDays <= 7) {
            groups.within1Week.push(project);
        } else if (diffDays <= 14) {
            groups.within2Weeks.push(project);
        } else if (diffDays <= 30) {
            groups.within4Weeks.push(project);
        } else if (diffMonths < 6) {
            groups.within6Months.push(project);
        } else if (diffMonths < 12) {
            groups.over6Months.push(project);
        } else if (diffMonths < 24) {
            groups.over1Year.push(project);
        } else {
            groups.over2Years.push(project);
        }
    }

    return groups;
};

export const getExpiryGroups = (projects: Project[]) => {
    const today = startOfDay(new Date());

    const groups = [
        { id: 'expired', label: '만기 경과', dDayRange: [-Infinity, -1], items: [] as Project[], bgColor: 'bg-red-50', textColor: 'text-red-600' },
        { id: 'within1Week', label: '1주일 이내', dDayRange: [0, 7], items: [] as Project[], bgColor: 'bg-orange-50', textColor: 'text-orange-600' },
        { id: 'within2Weeks', label: '2주일 이내', dDayRange: [8, 14], items: [] as Project[], bgColor: 'bg-yellow-50', textColor: 'text-yellow-600' },
        { id: 'within1Month', label: '1개월 이내', dDayRange: [15, 30], items: [] as Project[], bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' },
        { id: 'within3Months', label: '3개월 이내', dDayRange: [31, 90], items: [] as Project[], bgColor: 'bg-green-50', textColor: 'text-green-600' },
        { id: 'within6Months', label: '6개월 이내', dDayRange: [91, 180], items: [] as Project[], bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
        { id: 'over6Months', label: '6개월 초과', dDayRange: [181, Infinity], items: [] as Project[], bgColor: 'bg-slate-50', textColor: 'text-slate-600' },
        // --- [추가] 날짜 없음 그룹 ---
        { id: 'noDate', label: '날짜 없음', dDayRange: [null, null], items: [] as Project[], bgColor: 'bg-gray-100', textColor: 'text-gray-500' },
    ];

    for (const project of projects) {
        // 1. 날짜가 없는 경우 처리
        if (!project.expiryDate) {
            groups[7].items.push(project); // noDate 그룹
            continue;
        }

        const expiry = new Date(project.expiryDate);
        const diff = differenceInDays(expiry, today);

        if (isBefore(expiry, today)) {
            groups[0].items.push(project);
            continue;
        }

        let foundGroup = false;
        for (let i = 1; i < groups.length - 1; i++) { // 마지막 noDate 제외하고 순회
            const group = groups[i];
            if (diff >= group.dDayRange[0]! && diff <= group.dDayRange[1]!) {
                group.items.push(project);
                foundGroup = true;
                break;
            }
        }

        if (!foundGroup) {
            groups[6].items.push(project); // over6Months (120일 초과)
        }
    }

    for (const group of groups) {
        if (group.items.length > 0) {
            group.items.sort((a, b) => {
                // 날짜가 없는 경우는 뒤로
                if (!a.expiryDate) return 1;
                if (!b.expiryDate) return -1;
                // 만기일 기준 오름차순 (가까운 날짜가 먼저)
                return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
            });
        }
    }
    return groups;
};