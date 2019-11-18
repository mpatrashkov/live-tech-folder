import * as React from "react"
import Button from "./button"

interface IFooter {
    refresh: Function,
    runSelected: Function,
    runAll: Function
}

class Footer extends React.Component<IFooter> {
    render() {
        return (
            <div className="footer">
                <div className="footer-actions">
                    <Button text="Run Selected" onClick={() => this.props.runSelected()} />
                    <Button text="Run All" onClick={() => this.props.runAll()} />
                </div>
                <div className="footer-notice">
                    ** USE OF THIS PROGRAM HAS BEEN DESIGNED FOR LIVE-TECH STAFF USE ONLY - IF YOU FIND THIS PROGRAM BEING USED BY NON-LIVE-TECH AUTHORIZED TECHS PLEASE DELETE IT - THIS PROGRAM COULD DAMAGE A COMPUTER IF USED BY OTHERS
                </div>
            </div>
        )
    }
}

export default Footer;