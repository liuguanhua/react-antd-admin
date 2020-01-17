import React, { useState, useEffect, useCallback } from 'react'
import ReactMde from 'react-mde'
import * as Showdown from 'showdown'
import Vditor from 'vditor'
import ReactMarkdown from 'react-markdown'
import { message } from 'antd'

import 'react-mde/lib/styles/css/react-mde-all.css'
import 'vditor/dist/index.classic.css'

import { useModal } from '@components/hooks'
import {
  PkgExampleDesc,
  BegetModal,
  MarkdownCodeHighlight
} from '@components/common'

const iconTakeContent =
  '<svg viewBox="64 64 896 896" focusable="false" class="" data-icon="read" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M928 161H699.2c-49.1 0-97.1 14.1-138.4 40.7L512 233l-48.8-31.3A255.2 255.2 0 0 0 324.8 161H96c-17.7 0-32 14.3-32 32v568c0 17.7 14.3 32 32 32h228.8c49.1 0 97.1 14.1 138.4 40.7l44.4 28.6c1.3.8 2.8 1.3 4.3 1.3s3-.4 4.3-1.3l44.4-28.6C602 807.1 650.1 793 699.2 793H928c17.7 0 32-14.3 32-32V193c0-17.7-14.3-32-32-32zM324.8 721H136V233h188.8c35.4 0 69.8 10.1 99.5 29.2l48.8 31.3 6.9 4.5v462c-47.6-25.6-100.8-39-155.2-39zm563.2 0H699.2c-54.4 0-107.6 13.4-155.2 39V298l6.9-4.5 48.8-31.3c29.7-19.1 64.1-29.2 99.5-29.2H888v488zM396.9 361H211.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5zm223.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c0-4.1-3.2-7.5-7.1-7.5H627.1c-3.9 0-7.1 3.4-7.1 7.5zM396.9 501H211.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5zm416 0H627.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5z"></path></svg>'

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true
})

const MarkdownMde = () => {
  const [value, setValue] = useState('')
  const [selectedTab, setSelectedTab] = useState<any>('write')
  return (
    <ReactMde
      value={value}
      onChange={setValue}
      selectedTab={selectedTab}
      onTabChange={setSelectedTab}
      minEditorHeight={300}
      generateMarkdownPreview={markdown => {
        return Promise.resolve(converter.makeHtml(markdown))
      }}
    />
  )
}

const vditorOption: (string | IKeyStringProps)[] = [
  'emoji',
  'headings',
  'bold',
  'italic',
  'strike',
  '|',
  'line',
  'quote',
  'list',
  'ordered-list',
  'check',
  'code',
  'inline-code',
  'undo',
  'redo',
  'upload',
  'link',
  'table',
  'record',
  'both',
  'preview',
  'format',
  'fullscreen',
  'devtools',
  'info',
  'help'
  // 'br'
]

const MarkdownVditor = () => {
  const [isShow, { showModal, hideModal }] = useModal()
  const [vditorHtml, setVditorHtml] = useState()
  const createVditor = useCallback(() => {
    const vditor = new Vditor('contentEditor', {
      toolbar: vditorOption.concat([
        {
          tip: '获取预览区代码',
          name: 'takeContent',
          tipPosition: 'nw',
          icon: iconTakeContent,
          click: () => {
            showModal()
            vditor
              .getHTML()
              .then(code => {
                code = code.trim().replace(/(`|<code>|<\/code>)/g, '')
                const _html = `\`\`\`html${code}`
                setVditorHtml(_html)
              })
              .catch(() => {
                message.warn('获取失败，请重试!')
              })
          }
        }
      ])
    })
  }, [])
  useEffect(() => {
    createVditor()
  }, [])
  return (
    <>
      <div
        id="contentEditor"
        style={{
          minHeight: 340
        }}
      />
      <BegetModal
        title="获取预览区代码"
        visible={isShow}
        onCancel={hideModal}
        footer={null}
      >
        <ReactMarkdown
          source={vditorHtml}
          renderers={{
            code: MarkdownCodeHighlight
          }}
        />
      </BegetModal>
    </>
  )
}

interface IMarkdownEditorProps {}

const markdownInputVditor = `
\`\`\`js
import React, { useEffect } from 'react'
import Vditor from 'vditor'
import 'vditor/dist/index.classic.css'

useEffect(() => {
  new Vditor('contentEditor')
}, [])

return (
  <div
    id="contentEditor"
    style={{
      minHeight: 340
    }}
  />
)
\`\`\`
`

const markdownInputMde = `
\`\`\`js
import React, { useEffect } from 'react'
import ReactMde from 'react-mde'
import * as Showdown from 'showdown'
import 'react-mde/lib/styles/css/react-mde-all.css'

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true
})

export default function App() {
  const [value, setValue] = React.useState('')
  const [selectedTab, setSelectedTab] = React.useState('write')
  return (
    <div className="container">
      <ReactMde
        value={value}
        onChange={setValue}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={markdown =>
          Promise.resolve(converter.makeHtml(markdown))
        }
      />
    </div>
  )
}
\`\`\`
`

const MarkdownEditor: React.FC<IMarkdownEditorProps> = () => {
  return (
    <div layout-flex="auto" className="bg-color-white h-100 pd">
      <div className="mgb">
        <MarkdownVditor />
      </div>
      <PkgExampleDesc
        name="vditor"
        url="https://github.com/b3log/vditor"
        markdownInput={markdownInputVditor}
      />
      <div className="mgb">
        <MarkdownMde />
      </div>
      <PkgExampleDesc
        name="react-mde"
        url="https://github.com/andrerpena/react-mde"
        markdownInput={markdownInputMde}
      />
      <h3>
        推荐其余两款依赖Jquery包的Markdown编辑器：
        <a
          rel="noreferrer noopener"
          href="https://github.com/nhn/tui.editor"
          target="_blank"
          className="mgr"
        >
          tui.editor
        </a>
        <a
          rel="noreferrer noopener"
          href="https://github.com/pandao/editor.md"
          target="_blank"
        >
          editor.md
        </a>
      </h3>
    </div>
  )
}

export default MarkdownEditor
