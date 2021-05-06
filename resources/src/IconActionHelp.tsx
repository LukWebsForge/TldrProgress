import * as React from "react"
import {HelpCircle} from "@geist-ui/react-icons"
import {Modal, Text, Tooltip, useModal} from "@geist-ui/react"

const IconActionHelp = () => {
    const {setVisible, bindings} = useModal()

    return <>
        <Tooltip text='Help'>
            <HelpCircle className='cursor-pointer' size={28} onClick={() => setVisible(true)}/>
        </Tooltip>
        <Modal {...bindings} width='1000px'>
            <Modal.Title>Information</Modal.Title>
            <Modal.Subtitle>about this project</Modal.Subtitle>
            <Modal.Content>
                <Text h3>the tldr-pages project</Text>
                <Text p>...</Text>
                <Text h3>this website</Text>
                <Text p>...</Text>
                <Text h3>legend</Text>
                <Text p>...</Text>
                <Text h3>icons</Text>
                <Text p>...</Text>
                <Text h3>ideas?</Text>
                <Text p>...</Text>
            </Modal.Content>
        </Modal>
    </>
};

export {IconActionHelp}
