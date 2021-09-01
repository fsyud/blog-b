import React, { useState, useEffect } from 'react';
import { Card, Input, Form, Button, Table, message, Divider, Popconfirm, Badge } from 'antd';
import { getAwhileList, deleteAwhileOneLevel } from '@/services/awhile';
import styles from './index.less';

const text = '您确定要删除此数据吗？';

const ArticleList: React.FC<{}> = () => {
  const [page, setPage] = useState<number>(1);
  const [listData, setListData] = useState<any[]>([]);

  const [form] = Form.useForm();

  const getArtList = async (): Promise<any> => {
    const res: API.reponseData = await getAwhileList({
      page: 1,
      pageSize: 100,
      tag: 999,
    });
    if (res && Array.isArray(res.data)) {
      setListData(res.data);
    }
  };

  useEffect(() => {
    getArtList();
  }, []);

  /**
   * @description: 删除一级时刻
   * @param {any} params
   * @return {*}
   */
  const onCancel = async (params: any) => {
    const { data } = await deleteAwhileOneLevel(params);
    if (data) {
      message.info(data.msg);
      getArtList();
    }
  };

  /**
   * @description: 审核一级时刻
   * @param {any} params
   * @return {*}
   */
  const onAudit = async (params: string, article: string) => {
    console.log(article, params);
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
      title: '是否审核',
      dataIndex: 'is_handle',
      key: 'is_handle',
      render: (value: number) => {
        return (
          <span>
            {value === 1 ? (
              <div>
                <Badge status="error" />
                未审核
              </div>
            ) : (
              <div>
                <Badge status="success" />
                已审核
              </div>
            )}
          </span>
        );
      },
    },
    {
      title: '标签',
      dataIndex: 'tag',
      key: 'tag',
    },
    {
      title: '一级-作者',
      dataIndex: 'oneWhile',
      key: 'oneWhile.user_name',
      render: (value: any) => {
        return value.user_name;
      },
    },
    {
      title: '一级-内容',
      dataIndex: 'oneWhile',
      width: 300,
      key: 'oneWhile.content',
      render: (value: any) => {
        return (
          <div
            title={value.content}
            style={{
              width: 300,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {value.content}
          </div>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      align: 'center',
      key: 'option',
      render: (value: any, record: any) => [
        <Popconfirm
          placement="topRight"
          style={{ width: 100 }}
          title={'已确认内容合法性，确认审核！'}
          onConfirm={() => {
            const { _id, article_id } = record;
            onAudit(_id, article_id);
          }}
          okText="确认"
          cancelText="否"
        >
          <a>审核</a>
        </Popconfirm>,
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
          <a style={{ marginLeft: 10 }}>删除</a>
        </Popconfirm>,
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
          bordered
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
