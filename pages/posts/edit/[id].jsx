import Link from 'next/link';
import { useState } from 'react';
import { authPage } from '../../../middlewares/authorizationPage';

export async function getServerSideProps(context) {
   const { token } = await authPage(context);

   const { id } = context.query;

   const postReq = await fetch(`http://localhost:3000/api/posts/detail/${id}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
   });

   const res = await postReq.json();

   return { props: { token, post: res.data } };
}

export default function PostEdit({ token, post }) {
   const [fields, setFields] = useState({
      title: post.title,
      content: post.content,
   });
   const [status, setStatus] = useState('');

   async function updateHandler(e) {
      e.preventDefault();

      setStatus('loading');

      if (fields.title && fields.content === '') return setStatus('No Content');

      const update = await fetch(`/api/posts/update/${post.id}`, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
         },
         body: JSON.stringify(fields),
      });

      if (!update.ok) return setStatus(`error ${update.status}`);

      const res = await update.json();

      setStatus(res.message);
   }

   function fieldHandler(e) {
      const name = e.target.getAttribute('name');
      setFields({ ...fields, [name]: e.target.value });
   }

   return (
      <div className='container mx-auto'>
         <div className='mt-16 ml-12'>
            <div>{status}</div>
            <h1 className='text-3xl font-semibold mb-4'>Edit a Post</h1>
            <form onSubmit={updateHandler}>
               <div className='flex flex-col'>
                  <div className='flex flex-col w-64'>
                     <label htmlFor='title'>Title of post</label>
                     <input
                        className='py-2 px-3 border-solid border-2 rounded-md focus:outline-none focus:border-slate-400 mb-2'
                        type='text'
                        name='title'
                        id='title'
                        onChange={fieldHandler}
                        placeholder='Title of post'
                        defaultValue={post.title}
                        required
                     />
                  </div>
                  <div className='flex flex-col w-64'>
                     <label htmlFor='content'>Content of post</label>
                     <textarea
                        className='py-2 px-3 border-solid border-2 rounded-md focus:outline-none focus:border-slate-400 mb-2'
                        name='content'
                        id='content'
                        onChange={fieldHandler}
                        rows={10}
                        placeholder='Content of post'
                        defaultValue={post.content}
                        required
                     ></textarea>
                  </div>
                  <div className='mt-2'>
                     <button
                        className='py-2 px-3 rounded-md bg-slate-700 text-slate-100 hover:bg-slate-800 focus:ring-1 focus:ring-slate-400 mr-4'
                        type='submit'
                     >
                        Save Changes
                     </button>
                     <Link href='/posts' className='underline'>
                        Back to Posts
                     </Link>
                  </div>
               </div>
            </form>
         </div>
      </div>
   );
}
