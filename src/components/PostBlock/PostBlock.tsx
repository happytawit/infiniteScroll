import React from 'react'
import { Post } from '../../types/commonTypes'
import './PostBlock.css'

type Props = {
  post: Post
}

export default function PostBlock({ post }: Props) {
  return (
    <div className="postBlock">
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      <span>Post number {post.id}</span>
    </div>
  )
}
