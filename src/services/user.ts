import request from '@/utils/request';

export async function registerUser(body: API.LoginParams) {
  return request('/api/login/register', {
    method: 'POST',
    data: body,
  });
}

export async function userLogin(body: API.LoginParams) {
  return request('/api/login/user_login', {
    method: 'POST',
    data: body,
  });
}

// 获取用户列表
export async function getUserList() {
  return request('/api/login/list', {
    method: 'POST',
  });
}

// 删除用户
export async function deleteUser(params: number | string) {
  return request('/api/login/remove', {
    method: 'Delete',
    params: {
      id: params,
    },
  });
}

// 用户注册
export async function userRegister(params: API.userInfo) {
  return request('/api/login/register', {
    method: 'POST',
    data: params,
  });
}

// 用户修改信息
export async function userUpdate(params: API.updateUser) {
  return request('/api/login/update_userinfo', {
    method: 'POST',
    data: params,
  });
}
