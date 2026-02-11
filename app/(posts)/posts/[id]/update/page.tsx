import Form from '@/components/form'
import React from 'react'
import { PageProps } from "@/ingredients/interface";

export default async function Page({ params }: PageProps) {
    const { id } = await params;  // Promise 풀기
    // console.log(id + 21332);
    return (
        <Form opt='u' id={id} />
    )
}
