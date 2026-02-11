
import { getInfoAll } from "@/ingredients/getInfo";
import { Item } from "@/ingredients/interface";
import BlogTable from "@/components/blogTable"; // Client Component

export default async function Page() {
    const infos = await getInfoAll(); // 서버에서 데이터 페칭

    return (
        <div className='flex flex-col min-h-screen'>
            <h1 className='text-3xl m-5 flex justify-center'>Sol's Blog</h1>
            <BlogTable infoAll={infos} />
        </div>
    );
}
