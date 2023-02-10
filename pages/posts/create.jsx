import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { authPage } from '../../middlewares/authorizationPage';

export async function getServerSideProps(context) {
   const { token } = await authPage(context);

   return { props: { token } };
}

export default function PostCreate({ token }) {
   const [fields, setFields] = useState({ title: '', content: '' });
   const [status, setStatus] = useState('');
   const router = useRouter();

   async function createHandler(e) {
      e.preventDefault();

      setStatus('loading...');

      const create = await fetch('/api/posts/create', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
         },
         body: JSON.stringify(fields),
      });

      if (!create.ok) return setStatus(`error ${create.status}`);

      const res = await create.json();

      e.target.reset();

      setStatus(res.message);

      router.push('/posts');
   }

   function fieldHandler(e) {
      const name = e.target.getAttribute('name');
      setFields({ ...fields, [name]: e.target.value });
   }

   return (
      <div className='container mx-auto'>
         <div className='mt-16 ml-12'>
            <div>{status}</div>
            <h1 className='text-3xl font-semibold mb-4'>Create a Post</h1>
            <form onSubmit={createHandler}>
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
                        required
                     ></textarea>
                  </div>
                  <div className='mt-2'>
                     <button
                        className='py-2 px-3 rounded-md bg-slate-700 text-slate-100 hover:bg-slate-800 focus:ring-1 focus:ring-slate-400 mr-4'
                        type='submit'
                     >
                        Create Post
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
