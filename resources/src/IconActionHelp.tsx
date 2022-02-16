import { useContext } from 'react'
import { ArrowDownCircle, Bookmark, Filter, HelpCircle, Moon, Search, Sun } from '@geist-ui/icons'
import { Link, Modal, Text, Tooltip, useModal } from '@geist-ui/core'
import { DataContext } from './Data'
import { useEscClose } from './useEscClose'

const UpdateTime = () => {
  const { data } = useContext(DataContext)
  return <span>{data?.last_update}</span>
}

const HelpContent = () => (
  <>
    <Text h3>the tldr-pages project</Text>
    <Text p>
      The{' '}
      <Link icon href="https://tldr.sh/" target="_blank">
        tldr-pages project
      </Link>{' '}
      provides a collection of community-maintained help pages for command-line tools.
    </Text>
    <Text h3>this website</Text>
    <Text p>
      The main feature of this website is a table which lists the translation status for all tldr
      pages. You can click every status icon (legend) and you'll be taken to the respective page on
      GitHub or to a dialogue to create a new one.
    </Text>
    <Text p>
      The pages are grouped by operating system and are sorted in alphabetical order. Each blue row
      marks the start of the next group and shows its percentage of pages translated (an outdated
      page counts as translated).
    </Text>
    <Text p>
      The underlying dataset is based on the{' '}
      <Link icon href="https://github.com/tldr-pages/tldr" target="_blank">
        main
      </Link>
      branch of the tldr-pages/tldr repository and is scheduled to be updated every day at midnight
      (UTC). The last update was performed on <UpdateTime />.
    </Text>
    <Text h3>actions</Text>
    <Text p>
      <HelpCircle size={20} className="vertical-align-icons" /> - get help (this page) <br />
      <Moon size={20} className="vertical-align-icons" /> - switch to the dark mode <br />
      <Sun size={20} className="vertical-align-icons" /> - switch to the light mode <br />
      <ArrowDownCircle size={20} className="vertical-align-icons" /> - jump to a section of an
      operating system <br />
      <Filter size={20} className="vertical-align-icons" /> - filter for not yet translated or
      outdated pages in a given language <br />
      <Bookmark size={20} className="vertical-align-icons" /> - select preferred columns to be
      highlighted <br />
      <Search size={20} className="vertical-align-icons" /> - information on how to search the table{' '}
      <br />
    </Text>
    <Text h3>legend</Text>
    <Text p>
      ✓ - up-to-date translation (or source) <br />
      <span className="small-font">◇</span> - outdated translation <br />
      ✗ - not yet translated <br />
    </Text>
    <Text h3>ideas?</Text>
    <Text p>
      Feel free to drop an issue or even a pull request at the{' '}
      <Link icon href="https://github.com/LukWebsForge/TldrProgress" target="_blank">
        tldr progress
      </Link>
      repository.
    </Text>
  </>
)

const IconActionHelp = () => {
  const { visible, setVisible, bindings } = useModal()
  useEscClose(visible, setVisible)

  return (
    <>
      <Tooltip text="Help" enterDelay={0}>
        <HelpCircle
          className="cursor-pointer"
          size={28}
          onClick={() => {
            setVisible(true)
          }}
        />
      </Tooltip>
      <Modal {...bindings} width="1000px">
        <Modal.Title>Information</Modal.Title>
        <Modal.Subtitle>about this project</Modal.Subtitle>
        <Modal.Content>
          <HelpContent />
        </Modal.Content>
      </Modal>
    </>
  )
}

export { IconActionHelp }
