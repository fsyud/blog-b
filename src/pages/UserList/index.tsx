import React, { useState, useEffect } from 'react';
import { Card, Input, Form, Button, Table, message, Space, Popconfirm } from 'antd';
import { getUserList, deleteUser } from '@/services/user';
import styles from './index.less';

const UserList: React.FC<{}> = () => {
  const [page, setPage] = useState<number>(1);
  const [listData, setListData] = useState<any[]>([]);

  const [form] = Form.useForm();

  const text = '您确定要删除此数据吗？';

  const getArtList = async (): Promise<any> => {
    const res: API.reponseData = await getUserList();
    if (res && Array.isArray(res.data)) {
      setListData(res.data);
    }
  };

  useEffect(() => {
    getArtList();
  }, []);

  const onCheck = async () => {};

  // 删除
  const onCancel = async (params: any) => {
    const { data } = await deleteUser(params);
    if (data) {
      message.info(data.msg);
      getArtList();
    }
  };

  // 编辑
  const onEdit = async (params: any) => {
    const { data } = await deleteUser(params);
    if (data) {
      message.info(data.msg);
      getArtList();
    }
  };

  const columns: any[] = [
    {
      title: '头像',
      dataIndex: 'avatar_url',
      key: 'avatar_url',
      render: (value: string) => {
        return <img src={value} alt="avatar" />;
      },
    },
    {
      title: '账号',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (value: string) => {
        return value === '1' ? '管理员' : '注册会员';
      },
    },
    {
      title: '工作',
      dataIndex: 'job',
      key: 'job',
    },
    {
      title: '个人介绍',
      dataIndex: 'introduce',
      key: 'introduce',
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      render: (value: any, record: any) => (
        <Space size="middle">
          <a
            key="config"
            onClick={() => {
              const { _id } = record;
              onEdit(_id);
            }}
          >
            编辑
          </a>
          <Popconfirm
            placement="topRight"
            style={{ width: 100 }}
            title={text}
            onConfirm={() => {
              const { _id } = record;
              onCancel(_id);
            }}
            okText="确认"
            cancelText="否"
          >
            <a>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.user_list}>
      <Card bordered={false}>
        <Form form={form} name="article_list_header">
          <Form.Item name="main_text">
            <Input placeholder="请输入关键字" width={200} />
          </Form.Item>
        </Form>

        <Button type="primary" onClick={onCheck}>
          搜索
        </Button>
      </Card>

      <Card bordered={false}>
        <Table
          columns={columns}
          rowKey="user-list-table"
          dataSource={listData}
          pagination={{
            total: 100,
            pageSize: 100,
            // eslint-disable-next-line @typescript-eslint/no-shadow
            onChange: (page) => setPage(page),
            current: page,
          }}
        ></Table>
      </Card>
    </div>
  );
};

export default UserList;
