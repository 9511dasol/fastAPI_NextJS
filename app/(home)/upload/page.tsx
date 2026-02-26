import ExcelUploadClient from "@/components/dashBoard/ExcelUploadClient";

export const metadata = {
    title: '데이터 프로세서 | 로드맵 시스템',
    description: '엑셀 파일을 업로드하고 데이터를 자동으로 가공하세요.',
};

export default function UploadPage() {
    return (
        <main className="min-h-screen bg-gray-50/50 p-6 md:p-12 font-sans">
            <div className="max-w-2xl mx-auto">
                {/* 헤더 섹션 - 서버에서 정적으로 렌더링 */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-green-600 flex items-center justify-center shadow-xl shadow-green-100">
                        <i className='bx bxs-file-export text-white text-3xl'></i>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">데이터 프로세서</h1>
                        <p className="text-xs font-bold text-green-600/60 uppercase tracking-widest mt-1">
                            Excel Automation System
                        </p>
                    </div>
                </div>

                {/* 실제 인터랙션(파일 업로드, 상태 관리)을 담당하는 클라이언트 컴포넌트 */}
                <ExcelUploadClient />
            </div>
        </main>
    );
}