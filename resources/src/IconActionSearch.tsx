import {Search} from "@geist-ui/react-icons"
import {Tooltip, useToasts} from "@geist-ui/react"

const IconActionSearch = () => {
    const [, setToast] = useToasts()

    return <Tooltip text='Search'>
        <Search
            className='cursor-pointer'
            size={28}
            onClick={() => setToast({text: 'Use your browser\'s search functionality (Ctrl + F) to search'})}
        />
    </Tooltip>
}

export {IconActionSearch}
