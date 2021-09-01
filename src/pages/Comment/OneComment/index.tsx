import React, { useState, useEffect } from 'react';
import { Card, Input, Form, Button, Table, message, Space, Popconfirm, Divider, Badge } from 'antd';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { removeTwoCommentProps, auditTwoCommentProps } from '@/services/comment/index.dto';
import {
  getCommentList,
  deleteCommentOneLevel,
  auditOneComment,
  auditTwoComment,
  removeTwoComment,
} from '@/services/comment';
import moment from 'moment';
import styles from './index.less';

const OneComment: React.FC<{}> = () => {
  const [page, setPage] = useState<number>(1);
  const [listData, setListData] = useState<any[]>([]);

  const [form] = Form.useForm();

  const text = '您确定要删除此数据吗？';

  const getOneCommentList = async (): Promise<any> => {
    const res: API.reponseData = await getCommentList({});
    if (res && Array.isArray(res.data)) {
      const curData = res.data.map((s: any, i: number) => {
        return { ...s, ...{ key: i } };
      });
      setListData(curData);
    }
  };

  useEffect(() => {
    getOneCommentList();
  }, []);

  /**
   * @description: 删除一级评论
   * @param {any} params
   * @return {*}
   */
  const onCancel = async (params: any) => {
    const { data } = await deleteCommentOneLevel(params);
    if (data) {
      message.info(data.msg);
      getOneCommentList();
    }
  };

  /**
   * @description: 删除二级评论
   * @param {any} params
   * @return {*}
   */
  const onCancelTwo = async (pmrams: removeTwoCommentProps) => {
    const { data } = await removeTwoComment(pmrams);
    if (data) {
      message.info(data.msg);
      getOneCommentList();
    }
  };

  /**
   * @description: 审核一级评论
   * @param {any} params
   * @return {*}
   */
  const onAudit = async (params: string, article: string) => {
    const { data } = await auditOneComment({ id: params, article_id: article });
    if (data) {
      message.info(data.msg);
      getOneCommentList();
    }
  };

  /**
   * @description: 审核二级评论
   * @param {any} params
   * @return {*}
   */
  const onAuditTwo = async (query: auditTwoCommentProps) => {
    const { data } = await auditTwoComment(query);
    if (data) {
      message.info(data.msg);
      getOneCommentList();
    }
  };

  // 提交
  const onFinish = async (values: any): Promise<any> => {
    console.log(values);
  };

  const columns: any[] = [
    {
      title: '创建时间',
      dataIndex: 'create_times',
      key: 'create_times',
      width: 190,
      render: (value: any) => {
        return moment(value).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: '头像',
      with: 50,
      dataIndex: 'oneComment',
      key: 'oneComment.avatar',
      render: (value: any) => {
        return <img style={{ width: 50 }} src={value.avatar} alt="avatar" />;
      },
    },
    {
      title: '所在文章',
      dataIndex: 'article_title',
      key: 'article_title',
      render: (value: any) => {
        return (
          <div
            title={value}
            style={{
              width: 100,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {value}
          </div>
        );
      },
    },
    {
      title: '是否审核',
      dataIndex: 'state',
      key: 'state',
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
      title: '用户名',
      dataIndex: 'oneComment',
      key: 'oneComment.user_name',
      render: (value: any) => {
        return value.user_name;
      },
    },
    {
      title: '类型',
      dataIndex: 'oneComment',
      key: 'oneComment.type',
      render: (value: any) => {
        return value.type === '1' ? '管理员' : '注册会员';
      },
    },
    {
      title: '点赞数',
      dataIndex: 'likes',
      key: 'likes',
    },
    {
      title: '子评论',
      dataIndex: 'secondCommit',
      key: 'secondCommit.numbers',
      render: (value: any[]) => {
        return <a>{value.length}</a>;
      },
    },
    {
      title: '子未审',
      dataIndex: 'secondCommit',
      key: 'secondCommit.unAudit',
      render: (value: any[]) => {
        const datasUnAudit = value.filter((s: any) => s.state === 1);
        return <a>{datasUnAudit?.length}</a>;
      },
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      render: (value: any) => {
        return (
          <div
            title={value}
            style={{
              width: 300,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {value}
          </div>
        );
      },
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'option',
      key: 'option',
      render: (value: any, record: any) => (
        <Space size="middle">
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
            <a style={{ marginLeft: 10 }}>审核</a>
          </Popconfirm>
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

  /**
   * @description: 扩展table
   * @param {any} pmrams
   * @return {*}
   */
  const expandedRowRender = (pmrams: any) => {
    const extraColumns = [
      {
        title: '创建时间',
        dataIndex: 'create_times',
        key: 'create_times',
        width: 200,
        render: (value: any) => {
          return moment(value).format('YYYY-MM-DD HH:mm:ss');
        },
      },
      { title: '喜欢', dataIndex: 'likes', key: 'likes' },
      {
        title: '审核状态',
        dataIndex: 'state',
        key: 'state',
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
      { title: '回复内容', dataIndex: 'reply_content', key: 'reply_content' },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (value: any, record: any) => (
          <Space size="middle">
            <Popconfirm
              placement="topRight"
              style={{ width: 100 }}
              title={'已确认内容合法性，确认审核！'}
              onConfirm={() => {
                const { _id } = record;
                onAuditTwo({ curId: _id, article_id: pmrams?.article_id });
              }}
              okText="确认"
              cancelText="否"
            >
              <a style={{ marginLeft: 10 }}>审核</a>
            </Popconfirm>
            <Popconfirm
              placement="topRight"
              style={{ width: 100 }}
              title={text}
              onConfirm={() => {
                const { _id, state } = record;
                // eslint-disable-next-line no-underscore-dangle
                onCancelTwo({ commmnetId: pmrams?._id, curId: _id, state });
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
      <Table
        rowKey="extra-table"
        columns={extraColumns}
        dataSource={pmrams.secondCommit}
        pagination={false}
      />
    );
  };

  return (
    <div className={styles.user_list}>
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
      <Card bordered={false} className={styles.tool}>
        <Button type="primary">用户注册</Button>
      </Card>

      <Card bordered={false}>
        <Table
          columns={columns}
          expandable={{ expandedRowRender }}
          dataSource={listData}
          bordered
          pagination={{
            total: 100,
            pageSize: 100,
            // eslint-disable-next-line @typescript-eslint/no-shadow
            onChange: (page) => setPage(page),
            current: page,
          }}
        />
      </Card>
    </div>
  );
};

export default OneComment;
