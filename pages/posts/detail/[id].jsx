import Link from 'next/link';
import { useState } from 'react';
import Nav from '../../../components/Nav';
import { authPage } from '../../../middlewares/authorizationPage';

export async function getServerSideProps(context) {
   const { token } = await authPage(context);

   const { id } = context.query;

   const postReq = await fetch(`http://localhost:3000/api/posts/detail/${id}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
   });

   const post = await postReq.json();

   return { props: { post: post.data } };
}

export default function PostIndex({ post }) {
   return (
      <>
         <Nav />
         <div className='container mx-auto'>
            <div className='mt-16 ml-12'>
               <div className='flex items-center justify-between mb-6'>
                  <h1 className='text-3xl font-semibold'>Detail Post</h1>
               </div>
               <h4 className='font-semibold text-2xl mb-3'>{post.title}</h4>
               <p>{post.content}</p>
            </div>
         </div>
      </>
   );
}
