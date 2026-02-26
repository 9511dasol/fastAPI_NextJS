// app/upload/ExcelUploadClient.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { uploadResult } from '@/ingredients/getInfo';
import { execelSendResult } from '@/ingredients/interface';
import { useRouter } from 'next/navigation';


export default function ExcelUploadClient() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any[] | null>(null);
    const router = useRouter();
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };
    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);

        try {
            // 인자를 파일만 넘깁니다. 훨씬 깔끔하죠?
            const upResult: execelSendResult = await uploadResult(file);

            if (upResult && upResult.inserted >= -1) {
                alert("데이터 보내기 성공!!")
                setTimeout(() => router.push('/'), 200);
            }
        } catch (error) {
            // 에러 로직은 uploadResult에서 처리됨
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        handleUpload();
    }, [file])


    return (
        <div className="space-y-8">
            {/* 업로드 카드 */}
            <div className="bg-white p-8 rounded-4xl shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100 backdrop-blur-sm">
                <div className={`group relative border-2 border-dashed rounded-3xl p-10 transition-all flex flex-col items-center justify-center
                    ${file ? 'border-green-400 bg-green-50/20' : 'border-gray-200 hover:border-green-300 hover:bg-gray-50/50'}`}>

                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />

                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                        <i className={`bx ${file ? 'bx-check-circle text-green-500' : 'bx-cloud-upload text-gray-400'} text-3xl`}></i>
                    </div>

                    <p className="text-sm font-bold text-gray-700 text-center">
                        {file ? file.name : "엑셀 파일을 드래그하거나 클릭하세요"}
                    </p>

                    {/* 파일 유무에 따른 동적 메시지 처리 */}
                    {file ? (
                        <p className="text-[11px] text-green-600 font-bold mt-2 flex items-center gap-1">
                            <i className='bx bx-data'></i>
                            {(file.size / (1024 * 1024)).toFixed(2)} MB 업로드됨
                        </p>
                    ) : (
                        <p className="text-[11px] text-gray-400 mt-2">
                            Maximum size: 10MB (.xlsx, .xls)
                        </p>
                    )}
                </div>

                <button
                    onClick={handleUpload}
                    disabled={loading || !file}
                    className={`w-full mt-6 py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2
                        ${loading || !file
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-900 text-white hover:bg-black hover:shadow-xl active:scale-[0.98]'}`}
                >
                    {loading ? (
                        <i className='bx bx-loader-alt animate-spin text-xl'></i>
                    ) : (
                        <>
                            <i className='bx bx-wand text-xl'></i>
                            <span>데이터 보내기</span>
                        </>
                    )}
                </button>
            </div>

            {/* 결과 테이블 섹션 */}
            {result && (
                <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                            <i className='bx bx-table text-green-500 text-lg'></i> 가공 결과 (상위 5건)
                        </h3>
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                            Total: {result.length}
                        </span>
                    </div>

                    <div className="overflow-x-auto border border-gray-50 rounded-2xl">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    {Object.keys(result[0]).map((key) => (
                                        <th key={key} className="py-3 px-4 font-bold text-gray-400 uppercase tracking-tighter border-b border-gray-100">
                                            {key}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {result.slice(0, 5).map((row, idx) => (
                                    <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/30 transition-colors">
                                        {Object.values(row).map((val: any, i) => (
                                            <td key={i} className="py-3 px-4 text-gray-600 font-medium">
                                                {val.toString()}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}