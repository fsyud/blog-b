import React, { useState } from 'react';
import BraftEditor from 'braft-editor';
import { Drawer, Button, Card } from 'antd';
import 'braft-editor/dist/index.css';

import styles from './index.less';

const ArticleCreat: React.FC = () => {
  const [value, setValue] = useState<any>(BraftEditor.createEditorState('<p>nice <b>day!</b></p>'));
  const [visible, setVisible] = useState<boolean>(false);

  // 预览
  const preview = () => {
    setVisible(true);
  };

  const extendControls: any = [
    {
      key: 'custom-button',
      type: 'button',
      text: '预览',
      onClick: preview,
    },
  ];

  const submit = async (): Promise<any> => {};

  return (
    <div className={styles.creat_article}>
      <Card>
        <div className={styles.header}>
          <Button type="primary" size="middle" onClick={submit}>
            提交
          </Button>
        </div>
        <BraftEditor
          value={value}
          onChange={(val: any) => {
            setValue(val);
          }}
          extendControls={extendControls}
        />

        <Drawer
          title="预览"
          placement="right"
          closable={false}
          width={1000}
          onClose={() => setVisible(false)}
          visible={visible}
        >
          <div
            className={styles.toc_index}
            dangerouslySetInnerHTML={{
              __html: value.toHTML(),
            }}
          />
        </Drawer>
      </Card>
    </div>
  );
};

export default ArticleCreat;
