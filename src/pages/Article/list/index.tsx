import React, { useState, useEffect } from 'react';
import {
  Card,
  Input,
  Form,
  Button,
  Table,
  message,
  Divider,
  Popconfirm,
  Drawer,
  Badge,
} from 'antd';
import {
  getArticleList,
  deleteArticleList,
  auditArticleList,
  getArticleDetail,
} from '@/services/artlist/api';
import { MarkedTool } from '@/utils/marked';
import styles from './index.less';
import './index.css';

const text = '您确定要删除此文章吗？删除不可恢复，请谨慎操作';

const ArticleList: React.FC<{}> = () => {
  const [form] = Form.useForm();

  const [page, setPage] = useState<number>(1);
  const [listData, setListData] = useState<any[]>([]);
  const [modalVisable, setModalVisable] = useState<boolean>(false);
  const [artDetail, setArtDetail] = useState<string>('');

  /**
   * @description: 获取文章列表
   * @param {*} Promise
   * @return {*}
   */
  const getArtList = async (): Promise<any> => {
    const res: API.reponseData = await getArticleList({
      page: 1,
      pageSize: 100,
    });

    if (res && Array.isArray(res.data)) {
      setListData(res.data);
    }
  };

  useEffect(() => {
    getArtList();
  }, []);

  /**
   * @description: 删除文章
   * @param {any} params
   * @return {*}
   */
  const onCancel = async (params: any) => {
    const { data } = await deleteArticleList(params);
    if (data) {
      message.info(data.msg);
      getArtList();
    }
  };

  /**
   * @description: 审核文章
   * @param {any} params
   * @return {*}
   */
  const onAudit = async (params: string) => {
    const { data } = await auditArticleList(params);
    if (data) {
      message.info(data.msg);
      getArtList();
    }
  };

  /**
   * @description: 获取文章详情
   * @param {string} params
   * @return {*}
   */
  const showDetail = async (params: string) => {
    const { data } = await getArticleDetail(params);

    if (data) {
      setArtDetail(data?.content || '');
      setTimeout(() => {
        setModalVisable(true);
      });
    }
  };

  /**
   * @description: 文章列配置
   * @param {*}
   * @return {*}
   */
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
      render: (value: any) => {
        return (
          <div
            title={value}
            style={{
              width: 150,
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
      title: '文章描述',
      dataIndex: 'desc',
      key: 'desc',
      render: (value: any) => {
        return (
          <div
            title={value}
            style={{
              width: 150,
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
      title: '标签',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '文章状态',
      dataIndex: 'state',
      key: 'state',
      render: (value: any) => {
        if (value === 1) {
          return (
            <div>
              <Badge status="warning" />
              草稿箱
            </div>
          );
        }
        if (value === 2) {
          return (
            <div>
              <Badge status="error" />
              未审核
            </div>
          );
        }
        if (value === 3) {
          return (
            <div>
              <Badge status="success" />
              已审核
            </div>
          );
        }
        return '';
      },
    },
    {
      title: '作者',
      dataIndex: 'author_user_info',
      key: 'author_user_info.username',
      render: (value: any) => {
        return value.username;
      },
    },
    {
      title: '作者权限',
      dataIndex: 'author_user_info',
      key: 'author_user_info.type',
      render: (value: any) => {
        return value.type === '1' ? '管理员' : '注册会员';
      },
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'option',
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
          <a style={{ marginLeft: 10 }}>审核</a>
        </Popconfirm>,
        <a
          style={{ marginLeft: 10 }}
          onClick={() => {
            const { _id } = record;
            showDetail(_id);
          }}
        >
          详情
        </a>,
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
      <Drawer
        title="文章详情"
        placement="right"
        width={800}
        closable={false}
        onClose={() => {
          setModalVisable(false);
          setArtDetail('');
        }}
        visible={modalVisable}
      >
        <div
          className="marked-drawer"
          dangerouslySetInnerHTML={{
            __html: MarkedTool(artDetail),
          }}
        />
      </Drawer>
    </div>
  );
};

export default ArticleList;
