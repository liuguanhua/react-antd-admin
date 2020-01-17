import * as React from 'react'

import styles from '@styles/sass/page/login.module.scss'

const { logo, name } = window.g_config
const { login_logo } = styles

interface IFormLogoProps {
  welcomeContent?: React.ReactNode
}

const FormLogo: React.FC<IFormLogoProps> = ({ welcomeContent = '登录' }) => {
  return (
    <>
      {/* <h3>欢迎{welcomeContent}</h3> */}
      <div className={`tc ${login_logo}`}>
        <img alt="logo" className="logo" src={logo} title={name} />
        <span className="font-size-md font-weight-bold">{name}</span>
      </div>
    </>
  )
}

export default FormLogo
