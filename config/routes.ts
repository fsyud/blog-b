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
    icon: 'user',
    component: './UserList',
    title: '后台-用户列表',
  },
  {
    path: '/article',
    name: 'article',
    icon: 'table',
    routes: [
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
    path: '/comment',
    name: 'comment',
    icon: 'table',
    routes: [
      {
        path: '/comment/one-comment',
        name: 'one-comment',
        icon: 'smile',
        component: './Comment/OneComment',
        title: '后台-一级评论',
      },
    ],
  },
  {
    path: '/awhile',
    name: 'awhile',
    icon: 'table',
    routes: [
      {
        path: '/awhile',
        name: 'awhile',
        icon: 'smile',
        component: './Awhile',
        title: '后台-一级时刻评论',
      },
    ],
  },
  {
    path: '/proitem',
    name: 'proitem',
    icon: 'table',
    routes: [
      {
        path: '/proitem',
        name: 'proitem',
        icon: 'smile',
        component: './ProItem',
        title: '后台-项目',
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
