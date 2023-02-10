import Link from 'next/link';
import { useState } from 'react';
import Nav from '../../components/Nav';
import { authPage } from '../../middlewares/authorizationPage';

export async function getServerSideProps(context) {
   const { token } = await authPage(context);

   const postReq = await fetch('http://localhost:3000/api/posts', {
      headers: { Authorization: `Bearer ${token}` },
   });

   const posts = await postReq.json();

   return { props: { token, posts } };
}

export default function PostIndex({ token, posts }) {
   const [allPost, setAllPost] = useState(posts.data);
   const [status, setStatus] = useState('');

   async function deleteHandler(id, e) {
      e.preventDefault();

      setStatus('loading...');

      const ask = confirm('Are you sure want to delete?');

      if (ask) {
         const deletePost = await fetch(`/api/posts/delete/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
         });

         const res = await deletePost.json();

         const postsFiltered = allPost.filter((post) => {
            return post.id !== id && post;
         });

         setAllPost(postsFiltered);

         setStatus(res.message);
      }
   }

   return (
      <>
         <Nav />
         <div className='container mx-auto'>
            <div className='mt-16 ml-12'>
               <div className='flex items-center justify-between mb-6'>
                  <h1 className='text-3xl font-semibold'>Posts</h1>
                  <Link
                     href='/posts/create'
                     className='py-2 px-3 rounded-md bg-slate-700 text-slate-100 hover:bg-slate-800 focus:ring-1 focus:ring-slate-400'
                  >
                     Create a Post
                  </Link>
               </div>
               <div className='mb-4'>{status}</div>
               {allPost.map((post) => (
                  <div
                     key={post.id}
                     className='bg-slate-200 p-6 mb-8 rounded-md shadow-md hover:shadow-xl duration-200'
                  >
                     <h4 className='font-semibold text-2xl mb-3'>
                        <Link href={`/posts/detail/${post.id}`}>
                           {post.title}
                        </Link>
                     </h4>
                     <Link href={`/posts/edit/${post.id}`}>
                        <button className='py-1 px-4 text-white font-semibold bg-blue-500 hover:shadow-lg hover:shadow-blue-500/50 duration-300 rounded mr-3'>
                           Edit
                        </button>
                     </Link>
                     <button
                        onClick={deleteHandler.bind(this, post.id)}
                        className='py-1 px-4 text-white font-semibold bg-red-500 hover:shadow-lg hover:shadow-red-500/50 duration-300 rounded'
                     >
                        Delete
                     </button>
                  </div>
               ))}
            </div>
         </div>
      </>
   );
}
