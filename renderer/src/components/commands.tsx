import * as React from "react"
import { IpcRenderer } from "electron";
import Command from "./command";

const electron  = window.require('electron');
let ipcRenderer : IpcRenderer  = electron.ipcRenderer;

interface ICommandsProps {
    commands: any[],
    changeSelectedPaths: Function
}

class Commands extends React.Component<ICommandsProps> {
    state: {
        selectedPaths: any[]
    } = {
        selectedPaths: []
    }

    componentDidMount() {
        document.addEventListener("page:change", () => {
            this.setState({
                selectedPaths: []
            })
        })
    }

    changePath = (path: string, checked: boolean) => {
        let newPaths

        if(checked) {
            console.log(this.state.selectedPaths)
            console.log(path)
            if(!this.state.selectedPaths.includes(path)) {
                newPaths = [...this.state.selectedPaths, path]
                this.setState({
                    selectedPaths: [...this.state.selectedPaths, path]
                })
            }
        }
        else {
            newPaths = this.state.selectedPaths.filter(item => item != path)
            this.setState({
                selectedPaths: this.state.selectedPaths.filter(item => item != path)
            })
        }

        this.props.changeSelectedPaths(newPaths)
    }
    
    render() {
        const left = this.props.commands.filter((item, index) => index % 2 == 0)
        const right = this.props.commands.filter((item, index) => index % 2 != 0)

        return (
            <div className="commands-wrapper">
                <div className="commands">
                    <div className="commands-left">
                        {left.map((item: any, index) =>
                            <Command name={item.name} path={item.path} index={index * 2} changePath={this.changePath} />
                        )}
                    </div>

                    <div className="commands-right">
                        {right.map((item: any, index) =>
                            <Command name={item.name} path={item.path} index={index * 2 + 1} changePath={this.changePath} />
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default Commands