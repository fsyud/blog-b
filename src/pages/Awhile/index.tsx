import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Card, Input, Form, Button, Table, message, Divider, Popconfirm, Badge, Space } from 'antd';
import {
  getAwhileList,
  deleteAwhileOneLevel,
  auditOneWhile,
  auditTwoWhile,
  removeTwoWhile,
} from '@/services/awhile';
import type { auditTwoAwhileProps } from '@/services/awhile/index.dto';

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
      const curData = res.data.map((s: any, i: number) => {
        return { ...s, ...{ key: i } };
      });
      setListData(curData);
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
  const onAudit = async (id: any) => {
    const { data } = await auditOneWhile({ id });
    if (data) {
      message.info(data.msg);
      getArtList();
    }
  };

  const columns: any[] = [
    {
      title: '创建时间',
      dataIndex: 'create_times',
      key: 'create_times',
      width: 190,
      render: (value: any) => {
        return value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '';
      },
    },
    {
      title: '头像',
      with: 50,
      dataIndex: 'oneWhile',
      key: 'oneWhile.avatar',
      render: (value: any) => {
        return <img style={{ width: 50 }} src={value.avatar} alt="avatar" />;
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
      title: '标签',
      dataIndex: 'tag',
      key: 'tag',
      render: (value: any) => {
        return value === 999 ? '无' : value;
      },
    },
    {
      title: '点赞数',
      dataIndex: 'meta',
      key: 'meta.likes',
      render: (value: any) => {
        return value?.likes;
      },
    },
    {
      title: '子评论',
      dataIndex: 'secondCommit',
      key: 'secondCommit.numbers',
      render: (value: any, record: any) => {
        return record.secondWhile?.length;
      },
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
            const { _id } = record;
            onAudit(_id);
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

  /**
   * @description: 审核二级时刻
   * @param {any} params
   * @return {*}
   */
  const onAuditTwo = async (query: auditTwoAwhileProps) => {
    const { data } = await auditTwoWhile(query);
    if (data) {
      message.info(data.msg);
      getArtList();
    }
  };

  /**
   * @description: 删除二级评论
   * @param {any} params
   * @return {*}
   */
  const onCancelTwo = async (pmrams: auditTwoAwhileProps) => {
    const { data } = await removeTwoWhile(pmrams);
    if (data) {
      message.info(data.msg);
      getArtList();
    }
  };

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
        align: 'center',
        render: (value: any, record: any) => (
          <Space size="middle">
            <Popconfirm
              placement="topRight"
              style={{ width: 100 }}
              title={'已确认内容合法性，确认审核！'}
              onConfirm={() => {
                const { _id } = record;
                onAuditTwo({ curId: _id, parent_awhile_id: pmrams?.article_id });
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
                // eslint-disable-next-line no-underscore-dangle
                onCancelTwo({ parent_awhile_id: pmrams?._id, curId: _id });
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
        // @ts-ignore
        columns={extraColumns}
        dataSource={pmrams.secondWhile}
        pagination={false}
      />
    );
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
          columns={columns}
          bordered
          expandable={{ expandedRowRender }}
          dataSource={listData}
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

export default ArticleList;
