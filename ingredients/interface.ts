
export interface Item {
    id: number;
    title: string;
    content: string;
};

export interface PageProps {
    params: Promise<{ id: string }>;  // Promise 타입 명시
}

export interface tempInpo {
    id: number;
    company: string;
    project: string;
    start: string; // ISO 8601 형식 (예: "2026-02-18T09:00")
    end: string;
    desc: string;
}

export interface Project {
    auditType: string;
    buyer: string;
    co: string;
    dueBucket: string;
    dueDays: number;
    dueSoon: any;
    expiryDate: string;
    factoryName: string;
    fctId: string;
    id: number;
    latestAuditDate: string;
}

export interface fetchData {
    items: Project[];
    totalCount: number;
    totalPages: number;
}

export interface execelSendResult {
    failed: number;
    inserted: number;
    skipped: number;
    updated: number;
}
