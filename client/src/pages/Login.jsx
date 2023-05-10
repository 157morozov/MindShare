import { Component } from "react"
import server from "../../public/js/server"
import axios from "axios"
import "../../public/css/login.css"

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            signin_login: "",
            signin_password: "",
            signup_login: "",
            signup_password: "",
            signup_password_confirmation: "",
            signup_show_error: false,
            signup_error: "",
            isAuth: true,
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentWillMount() {
        if (localStorage.getItem("user") == null) {
            this.setState({ isAuth: false })
        }
    }

    handleChange(event) {
        const target = event.target
        const value = target.value
        const name = target.name
        this.setState({
            [name]: value
        })
    }

    handleSubmit(event) {
        const l_type = event.target.getAttribute("l-type")
        switch (l_type) {
            case "signin":
                const error_in = document.getElementById("signin-error")
                if (!(this.state.signin_login == "" || this.state.signin_password == "")) {
                    axios.post(`${server.url}/signin`, {
                        username: this.state.signin_login,
                        password: this.state.signin_password,
                    }).then((res) => {
                        console.log(res);
                        if (res.data.status == 200) {
                            const user = res.data.data
                            localStorage.setItem("user", JSON.stringify(user))
                            window.location.replace("/")
                        }
                        else {
                            error_in.textContent = res.data.value
                            error_in.style.marginTop = "0px"
                        }
                    })
                }
                else {
                    error_in.textContent = "Fill in all the inputs"
                    error_in.style.marginTop = "0px"
                }
                break
            case "signup":
                const error = document.getElementById("signup-error")
                if (!(this.state.signup_login == "" || this.state.signup_password == "" || this.state.signup_password_confirmation == "")) {
                    if (this.state.signup_password == this.state.signup_password_confirmation) {
                        axios.post(`${server.url}/signup`, {
                            username: this.state.signup_login,
                            password: this.state.signup_password,
                        }).then((res) => {
                            console.log(res);
                            if (res.data.status == 200) {
                                const user = res.data.data
                                localStorage.setItem("user", JSON.stringify(user))
                                window.location.replace("/")
                            }
                            else {
                                error.textContent = res.data.value
                                error.style.marginTop = "0px"
                            }
                        })
                    }
                    else {
                        error.textContent = "Password mismatch"
                        error.style.marginTop = "0px"
                    }
                }
                else {
                    error.textContent = "Fill in all the inputs"
                    error.style.marginTop = "0px"
                }
                break
        }
        event.preventDefault();
    }

    handleSwitch(event) {
        const l_switch = event.target.getAttribute("l-switch")
        switch (l_switch) {
            case "signin":
                document.getElementById("login-content").style.transform = "translate(0%)"
                break
            case "signup":
                document.getElementById("login-content").style.transform = "translate(-50%)"
                break
        }
        event.preventDefault();
    }

    render() {
        if (this.state.isAuth) {
            window.location.replace("/")
        }
        else {
            return (
                <div className="wrapper">
                    <div className="login">
                        <div className="login-wrapper">
                            <div id="login-content">
                                <div className="signin">
                                    <h2>Sign in</h2>
                                    <form l-type="signin" onSubmit={this.handleSubmit}>
                                        <input className="login-input" type="text" name="signin_login" value={this.state.signin_login} onChange={this.handleChange} placeholder="Login" />
                                        <input className="login-input" type="password" name="signin_password" value={this.state.signin_password} onChange={this.handleChange} placeholder="Password" />
                                        <button className="login-submit" type="submit">Sign in</button>
                                    </form>
                                    <a id="signin-error"></a>
                                    <a href="" onClick={this.handleSwitch} l-switch="signup" className="caption login-switcher">Don't have an accont?</a>
                                </div>
                                <div className="signup">
                                    <h2>Sign up</h2>
                                    <form l-type="signup" onSubmit={this.handleSubmit}>
                                        <input className="login-input" type="text" name="signup_login" value={this.state.signup_login} onChange={this.handleChange} placeholder="Login" />
                                        <input className="login-input" type="password" name="signup_password" value={this.state.signup_password} onChange={this.handleChange} placeholder="Password" />
                                        <input className="login-input" type="password" name="signup_password_confirmation" value={this.state.signup_password_confirmation} onChange={this.handleChange} placeholder="Password confirmation" />
                                        <button className="login-submit" type="submit">Sign up</button>
                                    </form>
                                    <a id="signup-error"></a>
                                    <a href="" onClick={this.handleSwitch} l-switch="signin" className="caption login-switcher">Already have an accont?</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default Login