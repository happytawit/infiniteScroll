import React, { useEffect, useState } from 'react'
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
  const [limit, setLimit] = useState<number>(5)
  const [isFetching, setIsFetching] = useState<boolean>(true)

  const [searchParams, setSearchParamas] = useSearchParams({
    limit: '5',
  })

  // console.log(limit2)

  // добавить fetchPosts, избавиться от isFetching
  useEffect(() => {
    if (isFetching) {
      fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}`)
        .then((response) => response.json())
        .then((result) => {
          setPosts(result)
        })
        .finally(() => setIsFetching(false))
    }
  }, [isFetching])

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

    if (position >= threshold) {
      // Если мы пересекли полосу-порог, вызываем нужное действие.
      setLimit((currLimit) => (currLimit <= 10 ? currLimit + 5 : currLimit))
      setIsFetching(true)

      console.log('searchParamas', searchParams)

      const currentValue: string = searchParams.get('limit') || ''
      const newValue = String(parseInt(currentValue, 10) + 5)

      setSearchParamas({ limit: newValue })

      console.log('searchParamas2', searchParams)

      console.log('currentValue, newValue', currentValue, newValue)

      // console.log(searchParams.get('limit'))
      // console.log(searchParams)
      // const limit2: string = searchParams.get('limit') || ''
      // console.log(limit2)
      // setSearchParamas({ limit: String(limit) })
    }
  }

  useEffect(() => {
    console.log('limits in useeffect', searchParams.get('limit'))
  }, [posts])

  useEffect(() => {
    const handler = throttle(checkPosition, 250)

    window.addEventListener('scroll', () => checkPosition())

    return () => {
      document.removeEventListener('scroll', checkPosition)
    }
  }, [])

  return (
    <div className="App">
      <div className="wrapper">
        <div className="content">
          {posts.map((post) => {
            return <PostBlock key={post.id} post={post} />
          })}
        </div>
        {limit >= 10 || limit < 100 ? (
          <Button
            className="buttonAdd"
            innerText="Загрузить еще"
            onClick={() => {
              setLimit((currLimit) => currLimit + 5)
              setIsFetching(true)
            }}
          />
        ) : null}
      </div>
    </div>
  )
}

export default App
