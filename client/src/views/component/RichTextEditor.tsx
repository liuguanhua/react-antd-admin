import React, { useState, useCallback, useMemo } from 'react'
import { Icon } from 'antd'
import BraftEditor, { ExtendControlType } from 'braft-editor'
import ReactQuill from 'react-quill'
import { isObject, isArray, isString } from 'util'

import 'braft-editor/dist/index.css'
import 'react-quill/dist/quill.snow.css'

import { PkgExampleDesc, BegetModal } from '@components/common'
import { useModal } from '@components/hooks'

function createMarkup(html: string) {
  return { __html: html }
}

const BraftEditorDemo: React.FC = () => {
  const [isShow, { showModal, hideModal }] = useModal()
  const [editorData, setEditorData] = useState(
    BraftEditor.createEditorState(null)
  )
  const [htmlData, setHtmlData] = useState()
  const onPreview = useCallback(
    () => {
      const editorHtml = editorData.toHTML()
      setHtmlData(createMarkup(editorHtml))
      showModal()
    },
    [editorData]
  )
  const extendControls: ExtendControlType[] = [
    {
      key: 'custom-button',
      type: 'button',
      text: '预览',
      onClick: onPreview
    }
  ]
  return (
    <>
      <BraftEditor
        style={{
          border: '1px solid rgba(0, 0, 0, 0.2)'
        }}
        value={editorData}
        extendControls={extendControls}
        contentStyle={{ height: 300 }}
        onChange={value => setEditorData(value)}
      />
      <BegetModal
        visible={isShow}
        title="效果预览"
        footer={null}
        onCancel={hideModal}
        size="large"
      >
        <div dangerouslySetInnerHTML={htmlData} />
      </BegetModal>
    </>
  )
}

const toolbarOption = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }, { align: [] }], // text direction

  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],

  ['link', 'image', 'video'],
  ['clean']
]

const QuillToolbarNode: React.FC<{
  data?: (string | IKeyStringProps)[]
}> = ({ data = [] }) => {
  return (
    <span className="ql-formats">
      {data.reduce(
        (nodeList, item) => {
          if (isObject(item)) {
            for (const [k, v] of Object.entries(item)) {
              const clsName = `ql-${k}`
              nodeList = nodeList.concat(
                isArray(v) ? (
                  <select key={k} className={clsName} />
                ) : (
                  <button key={`${k}${v}`} className={clsName} value={v} />
                )
              )
            }
          }
          if (isString(item)) {
            nodeList = nodeList.concat(
              <button key={item} className={`ql-${item}`} />
            )
          }
          return nodeList
        },
        [] as React.ReactNode[]
      )}
    </span>
  )
}

export const QuillToolbar: React.FC<{
  onPreview?: () => void
}> = ({ onPreview }) => {
  const ToolbarNode = useMemo(() => {
    return toolbarOption.map((item, key) => (
      <QuillToolbarNode key={key} data={item} />
    ))
  }, [])
  return (
    <div id="toolbar">
      {ToolbarNode}
      <span className="ql-formats">
        <button
          {...onPreview && {
            onClick: onPreview
          }}
          key="eye"
          className="ql-eye"
        >
          <Icon className="font-size-xl font-weight-bold" type="eye" />
        </button>
      </span>
    </div>
  )
}
//通过操作DOM的方式参考：https://quannt.github.io/programming/javascript/2017/05/11/adding-custom-toolbar-react-quill.html
const quillModules = {
  toolbar: {
    container: '#toolbar'
  },
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false
  }
}

const ReactQuillDemo: React.FC = () => {
  const [isShow, { showModal, hideModal }] = useModal()
  const [editorData, setEditorData] = useState('')
  const handleChange = useCallback(value => {
    setEditorData(value)
  }, [])
  const onPreview = useCallback(() => {
    showModal()
  }, [])
  return (
    <>
      <QuillToolbar onPreview={onPreview} />
      <ReactQuill
        modules={quillModules}
        value={editorData}
        className="quill-wrapper"
        onChange={handleChange}
      />
      <BegetModal
        visible={isShow}
        title="效果预览"
        footer={null}
        onCancel={hideModal}
        size="large"
      >
        <div dangerouslySetInnerHTML={createMarkup(editorData)} />
      </BegetModal>
    </>
  )
}

const markdownInput = `
\`\`\`js
import 'braft-editor/dist/index.css'
import React, { useCallback } from 'react'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'

export default () => {
  const [editorData, setEditorData] = useState(
    BraftEditor.createEditorState(null)
  )
  const handleChange = useCallback(value => {
    setEditorData(value)
  }, [])
  return <BraftEditor value={editorData} onChange={handleChange} />
}
\`\`\`
`
const markdownInputQuill = `
\`\`\`js
import React, { useState, useCallback } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export default () => {
  const [editorData, setEditorData] = useState('')
  const handleChange = useCallback(value => {
    setEditorData(value)
  }, [])
  return (
    <ReactQuill
      modules={{
        toolbar:  [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          ['image', 'code-block']
        ]
      }}
      value={editorData}
      onChange={handleChange}
    />
  )
}
\`\`\`
`

export default () => {
  return (
    <div layout-flex="auto" className="bg-color-white h-100 pd">
      <div className="mgb">
        <BraftEditorDemo />
      </div>
      <PkgExampleDesc
        name="braft-editor"
        url="https://github.com/margox/braft-editor/"
        markdownInput={markdownInput}
      />
      <div className="mgb">
        <ReactQuillDemo />
      </div>
      <PkgExampleDesc
        name="react-quill"
        url="https://github.com/zenoamaro/react-quill/"
        markdownInput={markdownInputQuill}
      />
    </div>
  )
}
