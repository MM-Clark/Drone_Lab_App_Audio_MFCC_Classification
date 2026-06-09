import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Classification } from '@/interfaces/interfaces'

const ClassificationItem: React.FC<{ item: Classification }> = ({ item }) => {
  return (
    <View style={styles.container}>
          <Text style={styles.name}>{item.timestamp}</Text>
          {/* types are now split at UI level and stored as one string */}
          <View style={styles.stats}>
            <View style={styles.statRow}>
              {/* <Text style={styles.statLabel}>HP:</Text> */}
              <Text style={styles.statValue}>{item.filename}</Text>
            </View>
            <View style={styles.statRow}>
              {/* <Text style={styles.statLabel}>Attack:</Text> */}
              <Text style={styles.statValue}>{item.dronePrediction}</Text>
            </View>
          </View>
        </View>
  )
}

export default ClassificationItem

const styles = StyleSheet.create({
    container: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#777",
  },
  stats: {
    width: "100%",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  statLabel: {
    fontWeight: "bold",
    color: "#777",
  },
  statValue: {
    color: "#fff",
  },
})