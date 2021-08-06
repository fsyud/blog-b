export default [
  {
    path: '/login',
    name: 'login',
    layout: false,
    icon: 'smile',
    component: './Login',
  },
  {
    path: '/userlist',
    name: 'userlist',
    icon: 'smile',
    component: './UserList',
  },
  {
    path: '/article',
    name: 'article',
    icon: 'smile',
    routes: [
      {
        path: '/article/create',
        name: 'article-create',
        icon: 'smile',
        component: './Article/creat',
      },
      {
        path: '/article/list',
        name: 'article-list',
        icon: 'table',
        component: './Article/list',
      },
    ],
  },
  {
    path: '/',
    redirect: '/article/list',
  },
  {
    component: './404',
  },
];
