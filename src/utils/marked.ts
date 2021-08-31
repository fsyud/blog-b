import 'highlight.js/styles/github.css';

const myMarked = require('marked');
const hljs = require('highlight.js');

/**
 * @description: 构建maked
 * @param {string} pmrams
 * @return {*}
 */
export const MarkedTool = (pmrams: string) => {
  myMarked.setOptions({
    renderer: new myMarked.Renderer(),
    highlight: (code: any) => {
      return hljs.highlightAuto(code).value;
    },
    pedantic: false,
    gfm: true,
    tables: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false,
  });

  return myMarked(pmrams);
};
