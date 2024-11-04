import React, { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../Api/Api.js";

function SignUp() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [state, setState] = useState({
    data: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      image: null,
    },
    errors: {},
    loading: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      data: { ...prev.data, [name]: value },
    }));
  };

  const handleFileChange = (e) => {
    setState((prev) => ({
      ...prev,
      data: { ...prev.data, image: e.target.files[0] },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, loading: true, errors: {} }));

    const formData = new FormData();
    formData.append("name", state.data.name);
    formData.append("email", state.data.email);
    formData.append("password", state.data.password);
    formData.append("confirm_password", state.data.confirm_password);
    formData.append("image", state.data.image);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/register`, formData);
      console.log(response)
      const { token, user } = response.data;
      login(token, user);
      navigate("/dashboard");
    } catch (error) {
      
      
      if (error.response && error.response.data.error ) {
        setState((prev) => ({ ...prev, errors: error.response.data.error }));
      } else {
        console.error("Signup Error:", error);
      }
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const responseGoogle = async (authResult) => {
    try {
      if (authResult["code"]) {
        const result = await googleAuth(authResult.code);
        const { email, name, profile_image } = result.data.user;
        const token = result.data.token;
       
        console.log(email,name,profile_image,token)
        const loggedInUser = {
          name,email,profile_image
        }
        login(token, loggedInUser);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("Error while requesting google code :", error);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <div className="container loginContainer mt-4 p-4">
      <h2>SignUp</h2>
      <div className="container p-2">
        <form onSubmit={handleSubmit}>
          <div className="formRow">
            <FloatingLabel  label="Name">
              <Form.Control
                type="text"
                placeholder="Enter Your Full Name"
                name="name"
                value={state.data.name}
                onChange={handleChange}
                isInvalid={!!state.errors.name}
              />
            </FloatingLabel>
            {state.errors.name && (
              <p className="errorParagraph">{state.errors.name}</p>
            )}
          </div>
          <div className="formRow">
            <FloatingLabel  label="Email address">
              <Form.Control
                type="email"
                placeholder="name@example.com"
                name="email"
                value={state.data.email}
                onChange={handleChange}
                isInvalid={!!state.errors.email}
              />
            </FloatingLabel>
            {state.errors.email && (
              <p className="errorParagraph">{state.errors.email}</p>
            )}
          </div>
          <div className="formRow">
            <FloatingLabel  label="Password">
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={state.data.password}
                onChange={handleChange}
                isInvalid={!!state.errors.password}
              />
            </FloatingLabel>
            {state.errors.password && (
              <p className="errorParagraph">{state.errors.password}</p>
            )}
          </div>
          <div className="formRow">
            <FloatingLabel  label="Confirm Password">
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                name="confirm_password"
                value={state.data.confirm_password}
                onChange={handleChange}
                isInvalid={!!state.errors.confirm_password}
              />
            </FloatingLabel>
            {state.errors.confirm_password && (
              <p className="errorParagraph">{state.errors.confirm_password}</p>
            )}
          </div>
          <div className="formRow">
            <Form.Group controlId="formFile">
              <Form.Label>Profile Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleFileChange}
                isInvalid={!!state.errors.Image}
              />
            </Form.Group>
            {state?.errors?.image && (
              <p className="errorParagraph">{state?.errors?.image}</p>
            )}
          </div>
          <Button
            className="loginButton"
            type="submit"
            disabled={state.loading}
          >
            {state.loading ? "Signing Up..." : "SignUp"}
          </Button>
        </form>
        
        <p className="text-center mt-3">
          Already have an account? <Link to="/login">LogIn</Link>
        </p>
        <Button className="loginWithGoogleButton"
        onClick={googleLogin}>SignUp with Google</Button>
      </div>
    </div>
  );
}

export default SignUp;
