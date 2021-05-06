import * as React from "react"
import {useContext} from "react"
import {ArrowDownCircle} from "@geist-ui/react-icons"
import {Link, Popover} from "@geist-ui/react"
import {DataContext} from "./Data"

const IconActionJump = () => {
    const {data} = useContext(DataContext)

    const content = [];
    content.push(<Popover.Item title>Jump to</Popover.Item>)

    if (data?.entries) {
        content.push(Object.keys(data?.entries).map(os =>
            <Popover.Item><Link href={'#' + os}>{os}</Link></Popover.Item>
        ))
    }

    return <Popover content={content} trigger='hover'>
        <ArrowDownCircle className='cursor-pointer' size={28}/>
    </Popover>
};

export {IconActionJump}
