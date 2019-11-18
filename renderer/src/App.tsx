import React from 'react';
import { IpcRenderer, IpcMessageEvent } from 'electron';
import Header from './components/header';
import Commands from './components/commands';
import Footer from './components/footer';

const electron  = window.require('electron') ;  // require electron like this in all the files. Don't Use import from 'electron' syntax for importing IpcRender from electron.
let ipcRenderer : IpcRenderer  = electron.ipcRenderer ; 

class App extends React.Component {
    state: {
        commands: any[],
        powerShell: any[],
        programs: any[],

        selectedPaths: any[],
        currentPage: number
    } = {
        commands: [],
        powerShell: [],
        programs: [],

        selectedPaths: [],
        currentPage: 0
    }

    constructor(props: any) {
        super(props)

        ipcRenderer.on("log", (event: any, data: any) => {
            console.log("Log:" + data)
        })

        ipcRenderer.on("commands", (event: any, files: any[]) => {
            console.log(files)
            this.setState({
                commands: files
            })
        })

        ipcRenderer.on("powershell", (event: any, files: any[]) => {
            console.log(files)
            this.setState({
                powerShell: files
            })
        })

        ipcRenderer.on("programs", (event: any, files: any[]) => {
            console.log(files)
            this.setState({
                programs: files
            })
        })

        ipcRenderer.send("getCommands")
    }

    changeSelectedPaths = (selectedPaths: any[]) => {
        console.log(selectedPaths)
        this.setState({
            selectedPaths: selectedPaths
        })
    }

    refresh = () => {
        ipcRenderer.send("getCommands")
    }

    runSelected = () => {
        console.log(this.state)
        ipcRenderer.send("runMultiple", this.state.selectedPaths)
    }

    runAll = () => {
        ipcRenderer.send("runMultiple", this.getFilesFromPage().map(item => item.path))
    }

    getFilesFromPage = () => {
        switch(this.state.currentPage) {
            case 0: return this.state.commands
            case 1: return this.state.powerShell
            case 2: return this.state.programs
            default: return this.state.commands
        }
    }

    changePage = (page: number) => {
        if(this.state.currentPage != page) {
            let event = new Event("page:change")
            document.dispatchEvent(event)

            this.setState({
                currentPage: page,
                selectedPaths: []
            })
        }
    }

    getPage = () => {
        switch(this.state.currentPage) {
            case 0: return <Commands commands={this.state.commands} changeSelectedPaths={this.changeSelectedPaths} />
            case 1: return <Commands commands={this.state.powerShell} changeSelectedPaths={this.changeSelectedPaths} />
            case 2: return <Commands commands={this.state.programs} changeSelectedPaths={this.changeSelectedPaths} />
        }
    }

    render() {
        return (
            <div className="App">
                <Header changePage={this.changePage} />
                {this.getPage()}
                <Footer refresh={this.refresh} runSelected={this.runSelected} runAll={this.runAll} />
            </div>
        )
    }
}

export default App;
