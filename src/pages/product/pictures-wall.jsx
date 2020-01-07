import React, { Component } from 'react'
import { Upload, Icon, Modal, message } from 'antd';
import { reqDeleteImg } from '../../api'
import { BASE_IMG } from '../../utils/Constants.js'
import PropTypes from 'prop-types'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends Component {
  static propTypes = {
    imgs: PropTypes.array
  }
  state = {
    previewVisible: false, // 表示是否显示大图预览
    previewImage: '', // 大图的 URL 或者 base 64 图片地址
    fileList: [
      // { // 文件信息对象 (file 对象)
      //   uid: '-1', // 唯一标识符
      //   name: 'image.png', // 文件名
      //   status: 'done', // 状态值：uploading done error removed
      //   url: 'http://localhost:5000/upload/image-1578364850192.jpg', // 图片的 URL
      // }
    ],
  };

  /*
    获取所以已上传图片文件名的数组
  */
  getImgs = () => this.state.fileList.map(file => file.name)

  handleCancel = () => this.setState({ previewVisible: false });

  /*
    进行大图预览的回调函数
    file：当前选择的图片对应的文件对象
  */
  handlePreview = async file => {
    if (!file.url && !file.preview) { // 如果 file 对象没有图片 url，只进行一次 base 64 处理来显示图片
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };
  /*
    在 file 的状态发生改变的监听回调
    file：当前操作的 file 文件对象（可能是上传，也可能是删除的 file）
  */
  handleChange = async ({ file, fileList }) => {
    // file 与 fileList 中最后一个 file 代表同个图片的不同对象
    // console.log('fileList执行啦：', file.status, file)
    // console.log('fileList执行啦：', file.status, file === fileList[fileList.length-1])
    
    // 如果上传成功
    if (file.status === 'done') {
      // 同样的内容，不同的对象，要改变的是 fileList[fileList.length-1] 个对象
      // 将它保存到 file 变量
      file = fileList[fileList.length-1]
      // 取出响应数据中的图片文件名和图片 url
      const { name, url } = file.response.data
      // console.log('上传成功了：', name, url)

      // 将文件名和文件 url 保存到上传的 file 对象中
      file.name = name
      file.url = url
    } else if (file.status === 'removed') { // 删除图片
      const result = await reqDeleteImg(file.name)
      if (result.status === 0) {
        message.success('删除图片成功')
      } else {
        message.error('删除图片失败')
      }
    }

    // 更新状态
    this.setState({ fileList })
  };

  componentWillMount() {
    // 根据传入的 imgs 生成 fileList 并更新
    const imgs = this.props.imgs
    if (imgs && imgs.length > 0) {
      const fileList = imgs.map((img, index) => ({
          uid: -index, // 唯一标识符
          name: img, // 文件名
          status: 'done', // 状态值：uploading done error removed
          url: BASE_IMG + img, // 图片的 URL
      }))
      
      // 更新状态
      this.setState({
        fileList
      })
    }
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          name="image" // 图片文件对应的参数名
          action="/manage/img/upload" // 上传图片的 URL
          listType="picture-card" // 显示风格
          fileList={fileList} // 已上传的所有图片文件信息对象的数组
          onPreview={this.handlePreview} // 大图预览
          onChange={this.handleChange} // 监控改变
        >
          {/* 判断最多能上传几张图片，超过就不显示上传功能 */}
          {fileList.length >= 9 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
