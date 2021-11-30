import request from '@/utils/request';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { auditTwoAwhileProps } from './index.dto';

// 获取时刻列表
export async function getAwhileList(params: any) {
  return request('/api/awhile/list', {
    method: 'POST',
    data: params,
  });
}

// 删除一级时刻
export async function deleteAwhileOneLevel(params: string) {
  return request('/api/awhile/removeOne', {
    method: 'Delete',
    params: {
      id: params,
    },
  });
}

// 一级时刻审核
export async function auditOneWhile(query: { id: string }) {
  return request('/api/awhile/auditOne', {
    method: 'POST',
    data: query,
  });
}

// 二级时刻审核
export async function auditTwoWhile(query: auditTwoAwhileProps) {
  return request('/api/awhile/auditTwo', {
    method: 'POST',
    data: query,
  });
}

// 二级时刻删除
export async function removeTwoWhile(twoAuditPost: auditTwoAwhileProps) {
  return request('/api/awhile/removeTwo', {
    method: 'POST',
    data: twoAuditPost,
  });
}
