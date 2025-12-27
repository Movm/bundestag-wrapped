/**
 * WrappedScrollContainer - Unified scroll container for wrapped experiences
 *
 * Shared component for both main wrapped and speaker wrapped.
 * Features:
 * - Full-screen snap pagination
 * - Animated progress bar
 * - Auto-scroll support
 * - Scroll locking during quizzes
 */

import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  StatusBar,
  Pressable,
  ListRenderItem,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import type { UseWrappedScrollReturn } from '../hooks/useWrappedScroll';
import { SlideAnimationProvider } from '../contexts/SlideAnimationContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface WrappedScrollContainerProps<T> {
  /** Scroll state from useWrappedScroll hook */
  scrollState: UseWrappedScrollReturn<T>;
  /** Items to render */
  items: T[];
  /** Render function for each item */
  renderItem: ListRenderItem<T>;
  /** Key extractor function */
  keyExtractor: (item: T, index: number) => string;
  /** Whether first item should trigger start on press */
  startOnFirstItemPress?: boolean;
  /** Hide status bar (default: false) */
  hideStatusBar?: boolean;
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export function WrappedScrollContainer<T>({
  scrollState,
  items,
  renderItem,
  keyExtractor,
  startOnFirstItemPress = true,
  hideStatusBar = false,
}: WrappedScrollContainerProps<T>) {
  const {
    flatListRef,
    currentIndex,
    hasStarted,
    isScrollLocked,
    progress,
    handleStart,
    handleMomentumScrollEnd,
  } = scrollState;

  // Progress bar animation
  const progressWidth = useSharedValue(0);

  React.useEffect(() => {
    progressWidth.value = withSpring(progress * 100, {
      damping: 20,
      stiffness: 100,
    });
  }, [progress, progressWidth]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  // Wrapped render item with start handler
  const wrappedRenderItem = useCallback<ListRenderItem<T>>(
    (info) => {
      const isFirstItem = info.index === 0;
      const shouldHandlePress = startOnFirstItemPress && isFirstItem && !hasStarted;

      return (
        <Pressable
          style={styles.slideWrapper}
          onPress={shouldHandlePress ? handleStart : undefined}
        >
          {renderItem(info)}
        </Pressable>
      );
    },
    [renderItem, hasStarted, handleStart, startOnFirstItemPress]
  );

  // Get item layout for optimization
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: SCREEN_HEIGHT,
      offset: SCREEN_HEIGHT * index,
      index,
    }),
    []
  );

  return (
    <SlideAnimationProvider currentIndex={currentIndex}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" hidden={hideStatusBar} />

        {/* Progress Bar */}
        {hasStarted && (
          <View style={styles.progressContainer}>
            <Animated.View style={[styles.progressBar, progressStyle]} />
          </View>
        )}

        {/* Slides */}
        <FlatList
          ref={flatListRef}
          data={items}
          renderItem={wrappedRenderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          extraData={currentIndex}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToInterval={SCREEN_HEIGHT}
          snapToAlignment="start"
          decelerationRate="fast"
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEnabled={!isScrollLocked}
          bounces={false}
          initialNumToRender={2}
          maxToRenderPerBatch={3}
          windowSize={5}
          // Android: Enable to unmount off-screen slides (saves memory & stops animations)
          // iOS: Keep false as it can cause visual glitches with complex animations
          removeClippedSubviews={Platform.OS === 'android'}
        />
      </View>
    </SlideAnimationProvider>
  );
}

// ─────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  slideWrapper: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  progressContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 100,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#ffffff',
  },
});
