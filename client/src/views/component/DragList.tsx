import React, { useCallback, useState } from 'react'
import { Droppable, DragDropContext, Draggable } from 'react-beautiful-dnd'
import { List, Card } from 'antd'
import { Random } from 'mockjs'

import styles from '@styles/sass/shared/merge.module.scss'

import { BegetThemeContainer } from '@components/common'

const { drag_grid_wrapper, drag_list_wrapper } = styles

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

const reorderQuoteMap = ({ quoteMap, source, destination }) => {
  const current = [...quoteMap[source.droppableId]]
  const next = [...quoteMap[destination.droppableId]]
  const target = current[source.index]

  // moving to same list
  if (source.droppableId === destination.droppableId) {
    const reordered = reorder(current, source.index, destination.index)
    const result = {
      ...quoteMap,
      [source.droppableId]: reordered
    }
    return {
      quoteMap: result
    }
  }

  // moving to different list

  // remove from original
  current.splice(source.index, 1)
  // insert into next
  next.splice(destination.index, 0, target)

  const result = {
    ...quoteMap,
    [source.droppableId]: current,
    [destination.droppableId]: next
  }

  return {
    quoteMap: result
  }
}

const getItems = (count, title, index) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `${index++}`,
    content: `${title}-${k}`,
    title
  }))

const initColumnConfig = {
  规划中: {
    color: '#e0541d'
  },
  实现中: {
    color: '#001629'
  },
  已实现: {
    color: '#ce204f'
  },
  已拒绝: {
    color: '#639'
  }
}
const initColumnKeys = Object.keys(initColumnConfig)
const initData = initColumnKeys.reduce(
  (info, title) => {
    const num = Random.natural(5, 10)
    info.totalNum = info.totalNum || 0
    return {
      ...info,
      [title]: getItems(num, title, info.totalNum),
      totalNum: info.totalNum + num
    }
  },
  {} as {
    totalNum?: number
    title?: string
  }
)

const Column: React.NamedExoticComponent<{
  columnId: string
  data: IKeyStringProps[]
}> = React.memo(({ columnId, data }) => {
  return (
    <Droppable droppableId={columnId}>
      {(provided, snapshot) => {
        return (
          <div
            className={drag_list_wrapper}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {/* 切记不能使用antd List组件，会报警告 */}
            <div className="ant-list ant-list-split">
              {data.map(({ id, title, content }, index) => {
                const { color } = initColumnConfig[title]
                return (
                  <Draggable key={id} draggableId={id} index={index}>
                    {(provided, snapshot) => (
                      <div className="ant-list-item">
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          layout-align="space-between center"
                        >
                          <span
                            style={{
                              color
                            }}
                          >
                            {content}
                          </span>
                          <span className="tr color-dark-gray">
                            id:
                            {id}
                          </span>
                        </div>
                      </div>
                    )}
                  </Draggable>
                )
              })}
            </div>
            {/* <List
              dataSource={data}
              renderItem={(item, index) => (
                <List.Item key={item.id}>
                  <Draggable draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {item.content}
                      </div>
                    )}
                  </Draggable>
                </List.Item>
              )}
            /> */}
            {provided.placeholder}
          </div>
        )
      }}
    </Droppable>
  )
})

interface IDragListProps {}

const DragList: React.FC<IDragListProps> = () => {
  const [quoteMap, setQuoteMap] = useState(initData)
  const onDragEnd = useCallback(
    result => {
      const { source, destination } = result
      // dropped outside the list
      if (!destination) {
        return
      }
      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      ) {
        return
      }
      const newQuoteMap = reorderQuoteMap({ quoteMap, source, destination })
        .quoteMap
      setQuoteMap(newQuoteMap)
    },
    [quoteMap]
  )
  return (
    <div layout-flex="auto" className="bg-color-white h-100 pd">
      <DragDropContext onDragEnd={onDragEnd}>
        <List
          grid={{
            gutter: 16,
            sm: 2,
            xl: 4
          }}
          dataSource={initColumnKeys}
          className={drag_grid_wrapper}
          renderItem={title => {
            const list = quoteMap[title]
            return (
              <BegetThemeContainer showThemeBgColor>
                <List.Item>
                  <Card title={title}>
                    <Column data={list} columnId={title} />
                  </Card>
                </List.Item>
              </BegetThemeContainer>
            )
          }}
        />
      </DragDropContext>
    </div>
  )
}

export default DragList

//ref: https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/patterns/virtual-lists.md
