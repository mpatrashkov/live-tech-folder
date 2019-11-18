import * as React from "react"

interface IButtonProps {
    text: string,
    size?: "small" | "normal" | "big",
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any
}

class Button extends React.Component<IButtonProps> {
    onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if(this.props.onClick) {
            this.props.onClick(event)
        }
    }

    render() {
        return (
            <button type="button" className={"btn btn-" + (this.props.size || "normal")} onClick={this.onClick}>
                {this.props.text}
            </button>
        )
    }
}

export default Button