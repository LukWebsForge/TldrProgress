import * as React from "react"
import {Filter} from "@geist-ui/react-icons"
import {Tooltip} from "@geist-ui/react"


const IconActionFilter = () => {
    return <Tooltip text='Filter'>
        <Filter className='cursor-pointer' size={28}/>
    </Tooltip>
};

export {IconActionFilter}
