import { View, Text, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSpeakerData } from '@/hooks/useDataQueries';
import { MotiView } from 'moti';

export default function SpeakerWrappedScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { data: speaker, isLoading, error } = useSpeakerData(slug || '');

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#0a0a0f] items-center justify-center">
        <ActivityIndicator size="large" color="#fafafa" />
        <Text className="text-white mt-4 text-lg">Lade Profil...</Text>
      </SafeAreaView>
    );
  }

  if (error || !speaker) {
    return (
      <SafeAreaView className="flex-1 bg-[#0a0a0f] items-center justify-center px-6">
        <Text className="text-red-400 text-xl text-center">
          Profil nicht gefunden
        </Text>
        <Pressable
          className="mt-6 bg-white/10 px-6 py-3 rounded-full"
          onPress={() => router.back()}
        >
          <Text className="text-white">Zurück</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0f]">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-white/10">
        <Pressable
          className="p-2 -ml-2"
          onPress={() => router.back()}
        >
          <Text className="text-white text-2xl">←</Text>
        </Pressable>
        <Text className="text-white text-lg font-medium ml-2 flex-1" numberOfLines={1}>
          {speaker.name}
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Hero Section */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500 }}
          className="px-6 pt-8 pb-6"
        >
          <Text className="text-white text-3xl font-bold text-center">
            {speaker.name}
          </Text>
          {speaker.academicTitle && (
            <Text className="text-white/60 text-center mt-1">
              {speaker.academicTitle}
            </Text>
          )}
          <View className="bg-white/10 self-center px-4 py-1 rounded-full mt-3">
            <Text className="text-white font-medium">{speaker.party}</Text>
          </View>
        </MotiView>

        {/* Stats Grid */}
        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 500, delay: 100 }}
          className="mx-6 bg-white/5 rounded-2xl p-6 border border-white/10"
        >
          <View className="flex-row flex-wrap">
            <StatItem
              label="Reden"
              value={speaker.speeches.toString()}
            />
            <StatItem
              label="Wortbeiträge"
              value={speaker.wortbeitraege.toString()}
            />
            <StatItem
              label="Wörter gesamt"
              value={speaker.totalWords.toLocaleString('de-DE')}
            />
            <StatItem
              label="Wörter pro Rede"
              value={Math.round(speaker.avgWords).toString()}
            />
          </View>
        </MotiView>

        {/* Rankings */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 200 }}
          className="mx-6 mt-6"
        >
          <Text className="text-white text-xl font-semibold mb-4">
            Rankings
          </Text>

          <View className="bg-white/5 rounded-xl p-4 border border-white/10">
            <RankItem
              label="Platz nach Redenanzahl"
              rank={speaker.rankings.speechRank}
              total={speaker.rankings.totalSpeakers}
            />
            <RankItem
              label="Platz nach Wörtern"
              rank={speaker.rankings.wordsRank}
              total={speaker.rankings.totalSpeakers}
            />
            <RankItem
              label={`In der ${speaker.party}-Fraktion`}
              rank={speaker.rankings.partySpeechRank}
              total={speaker.rankings.partySize}
            />
          </View>
        </MotiView>

        {/* Top Words */}
        {speaker.words.topWords.length > 0 && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 500, delay: 300 }}
            className="mx-6 mt-6"
          >
            <Text className="text-white text-xl font-semibold mb-4">
              Häufigste Wörter
            </Text>

            <View className="flex-row flex-wrap">
              {speaker.words.topWords.slice(0, 10).map((word) => (
                <View
                  key={word.word}
                  className="bg-white/10 rounded-full px-3 py-1.5 mr-2 mb-2"
                >
                  <Text className="text-white">
                    {word.word} <Text className="text-white/50">({word.count})</Text>
                  </Text>
                </View>
              ))}
            </View>
          </MotiView>
        )}

        {/* Spirit Animal */}
        {speaker.spiritAnimal && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 500, delay: 400 }}
            className="mx-6 mt-6"
          >
            <Text className="text-white text-xl font-semibold mb-4">
              Spirit Animal
            </Text>

            <View className="bg-white/5 rounded-xl p-6 border border-white/10 items-center">
              <Text className="text-6xl">{speaker.spiritAnimal.emoji}</Text>
              <Text className="text-white text-xl font-bold mt-3">
                {speaker.spiritAnimal.name}
              </Text>
              <Text className="text-white/60 text-center mt-1">
                {speaker.spiritAnimal.title}
              </Text>
              <Text className="text-white/80 text-center mt-3">
                {speaker.spiritAnimal.reason}
              </Text>
            </View>
          </MotiView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View className="w-1/2 py-2">
      <Text className="text-white text-2xl font-bold">{value}</Text>
      <Text className="text-white/60 text-sm">{label}</Text>
    </View>
  );
}

function RankItem({ label, rank, total }: { label: string; rank: number; total: number }) {
  return (
    <View className="flex-row justify-between py-2 border-b border-white/5 last:border-b-0">
      <Text className="text-white/80">{label}</Text>
      <Text className="text-white font-medium">
        #{rank} <Text className="text-white/50">von {total}</Text>
      </Text>
    </View>
  );
}
