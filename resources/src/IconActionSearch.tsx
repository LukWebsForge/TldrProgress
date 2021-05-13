import {Search} from "@geist-ui/react-icons"
import {Tooltip, useToasts} from "@geist-ui/react"

const IconActionSearch = (props: {side?: boolean}) => {
    const [, setToast] = useToasts()

    const placement = props.side ? 'left' : 'top'

    return <Tooltip text='Search' placement={placement} enterDelay={0}>
        <Search
            className='cursor-pointer'
            size={28}
            onClick={() => setToast({text: 'Use your browser\'s search functionality (Ctrl + F) to search'})}
        />
    </Tooltip>
}

export {IconActionSearch}
