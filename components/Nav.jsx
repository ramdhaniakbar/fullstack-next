import Link from 'next/link';
import Cookies from 'js-cookie';
import Router from 'next/router';

export default function Nav() {
   function logoutHandler(e) {
      e.preventDefault();

      Cookies.remove('token');

      Router.replace('/auth/login');
   }

   return (
      <div>
         <Link href='/'>Home</Link>
         <Link href='/posts'>Posts</Link>
         <a href='#' onClick={logoutHandler}>
            Logout
         </a>
      </div>
   );
}
