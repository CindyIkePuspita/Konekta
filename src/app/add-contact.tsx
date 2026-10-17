import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const defaultContacts = [
  {
    id: "1",
    name: "Ike",
    phone: "081234567890",
    address: "Malang",
  },
  {
    id: "2",
    name: "Meng",
    phone: "082345678901",
    address: "Batu",
  },
  {
    id: "3",
    name: "Dea",
    phone: "083456789012",
    address: "Malang",
  },
  {
    id: "4",
    name: "Bella",
    phone: "084567890123",
    address: "Malang",
  },
  {
    id: "5",
    name: "Kasih",
    phone: "085678901234",
    address: "Batu",
  },
];

export default function AddContact() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // useRef: menyimpan referensi ke TextInput agar bisa dipindah fokusnya
  // tanpa memicu re-render
  const phoneRef = useRef<TextInput>(null);
  const addressRef = useRef<TextInput>(null);

  const handleSave = async () => {
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanAddress = address.trim();

    if (!cleanName || !cleanPhone || !cleanAddress) {
      Alert.alert(
        "Data belum lengkap",
        "Silakan isi semua data kontak."
      );
      return;
    }

    try {
      const savedData = await AsyncStorage.getItem("contacts");

      let contacts = savedData
        ? JSON.parse(savedData)
        : defaultContacts;

      const newContact = {
        id: Date.now().toString(),
        name: cleanName,
        phone: cleanPhone,
        address: cleanAddress,
      };

      contacts = [...contacts, newContact];

      await AsyncStorage.setItem(
        "contacts",
        JSON.stringify(contacts)
      );

      Alert.alert(
        "Berhasil",
        "Kontak berhasil disimpan.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Gagal",
        "Kontak tidak dapat disimpan."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>
        Tambahkan kontak baru ke Konekta
      </Text>

      <Text style={styles.label}>Nama</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan nama"
        value={name}
        onChangeText={setName}
        returnKeyType="next"
        onSubmitEditing={() => phoneRef.current?.focus()}
      />

      <Text style={styles.label}>Nomor Telepon</Text>
      <TextInput
        ref={phoneRef}
        style={styles.input}
        placeholder="Masukkan nomor telepon"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        onSubmitEditing={() => addressRef.current?.focus()}
      />

      <Text style={styles.label}>Alamat</Text>
      <TextInput
        ref={addressRef}
        style={[styles.input, styles.addressInput]}
        placeholder="Masukkan alamat"
        multiline
        value={address}
        onChangeText={setAddress}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSave}
      >
        <Text style={styles.buttonText}>
          Simpan Kontak
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.back()}
      >
        <Text style={styles.cancelText}>Batal</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F7FC",
    paddingTop: 20,
    paddingHorizontal: 20,
  },

  subtitle: {
    fontSize: 14,
    color: "#777777",
    marginBottom: 30,
  },

  label: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 13,
    fontSize: 15,
    marginBottom: 20,
  },

  addressInput: {
    height: 100,
    textAlignVertical: "top",
  },

  button: {
    backgroundColor: "#6C63FF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 5,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  cancelButton: {
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 5,
  },

  cancelText: {
    color: "#555555",
    fontSize: 16,
  },
});