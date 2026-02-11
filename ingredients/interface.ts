
export interface Item {
    id: number;
    title: string;
    content: string;
};

export interface PageProps {
    params: Promise<{ id: string }>;  // Promise 타입 명시
}