import * as React from "react"
import Button from "./button"

import logo from "../logo.png"

import { IpcRenderer } from "electron";

const electron  = window.require('electron');
let ipcRenderer : IpcRenderer  = electron.ipcRenderer;

interface IHeaderProps {
    changePage: Function
}

class Header extends React.Component<IHeaderProps> {
    uploadFile = () => {
        ipcRenderer.send("uploadFile")
    }

    render() {
        return (
            <div className="header">
                <div className="header-row">
                    <img src={logo} className="header-logo"/>
                    <div className="header-upload-wrapper">
                        <div onClick={this.uploadFile} className="header-upload">Upload Scripts & Programs</div>
                    </div>
                </div>
                <div className="header-actions">
                    <Button size="normal" text="Commands" onClick={() => this.props.changePage(0)} />
                    <Button size="normal" text="PowerShell" onClick={() => this.props.changePage(1)} />
                    <Button size="normal" text="Programs" onClick={() => this.props.changePage(2)} />
                </div>
            </div>
        )
    }
}

export default Header