import {useContext} from "react"
import {Code, Modal, Note, useModal} from "@geist-ui/react"
import {Info} from "@geist-ui/react-icons"
import {DataContext} from "./Data"
import {useEscClose} from './useEscClose'

const ErrorMessage = () => {
    const {error} = useContext(DataContext)
    const {visible, setVisible, bindings} = useModal()
    useEscClose(visible, setVisible)

    return <>
        <Note type='error'>
            Can't fetch the translation progress data from GitHub
            <span style={{verticalAlign: 'middle', cursor: 'pointer'}}>
                {' '} <Info size={16} onClick={() => setVisible(true)}/>
            </span>
        </Note>
        <Modal {...bindings} width='50rem'>
            <Modal.Title>Error</Modal.Title>
            <Modal.Subtitle>Can't fetch the data from GitHub</Modal.Subtitle>
            <Modal.Content style={{overflow: 'auto'}}>
                <Code block width='100%'>{error}</Code>
            </Modal.Content>
        </Modal>
    </>
}

export {ErrorMessage}
