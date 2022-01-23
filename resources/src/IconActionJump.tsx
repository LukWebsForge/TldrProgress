import { useContext } from 'react'
import { ArrowDownCircle } from '@geist-ui/icons'
import { Link, Popover } from '@geist-ui/core'
import { DataContext } from './Data'

const IconActionJump = (props: { side?: boolean }) => {
  const { data } = useContext(DataContext)

  const content = []
  content.push(
    <Popover.Item key="title" title>
      Jump to
    </Popover.Item>
  )

  if (data?.entries) {
    content.push(
      Object.keys(data?.entries).map((os) => (
        <Popover.Item key={os}>
          <Link href={'#' + os}>{os}</Link>
        </Popover.Item>
      ))
    )
  }

  const placement = props.side ? 'left' : 'bottom'

  return (
    <Popover content={content} trigger="hover" placement={placement} enterDelay={0}>
      <ArrowDownCircle className="cursor-pointer" size={28} />
    </Popover>
  )
}

export { IconActionJump }
