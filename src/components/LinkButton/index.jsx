import React from 'react'
import './index.less'

/*
  自定看似链接实为 button 的组件
    1. {...props}：将接收的所有属性传给子标签
    2. children 标签属性：
      + 字符串：
        * `<LinkButton>xxx</LinkButton>`
      + 标签对象：
        * `<LinkButton><span>xxx</span></LinkButton>`
      + 标签对象的数组：
        * `<LinkButton><span>xxx</span><span>xxx</span></LinkButton>`
*/
export default function LinkButton (props) {
  return <button className="link-button" {...props}/>
}