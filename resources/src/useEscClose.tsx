import {useKeyPress} from './useKeyPress'

function useEscClose(visible: boolean, setVisible: (value: boolean) => void) {
    useKeyPress('Escape',
        visible ?
            () => setVisible(false) :
            undefined
    )
}

export {useEscClose}
