import { Component } from "react";

import "../../public/css/header.css";

import iconProfile from "../../public/img/icons/profileLight.svg";
import iconSearch from "../../public/img/icons/searchLight.svg";

class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isAuth: true,
            wrapperClassName: "wrapper",
        }
    }

    render() {
        if (localStorage.getItem("user") == null) {
            this.setState({ isAuth: false })
        }

        if (!this.state.isAuth) {
            this.state.wrapperClassName = "wrapper unauth"
        }
        else {
            this.state.wrapperClassName = "wrapper"
        }

        return (
            <header>
                <div className={this.state.wrapperClassName}>
                    <a className="logo" href="/"><h1>MindShare</h1></a>
                    <div className="nav">
                        <a className="nav-link" href="/profile"><img src={iconProfile} alt="Profile" /></a>
                        <a className="nav-link" href="/search"><img src={iconSearch} alt="Search" /></a>
                    </div>
                </div>
            </header>
        )
    }
}

export default Header