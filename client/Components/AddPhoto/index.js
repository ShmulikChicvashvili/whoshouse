import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import AddPhoto from './AddPhoto'

class AddPhotoContainer extends Component {
    state = {
        text: ''
    }

    handleChangeState = (key, value) => this.setState({ [key]: value })

    addPhoto = () => {
        console.log(this.props);
        this.props.addPhoto({
            variables: {
                url: this.props.navigation.state.params.url,
                text: this.state.text
            }
        }).then((res) => {
            this.props.navigation.navigate("Profile")
        })
    }
        
    render() {
        return (
            <AddPhoto
                addPhoto={this.addPhoto}
                url={this.props.navigation.state.params.url}
                changeState={this.handleChangeState}
            />
        )
    }
}

const addPhotoMutation = gql`
    mutation addPhoto($url: String!, $text: String!) {
        addPhoto(url: $url, text: $text)
    }
`

export default graphql(addPhotoMutation, {
    name: 'addPhoto'
})(AddPhotoContainer)
