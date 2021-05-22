import { useContext, useState, Fragment, useEffect } from 'react'
import { Checkbox, Modal, Tooltip, useModal } from '@geist-ui/react'
import { Bookmark } from '@geist-ui/react-icons'
import { useEscClose } from './useEscClose'
import { DataContext, Language } from './Data'

const HighlightCheckboxes = (props: {
  highlighted: Language[]
  onChange: (selected: Language[]) => void
}) => {
  const { data } = useContext(DataContext)

  const checkboxes = data!.languages.map((language) => (
    <Fragment key={language}>
      <Checkbox value={language}>{language}</Checkbox>
      <br />
    </Fragment>
  ))

  return (
    <Checkbox.Group value={props.highlighted} onChange={props.onChange}>
      {checkboxes}
    </Checkbox.Group>
  )
}

const IconActionHighlight = (props: { side?: boolean }) => {
  const { visible, setVisible, bindings } = useModal()
  useEscClose(visible, setVisible)

  // Columns which are being highlighted
  const { highlighted, setHighlighted } = useContext(DataContext)
  // We only want to apply the highlight selection once it has been confirmed, so we create a temporary store
  const [tmpHighlighted, setTmpHighlighted] = useState(Array.from(highlighted))
  // An extra state to begin saving the selection and applying it to the table
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (saving) {
      setHighlighted(tmpHighlighted)
      setVisible(false)
      setSaving(false)
    }
  }, [saving, setHighlighted, setVisible, tmpHighlighted])

  const placement = props.side ? 'left' : 'top'

  return (
    <>
      <Tooltip text="Highlight" enterDelay={0} placement={placement}>
        <Bookmark
          className="cursor-pointer"
          size={28}
          onClick={() => {
            // Populate the temporary storage with the latest data
            setTmpHighlighted(Array.from(highlighted))
            setVisible(true)
          }}
        />
      </Tooltip>
      <Modal {...bindings}>
        <Modal.Title>Highlight columns</Modal.Title>
        <Modal.Subtitle>Choose columns to highlight</Modal.Subtitle>
        <Modal.Content>
          <HighlightCheckboxes
            highlighted={tmpHighlighted}
            onChange={(selected) => setTmpHighlighted(selected)}
          />
        </Modal.Content>
        <Modal.Action
          passive
          onClick={() => {
            setVisible(false)
          }}
        >
          Cancel
        </Modal.Action>
        <Modal.Action
          onClick={() => {
            setSaving(true)
          }}
          loading={saving}
        >
          Save
        </Modal.Action>
      </Modal>
    </>
  )
}

export { IconActionHighlight }
