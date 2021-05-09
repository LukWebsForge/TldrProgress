import {GeistProvider, Page, Text} from "@geist-ui/react";
import {DataFetcher} from "./Data";
import {DataTable} from "./Table";
import {AppLoader} from "./AppLoader";
import {ErrorMessage} from "./ErrorMessage";
import {AppFooter} from "./AppFooter";
import {IconActions} from "./IconActions"
import 'inter-ui/inter.css'
import './App.css'

const App = () =>
    <GeistProvider>
        <Page size='large' style={{minHeight: '1px'}}>
            <Page.Header>
                <Text h1>tldr translation progress</Text>
            </Page.Header>
            <Page.Content>
                <DataFetcher loading={<AppLoader/>} error={<ErrorMessage/>}>
                    <IconActions/>
                    <DataTable/>
                </DataFetcher>
            </Page.Content>
            <Page.Footer style={{position: 'static'}}>
                <AppFooter/>
            </Page.Footer>
        </Page>
    </GeistProvider>;

export {App}
