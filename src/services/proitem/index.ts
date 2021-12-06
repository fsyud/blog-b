import request from '@/utils/request';

/**
 * @description: 添加项目
 * @param {API} body
 * @return {*}
 */
export async function addItem(body: API.ItemParms) {
  return request('/api/proitem/create', {
    method: 'POST',
    data: body,
  });
}

/**
 * @description: 更新项目
 * @param {API} body
 * @return {*}
 */
export async function updateItem(body: API.ItemParms) {
  return request('/api/proitem/updates', {
    method: 'POST',
    data: body,
  });
}

/**
 * @description: 获取项目列表
 * @param {object} query
 * @return {*}
 */
export async function getItem(query: { pageSize?: number; page?: number }) {
  return request('/api/proitem/list', {
    method: 'POST',
    data: query,
  });
}

/**
 * @description: 删除项目
 * @param {number} params
 * @return {*}
 */
export async function deleteItem(params: number | string) {
  return request('/api/proitem/remove', {
    method: 'Delete',
    params: {
      id: params,
    },
  });
}
