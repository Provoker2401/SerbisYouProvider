import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const BUTTON_WIDTH = Dimensions.get("screen").width - 80;
const SWIPE_RANGE = BUTTON_WIDTH - 74;

const SwipeButton2 = ({ onSwipe, isLoading = false }) => {
  const X = useSharedValue(0);

  useEffect(() => {
    if (!isLoading) {
      X.value = withSpring(0);
    }
  }, [isLoading]);

  const animatedGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      console.log("Gesture started");
    },
    onActive: (event, ctx) => {
      const newValue = event.translationX;
      console.log("Gesture active, translationX: ${newValue}");
      if (newValue >= 0 && newValue <= SWIPE_RANGE) {
        X.value = newValue;
      }
    },
    onEnd: () => {
      console.log(`Gesture ended, final X value: ${X.value}`);
      if (X.value < SWIPE_RANGE - 20) {
        X.value = withSpring(0);
      } else {
        runOnJS(onSwipe)();
      }
    },
  });

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            X.value,
            [0, SWIPE_RANGE],
            [0, SWIPE_RANGE],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        X.value,
        [0, SWIPE_RANGE],
        [1, 0],
        Extrapolate.CLAMP
      ),
    };
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.swipeButtonContainer}>
        <PanGestureHandler
          enabled={!isLoading}
          onGestureEvent={animatedGestureHandler}
        >
          <Animated.View style={[styles.swipeButton, animatedButtonStyle]}>
            {isLoading ? (
              <ActivityIndicator color={"#1A244D"} />
            ) : (
              <Image
                style={styles.chevron}
                source={require("../assets/group-6476.png")}
              />
            )}
          </Animated.View>
        </PanGestureHandler>
        <Animated.Text style={[styles.swipeText, animatedTextStyle]}>
          Swipe me for some action
        </Animated.Text>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  swipeButtonContainer: {
    height: 59,
    backgroundColor: "lightgrey",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: BUTTON_WIDTH,
    overflow: "hidden", // This is to make sure that the animated button doesn't overflow its container.
  },
  swipeButton: {
    position: "absolute",
    left: 0,
    height: 59,
    width: 80,
    borderRadius: 10,
    zIndex: 3,
    backgroundColor: "#1A244D",
    alignItems: "center",
    justifyContent: "center",
  },
  swipeText: {
    alignSelf: "center",
    fontSize: 14,
    fontWeight: "400",
    zIndex: 1,
    color: "grey",
    marginLeft: 80,
  },
  chevron: {
    height: 25,
    width: 20,
    tintColor: "white",
  },
});

export default SwipeButton2;
