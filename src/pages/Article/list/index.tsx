import React, { useState, useEffect } from 'react';
import { Card, Input, Form, Button, Table, message, Divider } from 'antd';
import { getArticleList, deleteArticleList } from '@/services/artlist/api';
import styles from './index.less';

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

  const onCancel = async (params: any) => {
    const { data } = await deleteArticleList(params);
    if (data) {
      message.info(data.msg);
      getArtList();
    }
  };

  const columns: any[] = [
    {
      title: '封面图片',
      with: 50,
      dataIndex: 'img_url',
      key: 'img_url',
      render: (value: string) => {
        return <img style={{ width: 50 }} src={value} alt="avatar" />;
      },
    },

    {
      title: '文章标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      render: (value: any, record: any) => [
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

  // 提交
  const onFinish = async (values: any): Promise<any> => {
    console.log(values);
  };

  return (
    <div className={styles.art_list}>
      <Card bordered={false} className={styles.search}>
        <Form onFinish={onFinish} form={form} layout="inline" name="article_list_header">
          <Form.Item name="main_text">
            <Input placeholder="请输入关键字" width={200} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Divider />
      <Card bordered={false}>
        <Table
          key="article-table-list"
          columns={columns}
          rowKey="article-table-list"
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
