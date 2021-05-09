import {useContext} from "react"
import {ArrowDownCircle, Filter, HelpCircle, Search} from "@geist-ui/react-icons"
import {Link, Modal, Text, Tooltip, useModal} from "@geist-ui/react"
import {DataContext} from "./Data"

const UpdateTime = () => {
    const {data} = useContext(DataContext)
    return <span>{data?.last_update}</span>
}

const HelpContent = () => <>
    <Text h3>the tldr-pages project</Text>
    <Text p>
        The <Link icon href='https://tldr.sh/' target='_blank'>tldr-pages project</Link> provides a
        collection of community-maintained help pages for command-line tools.
    </Text>
    <Text h3>this website</Text>
    <Text p>
        The main feature of this website is a table which lists the status of translation for all tldr pages.
        You can click every status icon (legend) and you'll be taken to the respective page on GitHub or to a
        dialogue to create a new one.
    </Text>
    <Text p>
        The pages are grouped by operating system and are sorted in alphabetical order.
        The blue rows mark a new group for an operating system and
        show the percentage of pages translated in this group (an outdated page still counts as translated).
    </Text>
    <Text p>
        The underlying dataset is based on
        the <Link icon href='https://github.com/tldr-pages/tldr/' target='_blank'>main</Link>
        branch of tldr-pages repository and is scheduled to be updated every day at 0am UTC.
        The last update was performed on <UpdateTime/>.
    </Text>
    <Text h3>actions</Text>
    <Text p>
        <HelpCircle size={20} className='vertical-algin-icons'/> -
        get help (this page) <br/>
        <ArrowDownCircle size={20} className='vertical-algin-icons'/> -
        jump to a section of an operating system <br/>
        <Filter size={20} className='vertical-algin-icons'/> -
        filter for not yet translated or outdated pages in a given language <br/>
        <Search size={20} className='vertical-algin-icons'/> -
        information on how to search the table <br/>
    </Text>
    <Text h3>legend</Text>
    <Text p>
        ✓ - up-to-date translation (or source) <br/>
        <span className="small-font">◇</span> - outdated translation <br/>
        ✗ - not yet translated <br/>
    </Text>
    <Text h3>ideas?</Text>
    <Text p>
        Feel free to drop an issue or even a pull request at
        the <Link icon href='https://github.com/LukWebsForge/TldrProgress' target='_blank'>tldr progress</Link>
        repository.
    </Text>
</>

const IconActionHelp = () => {
    const {setVisible, bindings} = useModal()

    return <>
        <Tooltip text='Help'>
            <HelpCircle className='cursor-pointer' size={28} onClick={() => setVisible(true)}/>
        </Tooltip>
        <Modal {...bindings} width='800px'>
            <Modal.Title>Information</Modal.Title>
            <Modal.Subtitle>about this project</Modal.Subtitle>
            <Modal.Content>
                <HelpContent/>
            </Modal.Content>
        </Modal>
    </>
}

export {IconActionHelp}
