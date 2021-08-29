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
    icon: 'table',
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
      {
        path: '/comment/two-comment',
        name: 'two-comment',
        icon: 'table',
        component: './Comment/TwoComment',
        title: '后台-二级评论',
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
    path: '/',
    redirect: '/article/list',
  },
  {
    component: './404',
  },
];
