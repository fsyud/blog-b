import type { Effect } from 'dva';
import { message } from 'antd';
import { deleteArticleList, createArticle } from '@/services/artlist/api';

export type CuurrentArt = {};
export interface ArticleModelType {
  namespace: 'article';
  state: {
    list: any[];
  };
  effects: {
    createArticle: Effect;
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
    *createArticle({ payload }, { call }) {
      const { data } = yield call(createArticle, payload);
      if (data) {
        message.info(data.msg);
      }
    },
    *deleteArticle({ payload }, { call }) {
      const { data } = yield call(deleteArticleList, payload);
      if (data) {
        message.info(data.msg);
      }
    },
  },
  reducers: {},
};

export default ArticleModel;
