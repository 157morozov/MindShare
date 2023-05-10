import { Component } from 'react';
import axios from 'axios';
import server from '../../public/js/server';

import iconProfile from '../../public/img/icons/profile.svg'

import "../../public/css/home.css";

import iconHeart from '../../public/img/icons/heart.svg'

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isAuth: true
        }
    }

    componentWillMount() {
        if (localStorage.getItem("user") == null) {
            this.setState({ isAuth: false })
        }
        else {
            this.renderPosts()
        }
    }

    renderPosts() {
        const user = JSON.parse(localStorage.getItem('user'))
        axios.post(`${server.url}/postsshow`, {
            username: user.username,
        }).then((res) => {
            if (res.data.status == 200) {
                let posts = res.data.data
                posts.forEach(post => {
                    post[0] = Number(post[0])
                });
                function compare(a, b) {
                    if (a[0] === b[0]) {
                        return 0;
                    }
                    return a[0] < b[0] ? -1 : 1;
                }
                posts.sort(compare);
                const wrapper = document.getElementById("posts")
                if (posts.length > 0) {
                    wrapper.replaceChildren()
                }
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
                                    <a button-type="like" post-id="${post[0]}" id="like${post[0]}">Likes: ${post[4]}</a>
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
                                    <a button-type="like" post-id="${post[0]}" id="like${post[0]}">Likes: ${post[4]}</a>
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
                })
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
            }

        })
    }

    render() {
        if (!this.state.isAuth) {
            window.location.replace("/login")
        }
        else {
            return (
                <div className="wrapper">
                    <div id='posts' className="posts">
                        <h2>It's empty 😔</h2>
                        <p>Follow someone to see their feed here</p>
                        <a className='searchLink' href='/search'>Search</a>
                    </div>
                </div>
            )
        }

    }
}

export default Home