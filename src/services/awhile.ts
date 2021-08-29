import request from '@/utils/request';

// 获取时刻列表
export async function getAwhileList(params: any) {
  return request('/api/awhile/list', {
    method: 'POST',
    data: params,
  });
}

// 获取时刻列表
export async function deleteAwhileOneLevel(params: string) {
  return request('/api/awhile/removeOne', {
    method: 'Delete',
    params: {
      id: params,
    },
  });
}
