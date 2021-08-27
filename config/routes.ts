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
    title: '后台-用户列表',
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
        title: '后台-写文章',
      },
      {
        path: '/article/list',
        name: 'article-list',
        icon: 'table',
        component: './Article/list',
        title: '后台-文章列表',
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
