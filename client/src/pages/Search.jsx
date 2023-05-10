import axios from "axios";
import { Component } from "react";
import server from "../../public/js/server";
import iconProfile from "../../public/img/icons/profile.svg"

import "../../public/css/search.css"
import "../../public/css/profile.css"

class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isAuth: true,
            user: "",
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentWillMount() {
        if (localStorage.getItem("user") == null) {
            this.setState({ isAuth: false })
        }
        else {
            const urlParams = new URLSearchParams(window.location.search)
            let user = urlParams.get('user')
            if (!(user == null)) {
                let ls_user = JSON.parse(localStorage.getItem('user'))
                if (user == ls_user.username) {
                    window.location.replace('/profile')
                }
                else {
                    this.setState({ user: user })
                    this.renderSearchedUser(user)
                }
            }
        }
    }

    componentDidMount() {
        document.getElementById("follow-wrapper").style.display = "none"
    }

    renderSearchedUser(username) {
        axios.post(`${server.url}/usersearch`, {
            username: username,
        }).then((res) => {
            const wrapper = document.getElementById("profile")
            if (res.data.status == 200) {
                const user = res.data.data
                let avatar
                if (user.avatar == null) {
                    avatar = iconProfile
                } else {
                    avatar = user.avatar
                }
                wrapper.insertAdjacentHTML('beforeend', `
                <div class="profile-avatar">
                    <img src="${avatar}" alt="avatar" />
                </div>
                <div class="profile-content">
                    <h2>${user.alias}</h2>
                    <p class="caption">@${user.username}</p>
                    <pre id="desc" class="caption">${user.description}</pre>
                </div>
                `)
                this.renderSearchedUserPosts(username)
                document.getElementById("follow-wrapper").style.display = "flex"
                const current_user = JSON.parse(localStorage.getItem("user"))
                if (current_user.follows.includes(user.username)) {
                    document.getElementById("follow-button").classList.add("followed")
                }
            }
            else if (res.data.status == 404) {
                wrapper.insertAdjacentHTML('beforeend', `
                <h2>User not found</h2>
                `)
            }
        })
    }

    renderSearchedUserPosts(username) {
        axios.post(`${server.url}/postshow`, {
            username: username,
        }).then((res) => {
            let posts = res.data.data
            const wrapper = document.getElementById("posts")
            posts.forEach(post => {
                if (post[3] == "") {
                    wrapper.insertAdjacentHTML('afterbegin', `
                    <div class="post">
                        <div class="post-header">
                            <a href="/search?user=${post[1]}"><img src="${post[6]}" alt="User" /> ${post[1]} </a>
                            <a>${post[5]}</a>
                        </div>
                        <div class="post-wrapper">
                            <pre>${post[2]}</pre>
                        </div>
                        <div class="post-footer">
                            <a button-type="like" post-id="${post[0]}" id="like${post[0]}">Likes: ${post[4]}</a>
                        </div>
                    </div>
                    `)
                }
                else {
                    wrapper.insertAdjacentHTML('afterbegin', `
                    <div class="post">
                        <div class="post-header">
                            <a href="/search?user=${post[1]}"><img src="${post[6]}" alt="User" /> ${post[1]} </a>
                            <a>${post[5]}</a>
                        </div>
                        <div class="post-wrapper">
                            <img src="${post[3]}" alt="Image" />
                            <pre>${post[2]}</pre>
                        </div>
                        <div class="post-footer">
                            <a button-type="like" post-id="${post[0]}" id="like${post[0]}">Likes: ${post[4]}</a>
                        </div>
                    </div>
                    `)
                }
                document.addEventListener("click", function (event) {
                    const target = event.target
                    if (target.getAttribute('button-type')) {
                        const post_id = target.getAttribute('post-id')
                        axios.post(`${server.url}/postlike`, {
                            post_id: post_id,
                        }).then((res) => {
                            if (res.data.status == 200) {
                                let previous_like_value = document.getElementById(`like${post_id}`).textContent
                                previous_like_value = previous_like_value.replace("Likes: ", "")
                                previous_like_value = Number(previous_like_value)
                                previous_like_value = previous_like_value + 1
                                document.getElementById(`like${post_id}`).textContent = `Likes: ${previous_like_value}`
                            }
                        })
                    }
                })
            })
        })
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
        event.preventDefault()
    }

    handleFollow() {
        if (document.getElementById("follow-button").className == "followed") {
            const urlParams = new URLSearchParams(window.location.search)
            let user = urlParams.get('user')
            let current_user = JSON.parse(localStorage.getItem('user'))
            axios.post(`${server.url}/userunfollow`, {
                username: current_user.username,
                password: current_user.password,
                user_unfollowing: user,
            }).then((res) => {
                if (res.data.status == 200) {
                    axios.post(`${server.url}/userupdate`, {
                        username: current_user.username,
                        password: current_user.password,
                    }).then((res) => {
                        console.log(res);
                        const save_data = JSON.stringify(res.data.data)
                        localStorage.setItem('user', save_data)
                        location.reload()
                    })
                }
            })
        }
        else {
            const urlParams = new URLSearchParams(window.location.search)
            let user = urlParams.get('user')
            let current_user = JSON.parse(localStorage.getItem('user'))
            axios.post(`${server.url}/userfollow`, {
                username: current_user.username,
                password: current_user.password,
                user_following: user,
            }).then((res) => {
                if (res.data.status == 200) {
                    axios.post(`${server.url}/userupdate`, {
                        username: current_user.username,
                        password: current_user.password,
                    }).then((res) => {
                        const save_data = JSON.stringify(res.data.data)
                        localStorage.setItem('user', save_data)
                        location.reload()
                    })
                }
            })
        }
    }

    render() {
        if (!this.state.isAuth) {
            window.location.replace("/login")
        }
        else {
            return (
                <div className="wrapper">
                    <div className="search">
                        <form>
                            <input name="user" type="text" value={this.state.user} onChange={this.handleChange} placeholder="Type username" />
                            <button type="submit">Search</button>
                        </form >
                    </div>
                    <div id="profile" className="profile">

                    </div>
                    <div id="follow-wrapper">
                        <button id="follow-button" onClick={this.handleFollow}>Follow</button>
                    </div>
                    <div id="posts" className="posts">

                    </div>
                </div>
            )
        }

    }
}

export default Search