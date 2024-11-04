import React, { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom"; // For navigation after login
import axios from "axios";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../Api/Api.js";

function Login() {
  const { login } = useContext(AuthContext); // Get login function from AuthContext
  const navigate = useNavigate();
  
  const initState = {
    status: 0,
    message: "",
    errors: {},
    data: {},
  };

  const [state, setState] = useState(initState);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setState(initState); // Reset the state

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, {
        email,
        password,
      });
      console.log("process.env.REACT_APP_BACKEND_URL",process.env.REACT_APP_BACKEND_URL)

      // Assuming the response contains the token and user data
      const { token, user } = response.data;
      login(token, user); // Update AuthContext with token and user data

      setState({
        status: response.status,
        message: "Login successful!",
        errors: {},
        data: response.data,
      });

      navigate("/dashboard"); // Navigate to another page after successful login
    } catch (error) {
      console.log(error)
      setState({
        status: error.response?.status || 500,
        message: error.response?.data?.message || "An error occurred",
        errors: error.response?.data?.errors || {},
        data: {},
      });
    } finally {
      setLoading(false);
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
      <h2>Login</h2>
      <div className="container p-2">
        <div className="formRow">
          <FloatingLabel controlId="floatingInput" label="Email address">
            <Form.Control
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!state.errors.email}
            />
          </FloatingLabel>
          {state.errors.email && (
            <p className="errorParagraph">{state.errors.email}</p>
          )}
        </div>

        <div className="formRow mt-3">
          <FloatingLabel controlId="floatingPassword" label="Password">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!state.errors.password}
            />
          </FloatingLabel>
          {state.errors.password && (
            <p className="errorParagraph">{state.errors.password}</p>
          )}
        </div>

        <Button
          className="loginButton mt-3"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Loading..." : "Login"}
        </Button>

        {state.message && (
          <p
            className={`text-center mt-3 ${
              state.status === 200 ? "text-success" : "text-danger"
            }`}
          >
            {state.message}
          </p>
        )}

        <p className="text-center mt-3">
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>

        <Button className="loginWithGoogleButton mt-2"
        onClick={googleLogin}>Login with Google</Button>
      </div>
    </div>
  );
}

export default Login;
