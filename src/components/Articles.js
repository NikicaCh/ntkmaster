import React from 'react'
import firebase from 'firebase'


//Components
import Navbar from './navbar'
import MaterialTableDemo from './Table'


class Articles extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tableColumns: [
                {title: "Name", field: "Name"},
                {title: "Price", field: "Price"},
                {title: "Image", field: "Image"}
            ],
            records: [],
            newObject: {
                Name: "",
                Price: 0
            }
        }
    }

    render() {
        return (
            <div className="articles">
                <Navbar />
                <MaterialTableDemo 
                    tableColumns={this.state.tableColumns}
                    records={this.state.records}
                    newObject={this.state.newObject}/>
            </div>
        )
    }

}

export default Articles;