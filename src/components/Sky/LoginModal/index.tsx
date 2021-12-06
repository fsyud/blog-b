import React, { useEffect } from 'react';
import type { ModalProps } from 'antd';
import { Modal, Form, Button, Input, notification, Radio } from 'antd';
import { userRegister } from '@/services/user';

interface LoginModalProps extends ModalProps {
  onSuccessLogin: (params: boolean) => void;
}

const LoginModal: React.FC<LoginModalProps> = (props) => {
  const { onSuccessLogin, ...otherProps } = props;

  const [form] = Form.useForm();
  useEffect(() => {
    if (!props.visible) form.resetFields();
  }, [props.visible, form]);

  const onFinish = async (values: any): Promise<any> => {
    const { data } = await userRegister(values);

    if (data?.success) {
      notification.success({
        message: data.msg,
      });
      onSuccessLogin(true);
    } else {
      notification.error({
        message: '注册失败',
      });
      onSuccessLogin(false);
    }
  };

  return (
    <Modal {...otherProps} forceRender footer={null} width={380}>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        name="basic"
        form={form}
        onFinish={onFinish}
      >
        <Form.Item label="名字" name="name" rules={[{ required: true, message: '请输入用户名！' }]}>
          <Input placeholder="用户名" />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码！' }]}
        >
          <Input placeholder="密码" />
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

        <Form.Item wrapperCol={{ span: 24 }}>
          <Button block type="primary" htmlType="submit">
            注册
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LoginModal;
