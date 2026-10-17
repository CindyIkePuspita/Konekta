import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Contact {
  id: string;
  name: string;
  phone: string;
  address: string;
}

export default function ContactDetail() {
  const { id, name, phone, address, mode } = useLocalSearchParams<{
    id: string;
    name: string;
    phone: string;
    address: string;
    mode?: string;
  }>();

  const [isEditing, setIsEditing] = useState(mode === "edit");
  const [editName, setEditName] = useState(name || "");
  const [editPhone, setEditPhone] = useState(phone || "");
  const [editAddress, setEditAddress] = useState(address || "");

  const handleSaveEdit = async (): Promise<void> => {
    if (
      !editName.trim() ||
      !editPhone.trim() ||
      !editAddress.trim()
    ) {
      Alert.alert("Peringatan", "Semua data harus diisi.");
      return;
    }

    try {
      const savedContacts = await AsyncStorage.getItem("contacts");
      const contacts: Contact[] = savedContacts
        ? JSON.parse(savedContacts)
        : [];

      const updatedContacts = contacts.map((contact) =>
        contact.id === id
          ? {
              ...contact,
              name: editName.trim(),
              phone: editPhone.trim(),
              address: editAddress.trim(),
            }
          : contact
      );

      await AsyncStorage.setItem(
        "contacts",
        JSON.stringify(updatedContacts)
      );

      Alert.alert("Berhasil", "Kontak berhasil diperbarui.");
      router.replace("/");
    } catch (error) {
      console.log("Gagal memperbarui kontak:", error);
      Alert.alert("Error", "Kontak gagal diperbarui.");
    }
  };

  const handleDelete = (): void => {
    Alert.alert(
      "Hapus Kontak",
      `Apakah kamu yakin ingin menghapus kontak ${name}?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              const savedContacts =
                await AsyncStorage.getItem("contacts");
              const contacts: Contact[] = savedContacts
                ? JSON.parse(savedContacts)
                : [];

              const updatedContacts = contacts.filter(
                (contact) => contact.id !== id
              );

              await AsyncStorage.setItem(
                "contacts",
                JSON.stringify(updatedContacts)
              );

              Alert.alert("Berhasil", "Kontak berhasil dihapus.", [
                {
                  text: "OK",
                  onPress: () => router.replace("/"),
                },
              ]);
            } catch (error) {
              console.log("Gagal menghapus kontak:", error);
              Alert.alert("Error", "Kontak gagal dihapus.");
            }
          },
        },
      ]
    );
  };

  const openEditMode = (): void => {
    router.setParams({ mode: "edit" });
    setIsEditing(true);
  };

  const cancelEdit = (): void => {
    router.setParams({ mode: "" });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Edit Kontak</Text>

        <TextInput
          style={styles.input}
          value={editName}
          onChangeText={setEditName}
          placeholder="Nama"
        />

        <TextInput
          style={styles.input}
          value={editPhone}
          onChangeText={setEditPhone}
          placeholder="Nomor Telepon"
          keyboardType="phone-pad"
        />

        <TextInput
          style={styles.input}
          value={editAddress}
          onChangeText={setEditAddress}
          placeholder="Alamat"
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveEdit}
        >
          <Text style={styles.buttonText}>Simpan Perubahan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={cancelEdit}
        >
          <Text style={styles.cancelText}>Batal</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {name?.charAt(0).toUpperCase()}
        </Text>
      </View>

      <Text style={styles.name}>{name}</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Nomor Telepon</Text>
        <Text style={styles.value}>{phone}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Alamat</Text>
        <Text style={styles.value}>{address}</Text>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={openEditMode}
      >
        <Text style={styles.buttonText}>Edit Kontak</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
      >
        <Text style={styles.buttonText}>Hapus Kontak</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>Kembali</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E8DEF8",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#5B3A8E",
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  infoBox: {
    backgroundColor: "#F7F7F7",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: "#777",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: "#222",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
  },
  editButton: {
    backgroundColor: "#6C5CE7",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#6C5CE7",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#E74C3C",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  backButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelText: {
    color: "#555",
    fontSize: 16,
  },
  backText: {
    color: "#6C5CE7",
    fontSize: 16,
    fontWeight: "bold",
  },
});