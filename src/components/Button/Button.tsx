import React from 'react'
import './Button.css'

type Props = {
  className?: string
  innerText: string
  onClick: () => void
}

export default function Button({ className, innerText, onClick }: Props) {
  return (
    <button className={className ? className : 'button'} onClick={onClick}>
      {innerText}
    </button>
  )
}
