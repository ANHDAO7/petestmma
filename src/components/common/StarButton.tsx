import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface StarButtonProps {
  favorite: boolean;
  onPress: () => void;
  size?: number;
  testID?: string;
}

export const StarButton: React.FC<StarButtonProps> = ({
  favorite,
  onPress,
  size = 24,
  testID,
}) => {
  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      style={styles.container}
      activeOpacity={0.6}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Text style={[styles.star, { fontSize: size, color: favorite ? '#eab308' : '#94a3b8' }]}>
        {favorite ? '★' : '☆'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  star: {
    lineHeight: 28,
  },
});
