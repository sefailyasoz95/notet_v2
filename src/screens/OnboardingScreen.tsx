import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParams } from "../utils/types";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { useAppDispatch } from "../redux/store";
import { useTranslation } from "react-i18next";
import Carousel from "react-native-reanimated-carousel";
import { DEVICE_HEIGHT, DEVICE_WIDTH } from "../utils/constants";
import Animated, {
  Easing,
  SlideInDown,
  SlideInUp,
} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createUser } from "../redux/actions";
import { setonboardingPassed } from "../redux/reducers";
import DeviceInfo from "react-native-device-info";
import * as RNLocalize from "react-native-localize";

type Props = NativeStackScreenProps<AuthStackParams, "OnboardingScreen">;
const OnboardingScreen = ({ navigation, route }: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const onGetStarted = async () => {
    await AsyncStorage.setItem("onBoardingPassed", "true");
    const deviceId = DeviceInfo.getUniqueIdSync();
    const country = RNLocalize.getCountry();
    dispatch(
      createUser({
        country: country,
        email: "",
        fullName: "",
        isPremium: false,
        deviceId,
      })
    );
    dispatch(setonboardingPassed(true));
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]" edges={["right", "left"]}>
      <Animated.View
        className="bg-[#4CAF50] rounded-b-3xl absolute top-0 h-1/6 w-full items-center justify-center"
        entering={SlideInUp.duration(500).easing(Easing.elastic(0.1))}
      >
        <Text
          className="text-white text-5xl mt-10 font-bold"
          style={{ letterSpacing: 5, fontFamily: "Inter", fontSize: 28 }}
        >
          NotEt
        </Text>
      </Animated.View>
      <Carousel
        loop
        width={DEVICE_WIDTH}
        snapEnabled
        autoPlay
        withAnimation={{
          config: {
            duration: 1000,
            easing: Easing.elastic(1.2),
          },
          type: "timing",
        }}
        height={DEVICE_HEIGHT}
        autoPlayInterval={3000}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 15,
        }}
        data={[
          {
            title: "onboarding.firstTitle",
            text: "onboarding.firstDescription",
            animation: require("../../assets/animations/todo-list-animation.json"),
          },
          {
            title: "onboarding.secondTitle",
            text: "onboarding.secondDescription",
            animation: require("../../assets/animations/reminder-animation.json"),
          },
        ]}
        renderItem={({ item, index }) => (
          <View
            key={index}
            className="gap-y-5 mt-20 self-center items-center bg-white rounded-2xl"
            style={{
              borderRadius: 16,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 12,
              padding: 24,
            }}
          >
            <LottieView
              source={item.animation}
              autoPlay
              loop
              style={styles.animation}
            />
            <Text
              className="text-4xl w-4/5 text-black font-bold"
              style={{ fontFamily: "Inter", fontSize: 22 }}
            >
              {t(item.title)}
            </Text>
            <Text
              className="text-xl font-medium text-gray-600"
              style={{ fontFamily: "Inter", fontSize: 16 }}
            >
              {t(item.text)}
            </Text>
          </View>
        )}
      />
      <Animated.View
        className="bg-[#4CAF50] rounded-t-3xl h-1/6 w-full items-center justify-center"
        entering={SlideInDown.duration(500).easing(Easing.elastic(0.1))}
      >
        <TouchableOpacity
          style={styles.shadow}
          onPress={onGetStarted}
          className="self-center w-10/12 bg-[#4CAF50] items-center py-3 mb-10 rounded-full shadow-lg"
        >
          <Text
            className="font-medium text-white"
            style={{ fontFamily: "Inter", fontSize: 16 }}
          >
            {t("getStarted")}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
const styles = StyleSheet.create({
  shadow: {
    shadowColor: "black",
    shadowOffset: {
      height: 10,
      width: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  animation: {
    width: DEVICE_WIDTH * 0.75,
    aspectRatio: 1,
  },
});
