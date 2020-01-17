import React from 'react'

const { publicPath } = window.g_config

interface IIFrameProps {
  src?: string
  title?: string
}

export const IFrame: React.FC<IIFrameProps> = ({ src, title = '嵌入框架' }) => {
  const iFrameHeight = document.body.scrollHeight
  return src ? (
    <iframe
      style={{
        width: '100%',
        height: iFrameHeight,
        overflow: 'visible'
      }}
      title={title}
      src={src}
      width="100%"
      height={iFrameHeight}
      scrolling="no"
      frameBorder="0"
    />
  ) : null
}

export const ViewPdfFile: React.FC<{
  url?: string
}> = ({ url }) => {
  const src = url ? `${publicPath}minified/web/viewer.html?file=${url}` : ''
  return src ? <IFrame src={src} /> : null
}
