export const HOME = '/'

export default [
  {
    path: HOME,
    component: 'dashboard',
    icon: 'home',
    title: '首页'
  },
  {
    path: '/message',
    icon: 'message',
    title: '信息中心',
    component: 'message/Inbox',
    models: ['inbox']
  },
  {
    path: '/order-count',
    component: 'order/OrderCount',
    icon: 'heat-map',
    title: '订单统计'
  },
  {
    path: '/member-manage',
    component: 'member/member-list',
    icon: 'solution',
    title: '会员管理'
  },
  {
    path: '/component',
    icon: 'shop',
    title: '组件',
    routes: [
      {
        path: '/component/video',
        component: 'component/VideoPlayer',
        title: '视频'
      },
      {
        path: '/component/drag-list',
        component: 'component/DragList',
        title: '拖拽'
      },
      {
        path: '/component/infinite-scroller',
        component: 'component/InfiniteScroller',
        title: '无限加载'
      },
      {
        path: '/component/pdf-preview',
        component: 'component/PdfPreview',
        title: 'PDF预览'
      },
      {
        path: '/component/edit',
        title: '编辑器',
        routes: [
          {
            path: '/component/edit/rich-text-editor',
            component: 'component/RichTextEditor',
            title: '富文本'
          },
          {
            path: '/component/edit/markdown-editor',
            component: 'component/MarkdownEditor',
            title: 'Markdown'
          }
        ]
      }
    ]
  },
  {
    path: '/*',
    title: '404',
    navHide: true,
    component: 'common/NotFound',
    component_from: 'components'
  }
] as IRouteItemMinor[]
