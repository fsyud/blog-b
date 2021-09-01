import request from '@/utils/request';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { auditTwoCommentProps, removeTwoCommentProps } from './index.dto';

// 获取所有评论列表
export async function getCommentList(query: { pageSize?: number; page?: number }) {
  return request('/api/comment/allList', {
    method: 'POST',
    data: query,
  });
}

// 删除一级评论
export async function deleteCommentOneLevel(params: string) {
  return request('/api/comment/removeOne', {
    method: 'Delete',
    params: {
      id: params,
    },
  });
}

// 一级评论审核
export async function auditOneComment(query: { id: string; article_id: string }) {
  return request('/api/comment/auditOne', {
    method: 'POST',
    data: query,
  });
}

// 二级评论审核
export async function auditTwoComment(query: auditTwoCommentProps) {
  return request('/api/comment/auditTwo', {
    method: 'POST',
    data: query,
  });
}

// 二级评论删除
export async function removeTwoComment(twoAuditPost: removeTwoCommentProps) {
  return request('/api/comment/removeTwo', {
    method: 'POST',
    data: twoAuditPost,
  });
}
