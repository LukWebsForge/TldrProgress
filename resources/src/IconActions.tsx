import {Grid} from "@geist-ui/react"
import {IconActionHelp} from "./IconActionHelp"
import {IconActionJump} from "./IconActionJump"
import {IconActionFilter} from "./IconActionFilter"
import {IconActionSearch} from "./IconActionSearch"

const IconActions = () => {
    return <Grid.Container gap={2} justify='space-between'>
        <Grid><IconActionHelp/></Grid>
        <Grid>
            <IconActionJump/>
            <IconActionFilter/>
            <IconActionSearch/>
        </Grid>
    </Grid.Container>
}

export {IconActions}
