import React from 'react'

interface ITipsProps {
  text?: string
}

const TipsWrapContent: React.FC<ITipsProps> = ({ children, text }) => (
  <div className="tc">{children || text || '暂无数据!'}</div>
)
export default TipsWrapContent
