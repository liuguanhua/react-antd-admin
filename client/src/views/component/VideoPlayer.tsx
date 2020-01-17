import React, { useCallback, useRef, useState } from 'react'
import { Row, Col, Button } from 'antd'
import { Player, BigPlayButton, ControlBar } from 'video-react'

import 'video-react/dist/video-react.css'
import { PkgExampleDesc } from '@components/common'

const { publicPath } = window.g_config

const markdownInput = `
\`\`\`js
import React from 'react';
import { Player } from 'video-react';

import 'video-react/dist/video-react.css'

export default () => {
  return (
    <Player
      playsInline
      poster="/assets/poster.png"
      src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
    >
      <BigPlayButton position="center" />
    </Player>
  );
};
\`\`\`
`
const sources = {
  sintelTrailer: 'http://media.w3.org/2010/05/sintel/trailer.mp4',
  bunnyTrailer: 'http://media.w3.org/2010/05/bunny/trailer.mp4',
  bunnyMovie: 'http://media.w3.org/2010/05/bunny/movie.mp4',
  test: 'http://media.w3.org/2010/05/video/movie_300.webm'
}

const VideoPlayer: React.FC = () => {
  const [info, setInfo] = useState({
    source: sources.bunnyMovie
  })
  const { source } = info
  const refPlayer = useRef<IKeyStringProps>({})
  const execDirect = useCallback((direct: string) => {
    return () => {
      const { current } = refPlayer
      current[direct] && current[direct]()
    }
  }, [])
  const changeCurrentTime = useCallback((seconds: number) => {
    return () => {
      const { current } = refPlayer
      const { player } = current.getState()
      current.seek(player.currentTime + seconds)
    }
  }, [])
  const seek = (seconds: number) => {
    return () => {
      refPlayer.current.seek(seconds)
    }
  }
  const changePlaybackRateRate = useCallback(steps => {
    return () => {
      const { current } = refPlayer
      const { player } = current.getState()
      refPlayer.current.playbackRate = player.playbackRate + steps
    }
  }, [])
  const changeVolume = useCallback(steps => {
    return () => {
      const { current } = refPlayer
      const { player } = current.getState()
      refPlayer.current.volume = player.volume + steps
    }
  }, [])
  const setMuted = useCallback(muted => {
    return () => {
      refPlayer.current.muted = muted
    }
  }, [])
  const changeSource = useCallback(name => {
    return () => {
      setInfo(v => ({
        ...v,
        source: sources[name]
      }))
      refPlayer.current.load()
    }
  }, [])
  return (
    <div layout-flex="auto" className="bg-color-white h-100 pd">
      <Row gutter={16}>
        <Col className="mgb" xl={14}>
          <Player
            ref={refPlayer}
            playsInline
            poster={`${publicPath}static/poster.png`}
          >
            <source src={source} />
            <ControlBar autoHide={false} />
            <BigPlayButton position="center" />
          </Player>
        </Col>
        <Col xl={10}>
          <h3>视频(播放、暂停、重载)</h3>
          <Button
            className="mgb mgr"
            type="primary"
            shape="round"
            onClick={execDirect('play')}
          >
            play()
          </Button>
          <Button
            className="mgb mgr"
            type="primary"
            shape="round"
            onClick={execDirect('pause')}
          >
            pause()
          </Button>
          <Button
            className="mgb mgr"
            type="primary"
            shape="round"
            onClick={execDirect('load')}
          >
            load()
          </Button>
          <h3>按时间索引播放</h3>
          <Button className="mgb mgr" onClick={changeCurrentTime(10)}>
            currentTime += 10
          </Button>
          <Button className="mgb mgr" onClick={changeCurrentTime(-10)}>
            currentTime -= 10
          </Button>
          <Button className="mgb mgr" onClick={seek(50)}>
            currentTime = 50
          </Button>
          <h3>设置或返回视频播放速度</h3>
          <Button
            className="mgb mgr"
            type="dashed"
            onClick={changePlaybackRateRate(1)}
          >
            playbackRate++
          </Button>
          <Button
            className="mgb mgr"
            type="dashed"
            onClick={changePlaybackRateRate(-1)}
          >
            playbackRate--
          </Button>
          <Button
            className="mgb mgr"
            type="dashed"
            onClick={changePlaybackRateRate(0.1)}
          >
            playbackRate+=0.1
          </Button>
          <Button
            className="mgb mgr"
            type="dashed"
            onClick={changePlaybackRateRate(-0.1)}
          >
            playbackRate-=0.1
          </Button>
          <h3>设置或返回(视频的音量、是否将视频静音)</h3>
          <Button className="mgb mgr" type="danger" onClick={changeVolume(0.1)}>
            volume+=0.1
          </Button>
          <Button
            className="mgb mgr"
            type="danger"
            onClick={changeVolume(-0.1)}
          >
            volume-=0.1
          </Button>
          <Button className="mgb mgr" type="danger" onClick={setMuted(true)}>
            muted=true
          </Button>
          <Button className="mgb mgr" type="danger" onClick={setMuted(false)}>
            muted=false
          </Button>
          <h3>更新视频源</h3>
          <Button
            className="mgb mgr"
            type="link"
            onClick={changeSource('sintelTrailer')}
          >
            Sintel teaser
          </Button>
          <Button
            className="mgb mgr"
            type="link"
            onClick={changeSource('bunnyTrailer')}
          >
            Bunny trailer
          </Button>
          <Button
            className="mgb mgr"
            type="link"
            onClick={changeSource('bunnyMovie')}
          >
            Bunny movie
          </Button>
          <Button type="link" onClick={changeSource('test')}>
            Test movie
          </Button>
        </Col>
        <Col xl={24}>
          <PkgExampleDesc
            name="video-react"
            url="https://github.com/video-react/video-react/"
            markdownInput={markdownInput}
          />
        </Col>
      </Row>
    </div>
  )
}
export default VideoPlayer
