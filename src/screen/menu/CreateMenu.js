import React, { Component } from "react";
import { View , StatusBar} from "react-native";
import AnimatedMultistep from "react-native-animated-multistep";

import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";


const allSteps = [
  { name: "step 1", component: Step1 },
  { name: "step 2", component: Step2 },
  { name: "step 3", component: Step3 },


];

export default class CreateMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  onNext = () => {
    console.log("Next");
  };
  onBack = () => {
    console.log("Back");
  };

  finish = state => {
    console.log("TCL: App -> state", state);
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#010113" }}>
          <StatusBar barStyle="dark-content" hidden={false} backgroundColor="black" />
        <AnimatedMultistep
          steps={allSteps}
          onFinish={this.finish}
          animate={true}
          onBack={this.onBack}
          onNext={this.onNext}
        />
      </View>
    );
  }
}