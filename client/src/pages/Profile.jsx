import { Component } from "react"
import axios from "axios"
import server from "../../public/js/server"

import iconProfile from "../../public/img/icons/profile.svg"
import iconImage from "../../public/img/icons/image.svg"
import iconSend from "../../public/img/icons/send.svg"

import "../../public/css/profile.css"

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isAuth: true,
            user: null,
            get: null,
            posts: {},
            post_title: "",
            post_image: "",
        }
        this.handleChange = this.handleChange.bind(this)
        this.handlePostImageChange = this.handlePostImageChange.bind(this)
        this.handlePostSubmit = this.handlePostSubmit.bind(this)
    }

    componentWillMount() {
        if (localStorage.getItem("user") == null) {
            this.setState({ isAuth: false })
        }
        else {
            const author_username = JSON.parse(localStorage.getItem("user")).username
            axios.post(`${server.url}/postshow`, {
                username: author_username,
            }).then((res) => {
                let posts = res.data.data
                this.setState({ posts: posts })
                this.showPosts(posts)
            })
            this.setState({
                user: JSON.parse(localStorage.getItem("user")),
                get: author_username,
            })
        }
    }

    showPosts(posts) {
        const wrapper = document.getElementById("posts")
        posts.forEach(post => {
            if (post[6] == null || post[6] == "") {
                if (post[3] == null || post[3] == "") {
                    wrapper.insertAdjacentHTML('afterbegin', `
                    <div class="post">
                        <div class="post-header">
                            <a href="/search?user=${post[1]}"><img src=${iconProfile} alt="User" /> ${post[1]} </a>
                            <a>${post[5]}</a>
                        </div>
                        <div class="post-wrapper">
                            <pre>${post[2]}</pre>
                        </div>
                        <div class="post-footer">
                            <a button-type="like" post-id="${post[0]}"  id="like${post[0]}">Likes: ${post[4]}</a>
                        </div>
                    </div>
                    `)
                }
                else {
                    wrapper.insertAdjacentHTML('afterbegin', `
                    <div class="post">
                        <div class="post-header">
                            <a href="/search?user=${post[1]}"><img src=${iconProfile} alt="User" /> ${post[1]} </a>
                            <a>${post[5]}</a>
                        </div>
                        <div class="post-wrapper">
                            <img src=${post[3]} alt="Image" />
                            <pre>${post[2]}</pre>
                        </div>
                        <div class="post-footer">
                            <a button-type="like" post-id="${post[0]}"  id="like${post[0]}">Likes: ${post[4]}</a>
                        </div>
                    </div>
                    `)
                }
            }
            else {
                wrapper.insertAdjacentHTML('afterbegin', `
                <div class="post">
                    <div class="post-header">
                        <a href="/search?user=${post[1]}"><img src=${post[6]} alt="User" /> ${post[1]} </a>
                        <a>${post[5]}</a>
                    </div>
                    <div class="post-wrapper">
                        <img src=${post[3]} alt="Image" />
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
        });
    }

    handleDescriptionChange() {
        document.getElementById("descSubmit").style.height = "40px"
    }

    handleDescriptionSubmit() {
        document.getElementById("descSubmit").style.height = "0px"
        const user = JSON.parse(localStorage.getItem("user"))
        user.description = document.getElementById("desc").textContent
        axios.post(`${server.url}/userdescriptionedit`, user).then((res) => {
            if (res.data.status == 200) {
                localStorage.setItem("user", JSON.stringify(res.data.data))
            }
        })

    }

    handleImageChange(event) {
        const data = new FileReader()
        data.readAsDataURL(event.target.files[0])
        data.addEventListener("load", () => {
            const user = JSON.parse(localStorage.getItem("user"))
            user.avatar = data.result
            axios.post(`${server.url}/useravataredit`, user).then((res) => {
                if (res.data.status == 200) {
                    localStorage.setItem("user", JSON.stringify(res.data.data))
                    location.reload()
                }
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

    handlePostImageChange(event) {
        const data = new FileReader()
        data.readAsDataURL(event.target.files[0])
        data.addEventListener("load", () => {
            this.setState({ post_image: data.result })
        })
    }

    handlePostSubmit() {
        if (!(this.state.post_title == "")) {
            const user = JSON.parse(localStorage.getItem("user"))
            user.post_title = this.state.post_title
            user.post_image = this.state.post_image
            axios.post(`${server.url}/postpublish`, user).then((res) => {
                if (res.data.status == 200) {
                    window.location.reload()
                }
            })
        }
        else {
            document.getElementById('post-title').focus()
        }
    }

    handleLogut() {
        localStorage.clear()
        window.location.reload()
    }

    render() {
        if (!this.state.isAuth) {
            window.location.replace("/login")
        }
        else {
            let description = this.state.user.description
            if (description == undefined) {
                description = "Write something about yourself"
            }
            let avatar = iconProfile
            if (!(this.state.user.avatar == null)) {
                avatar = this.state.user.avatar
            }
            return (
                <div className="wrapper">
                    <div className="profile">
                        <div className="profile-avatar">
                            <img src={avatar} alt="avatar" />
                            <label for="avatar-upload" class="custom-file-upload">
                                Edit
                            </label>
                            <input id="avatar-upload" type="file" onChange={this.handleImageChange} accept=".png, .svg, .jpg, .jpeg" />
                        </div>
                        <div className="profile-content">
                            <h2>{this.state.user.alias}</h2>
                            <p className="caption">@{this.state.user.username}</p>
                            <pre id="desc" onClick={this.handleDescriptionChange} contentEditable="true" className="caption">{description}</pre>
                            <button id="descSubmit" onClick={this.handleDescriptionSubmit} className="desc-save">Save description</button>
                            <button onClick={this.handleLogut} className="desc-save h">Sign out</button>
                        </div>
                    </div>
                    <div className="publish">
                        <input id="post-title" onChange={this.handleChange} value={this.state.post_title} name="post_title" placeholder="How are you today?" />
                        <label for="post-image"><img src={iconImage} alt="Image" /></label>
                        <input id="post-image" onChange={this.handlePostImageChange} accept=".png, .svg, .jpg, .jpeg" type="file" />
                        <button onClick={this.handlePostSubmit}><img src={iconSend} alt="Publish" /></button>
                    </div>
                    <div id="posts" className="posts">
                    </div>
                </div>
            )
        }
    }
}

export default Profile