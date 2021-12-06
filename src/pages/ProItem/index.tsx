import React, { useState, useEffect } from 'react';
import {
  Card,
  Input,
  Form,
  Button,
  Modal,
  notification,
  Popconfirm,
  Space,
  Table,
  message,
} from 'antd';
import { addItem, getItem, deleteItem, updateItem } from '@/services/proitem';
import styles from './index.less';

const text = '您确定要删除此数据吗？';

const ProItem: React.FC<{}> = () => {
  const [page, setPage] = useState<number>(1);
  const [form] = Form.useForm();
  const [formUser] = Form.useForm();
  const [listData, setListData] = useState<any[]>([]);
  const [modalVisable, setModalVisable] = useState<boolean>(false);
  const [editInfo, seteditInfo] = useState<any>({});

  useEffect(() => {
    if (editInfo) {
      formUser.setFieldsValue(editInfo);
    }
  }, [editInfo, formUser]);

  /**
   * @description: 获取项目列表
   * @param {*} Promise
   * @return {*}
   */
  const getItemList = async (): Promise<any> => {
    const res: any = await getItem({});
    if (res && Array.isArray(res.data)) {
      setListData(res.data);
    }
  };

  useEffect(() => {
    getItemList();
  }, []);

  const onSuccessAdd = (params?: boolean): void => {
    if (params) {
      setModalVisable(false);
      getItemList();
    }
  };

  const onFinish = async (values: any): Promise<any> => {
    if (Object.keys(editInfo).length > 0) {
      const { code } = await updateItem({ ...editInfo, ...values });

      if (code === 0) {
        notification.success({
          message: '项目更新成功！',
        });
        onSuccessAdd(true);
      } else {
        notification.error({
          message: '项目更新失败！',
        });
        onSuccessAdd();
      }
    } else {
      const { code } = await addItem(values);

      if (code === 0) {
        notification.success({
          message: '项目添加成功！',
        });
        onSuccessAdd(true);
      } else {
        notification.error({
          message: '项目添加失败！',
        });
        onSuccessAdd();
      }
    }
  };

  // 删除
  const onCancel = async (params: any) => {
    const { data } = await deleteItem(params);
    if (data) {
      message.info(data.msg);
      getItemList();
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
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '描述',
      dataIndex: 'desc',
      key: 'desc',
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'option',
      key: 'option',
      render: (value: any, record: any) => (
        <Space size="middle">
          <a
            key="config"
            onClick={() => {
              setModalVisable(true);
              seteditInfo(record);
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
    <div className={styles.pro_item}>
      <Card bordered={false} className={styles.search}>
        <Form onFinish={() => {}} form={form} layout="inline" name="article_list_header">
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
      <Card bordered={false} className={styles.tool}>
        <Button type="primary" onClick={() => setModalVisable(true)}>
          项目添加
        </Button>
      </Card>

      <Card bordered={false}>
        <Table
          columns={columns}
          rowKey="user-list-table"
          bordered
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

      <Modal
        visible={modalVisable}
        forceRender
        title="详情"
        onCancel={() => {
          setModalVisable(false);
          formUser.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          name="basic"
          form={formUser}
          onFinish={onFinish}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入标题！' }]}
          >
            <Input placeholder="标题" />
          </Form.Item>
          <Form.Item label="描述" name="desc" rules={[{ required: true, message: '请输入描述！' }]}>
            <Input.TextArea placeholder="描述" />
          </Form.Item>

          <Form.Item
            label="封面图片路径"
            name="img_url"
            rules={[{ required: true, message: '请输入封面图片路径！' }]}
          >
            <Input.TextArea placeholder="描述" />
          </Form.Item>

          <Form.Item wrapperCol={{ span: 24 }}>
            <Button block type="primary" htmlType="submit">
              添加
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProItem;
