// tailwind.config.ts 예시
import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            // 여기서 grid-cols-15를 정의합니다.
            gridTemplateColumns: {
                '15': 'repeat(15, minmax(0, 1fr))',
            },
        },
    },
    plugins: [],
};
export default config;