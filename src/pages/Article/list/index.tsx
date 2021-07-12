import React, { useState, useEffect } from 'react';
import { Card, Input, Form, Button, Table, message } from 'antd';
import { getArticleList, deleteArticleList } from '@/services/artlist/api';

const ArticleList: React.FC<{}> = () => {
  const [page, setPage] = useState<number>(1);
  const [listData, setListData] = useState<any[]>([]);

  const [form] = Form.useForm();

  const getArtList = async (): Promise<any> => {
    const res: API.reponseData = await getArticleList({
      page: 1,
      pageSize: 15,
    });
    if (res && Array.isArray(res.data)) {
      setListData(res.data);
    }
  };

  useEffect(() => {
    getArtList();
  }, []);

  const onCheck = async () => {};

  const onCancel = async (params: any) => {
    const { data } = await deleteArticleList(params);
    if (data) {
      message.info(data.msg);
      getArtList();
    }
  };

  const columns: any[] = [
    {
      title: '文章标题',
      dataIndex: 'title',
    },
    {
      title: '类型',
      dataIndex: 'type',
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (_, record: any) => [
        <a
          key="config"
          onClick={() => {
            const { _id } = record;
            onCancel(_id);
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <div>
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
          rowKey="artListKey"
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

export default ArticleList;
