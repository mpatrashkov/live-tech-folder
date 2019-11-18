import * as React from "react"
import Button from "./button"
import { IpcRenderer } from "electron";

const electron  = window.require('electron');
let ipcRenderer : IpcRenderer  = electron.ipcRenderer;

interface ICommandProps {
    name: string,
    path: string,
    index: number,
    changePath?: Function
}

class Command extends React.Component<ICommandProps> {
    state = {
        checked: false
    }

    componentDidMount() {
        document.addEventListener("page:change", () => {
            this.setState({
                checked: false
            })
        })
    }

    onCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            checked: e.target.checked
        })

        if(this.props.changePath) {
            this.props.changePath(this.props.path, e.target.checked)
        }
    }

    onClick = () => {
        ipcRenderer.send("exec-command", this.props.path)
    }

    render() {
        return (
            <div className="command">
                <input id={"cmd-checkbox-" + this.props.index} type="checkbox" checked={this.state.checked} onChange={this.onCheck} />
                <label htmlFor={"cmd-checkbox-" + this.props.index}>{this.props.name}</label>
                <Button size="small" text="Run CMD" onClick={this.onClick} />
            </div>
        )
    }
}

export default Command