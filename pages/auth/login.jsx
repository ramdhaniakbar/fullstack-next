import Link from 'next/link';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import cookies from 'next-cookies';
import { unauthPage } from '../../middlewares/authorizationPage';

export async function getServerSideProps(context) {
   await unauthPage(context);

   return { props: {} };
}

export default function Login() {
   const [fields, setFields] = useState({ email: '', password: '' });
   const [status, setStatus] = useState('');
   const router = useRouter();

   async function loginHandler(e) {
      e.preventDefault();

      setStatus('loading');

      const loginReq = await fetch('/api/auth/login', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(fields),
      });

      if (!loginReq.ok) return setStatus('error ' + loginReq.status);

      const loginRes = await loginReq.json();

      e.target.reset();

      setStatus('success');

      Cookies.set('token', loginRes.token);

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
            <h1 className='text-3xl font-semibold mb-4'>Login</h1>
            <form onSubmit={loginHandler}>
               <div className='flex flex-col'>
                  <div className='flex flex-col w-64'>
                     <label htmlFor='email'>Email address</label>
                     <input
                        className='py-2 px-3 border-solid border-2 rounded-md focus:outline-none focus:border-slate-400 mb-2'
                        type='text'
                        name='email'
                        id='email'
                        onChange={fieldHandler}
                        placeholder='gonalu@gmail.com'
                     />
                  </div>
                  <div className='flex flex-col w-64'>
                     <label htmlFor='password'>Password</label>
                     <input
                        className='py-2 px-3 border-solid border-2 rounded-md focus:outline-none focus:border-slate-400 mb-2'
                        type='password'
                        name='password'
                        id='password'
                        onChange={fieldHandler}
                        placeholder='******'
                     />
                  </div>
                  <div className='mt-2'>
                     <button
                        className='py-2 px-3 rounded-md bg-slate-700 text-slate-100 hover:bg-slate-800 focus:ring-1 focus:ring-slate-400 mr-4'
                        type='submit'
                     >
                        Login
                     </button>
                     <Link href='/auth/register' className='underline'>
                        Register
                     </Link>
                  </div>
               </div>
            </form>
         </div>
      </div>
   );
}
