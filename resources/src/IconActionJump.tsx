import {useContext} from "react"
import {ArrowDownCircle} from "@geist-ui/react-icons"
import {Link, Popover} from "@geist-ui/react"
import {DataContext} from "./Data"

const IconActionJump = (props: {side?: boolean}) => {
    const {data} = useContext(DataContext)

    const content = []
    content.push(<Popover.Item title key='title'>Jump to</Popover.Item>)

    if (data?.entries) {
        content.push(Object.keys(data?.entries).map(os =>
            <Popover.Item key={os}><Link href={'#' + os}>{os}</Link></Popover.Item>
        ))
    }

    const placement = props.side ? 'left' : 'bottom'

    return <Popover content={content} trigger='hover' placement={placement} enterDelay={0}>
        <ArrowDownCircle className='cursor-pointer' size={28}/>
    </Popover>
}

export {IconActionJump}
