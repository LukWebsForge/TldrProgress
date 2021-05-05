import * as React from "react";
import {Code, Modal, Note, useModal} from "@geist-ui/react";
import {Info} from "@geist-ui/react-icons";
import {ErrorMessageContext} from "./Data";

const ErrorMessage = () => {
    const error = React.useContext(ErrorMessageContext);
    const {setVisible, bindings} = useModal();

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
    </>;
}

export {ErrorMessage}
