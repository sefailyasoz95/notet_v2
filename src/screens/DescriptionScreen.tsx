import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import RenderHTML from "react-native-render-html";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParams } from "../utils/types";
import { DEVICE_HEIGHT, DEVICE_WIDTH } from "../utils/constants";
import Animated, { Easing, SlideInUp } from "react-native-reanimated";
import { commonStyles } from "../utils/commonStyles";
import { Ionicons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<AppStackParams, "DescriptionScreen">;

const DescriptionScreen = ({ navigation, route }: Props) => {
  const source = {
    html: `
    ${route.params.description}
    `,
  };
  return (
    <SafeAreaView edges={["left", "right"]} className="bg-[#FAFAFA] pb-5">
      {/* <View className='bg-light-green rounded-b-full  h-1/3 w-full' /> */}
      <Animated.View
        className="bg-[#4CAF50] rounded-b-3xl h-1/6 z-20 w-full absolute top-0 justify-center px-5"
        style={[
          commonStyles.headerShadow,
          { shadowColor: "#4CAF50", shadowOpacity: 0.1, shadowRadius: 12 },
        ]}
        entering={SlideInUp.duration(500).easing(Easing.elastic(0.1))}
      >
        <TouchableOpacity
          onPress={navigation.goBack}
          className="flex-row items-center gap-x-2"
        >
          <Ionicons name="chevron-back" size={30} color={"#FFFFFF"} />
        </TouchableOpacity>
      </Animated.View>
      <ScrollView contentContainerStyle={{ paddingTop: DEVICE_HEIGHT * 0.18 }}>
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 12,
            margin: 16,
            padding: 16,
          }}
        >
          <RenderHTML
            contentWidth={DEVICE_WIDTH * 0.9}
            source={source}
            baseStyle={{
              paddingHorizontal: 20,
              fontFamily: "Inter",
              fontSize: 16,
              color: "#212121",
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DescriptionScreen;
