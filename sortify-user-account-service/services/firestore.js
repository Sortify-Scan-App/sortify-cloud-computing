const { Firestore } = require("@google-cloud/firestore");
const path = require("path");

// Fungsi untuk memodelkan data pengguna
function userData(doc) {
	return {
		id: doc.id,
		fullname: doc.data().fullname,
		email: doc.data().email,
		password: doc.data().password,
		createdAt: doc.data().createdAt,
	};
}
// Koneksi ke Firestore menggunakan credensial lokal
async function database() {
	const localCredentials = path.resolve(__dirname, "../config/credentials.json");
	const settings = {
		projectId: process.env.PROJECT_ID,
		keyFilename: localCredentials,
	};
	return new Firestore(process.env.APP_ENV === "local" ? settings : undefined);
}
// Simpan data pengguna
async function storeUser(id, data) {
	const userCollection = (await database()).collection("users");
	return userCollection.doc(id).set(data);
}
// Ambil data pengguna
async function getUser(id = null) {
	const userCollection = (await database()).collection("users");
	if (id) {
		const doc = await userCollection.doc(id).get();
		if (!doc.exists) return null;
		return userData(doc);
	} else {
		const snapshot = await userCollection.get();
		const allUsers = [];
		snapshot.forEach((doc) => allUsers.push(userData(doc)));
		return allUsers;
	}
}
async function updateUser(id, data) {
	const usersCollection = (await database()).collection('users');
	const updateData = {
		...data,
		updateAt: new Date().toISOString(),
	};
	return usersCollection.doc(id).update(updateData);
}

module.exports = { storeUser, getUser, userData, updateUser };
