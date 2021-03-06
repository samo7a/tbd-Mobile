import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { useHistory } from "react-router-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import logo from "../images/logo.png";
import styles from "../../styles/GlobalStyles";
import Axios, { setClientToken } from "../utilities/axios";
import jwt_decode from "jwt-decode";
import Loader from "../components/Loader";

const Storage = require("../utilities/TokenStorage");

const LoginScene = () => {
  const history = useHistory();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    async function checkLogin() {
      setIsLoading(true);
      const bol = await Storage.load("isLoggedIn");
      if (bol === "true") {
        const token = await Storage.load("accessToken");
        const obj = jwt_decode(token, { complete: true });
        if (obj.isOwner === true) {
          history.push("/ownerHome");
        } else {
          history.push("/adaptorHome");
        }
      } else {
        setIsLoading(false);
      }
    }
    try {
      checkLogin();
    } catch (e) {
      console.log(e);
    }
  }, []);

  const loginHandler = async () => {
    setIsLoading(true);
    const json = {
      Email: email,
      Password: password,
    };
    // const onFailure = (error) => {
    //   console.log(12);
    //   console.log(error);
    //   console.log(13);
    //   Alert.alert("Technical Error, Please Try again!");
    //   console.log(14);
    //   setIsLoading(false);
    //   console.log(15);
    // };
    await Axios.post("/login", json)
      .then(async function (response) {
        var res = response.data.accessToken;
        if (res.error) {
          setIsLoading(false);
        } else {
          Storage.save("accessToken", JSON.stringify(res));
          Storage.save("isLoggedIn", "true");
          setClientToken(res);
          const obj = jwt_decode(res, { complete: true });
          if (obj.isOwner) {
            history.push("/ownerHome");
          } else {
            history.push("/adaptorHome");
          }
        }
      })
      .catch((e) => {
        console.log("error : " + e);
        Alert.alert("Wrong Email or Password!", "Please try again.");
        setIsLoading(false);
      });
  };

  return (
    <SafeAreaView>
      <LinearGradient
        colors={["#8D99AE", "#EDF2F4"]}
        style={{ height: "100%" }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Image style={styles.logo} source={logo} />
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
              <View style={styles.form}>
                <Text style={styles.text}>Email</Text>
                <TextInput
                  ref={emailRef}
                  onSubmitEditing={() => {
                    passwordRef.current.focus();
                  }}
                  style={styles.inputText}
                  placeholder="Email"
                  onChangeText={(e) => setEmail(e)}
                  value={email}
                  backgroundColor="white"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <Text style={styles.text}>Password</Text>
                <TextInput
                  ref={passwordRef}
                  style={styles.inputText}
                  placeholder="Password"
                  onChangeText={(e) => setPassword(e)}
                  value={password}
                  backgroundColor="white"
                  secureTextEntry={true}
                  textContentType="password"
                  keyboardType="default"
                />

                <TouchableOpacity onPress={loginHandler}>
                  <View style={styles.primaryButton}>
                    <Text
                      style={{
                        fontFamily: "Arial",
                        fontSize: 15,
                        color: "white",
                        alignSelf: "center",
                      }}
                    >
                      Login
                      <Icon name="chevron-right" size={15} color="white" />
                    </Text>
                  </View>
                </TouchableOpacity>
                <Text style={styles.text}>New User?</Text>
                <TouchableOpacity onPress={() => history.push("/signup")}>
                  <View style={styles.secondaryButton}>
                    <Text
                      style={{
                        fontFamily: "Arial",
                        fontSize: 15,
                        color: "white",
                        alignSelf: "center",
                      }}
                    >
                      Signup
                      <Icon name="chevron-up" size={15} color="white" />
                    </Text>
                  </View>
                </TouchableOpacity>
                <Text
                  style={styles.link}
                  onPress={() => history.push("/reset")}
                >
                  {" "}
                  Forgot your Password?{" "}
                </Text>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>

        <Loader isLoading={isLoading} />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default LoginScene;
