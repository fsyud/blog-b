import React, { useState, useEffect } from 'react';
import {
  Card,
  Input,
  Form,
  Button,
  Table,
  message,
  Space,
  Popconfirm,
  Drawer,
  Divider,
  Upload,
  Radio,
} from 'antd';
import ImgCrop from 'antd-img-crop';
import { getUserList, deleteUser, userUpdate } from '@/services/user';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import LoginModal from '@/components/Sky/LoginModal';
import styles from './index.less';

const { TextArea } = Input;

const UserList: React.FC<{}> = () => {
  const [page, setPage] = useState<number>(1);
  const [listData, setListData] = useState<any[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [imgurl, setImgurl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisable, setModalVisable] = useState<boolean>(false);
  const [editInfo, seteditInfo] = useState<any>(null);

  const [form] = Form.useForm();
  const [formUser] = Form.useForm();

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

  useEffect(() => {
    if (editInfo) {
      formUser.setFieldsValue(editInfo);
      setImgurl(editInfo?.avatar_url);
    }
  }, [editInfo, formUser]);

  // 删除
  const onCancel = async (params: any) => {
    const { data } = await deleteUser(params);
    if (data) {
      message.info(data.msg);
      getArtList();
    }
  };

  const getBase64 = (img: any, callback: any) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onChange = ({ file, fileList, event }: any) => {
    if (file?.response?.code === 0) {
      const { path } = file.response.data;
      getBase64(file.originFileObj, () => {
        setImgurl(path);
        setLoading(false);
      });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传文章封面</div>
    </div>
  );

  // 提交
  const onFinish = async (values: any): Promise<any> => {
    // eslint-disable-next-line no-underscore-dangle
    const params = { ...values, ...{ id: editInfo?._id, avatar_url: imgurl } };

    const data = await userUpdate(params);

    if (data.code === 0) {
      message.success('修改成功！');
      setVisible(false);
      seteditInfo(null);
      formUser.resetFields();
      setImgurl('');
      getArtList();
    } else {
      message.error('修改失败！');
    }
  };

  // 注册成功
  const onSuccessLogin = (params: boolean): void => {
    if (params) {
      setModalVisable(false);
      getArtList();
    }
  };

  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('请上传 JPG/PNG 格式的文件!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isLt2M) {
      message.error('图片请小于2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const columns: any[] = [
    {
      title: '头像',
      with: 50,
      dataIndex: 'avatar_url',
      key: 'avatar_url',
      render: (value: string) => {
        return <img style={{ width: 50 }} src={value} alt="avatar" />;
      },
    },
    {
      title: '注册账号',
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
              setVisible(true);
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
    <div className={styles.user_list}>
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
      <Divider />
      <Card bordered={false} className={styles.tool}>
        <Button type="primary" onClick={() => setModalVisable(true)}>
          用户注册
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
      <Drawer
        title="用户信息"
        placement="right"
        closable={false}
        width={700}
        onClose={() => {
          setVisible(false);
          seteditInfo(null);
          formUser.resetFields();
          setImgurl('');
        }}
        visible={visible}
      >
        <Form
          name="basic"
          labelCol={{ span: 3 }}
          onFinish={onFinish}
          wrapperCol={{ span: 21 }}
          form={formUser}
          initialValues={{ remember: true }}
        >
          <Form.Item label="用户头像">
            <ImgCrop rotate aspect={3 / 2} modalTitle="裁剪图片，建议上传3/2比例的图片">
              <Upload
                action="/api/common/upload"
                listType="picture-card"
                showUploadList={false}
                onChange={onChange}
                beforeUpload={beforeUpload}
              >
                {imgurl ? (
                  <img src={imgurl} alt="avatar" style={{ width: '100%' }} />
                ) : (
                  uploadButton
                )}
              </Upload>
            </ImgCrop>
            <span className={styles.upload_tips}>建议尺寸：1303*734px</span>
          </Form.Item>
          <Form.Item label="账号" name="name">
            <Input placeholder="填写你的账号" />
          </Form.Item>
          <Form.Item label="密码" name="password">
            <Input placeholder="填写你的密码" />
          </Form.Item>
          <Form.Item
            label="角色"
            name="type"
            rules={[{ required: true, message: '请选择角色权限！' }]}
          >
            <Radio.Group>
              <Radio value="1">管理员</Radio>
              <Radio value="2">游客</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="用户名" name="username">
            <Input placeholder="填写你的用户名" />
          </Form.Item>
          <Divider />
          <Form.Item label="职位" name="job">
            <Input placeholder="填写你的职位" />
          </Form.Item>
          <Divider />
          <Form.Item label="公司" name="company">
            <Input placeholder="填写你的公司" />
          </Form.Item>
          <Divider />
          <Form.Item label="个人介绍" name="introduce">
            <TextArea
              placeholder="填写职业技能、擅长的事情、喜欢的事情等"
              allowClear
              autoSize={{ minRows: 3, maxRows: 6 }}
            />
          </Form.Item>
          <Divider />
          <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
            <Button type="primary" htmlType="submit">
              保存修改
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
      <LoginModal
        visible={modalVisable}
        onSuccessLogin={onSuccessLogin}
        maskClosable
        closable
        title="注册"
        onCancel={() => {
          setModalVisable(false);
        }}
      />
    </div>
  );
};

export default UserList;
