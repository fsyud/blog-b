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
} from 'antd';
import ImgCrop from 'antd-img-crop';
import { getCommentList, deleteCommentOneLevel } from '@/services/comment';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './index.less';

const { TextArea } = Input;

const OneComment: React.FC<{}> = () => {
  const [page, setPage] = useState<number>(1);
  const [listData, setListData] = useState<any[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [imgurl, setImgurl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [form] = Form.useForm();
  const [formUser] = Form.useForm();

  const text = '您确定要删除此数据吗？';

  const getOneCommentList = async (): Promise<any> => {
    const res: API.reponseData = await getCommentList({});

    if (res && Array.isArray(res.data)) {
      setListData(res.data);
    }
  };

  useEffect(() => {
    getOneCommentList();
  }, []);

  // 删除
  const onCancel = async (params: any) => {
    const { data } = await deleteCommentOneLevel(params);
    if (data) {
      message.info(data.msg);
      getOneCommentList();
    }
  };

  // 编辑
  // const onEdit = async (params: any) => {
  //   const { data } = await deleteUser(params);
  //   if (data) {
  //     message.info(data.msg);
  //     getArtList();
  //   }
  // };

  const getBase64 = (img: any, callback: any) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const onChange = ({ file }: any) => {
    if (file?.response?.code === 0) {
      // const { path } = file.response.data;
      getBase64(file.originFileObj, (imageUrl: any) => {
        setImgurl(imageUrl);
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
    console.log(values);
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
      dataIndex: 'oneComment.avatar',
      key: 'avatar',
      render: (value: string) => {
        return <img style={{ width: 50 }} src={value} alt="avatar" />;
      },
    },
    {
      title: '所在文章',
      dataIndex: 'article_title',
      key: 'article_title',
    },
    {
      title: '是否审核',
      dataIndex: 'is_handle',
      key: 'is_handle',
      render: (value: number) => {
        return value === 1 ? '已审核' : '未审核';
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
      dataIndex: 'option',
      key: 'option',
      render: (value: any, record: any) => (
        <Space size="middle">
          <a
            key="config"
            onClick={() => {
              setVisible(true);
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
      <Drawer
        title="用户信息"
        placement="right"
        closable={false}
        width={700}
        onClose={() => setVisible(false)}
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
    </div>
  );
};

export default OneComment;
