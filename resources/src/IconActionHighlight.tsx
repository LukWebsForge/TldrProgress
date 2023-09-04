import { useContext, useState } from 'react'
import { Button, Checkbox, Grid, Modal, Text, Tooltip, useModal } from '@geist-ui/core'
import { MessageCircle, Save } from '@geist-ui/icons'
import { useEscClose } from './useEscClose'
import { DataContext, Language } from './Data'

const HighlightCheckboxes = (props: {
  highlighted: Language[]
  onChange: (selected: Language[]) => void
}) => {
  const { data } = useContext(DataContext)

  const checkboxes = data!.languages.map((language) => (
    <Grid key={language} xs={6}>
      <Checkbox value={language} disabled={language === 'en'}>
        {language}
      </Checkbox>
    </Grid>
  ))

  return (
    <Checkbox.Group value={props.highlighted} onChange={props.onChange}>
      <Grid.Container justify="flex-start" gap={0.5}>
        {checkboxes}
      </Grid.Container>
    </Checkbox.Group>
  )
}

const SelectHighlights = (props: {}) => {
  // Columns which are being highlighted
  const { highlighted, setHighlighted } = useContext(DataContext)
  // We only want to apply the highlight selection once it has been confirmed, so we create a temporary store
  const [tmpHighlighted, setTmpHighlighted] = useState(Array.from(highlighted))

  return (
    <>
      <Text h3>Select languages to show</Text>
      <br />
      <HighlightCheckboxes
        highlighted={tmpHighlighted}
        onChange={(selected) => setTmpHighlighted(selected)}
      />
      <br />
      <Button auto type="secondary" icon={<Save />} onClick={() => setHighlighted(tmpHighlighted)}>
        Continue
      </Button>
    </>
  )
}

const IconActionHighlight = (props: { side?: boolean }) => {
  const { visible, setVisible, bindings } = useModal()
  useEscClose(visible, setVisible)

  // Columns which are being highlighted
  const { highlighted, setHighlighted } = useContext(DataContext)
  // We only want to apply the highlight selection once it has been confirmed, so we create a temporary store
  const [tmpHighlighted, setTmpHighlighted] = useState(Array.from(highlighted))

  const placement = props.side ? 'left' : 'top'

  return (
    <>
      <Tooltip text="Languages" enterDelay={0} placement={placement}>
        <MessageCircle
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
        <Modal.Title>Select Languages</Modal.Title>
        <Modal.Subtitle>Choose languages to display</Modal.Subtitle>
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
            setVisible(false)
            setHighlighted(tmpHighlighted)
          }}
        >
          Save
        </Modal.Action>
      </Modal>
    </>
  )
}

export { IconActionHighlight, SelectHighlights }
