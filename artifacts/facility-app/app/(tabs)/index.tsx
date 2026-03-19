import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";

const { width } = Dimensions.get("window");
const CARD_GAP = 12;
const PADDING = 20;
const CARD_WIDTH = (width - PADDING * 2 - CARD_GAP) / 2;

type RequestCategory = {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  colorKey: keyof typeof Colors.light;
  route: string;
};

const CATEGORIES: RequestCategory[] = [
  {
    id: "cleaning",
    title: "청소 요청",
    subtitle: "청결 유지 신청",
    icon: "sparkles-outline",
    colorKey: "cleaning",
    route: "/request/cleaning",
  },
  {
    id: "repair",
    title: "시설 수리",
    subtitle: "파손·고장 신고",
    icon: "construct-outline",
    colorKey: "repair",
    route: "/request/repair",
  },
  {
    id: "supplies",
    title: "비품 부족",
    subtitle: "소모품 요청",
    icon: "cube-outline",
    colorKey: "supplies",
    route: "/request/supplies",
  },
  {
    id: "safety",
    title: "안전 신고",
    subtitle: "위험 요소 신고",
    icon: "shield-checkmark-outline",
    colorKey: "safety",
    route: "/request/safety",
  },
  {
    id: "pest",
    title: "해충 신고",
    subtitle: "방역 요청",
    icon: "bug-outline",
    colorKey: "pest",
    route: "/request/pest",
  },
  {
    id: "parking",
    title: "주차 문제",
    subtitle: "주차 관련 신고",
    icon: "car-outline",
    colorKey: "parking",
    route: "/request/parking",
  },
];

type CategoryCardProps = {
  item: RequestCategory;
};

function CategoryCard({ item }: CategoryCardProps) {
  const colorSet = Colors.light[item.colorKey] as {
    bg: string;
    icon: string;
    label: string;
  };

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(item.route as any);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: Colors.light.surface, opacity: pressed ? 0.85 : 1 },
      ]}
      onPress={handlePress}
    >
      <View style={[styles.iconWrapper, { backgroundColor: colorSet.bg }]}>
        <Ionicons name={item.icon} size={28} color={colorSet.icon} />
      </View>
      <Text style={[styles.cardTitle, { color: colorSet.label }]}>
        {item.title}
      </Text>
      <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const topPad = isWeb ? 67 : insets.top;

  return (
    <View style={[styles.root, { backgroundColor: Colors.light.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: topPad + 16,
            paddingBottom: insets.bottom + 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>안녕하세요 👋</Text>
            <Text style={styles.headerTitle}>무엇을 도와드릴까요?</Text>
          </View>
          <Pressable style={styles.bellBtn}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={Colors.light.text}
            />
          </Pressable>
        </View>

        <View style={styles.bannerCard}>
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerEyebrow}>시설 관리 시스템</Text>
            <Text style={styles.bannerTitle}>
              불편사항을{"\n"}빠르게 해결해드려요
            </Text>
          </View>
          <Ionicons name="business-outline" size={56} color="#BFDBFE" />
        </View>

        <Text style={styles.sectionTitle}>요청 유형 선택</Text>

        <View style={styles.grid}>
          {CATEGORIES.map((item) => (
            <CategoryCard key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: PADDING,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontFamily: "Inter_400Regular",
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: Colors.light.text,
  },
  bellBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.light.surface,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  bannerCard: {
    backgroundColor: Colors.light.tint,
    borderRadius: 20,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
    shadowColor: Colors.light.tint,
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  bannerLeft: {
    flex: 1,
  },
  bannerEyebrow: {
    fontSize: 12,
    color: "#BFDBFE",
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.5,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  bannerTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    lineHeight: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: Colors.light.text,
    marginBottom: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: CARD_GAP,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.light.textSecondary,
  },
});
