import { Search } from '@geist-ui/icons'
import { Keyboard, Tooltip, useToasts } from '@geist-ui/core'
import { isIOS, isMacOs } from 'react-device-detect'

const IconActionSearch = (props: { side?: boolean }) => {
  const { setToast } = useToasts()

  const placement = props.side ? 'left' : 'top'
  const hotkey = isIOS || isMacOs ? <Keyboard command>f</Keyboard> : <>(ctrl + f)</>
  const toastText = <div>Use your browser's search functionality {hotkey} to search</div>

  return (
    <Tooltip text="Search" placement={placement} enterDelay={0}>
      <Search
        className="cursor-pointer"
        size={28}
        onClick={() => {
          setToast({ text: toastText })
        }}
      />
    </Tooltip>
  )
}

export { IconActionSearch }
