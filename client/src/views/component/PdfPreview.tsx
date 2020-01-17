import * as React from 'react'

import { ViewPdfFile, PkgExampleDesc } from '@components/common'

interface IPdfPreviewProps {}

const markdownInput = `
\`\`\`
提示:
  问题：报错Uncaught (in promise) Error: file origin does not match viewer's
  解决方案：标记一个变量window.PDF_VIEWER_ORIGIN=[window.location.origin]，将此变量合并到pdf.js源码web目录下app.js 1490行HOSTED_VIEWER_ORIGINS中，重新运行gulp minified
\`\`\`
`
const { apiRoot } = window.g_config

const PdfPreview: React.FC<IPdfPreviewProps> = () => {
  return (
    <div layout-flex="auto" className="bg-color-white h-100 pd">
      <PkgExampleDesc
        name="pdf.js"
        markdownInput={markdownInput}
        url="https://github.com/mozilla/pdf.js"
      />
      <ViewPdfFile
        url={`${apiRoot}assets/compressed.tracemonkey-pldi-09.pdf`}
      />
    </div>
  )
}

export default PdfPreview
