import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Breadcrumb, Card } from '@themesberg/react-bootstrap';
import { ChoosePhotoWidget, ProfileCardWidget } from "../components/Widgets";
import GeneralInfoForm from "../components/Forms";
import axios from "axios";
import { Link } from "react-router-dom";
import { Routes } from "../routes";


class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tempSkill: "",
      userCredentials: null,
      userData: null,
    }
  }


  componentDidMount = () => {
    this.setState({ userCredentials: this.props.componentProps.credentials }, async () => {
      await this.getUserData()
    })
  }

  postCredentials = async () => {
    if (this.props.credentials == null) {
      return
    }
    const header = {
      'Authorization': `Token ${this.state.userCredentials.token}`
    }

    await axios.put(`/auth/user_credentials/`, this.state.userCredentials.user, {
      headers: header
    })
      .then((response) => {
        return
      })
      .catch((error) => {
        console.log(error)
      })
  }

  getUserData = async () => {
    const header = {
      'Authorization': `Token ${this.state.userCredentials.token}`
    }
    console.log(header)
    await axios.get('/auth/userdata/', {
      headers: header
    })
      .then((response) => {
        this.setState({ userData: response.data[0] })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  updateUserData = (key, value) => {
    var tempData = this.state.userData;
    tempData[key] = value
    this.setState({ userData: tempData })
  }

  postUserData = async () => {
    if (this.state.userData == null) {
      return
    }
    const header = {
      'Authorization': `Token ${this.state.userCredentials.token}`
    }

    await axios.put(`/auth/userdata/`, this.state.userData, {
      headers: header
    })
      .then((response) => {
        this.setState({ userData: response.data })
        this.getUserData()
      })
      .catch((error) => {
        console.log(error)
      })
  }

  addSkill = (tempSkill) => {
    if ((this.state.userData.skills.indexOf(tempSkill) != -1) || tempSkill == null || tempSkill == undefined || tempSkill == "") {
      return
    }
    var tempData = this.state.userData;
    tempData.skills.push(tempSkill);
    this.setState({
      userData: tempData,
    })
  }

  removeSkill = (index) => {
    if (index >= this.state.userData.skills.length) {
      return
    }
    var tempData = this.state.userData;
    tempData.skills.splice(index, 1)
    this.setState({
      userData: tempData,
    })
  }

  changeProfileImage = async (event) => {
    const header = {
      'Authorization': `Token ${this.state.userCredentials.token}`
    }

    var form_data = new FormData();
    form_data.append('profile_image', event.target.files[0], event.target.files[0].name)
    await axios.put(`/auth/profile_image/`, form_data, {
      headers: header
    })
      .then((response) => {
        this.getUserData()
      })
      .catch((error) => {
        console.log(error)
      })
  }

  render() {
    if (this.state.userCredentials == null || this.state.userData == null) {
      return ""
    }
    return (
      <div>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
          <div className="d-block mb-4 mb-md-0">
            <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
              <Breadcrumb.Item><Card.Link as={Link} to={Routes.ZealHome.path}><FontAwesomeIcon icon={faHome} /></Card.Link></Breadcrumb.Item>
              <Breadcrumb.Item active>Profile</Breadcrumb.Item>
            </Breadcrumb>
            <h4>Profile</h4>
            <p className="mb-0">This is an opportunity to make your profile amazing for other members to find you more easily.</p>
          </div>
        </div>

        <Row>
          <Col xs={12} xl={8}>
            <GeneralInfoForm credentials={this.state.userCredentials} changeCredentials={this.props.componentProps.changeCredentials} postCredentials={this.postCredentials} getUserData={this.getUserData} updateUserData={this.updateUserData} postUserData={this.postUserData} addSkill={this.addSkill} removeSkill={this.removeSkill} userData={this.state.userData} />
          </Col>

          <Col xs={12} xl={4}>
            <Row>
              <Col xs={12}>
                <ProfileCardWidget userData={this.state.userData} credentials={this.state.userCredentials} />
              </Col>
              <Col xs={12}>
                <ChoosePhotoWidget
                  title="Change profile photo"
                  changeProfileImage={this.changeProfileImage}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  };
}

export default Profile