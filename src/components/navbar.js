import React from 'react'


class Navbar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        }
    }
    

    componentDidMount() {
        window.onscroll = function() {
            const nav = document.getElementById('nav');
            const line = document.getElementById('line');
            const title = document.getElementById('title');
            if ( window.pageYOffset > 20 ) {
                nav.setAttribute("class", "navbar navbar-scrolled")
                line.setAttribute("class", "line-scrolled")
                title.setAttribute("class", "line-scrolled")
            } else {
                nav.setAttribute("class", "navbar")
                line.setAttribute("class", "")
                title.setAttribute("class", "")
            }
        }
    }

    render() {
        return(
            <div id="nav" className="navbar">
                <img className="ntk-logo" src={require("../icons/logo.webp")}></img>
                <span id="line"></span>
                <span id="title">Ntkmaster</span>
            </div>
        )
    }
}

export default Navbar;