import type { Effect } from 'dva';
import { message } from 'antd';
import { deleteArticleList } from '@/services/artlist/api';

export type CuurrentArt = {};
export interface ArticleModelType {
  namespace: 'article';
  state: {
    list: any[];
  };
  effects: {
    deleteArticle: Effect;
  };
  reducers: {};
}

const ArticleModel: ArticleModelType = {
  namespace: 'article',
  state: {
    list: [],
  },
  effects: {
    *deleteArticle({ payload }, { call }) {
      console.log(payload);
      const { data } = yield call(deleteArticleList, payload);
      if (data) {
        message.info(data.msg);
      }
    },
  },
  reducers: {},
};

export default ArticleModel;
