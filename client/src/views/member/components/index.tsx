import React from 'react'
import Highlighter from 'react-highlight-words'
import { Button, Popconfirm } from 'antd'

import { ColumnProps } from 'antd/lib/table'
import { EUserSex } from '@scripts/types/EnumType'

import { addUseField } from '@scripts/utils'

import { ReactComponent as GradeDiamond } from '@fonts/svg/grade/diamond.svg'
import { ReactComponent as GradePlatinum } from '@fonts/svg/grade/platinum.svg'
import { ReactComponent as GradeGold } from '@fonts/svg/grade/gold.svg'
import { ReactComponent as GradeSilver } from '@fonts/svg/grade/silver.svg'
import { ReactComponent as GradeBronze } from '@fonts/svg/grade/bronze.svg'

const sty_gradeIcon: React.CSSProperties = {
  width: '6em',
  height: '2.5em'
}

const GradeSvgIcon: React.FC<{
  component: React.ComponentType<any>
}> = ({ component: Component }) => <Component {...sty_gradeIcon} />
const UserGrade = (grade: number) => {
  switch (true) {
    case grade >= 80:
      return <GradeSvgIcon component={GradeDiamond} />
    case grade >= 60:
      return <GradeSvgIcon component={GradePlatinum} />
    case grade >= 40:
      return <GradeSvgIcon component={GradeGold} />
    case grade >= 20:
      return <GradeSvgIcon component={GradeSilver} />
    default:
      return <GradeSvgIcon component={GradeBronze} />
  }
}

export type TOperateMemberFunc = (
  value: IKeyStringProps,
  event: React.MouseEvent<HTMLElement>
) => void

export interface IOperateMemberProps {
  onEdit?: TOperateMemberFunc
}

export const memberListColumns = (
  option: IOperateMemberProps & {
    onDelete?: TOperateMemberFunc
    searchData?: IKeyStringProps
  } = {}
) => {
  const { onDelete, onEdit, searchData = {} } = option
  const { name } = searchData
  return addUseField<ColumnProps<{}>>({
    isCenter: true,
    data: [
      {
        dataIndex: 'avatar',
        title: '用户',
        colSpan: 2,
        render(imgSrc, row: IKeyStringProps) {
          return (
            <div className="avatar-thumbnail">
              <img
                className="w-100 h-100 bdr-half"
                src={imgSrc}
                alt={row.userName}
              />
            </div>
          )
        }
      },
      {
        title: '昵称',
        dataIndex: 'nickname',
        colSpan: 0
      },
      {
        title: '等级',
        dataIndex: 'grade',
        render: grade => UserGrade(grade)
      },
      {
        title: '姓名',
        dataIndex: 'name',
        render(text) {
          return (
            <Highlighter
              searchWords={[name]}
              textToHighlight={text}
              autoEscape
              highlightStyle={{
                // backgroundColor: 'transparent',
                color: 'red'
              }}
            />
          )
        }
      },
      {
        title: '性别',
        dataIndex: 'sex',
        render: sex => EUserSex[sex]
      },
      {
        title: '邮箱',
        dataIndex: 'email'
      },
      {
        title: '地址',
        dataIndex: 'address'
      },
      {
        title: '注册时间',
        dataIndex: 'registerTime'
      },
      {
        title: '操作',
        dataIndex: 'opearte',
        width: 154,
        fixed: 'right',
        render(_, record) {
          return (
            <>
              <Button
                {...(onEdit && {
                  onClick: onEdit.bind(null, record)
                })}
                className="mgr"
                type="primary"
              >
                编辑
              </Button>
              <Popconfirm
                title="确定删除？"
                {...(onDelete && {
                  onConfirm: e => onDelete(record, e!)
                })}
              >
                <Button type="danger">删除</Button>
              </Popconfirm>
            </>
          )
        }
      }
    ]
  })
}
