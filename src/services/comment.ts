import request from '@/utils/request';

// 获取所有评论列表
export async function getCommentList(query: { pageSize?: number; page?: number }) {
  return request('/api/comment/allList', {
    method: 'POST',
    data: query,
  });
}

// 删除一级时刻
export async function deleteCommentOneLevel(params: string) {
  return request('/api/comment/removeOne', {
    method: 'Delete',
    params: {
      id: params,
    },
  });
}
