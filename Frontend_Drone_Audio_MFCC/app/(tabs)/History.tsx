import { useAuth } from '@/context/context';
import { Classification } from '@/interfaces/interfaces';
import { supabase } from '@/services/supabase'; // Adjust import path as needed
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const History = () => {
  const { user } = useAuth();
  const [historyData, setHistoryData] = useState<Classification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // load list whenever switching to the screen, ensures new classifications are displayed 
  // without reloading the app
  useFocusEffect(() => {
    fetchHistory();
  })

  const fetchHistory = async () => {
    try {
      // Fetch data, ordered by newest first
      const { data, error } = await supabase
        .from('classifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setHistoryData(data);
      
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // The UI for a single list item
  const renderItem = ({ item }: { item: Classification }) => {
    // Format the Postgres timestamp into a readable date/time
    const dateObj = new Date(item.created_at);
    const formattedDate = dateObj.toLocaleDateString();
    const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <View style={styles.card}>
        <View>
          <Text style={styles.droneModel}>{item.drone_model}</Text>
          <Text style={styles.fileName}>{item.filename}</Text>
          <Text style={styles.confidence}>Confidence: {item.confidence}</Text>
          {/* TODO: add accuracy, loss results to display, NO CAN DO */}
        </View>
        <View style={styles.dateContainer}>
          <Ionicons 
            name={item.isaudio ? 'musical-notes-outline' : 'image-outline'}
            size={22}
            color={'#358fc9'}
          />
          <Text style={styles.classificationType}>{item.isaudio ? 'AUDIO' : 'MFCC'}</Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
          <Text style={styles.dateText}>{formattedTime}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Classification History</Text>
      
      {isLoading ? (
        <ActivityIndicator size="large" color="#4fb17f" style={{ marginTop: 20 }} />
      ) : (
        <>
          <Text style={styles.content}>{historyData.length} classifications found.</Text>
          
          <FlatList 
            data={historyData}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No history found in Database.</Text>
              </View>
            }
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default History;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(11, 10, 16, 0.92)',
    flex: 1,
    padding: 20,
  },
  title: {
    color: '#f79756',       // #4fb17f 
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    color: '#A9A9A9',
    fontSize: 16,
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 40, // Prevents last item from being hidden by screen edge
  },
  card: {
    backgroundColor: 'rgba(39, 37, 50, 0.92)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#024570',
  },
  droneModel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  confidence: {
    color: '#66C8D2',   // #66C8D2, #f79756
    fontSize: 14,
    // marginTop: 4,
  },
  fileName: {
    color: '#A9A9A9',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 4,
  },
  dateContainer: {
    alignItems: 'flex-end',
  },
  classificationType: {
    color: '#358fc9',
    fontSize: 11,
    marginBottom: 2,
  },
  dateText: {
    color: '#A9A9A9',
    fontSize: 12,
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    color: '#A9A9A9',
    fontSize: 16,
  }
});