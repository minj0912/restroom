import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";

type RequestItem = {
  id: string;
  category: string;
  categoryLabel: string;
  title: string;
  description: string;
  location: string;
  status: "pending" | "inprogress" | "done";
  createdAt: string;
};

const STATUS_CONFIG: Record<
  RequestItem["status"],
  { label: string; color: string; bg: string }
> = {
  pending: { label: "접수 대기", color: "#D97706", bg: "#FFFBEB" },
  inprogress: { label: "처리 중", color: "#2563EB", bg: "#EFF6FF" },
  done: { label: "완료", color: "#16A34A", bg: "#F0FDF4" },
};

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  cleaning: "sparkles-outline",
  repair: "construct-outline",
  supplies: "cube-outline",
  safety: "shield-checkmark-outline",
  pest: "bug-outline",
  parking: "car-outline",
};

function HistoryItem({ item }: { item: RequestItem }) {
  const statusCfg = STATUS_CONFIG[item.status];
  const iconName = CATEGORY_ICONS[item.category] ?? "document-text-outline";
  const date = new Date(item.createdAt);
  const formatted = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

  return (
    <View style={styles.historyCard}>
      <View style={styles.cardRow}>
        <View style={styles.iconCircle}>
          <Ionicons name={iconName} size={20} color={Colors.light.tint} />
        </View>
        <View style={styles.cardBody}>
          <View style={styles.cardTopRow}>
            <Text style={styles.categoryLabel}>{item.categoryLabel}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
              <Text style={[styles.statusText, { color: statusCfg.color }]}>
                {statusCfg.label}
              </Text>
            </View>
          </View>
          <Text style={styles.requestTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.metaRow}>
            <Ionicons
              name="location-outline"
              size={12}
              color={Colors.light.textSecondary}
            />
            <Text style={styles.metaText}>{item.location}</Text>
            <Text style={styles.dot}>·</Text>
            <Text style={styles.metaText}>{formatted}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function EmptyHistory() {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="document-text-outline"
        size={56}
        color={Colors.light.textTertiary}
      />
      <Text style={styles.emptyTitle}>접수 내역이 없습니다</Text>
      <Text style={styles.emptySubtitle}>
        홈에서 요청을 제출하면 여기에 표시됩니다
      </Text>
    </View>
  );
}

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPad = isWeb ? 67 : insets.top;

  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem("facility_requests");
      if (raw) {
        const parsed: RequestItem[] = JSON.parse(raw);
        setRequests(parsed.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  return (
    <View style={[styles.root, { backgroundColor: Colors.light.background }]}>
      <View style={[styles.headerBar, { paddingTop: topPad + 8 }]}>
        <Text style={styles.headerTitle}>접수 내역</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={Colors.light.tint} />
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HistoryItem item={item} />}
          ListEmptyComponent={<EmptyHistory />}
          contentContainerStyle={[
            styles.listContent,
            {
              paddingBottom: insets.bottom + 100,
            },
          ]}
          showsVerticalScrollIndicator={false}
          onRefresh={loadRequests}
          refreshing={loading}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerBar: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: Colors.light.background,
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    color: Colors.light.text,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  historyCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: { flex: 1 },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: Colors.light.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  requestTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: Colors.light.text,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  metaText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.light.textSecondary,
  },
  dot: {
    fontSize: 12,
    color: Colors.light.textTertiary,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: Colors.light.text,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.light.textSecondary,
    textAlign: "center",
  },
});
