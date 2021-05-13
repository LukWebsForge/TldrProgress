import {Fragment, useContext, useMemo, useState} from "react"
import {Link, Modal, Pagination, Select, Spacer, Text, Tooltip, useModal} from "@geist-ui/react"
import {Filter} from "@geist-ui/react-icons"
import {DataContext, TranslationData, TranslationStatus} from "./Data"
import {FileAction, tldrPageUrl} from "./tldrPageUrl"
import {useEscClose} from './useEscClose'

enum FilterType {
    Outdated = 'outdated',
    NotTranslated = 'not-translated'
}

type FilterAttributes = { type: FilterType, language: string }

type FilteredPage = { os: string, page: string }

const FilterSelection = (props: { initial: FilterAttributes, onChange: (attributes: FilterAttributes) => void }) => {
    const {data} = useContext(DataContext)
    const [type, setType] = useState(props.initial.type)
    const [language, setLanguage] = useState(props.initial.language)

    const languageOptions = data?.languages.map(lang =>
        <Select.Option value={lang} key={lang}>{lang}</Select.Option>
    ) ?? []

    return <div>
        Show
        <Spacer y={.25} inline={true}/>
        <Select initialValue={props.initial.type} size='small' onChange={(value: FilterType) => {
            setType(value)
            props.onChange({type: value, language: language})
        }}>
            <Select.Option value='outdated' key='outdated'>◇ outdated</Select.Option>
            <Select.Option value='not-translated' key='not-translated'>✗ not translated</Select.Option>
        </Select>
        <Spacer y={.25} inline={true}/>
        pages in the language
        <Spacer y={.25} inline={true}/>
        <Select initialValue={props.initial.language} size='small' onChange={(value: string) => {
            setLanguage(value)
            props.onChange({type: type, language: value})
        }}>
            {languageOptions}
        </Select>
    </div>
}

function filterData(data: TranslationData, filter: FilterAttributes) {
    const filtered: FilteredPage[] = []

    for (let [osName, osStatus] of Object.entries(data.entries ?? {})) {
        for (let [pageName, page] of Object.entries(osStatus.pages)) {
            const status = page.status[filter.language]

            let add = false
            switch (filter.type) {
                case FilterType.Outdated:
                    add = status === TranslationStatus.Outdated
                    break
                case FilterType.NotTranslated:
                    add = !status
                    break
            }

            if (add) filtered.push({os: osName, page: pageName})
        }
    }

    return filtered
}

const FilteredPageList = (props: { attributes: FilterAttributes, pages: FilteredPage[] }) => {
    let action: FileAction
    let empty: string
    switch (props.attributes.type) {
        case FilterType.NotTranslated:
            action = FileAction.CREATE
            empty = "✓ all pages are translated"
            break
        case FilterType.Outdated:
            action = FileAction.VIEW
            empty = "✓ all translated pages are up-to-date"
            break
    }

    const elements = props.pages.map(page =>
        <Fragment key={page.os + '/' + page.page}>
            <Link color href={tldrPageUrl(action, page.os, page.page, props.attributes.language)} target='_blank'>
                {page.os}/{page.page}
            </Link>
            <br/>
        </Fragment>
    )

    return <Text p style={{minHeight: '25rem'}}>
        {props.pages.length > 0 ? elements : empty}
    </Text>
}

const FilteredData = (props: { attributes: FilterAttributes }) => {
    const initialPage = 1
    const elementsPerPage = 20

    const {data} = useContext(DataContext)
    const filtered = useMemo(
        () => filterData(data!, props.attributes),
        [data, props.attributes]
    )
    const [pageNumber, setPageNumber] = useState(initialPage)

    return <>
        <FilteredPageList
            attributes={props.attributes}
            pages={filtered.slice((pageNumber - 1) * elementsPerPage, pageNumber * elementsPerPage)}
        />
        <Pagination
            count={Math.ceil(filtered.length / elementsPerPage)}
            initialPage={initialPage}
            onChange={(page: number) => setPageNumber(page)}
        />
    </>
}

const FilterUI = () => {
    const initialAttributes: FilterAttributes = {type: FilterType.Outdated, language: 'en'}
    const [attributes, setAttributes] = useState(initialAttributes)

    return <>
        <FilterSelection initial={initialAttributes} onChange={attributes => setAttributes(attributes)}/>
        {/* The key property is important to start the pagination for every selection at the first page */}
        <FilteredData attributes={attributes} key={attributes.type + '-' + attributes.language}/>
    </>
}

const IconActionFilter = (props: {side?: boolean}) => {
    const {visible, setVisible, bindings} = useModal()
    useEscClose(visible, setVisible)

    const placement = props.side ? 'left' : 'top'

    return <>
        <Tooltip text='Filter' placement={placement} enterDelay={0}>
            <Filter className='cursor-pointer' size={28} onClick={() => setVisible(true)}/>
        </Tooltip>
        <Modal {...bindings} width='800px'>
            <Modal.Title>Filter</Modal.Title>
            <Modal.Content>
                <FilterUI/>
            </Modal.Content>
        </Modal>
    </>
}

export {IconActionFilter}
