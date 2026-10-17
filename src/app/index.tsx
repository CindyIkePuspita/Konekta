import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { styles } from "../styles";

interface Contact {
  id: string;
  name: string;
  phone: string;
  address: string;
}

const defaultContacts: Contact[] = [
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

export default function Index() {
  const [contacts, setContacts] = useState<Contact[]>(defaultContacts);

  // search  = isi yang sedang diketik pengguna
  // keyword = hasil "tunda 300ms" dari search, dipakai untuk memfilter
  const [search, setSearch] = useState("");
  const [keyword, setKeyword] = useState("");

  const loadContacts = async (): Promise<void> => {
    try {
      const savedContacts = await AsyncStorage.getItem("contacts");

      if (savedContacts) {
        const parsedContacts: Contact[] = JSON.parse(savedContacts);
        setContacts(parsedContacts);
      } else {
        await AsyncStorage.setItem(
          "contacts",
          JSON.stringify(defaultContacts)
        );
        setContacts(defaultContacts);
      }
    } catch (error) {
      console.log("Gagal memuat kontak:", error);
    }
  };

  // Dijalankan setiap halaman ini kembali menjadi layar aktif
  useFocusEffect(
    useCallback(() => {
      loadContacts();
    }, [])
  );

  // useEffect: setiap state `search` berubah, tunggu 300ms lalu update `keyword`.
  // Fungsi cleanup membatalkan timer lama jika pengguna masih mengetik.
  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(search.trim().toLowerCase());
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // useMemo: hasil filter hanya dihitung ulang jika contacts atau keyword berubah
  const filteredContacts = useMemo(() => {
    if (!keyword) return contacts;

    return contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(keyword) ||
        contact.phone.includes(keyword) ||
        contact.address.toLowerCase().includes(keyword)
    );
  }, [contacts, keyword]);

  const renderContact = ({ item }: { item: Contact }) => {
    return (
      <TouchableOpacity
        style={styles.contactCard}
        onPress={() =>
          router.push({
            pathname: "/contact-detail",
            params: {
              id: item.id,
              name: item.name,
              phone: item.phone,
              address: item.address,
            },
          })
        }
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.name}</Text>

          <Text style={styles.contactPhone}>
            {item.phone}
          </Text>

          <Text style={styles.contactAddress}>
            {item.address}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Konekta</Text>

          <Text
            style={{
              marginTop: 4,
              fontSize: 14,
              color: "#777",
            }}
          >
            Daftar kontak kamu
          </Text>
        </View>

        <View style={styles.countBox}>
          <Text style={styles.countText}>
            {contacts.length} Kontak
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/add-contact")}
      >
        <Text style={styles.addButtonText}>
          + Tambah Kontak
        </Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Cari nama, nomor, atau alamat"
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
        clearButtonMode="while-editing"
      />

      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={renderContact}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text
            style={{
              textAlign: "center",
              color: "#888",
              marginTop: 30,
            }}
          >
            Kontak tidak ditemukan.
          </Text>
        }
      />
    </View>
  );
}