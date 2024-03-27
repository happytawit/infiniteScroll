import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PostBlock from './components/PostBlock/PostBlock'
import { Post } from './types/commonTypes'
import Button from './components/Button/Button'
import './App.css'

function throttle(callee: any, timeout: any) {
  let timer: any = null

  return function perform(...args: any) {
    if (timer) return

    timer = setTimeout(() => {
      callee(...args)

      clearTimeout(timer)
      timer = null
    }, timeout)
  }
}

function App() {
  const [posts, setPosts] = useState<Post[]>([])
  const [searchParams, setSearchParamas] = useSearchParams({
    limit: '5',
  })

  function fetchPosts() {
    fetch(
      `https://jsonplaceholder.typicode.com/posts?_limit=${searchParams.get(
        'limit',
      )}`,
    )
      .then((response) => response.json())
      .then((data) => {
        setPosts(data)
      })
  }

  async function checkPosition() {
    // Нам потребуется знать высоту документа и высоту экрана:
    const height = document.body.offsetHeight
    const screenHeight = window.innerHeight

    // Они могут отличаться: если на странице много контента,
    // высота документа будет больше высоты экрана (отсюда и скролл).

    // Записываем, сколько пикселей пользователь уже проскроллил:
    const scrolled = window.scrollY

    // Обозначим порог, по приближении к которому
    // будем вызывать какое-то действие.
    // В нашем случае — четверть экрана до конца страницы:
    const threshold = height - screenHeight / 4

    // Отслеживаем, где находится низ экрана относительно страницы:
    const position = scrolled + screenHeight

    if (
      position >= threshold &&
      parseInt(searchParams.get('limit') as string, 10) < 25
    ) {
      // Если мы пересекли полосу-порог, вызываем нужное действие.
      // console.log(refLimitValue.current)
      getNewPosts()
    }
  }

  function setNewLimit() {
    setSearchParamas((prev) => {
      const cur: string = prev.get('limit') || ''

      prev.set('limit', String(parseInt(cur, 10) + 5))

      return prev
    })
  }

  function getNewPosts() {
    setNewLimit()
    fetchPosts()
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    const scrollHandler = throttle(checkPosition, 250)

    window.addEventListener('scroll', scrollHandler)

    return () => {
      window.removeEventListener('scroll', scrollHandler)
    }
  }, [])

  // куда правильно вставить скролл вниз?
  useEffect(() => {
    // console.log(posts.length)
    setTimeout(() => {
      if (parseInt(searchParams.get('limit') as string, 10) > 5) {
        // console.log('scrollTo')
        // console.log(document.body.scrollHeight)
        window.scrollTo(0, document.body.scrollHeight)
      }
    }, 1000)
  }, [])

  return (
    <div className="App">
      <div className="wrapper">
        <div className="content">
          {posts.map((post) => {
            return <PostBlock key={post.id} post={post} />
          })}
        </div>
        {parseInt(searchParams.get('limit') as string, 10) >= 10 ||
        parseInt(searchParams.get('limit') as string, 10) < 100 ? (
          <Button
            className="buttonAdd"
            innerText="Загрузить еще"
            onClick={() => {
              getNewPosts()
            }}
          />
        ) : null}
      </div>
    </div>
  )
}

export default App
