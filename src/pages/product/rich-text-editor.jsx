import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs'
import PropTypes from 'prop-types'
// import _ from 'lodash' // 不建议在详情页加入函数防抖，太卡了
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './rich-text-editor.less'

export default class RichTextEditor extends Component {
  static propTypes = {
    detail: PropTypes.string
  }

  state = {
    editorState: EditorState.createEmpty(),
  }

  // 使用函数防抖优化编辑器处理改变回调函数
  onEditorStateChange = (editorState) => {
    console.log('----')
    this.setState({
      editorState,
    });
  };

  uploadImageCallBack = (file) => {
    return new Promise(
      (resolve, reject) => { // 执行器函数：执行异步任务
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/manage/img/upload');
        xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
        const data = new FormData();
        data.append('image', file);
        xhr.send(data);
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText); // {status:0, data: {name: '', url: '....'}}
          const url = response.data.url
          delete response.data.url
          response.data.link = url
          resolve(response);
        });
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText);
          reject(error);
        });
      }
    );
  }

  getDetail = () => draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))

  componentWillMount() {
    const detail = this.props.detail
    if (detail) {
      // 根据 detail 生成一个 editorState
      const contentBlock = htmlToDraft(detail);
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);

      // 更新状态
      this.setState({
        editorState
      })
    }
  }

  render() {
    const { editorState } = this.state;
    return (
      <div className="rich-text-editor">
        <Editor
          editorState={editorState}
          wrapperClassName="rich-text-wrapper"
          editorClassName="rich-text-content"
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            inline: { inDropdown: true },
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
            link: { inDropdown: true },
            history: { inDropdown: true },
            image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
          }}
        />
      </div>
    );
  }
}
