import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";

type CategoryMeta = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  colorKey: keyof typeof Colors.light;
  placeholder: string;
  urgentLabel?: string;
};

const CATEGORY_META: Record<string, CategoryMeta> = {
  cleaning: {
    label: "청소 요청",
    icon: "sparkles-outline",
    colorKey: "cleaning",
    placeholder: "청소가 필요한 상세 내용을 입력하세요\n(예: 화장실 청소, 복도 쓰레기 등)",
  },
  repair: {
    label: "시설 수리",
    icon: "construct-outline",
    colorKey: "repair",
    placeholder: "수리가 필요한 시설과 상태를 입력하세요\n(예: 형광등 교체, 문 손잡이 파손 등)",
    urgentLabel: "긴급 수리 필요",
  },
  supplies: {
    label: "비품 부족",
    icon: "cube-outline",
    colorKey: "supplies",
    placeholder: "부족한 비품 목록과 수량을 입력하세요\n(예: A4용지 5박스, 화장지 등)",
  },
  safety: {
    label: "안전 신고",
    icon: "shield-checkmark-outline",
    colorKey: "safety",
    placeholder: "위험 요소와 위치를 자세히 입력하세요\n(예: 계단 난간 파손, 바닥 미끄러움 등)",
    urgentLabel: "즉시 조치 필요",
  },
  pest: {
    label: "해충 신고",
    icon: "bug-outline",
    colorKey: "pest",
    placeholder: "발견 장소와 해충 종류를 입력하세요\n(예: 화장실에 바퀴벌레 발견 등)",
  },
  parking: {
    label: "주차 문제",
    icon: "car-outline",
    colorKey: "parking",
    placeholder: "주차 관련 문제를 상세히 입력하세요\n(예: 불법 주차, 차단봉 고장 등)",
  },
};

const FLOORS = ["B1", "1층", "2층", "3층", "4층", "5층", "6층", "옥상"];

export default function RequestScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPad = isWeb ? 67 : insets.top;

  const meta = CATEGORY_META[category ?? ""] ?? CATEGORY_META["cleaning"];
  const colorSet = Colors.light[meta.colorKey] as {
    bg: string;
    icon: string;
    label: string;
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [floor, setFloor] = useState<string | null>(null);
  const [urgent, setUrgent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isValid = title.trim().length > 0 && description.trim().length > 0 && location.trim().length > 0;

  const handleSubmit = async () => {
    if (!isValid || submitting) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSubmitting(true);

    try {
      const existing = await AsyncStorage.getItem("facility_requests");
      const list = existing ? JSON.parse(existing) : [];

      const newRequest = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        category: category ?? "cleaning",
        categoryLabel: meta.label,
        title: title.trim(),
        description: description.trim(),
        location: floor ? `${location.trim()} ${floor}` : location.trim(),
        urgent,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      list.unshift(newRequest);
      await AsyncStorage.setItem("facility_requests", JSON.stringify(list));

      setSubmitted(true);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      /* ignore */
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <View
        style={[
          styles.root,
          { paddingTop: topPad, paddingBottom: insets.bottom + 34 },
          { backgroundColor: Colors.light.background },
        ]}
      >
        <View style={styles.successContainer}>
          <View style={[styles.successIcon, { backgroundColor: colorSet.bg }]}>
            <Ionicons name="checkmark-circle" size={64} color={colorSet.icon} />
          </View>
          <Text style={styles.successTitle}>접수 완료!</Text>
          <Text style={styles.successSubtitle}>
            요청이 성공적으로 접수되었습니다.{"\n"}담당자가 신속히 처리할 예정입니다.
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.doneBtn,
              { backgroundColor: Colors.light.tint, opacity: pressed ? 0.85 : 1 },
            ]}
            onPress={() => router.back()}
          >
            <Text style={styles.doneBtnText}>홈으로 돌아가기</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: Colors.light.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <View style={[styles.navBar, { paddingTop: topPad + 4 }]}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons
              name="chevron-back"
              size={22}
              color={Colors.light.text}
            />
          </Pressable>
          <Text style={styles.navTitle}>{meta.label}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 120 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.categoryBanner, { backgroundColor: colorSet.bg }]}>
            <Ionicons name={meta.icon} size={32} color={colorSet.icon} />
            <Text style={[styles.categoryBannerText, { color: colorSet.label }]}>
              {meta.label} 신청서
            </Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>제목 *</Text>
            <TextInput
              style={styles.input}
              placeholder="제목을 입력하세요"
              placeholderTextColor={Colors.light.textTertiary}
              value={title}
              onChangeText={setTitle}
              maxLength={50}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>위치 *</Text>
            <TextInput
              style={styles.input}
              placeholder="건물명 또는 구역명을 입력하세요"
              placeholderTextColor={Colors.light.textTertiary}
              value={location}
              onChangeText={setLocation}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipScroll}
              contentContainerStyle={styles.chipRow}
            >
              {FLOORS.map((f) => (
                <Pressable
                  key={f}
                  style={[
                    styles.chip,
                    floor === f && {
                      backgroundColor: Colors.light.tint,
                      borderColor: Colors.light.tint,
                    },
                  ]}
                  onPress={() => setFloor(floor === f ? null : f)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      floor === f && { color: "#fff" },
                    ]}
                  >
                    {f}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>상세 내용 *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder={meta.placeholder}
              placeholderTextColor={Colors.light.textTertiary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {meta.urgentLabel && (
            <Pressable
              style={styles.urgentRow}
              onPress={() => {
                setUrgent((v) => !v);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <View
                style={[
                  styles.checkbox,
                  urgent && { backgroundColor: Colors.light.danger, borderColor: Colors.light.danger },
                ]}
              >
                {urgent && (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                )}
              </View>
              <Text style={styles.urgentLabel}>{meta.urgentLabel}</Text>
            </Pressable>
          )}
        </ScrollView>

        <View
          style={[
            styles.footer,
            { paddingBottom: isWeb ? 34 : insets.bottom + 16 },
          ]}
        >
          <Pressable
            style={({ pressed }) => [
              styles.submitBtn,
              {
                backgroundColor: isValid
                  ? Colors.light.tint
                  : Colors.light.border,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
            onPress={handleSubmit}
            disabled={!isValid || submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text
                style={[
                  styles.submitBtnText,
                  { color: isValid ? "#fff" : Colors.light.textTertiary },
                ]}
              >
                접수하기
              </Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.surface,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  navTitle: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
    color: Colors.light.text,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  categoryBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
  },
  categoryBannerText: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: Colors.light.textSecondary,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  textArea: {
    height: 110,
    paddingTop: 14,
  },
  chipScroll: {
    marginTop: 10,
  },
  chipRow: {
    gap: 8,
    paddingRight: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.surface,
  },
  chipText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: Colors.light.textSecondary,
  },
  urgentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
    marginTop: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    alignItems: "center",
    justifyContent: "center",
  },
  urgentLabel: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: Colors.light.danger,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  submitBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  successTitle: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    color: Colors.light.text,
  },
  successSubtitle: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: Colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  doneBtn: {
    marginTop: 12,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 40,
  },
  doneBtnText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
});
