import React, { useCallback, useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Platform,
  StatusBar,
} from 'react-native';

interface QuoteItem {
  id: string;
  quote: string;
  author: string;
}

const SAMPLE_QUOTES: QuoteItem[] = [
  { id: '1', quote: 'The only limit to our realization of tomorrow is our doubts of today.', author: 'Franklin D. Roosevelt' },
  { id: '2', quote: 'In the middle of difficulty lies opportunity.', author: 'Albert Einstein' },
  { id: '3', quote: 'What you do speaks so loudly that I cannot hear what you say.', author: 'Ralph Waldo Emerson' },
  { id: '4', quote: 'Do not go where the path may lead, go instead where there is no path and leave a trail.', author: 'Ralph Waldo Emerson' },
  { id: '5', quote: 'The journey of a thousand miles begins with one step.', author: 'Lao Tzu' },
  { id: '6', quote: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
  { id: '7', quote: "Life is what happens when you're busy making other plans.", author: 'John Lennon' },
  { id: '8', quote: 'The unexamined life is not worth living.', author: 'Socrates' },
  { id: '9', quote: 'Happiness is not something ready made. It comes from your own actions.', author: 'Dalai Lama' },
  { id: '10', quote: "Believe you can and you're halfway there.", author: 'Theodore Roosevelt' },
  { id: '11', quote: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci' },
  { id: '12', quote: 'Be yourself; everyone else is already taken.', author: 'Oscar Wilde' },
];

const App: React.FC = () => {
  const [data, setData] = useState<QuoteItem[]>(SAMPLE_QUOTES);
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setData((prev) => [...prev].sort(() => Math.random() - 0.5));
      setRefreshing(false);
    }, 800);
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return data;
    const q = query.toLowerCase();
    return data.filter(
      (item) => item.quote.toLowerCase().includes(q) || item.author.toLowerCase().includes(q)
    );
  }, [data, query]);

  const renderItem = useCallback(({ item, index }: { item: QuoteItem; index: number }) => {
    const fav = !!favorites[item.id];
    return (
      <TouchableOpacity activeOpacity={0.9} style={[styles.card, index % 2 === 0 ? styles.cardEven : styles.cardOdd]}>
        <View style={styles.cardContent}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.author.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}</Text>
          </View>

          <View style={styles.textWrap}>
            <Text numberOfLines={3} style={styles.quote}>
              “{item.quote}”
            </Text>
            <Text style={styles.author}>— {item.author}</Text>
          </View>

          <TouchableOpacity onPress={() => toggleFavorite(item.id)} style={styles.favBtn}>
            <Text style={[styles.favText, fav && styles.favActive]}>{fav ? '★' : '☆'}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }, [favorites, toggleFavorite]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={styles.header}>
        <Text style={styles.title}>Precious Quotes</Text>
        <Text style={styles.subtitle}>A small collection of famous, timeless lines</Text>

        <View style={styles.searchWrap}>
          <TextInput
            placeholder="Search quotes or authors..."
            placeholderTextColor="#cbd5e1"
            value={query}
            onChangeText={setQuery}
            style={styles.search}
          />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No quotes found.</Text>
          </View>
        }
      />

      <View style={styles.footerBar}>
        <Text style={styles.footerText}>Tap the star to save favorites</Text>
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 12 : 16,
    paddingBottom: 16,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '700',
  },
  subtitle: {
    color: '#94a3b8',
    marginTop: 4,
    marginBottom: 12,
  },
  searchWrap: {
    marginTop: 8,
  },
  search: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#071033',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 8,
  },
  card: {
    borderRadius: 14,
    padding: 14,
    marginVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  cardEven: {
    backgroundColor: '#0b1220',
  },
  cardOdd: {
    backgroundColor: '#071633',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#0ea5a4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#04263b',
    fontWeight: '800',
    fontSize: 16,
  },
  textWrap: {
    flex: 1,
  },
  quote: {
    color: '#e6eef6',
    fontSize: 16,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  author: {
    marginTop: 8,
    color: '#9fb0c8',
    fontWeight: '600',
  },
  favBtn: {
    marginLeft: 12,
    padding: 6,
    alignSelf: 'center',
  },
  favText: {
    fontSize: 20,
    color: '#94a3b8',
  },
  favActive: {
    color: '#fbbf24',
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9ca3af',
  },
  footerBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 18,
    backgroundColor: '#020617aa',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  footerText: {
    color: '#cbd5e1',
  },
});
