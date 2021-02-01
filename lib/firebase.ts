import * as firebase from 'firebase';
import { RoomID, PositionRef } from '../types/firebase';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBHVV_s7BEZOrjd2kbc6Q3-3E3Wbo4MKuk',
  authDomain: 'ne-ne-1aae6.firebaseapp.com',
  databaseURL: 'https://ne-ne-1aae6-default-rtdb.firebaseio.com',
  projectId: 'ne-ne-1aae6',
  storageBucket: 'ne-ne-1aae6.appspot.com',
  messagingSenderId: '224810665715',
  appId: '1:224810665715:web:95e23944eec6be2c041986',
  measurementId: 'G-1J9J0QTSJK',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const generateClassRoomId: RoomID = () => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return code;
};

export const getMessageRef: PositionRef = async (
  roomId: string,
  userId: string,
) => {
  return await firebase
    .database()
    .ref('rooms/' + roomId + '/position/' + userId + '/');
};

export const getUserPositionRef = async (roomId: string, uid: string) => {
  return await firebase
    .database()
    .ref('rooms/' + roomId + '/position/' + uid + '/');
};

export const setNewCollection = async (
  schoolName: string,
  day: string,
  time: string,
  className: string,
) => {
  console.log('新しいコレクションを作成する');
  await firebase
    .firestore()
    .collection('schools')
    .doc(schoolName)
    .collection(day)
    .doc(time)
    .set({
      name: className,
      country: 'Japan',
    })
    .then(() => {
      return { success: true };
    })
    .catch((e) => {
      console.log('error' + e);
    });
};

export const getUserId = async (email, password) => {
  const userCredential = await firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(({ user }) => {
      return { uid: user?.uid, success: true };
    })
    .catch((error) => {
      return { uid: null, success: false };
    });
};

export const remove = async (ref) => {
  return firebase.database().ref(ref).remove();
};

export const login = (email, password) => {
  return firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(({ user }) => {
      return { user, success: true };
    })
    .catch((error) => {
      console.log('error at firebase login', error);

      return { error, success: false };
    });
};

export const singOut = () => {
  console.log('signOutきた');

  return firebase
    .auth()
    .signOut()
    .then(() => {
      return { success: true };
    })
    .catch((error) => {
      console.log('error at firebase signup', error);

      return { error };
    });
};

export const signup = (email, password) => {
  console.log('signupきた');

  return firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(({ user }) => {
      return { user, success: true };
    })
    .catch((error) => {
      console.log('error at firebase signup', error);

      return { success: false };
    });
};

export const once = (ref) => {
  return firebase
    .database()
    .ref(ref)
    .once('value')
    .then((snapshot) => {
      // console.log("result", snapshot.val());
      return { value: snapshot.val() };
    })
    .catch((error) => {
      console.log('error at firebase once', error);

      return { error };
    });
};

export const ref = (ref) => {
  return firebase.database().ref(ref);
};

// databaseのuid直下に値を入れる
export const set = (ref, data) => {
  return firebase
    .database()
    .ref(ref)
    .set(data)
    .then(() => {
      return { success: true };
    })
    .catch((error) => {
      console.log('error at firebase set', error);

      return { error };
    });
};

export const update = (ref, data) => {
  return firebase
    .database()
    .ref(ref)
    .update(data)
    .then((result) => {
      console.log('success at firebase update', result);

      return { success: true };
    })
    .catch((error) => {
      console.log('error at firebase update', error);

      return { error };
    });
};

export const listOrderDesc = (ref, option = {}) => {
  let query = firebase.database().ref(ref).orderByKey();

  if (option.limit) {
    query = query.limitToLast(option.limit);
  }
  if (option.endAt) {
    query = query.endAt(option.endAt);
  }

  return query
    .once('value')
    .then((snapshot) => {
      console.log('result list', snapshot.val());

      return { value: snapshot.val() };
    })
    .catch((error) => {
      console.log('error at firebase set', error);

      return { error };
    });
};

export const push = (ref, data) => {
  const refPush = firebase.database().ref(ref).push();

  return refPush
    .set(data)
    .then(() => {
      console.log('result', refPush.key);

      return { value: { id: refPush.key } };
    })
    .catch((error) => {
      console.log('error at firebase push', error);

      return { error };
    });
};

export const upload = async (ref, uri) => {
  try {
    const refUpload = firebase.storage().ref(ref);
    const snapshot = await refUpload.put(uri, {
      contentType: 'image/jpeg',
    });
    console.log('result at firebase storage upload', snapshot);

    const downloadURL = await refUpload.getDownloadURL();

    return { downloadURL };
  } catch (error) {
    console.log('error at firebase storage upload', error);

    return { error };
  }
};
