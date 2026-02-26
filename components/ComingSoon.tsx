import Link from 'next/link';

interface ComingSoonProps {
    title: string;
}

export default function ComingSoon({ title }: ComingSoonProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] w-full text-center">
            {/* 배경 장식용 그래픽 */}
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-blue-100/50 rounded-full blur-3xl animate-pulse"></div>
                <div className="relative w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center border border-gray-100">
                    <i className='bx bx-code-alt text-5xl text-blue-600 animate-bounce'></i>
                </div>
                {/* 작은 장식용 아이콘들 */}
                <i className='bx bxs-cog absolute -top-2 -right-2 text-2xl text-gray-300 animate-[spin_4s_linear_infinite]'></i>
                <i className='bx bxs-wrench absolute -bottom-2 -left-2 text-2xl text-gray-300'></i>
            </div>

            {/* 텍스트 정보 영역 */}
            <div className="text-center px-6">
                {/* 메인 타이틀: 자간을 줄여서 더 꽉 찬 느낌을 줌 */}
                <h2 className="text-3xl font-black text-gray-900 mb-5 tracking-[-0.03em] leading-tight">
                    {title} 기능 준비 중
                </h2>

                {/* 서브 설명문: 행간을 넓히고 텍스트 간격을 조정하여 가독성 향상 */}
                <div className="space-y-1.5">
                    <p className="text-[15px] font-medium text-gray-500 leading-relaxed tracking-tight">
                        더 나은 서비스를 위해 현재 열심히 개발하고 있는 기능입니다.
                    </p>
                    <p className="text-[15px] font-medium text-gray-500 leading-relaxed tracking-tight">
                        조금만 기다려 주시면 곧 멋진 모습으로 찾아올게요!
                    </p>
                </div>
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-3">
                <Link
                    href="/"
                    className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all active:scale-95 flex items-center gap-2"
                >
                    <i className='bx bx-home-alt'></i>
                    홈으로 돌아가기
                </Link>
            </div>
        </div>
    );
}