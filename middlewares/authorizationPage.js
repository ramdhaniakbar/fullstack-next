import cookies from 'next-cookies';

export function unauthPage(context) {
   return new Promise((resolve) => {
      const allCookies = cookies(context);

      if (allCookies.token)
         context.res
            .writeHead(302, {
               Location: '/posts',
            })
            .end();

      return resolve('unauthorized');
   });
}

export function authPage(context) {
   return new Promise((resolve) => {
      const allCookies = cookies(context);

      if (!allCookies.token)
         context.res
            .writeHead(302, {
               Location: '/auth/login',
            })
            .end();

      return resolve({
         token: allCookies.token,
      });
   });
}
